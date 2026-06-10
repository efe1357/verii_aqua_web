import { type ReactElement, type ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageToolbar, ColumnPreferencesPopover, AdvancedFilter } from '@/components/shared';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  RefreshCw,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  PlayCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Filter,
  ChevronDown,
} from 'lucide-react';
import {
  HANGFIRE_QUERY_KEYS,
  useHangfireDeadLetterQuery,
  useHangfireFailedJobsQuery,
  useHangfireRecurringJobsQuery,
  useHangfireStatsQuery,
  useHangfireSuccessJobsQuery,
} from '../hooks/useHangfireMonitoring';
import { hangfireMonitoringApi } from '../api/hangfireMonitoring.api';
import type {
  HangfireFailedResponseDto,
  HangfireRecurringJobItemDto,
  HangfireSuccessJobItemDto,
} from '../types/hangfireMonitoring.types';
import { cn } from '@/lib/utils';
import { applyFilterRowsClient, type FilterColumnConfig, type FilterRow } from '@/lib/advanced-filter-types';
import { loadColumnPreferences } from '@/lib/column-preferences';
import { formatDateTimeForLocale } from '@/lib/date-localization';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
const RECURRING_COLUMN_KEYS = ['id', 'jobName', 'cron', 'nextExecution', 'lastExecution', 'queue'];
const SUCCESS_COLUMN_KEYS = ['jobId', 'jobName', 'recurringJobId', 'queue', 'durationMs', 'retryCount', 'finishedAt'];
const FAILED_COLUMN_KEYS = ['jobId', 'jobName', 'state', 'failedAt', 'reason'];
const DEAD_LETTER_COLUMN_KEYS = ['jobId', 'jobName', 'state', 'enqueuedAt', 'reason'];

interface DataTableColumn<T extends object> {
  key: string;
  label: string;
  type: FilterColumnConfig['type'];
  className?: string;
  render: (item: T) => ReactNode;
  searchableValue?: (item: T) => string;
}

interface DataTableControls {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  pageSize: number;
  setPageSize: (value: number) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  draftFilterRows: FilterRow[];
  setDraftFilterRows: (rows: FilterRow[]) => void;
  appliedFilterRows: FilterRow[];
  setAppliedFilterRows: (rows: FilterRow[]) => void;
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  columnOrder: string[];
  setColumnOrder: (columns: string[]) => void;
}

function useDataTableControls(pageKey: string, defaultColumnKeys: string[], userId?: number): DataTableControls {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [showFilters, setShowFilters] = useState(false);
  const [draftFilterRows, setDraftFilterRows] = useState<FilterRow[]>([]);
  const [appliedFilterRows, setAppliedFilterRows] = useState<FilterRow[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => defaultColumnKeys);
  const [columnOrder, setColumnOrder] = useState<string[]>(() => defaultColumnKeys);

  useEffect(() => {
    const prefs = loadColumnPreferences(pageKey, userId, defaultColumnKeys, defaultColumnKeys[0]);
    setVisibleColumns(prefs.visibleKeys);
    setColumnOrder(prefs.order);
  }, [defaultColumnKeys, pageKey, userId]);

  return {
    searchTerm,
    setSearchTerm,
    pageSize,
    setPageSize,
    showFilters,
    setShowFilters,
    draftFilterRows,
    setDraftFilterRows,
    appliedFilterRows,
    setAppliedFilterRows,
    visibleColumns,
    setVisibleColumns,
    columnOrder,
    setColumnOrder,
  };
}

function filterDataTableRows<T extends object>(
  rows: T[],
  columns: DataTableColumn<T>[],
  controls: DataTableControls,
): T[] {
  const search = controls.searchTerm.trim().toLowerCase();
  const searched = search
    ? rows.filter((row) => columns.some((column) => {
      const value = column.searchableValue ? column.searchableValue(row) : String((row as Record<string, unknown>)[column.key] ?? '');
      return value.toLowerCase().includes(search);
    }))
    : rows;

  return applyFilterRowsClient(searched, controls.appliedFilterRows, columns.map((column) => ({
    value: column.key,
    type: column.type,
    labelKey: column.label,
  })));
}

function formatDate(value?: string, language?: string): string {
  if (!value) return '-';
  return formatDateTimeForLocale(value, language) || '-';
}

function formatDuration(durationMs: number): string {
  if (!Number.isFinite(durationMs) || durationMs <= 0) return '-';
  if (durationMs < 1000) return `${durationMs} ms`;
  return `${(durationMs / 1000).toFixed(durationMs >= 10_000 ? 0 : 1)} sn`;
}

export function HangfireMonitoringPage(): ReactElement {
  const { t, i18n } = useTranslation(['hangfire-monitoring', 'stock', 'common']);
  const { setPageTitle } = useUIStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [failedPage, setFailedPage] = useState(1);
  const [successPage, setSuccessPage] = useState(1);
  const [deadLetterPage, setDeadLetterPage] = useState(1);
  const [recurringPage, setRecurringPage] = useState(1);
  const [selectedRecurringJobId, setSelectedRecurringJobId] = useState<string>('');

  const recurringControls = useDataTableControls('aqua-hangfire-recurring', RECURRING_COLUMN_KEYS, user?.id);
  const successControls = useDataTableControls('aqua-hangfire-succeeded', SUCCESS_COLUMN_KEYS, user?.id);
  const failedControls = useDataTableControls('aqua-hangfire-failed', FAILED_COLUMN_KEYS, user?.id);
  const deadLetterControls = useDataTableControls('aqua-hangfire-dead-letter', DEAD_LETTER_COLUMN_KEYS, user?.id);

  const failedPageSize = failedControls.pageSize;
  const successPageSize = successControls.pageSize;
  const deadLetterPageSize = deadLetterControls.pageSize;
  const recurringPageSize = recurringControls.pageSize;

  const failedFrom = failedPage;
  const successFrom = successPage;
  const deadLetterFrom = deadLetterPage;

  const statsQuery = useHangfireStatsQuery();
  const failedQuery = useHangfireFailedJobsQuery(failedFrom, failedPageSize);
  const successQuery = useHangfireSuccessJobsQuery(successFrom, successPageSize);
  const deadLetterQuery = useHangfireDeadLetterQuery(deadLetterFrom, deadLetterPageSize);
  const recurringJobsQuery = useHangfireRecurringJobsQuery();

  useEffect(() => {
    setPageTitle(t('title'));
    return () => setPageTitle(null);
  }, [setPageTitle, t]);

  useEffect(() => {
    const firstJobId = recurringJobsQuery.data?.items?.[0]?.id;
    if (!selectedRecurringJobId && firstJobId) {
      setSelectedRecurringJobId(firstJobId);
    }
  }, [recurringJobsQuery.data?.items, selectedRecurringJobId]);

  const triggerRecurringJobMutation = useMutation({
    mutationFn: (jobId: string) => hangfireMonitoringApi.triggerRecurringJob(jobId),
    onSuccess: async (result) => {
      toast.success(t('recurring.triggerSuccess', { jobName: result.jobId }));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: HANGFIRE_QUERY_KEYS.RECURRING }),
        queryClient.invalidateQueries({ queryKey: HANGFIRE_QUERY_KEYS.STATS }),
        queryClient.invalidateQueries({ queryKey: ['hangfire'] }),
      ]);
    },
    onError: () => {
      toast.error(t('recurring.triggerError'));
    },
  });

  const isRefreshing =
    statsQuery.isRefetching ||
    failedQuery.isRefetching ||
    successQuery.isRefetching ||
    deadLetterQuery.isRefetching ||
    recurringJobsQuery.isRefetching;

  const handleRefresh = async (): Promise<void> => {
    await Promise.all([
      statsQuery.refetch(),
      failedQuery.refetch(),
      successQuery.refetch(),
      deadLetterQuery.refetch(),
      recurringJobsQuery.refetch(),
    ]);
  };

  const recurringItems = recurringJobsQuery.data?.items ?? [];
  const selectedRecurringJob = useMemo(
    () => recurringItems.find((job) => job.id === selectedRecurringJobId) ?? recurringItems[0] ?? null,
    [recurringItems, selectedRecurringJobId],
  );

  const failedTotal = failedQuery.data?.total ?? 0;
  const successTotal = successQuery.data?.total ?? 0;
  const deadLetterTotal = deadLetterQuery.data?.total ?? deadLetterQuery.data?.enqueued ?? 0;
  const recurringTotal = recurringItems.length;

  useEffect(() => {
    setRecurringPage(1);
  }, [recurringTotal, recurringPageSize, recurringControls.searchTerm, recurringControls.appliedFilterRows]);

  useEffect(() => {
    setSuccessPage(1);
  }, [successPageSize, successControls.searchTerm, successControls.appliedFilterRows]);

  useEffect(() => {
    setFailedPage(1);
  }, [failedPageSize, failedControls.searchTerm, failedControls.appliedFilterRows]);

  useEffect(() => {
    setDeadLetterPage(1);
  }, [deadLetterPageSize, deadLetterControls.searchTerm, deadLetterControls.appliedFilterRows]);

  const failedTotalPages = Math.max(1, Math.ceil(failedTotal / failedPageSize));
  const successTotalPages = Math.max(1, Math.ceil(successTotal / successPageSize));
  const deadLetterTotalPages = Math.max(1, Math.ceil(deadLetterTotal / deadLetterPageSize));
  const recurringTotalPages = Math.max(1, Math.ceil(recurringTotal / recurringPageSize));

  const recurringRows = recurringItems.slice((recurringPage - 1) * recurringPageSize, recurringPage * recurringPageSize);

  const headStyle = 'py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap';
  const recurringColumns = useMemo<DataTableColumn<HangfireRecurringJobItemDto>[]>(() => [
    { key: 'id', label: t('recurring.table.id'), type: 'string', className: 'px-6 font-mono text-xs text-slate-500 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-400', render: (item) => item.id },
    {
      key: 'jobName',
      label: t('recurring.table.job'),
      type: 'string',
      className: 'min-w-[240px] max-w-[340px]',
      render: (item) => (
        <div className="max-w-[340px]">
          <div className="truncate font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400" title={item.jobName}>{item.jobName}</div>
          {item.method ? <div className="truncate text-xs text-slate-500 dark:text-slate-400" title={item.method}>{item.method}</div> : null}
          {item.error ? <div className="truncate text-xs text-rose-500 mt-1" title={item.error}>{item.error}</div> : null}
        </div>
      ),
      searchableValue: (item) => `${item.jobName} ${item.method ?? ''} ${item.error ?? ''}`,
    },
    { key: 'cron', label: t('recurring.table.cron'), type: 'string', render: (item) => item.cron || '-' },
    { key: 'nextExecution', label: t('recurring.table.nextExecution'), type: 'date', render: (item) => formatDate(item.nextExecution, i18n.language), searchableValue: (item) => formatDate(item.nextExecution, i18n.language) },
    { key: 'lastExecution', label: t('recurring.table.lastExecution'), type: 'date', render: (item) => formatDate(item.lastExecution, i18n.language), searchableValue: (item) => formatDate(item.lastExecution, i18n.language) },
    { key: 'queue', label: t('recurring.table.queue'), type: 'string', render: (item) => item.queue || '-' },
  ], [i18n.language, t]);

  const successColumns = useMemo<DataTableColumn<HangfireSuccessJobItemDto>[]>(() => [
    { key: 'jobId', label: 'ID', type: 'string', className: 'w-[80px] px-6 font-mono text-xs text-slate-500 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-400', render: (item) => `#${item.jobId}` },
    { key: 'jobName', label: t('table.jobName'), type: 'string', className: 'min-w-[220px] max-w-[320px] truncate font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400', render: (item) => item.jobName, searchableValue: (item) => item.jobName },
    { key: 'recurringJobId', label: t('table.recurringJobId'), type: 'string', render: (item) => item.recurringJobId || '-' },
    { key: 'queue', label: t('table.queue'), type: 'string', render: (item) => item.queue || '-' },
    { key: 'durationMs', label: t('table.duration'), type: 'number', render: (item) => formatDuration(item.durationMs), searchableValue: (item) => formatDuration(item.durationMs) },
    { key: 'retryCount', label: t('table.retryCount'), type: 'number', render: (item) => item.retryCount },
    { key: 'finishedAt', label: t('table.time'), type: 'date', render: (item) => formatDate(item.finishedAt, i18n.language), searchableValue: (item) => formatDate(item.finishedAt, i18n.language) },
  ], [i18n.language, t]);

  const failedColumns = useMemo<DataTableColumn<HangfireFailedResponseDto['items'][number]>[]>(() => [
    { key: 'jobId', label: 'ID', type: 'string', className: 'w-[80px] px-6 font-mono text-xs text-slate-500 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-400', render: (item) => `#${item.jobId}` },
    { key: 'jobName', label: t('table.jobName'), type: 'string', className: 'min-w-[200px] max-w-[320px] truncate font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400', render: (item) => item.jobName },
    { key: 'state', label: t('table.state'), type: 'string', className: 'w-[120px]', render: (item) => <Badge variant="outline" className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20 rounded-md text-[10px] font-bold px-2 py-0">{item.state || 'Failed'}</Badge> },
    { key: 'failedAt', label: t('table.time'), type: 'date', className: 'w-[180px]', render: (item) => formatDate(item.failedAt, i18n.language), searchableValue: (item) => formatDate(item.failedAt, i18n.language) },
    { key: 'reason', label: t('table.reason'), type: 'string', className: 'max-w-[400px] truncate', render: (item) => item.reason || '-' },
  ], [i18n.language, t]);

  const deadLetterColumns = useMemo<DataTableColumn<HangfireFailedResponseDto['items'][number]>[]>(() => [
    { key: 'jobId', label: 'ID', type: 'string', className: 'w-[80px] px-6 font-mono text-xs text-slate-500 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-400', render: (item) => `#${item.jobId}` },
    { key: 'jobName', label: t('table.jobName'), type: 'string', className: 'min-w-[200px] max-w-[320px] truncate font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400', render: (item) => item.jobName },
    { key: 'state', label: t('table.state'), type: 'string', className: 'w-[120px]', render: (item) => <Badge variant="outline" className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-500/20 rounded-md text-[10px] font-bold px-2 py-0">{item.state || 'Enqueued'}</Badge> },
    { key: 'enqueuedAt', label: t('table.time'), type: 'date', className: 'w-[180px]', render: (item) => formatDate(item.enqueuedAt, i18n.language), searchableValue: (item) => formatDate(item.enqueuedAt, i18n.language) },
    { key: 'reason', label: t('table.reason'), type: 'string', className: 'max-w-[400px] truncate', render: (item) => item.reason || '-' },
  ], [i18n.language, t]);

  const getVisibleColumns = <T extends object,>(columns: DataTableColumn<T>[], controls: DataTableControls): DataTableColumn<T>[] => {
    const byKey = new Map(columns.map((column) => [column.key, column]));
    const ordered = controls.columnOrder.map((key) => byKey.get(key)).filter((column): column is DataTableColumn<T> => Boolean(column));
    const missing = columns.filter((column) => !controls.columnOrder.includes(column.key));
    return [...ordered, ...missing].filter((column) => controls.visibleColumns.includes(column.key));
  };

  const renderStockPaging = (
    total: number,
    page: number,
    totalPages: number,
    onPrevious: () => void,
    onNext: () => void,
  ): ReactElement => (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 bg-slate-50 dark:bg-blue-950/50 border-t border-slate-200 dark:border-cyan-800/30 gap-4 shrink-0 rounded-b-2xl">
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
        {t('stock:list.total')} <span className="font-bold text-slate-900 dark:text-white mx-1">{total}</span> {t('stock:list.recordsListed')}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg text-xs bg-white border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-transparent dark:border-cyan-800/50 dark:text-slate-300 dark:hover:bg-blue-900/50 dark:hover:text-white disabled:opacity-50 transition-colors" onClick={onPrevious} disabled={page <= 1}>
          <ArrowLeft className="w-3 h-3 mr-1" /> {t('stock:list.previous')}
        </Button>
        <div className="text-xs font-semibold bg-white border border-slate-200 text-slate-800 dark:bg-blue-950 dark:border-cyan-800/50 px-3 py-1.5 rounded-md min-w-12 text-center dark:text-slate-200 shadow-sm">
          {page} / {totalPages}
        </div>
        <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg text-xs bg-white border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-transparent dark:border-cyan-800/50 dark:text-slate-300 dark:hover:bg-blue-900/50 dark:hover:text-white disabled:opacity-50 transition-colors" onClick={onNext} disabled={page >= totalPages}>
          {t('stock:list.next')} <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );

  const renderPagedDataTable = <T extends object,>({
    title,
    icon,
    headerRight,
    columns,
    controls,
    rows,
    emptyText,
    emptyIcon,
    rowKey,
    onRowClick,
    selectedRowKey,
    total,
    page,
    totalPages,
    onPrevious,
    onNext,
    onRefresh,
  }: {
    title: string;
    icon: ReactElement;
    headerRight?: ReactNode;
    columns: DataTableColumn<T>[];
    controls: DataTableControls;
    rows: T[];
    emptyText: string;
    emptyIcon: ReactElement;
    rowKey: (row: T) => string;
    onRowClick?: (row: T) => void;
    selectedRowKey?: string | null;
    total: number;
    page: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
    onRefresh: () => Promise<void>;
  }): ReactElement => {
    const visibleTableColumns = getVisibleColumns(columns, controls);
    const filteredRows = filterDataTableRows(rows, columns, controls);
    const filterColumns = columns.map((column) => ({
      value: column.key,
      type: column.type,
      labelKey: column.label,
      translatedLabel: column.label,
    }));
    const hasFiltersActive = controls.appliedFilterRows.some((row) => row.value.trim());

    return (
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            {icon}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">{title}</h2>
          </div>
          {headerRight ?? null}
        </div>
        <div className="bg-white dark:bg-blue-950/60 backdrop-blur-xl border border-slate-200 dark:border-cyan-800/30 rounded-2xl p-5 flex flex-col gap-5 shadow-sm transition-all duration-300">
          <PageToolbar
            searchPlaceholder={t('common:search')}
            searchValue={controls.searchTerm}
            onSearchChange={controls.setSearchTerm}
            onRefresh={onRefresh}
            rightSlot={
              <div className="flex flex-wrap items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border transition-all duration-300 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-cyan-800/30 hover:bg-slate-100 dark:hover:bg-blue-900/50 hover:text-slate-900 dark:hover:text-white">
                      <span className="font-medium text-sm">{controls.pageSize}</span>
                      <ChevronDown size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-20 bg-white dark:bg-blue-950 border border-slate-200 dark:border-cyan-800/30 shadow-2xl rounded-xl overflow-hidden p-1">
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <DropdownMenuItem key={size} onSelect={() => controls.setPageSize(size)} className={cn('flex items-center justify-center text-xs font-medium px-2 py-1.5 rounded-lg cursor-pointer transition-colors', controls.pageSize === size ? 'bg-cyan-50 dark:bg-cyan-800/30 text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-blue-900/50 hover:text-slate-900 dark:hover:text-white')}>
                        {size}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Popover open={controls.showFilters} onOpenChange={controls.setShowFilters}>
                  <PopoverTrigger asChild>
                    <Button variant={hasFiltersActive ? 'default' : 'outline'} className={cn('h-10 px-3 sm:px-4 rounded-xl border transition-all duration-300', hasFiltersActive ? 'bg-cyan-50 dark:bg-cyan-800/30 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-700 hover:bg-cyan-100 dark:hover:bg-cyan-800/50' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-cyan-800/30 hover:bg-slate-100 dark:hover:bg-blue-900/50 hover:text-slate-900 dark:hover:text-white')}>
                      <Filter className="sm:mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">{t('common:filters')}</span>
                      {hasFiltersActive && <span className="ml-2 flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="bottom" align="start" className="w-[calc(100vw-2rem)] sm:w-[420px] p-0 bg-white dark:bg-blue-950 border border-slate-200 dark:border-cyan-800/30 shadow-2xl rounded-2xl overflow-hidden z-50">
                    <AdvancedFilter
                      columns={filterColumns}
                      defaultColumn={filterColumns[0]?.value ?? ''}
                      draftRows={controls.draftFilterRows}
                      onDraftRowsChange={controls.setDraftFilterRows}
                      onSearch={() => {
                        controls.setAppliedFilterRows(controls.draftFilterRows);
                        controls.setShowFilters(false);
                      }}
                      onClear={() => {
                        controls.setDraftFilterRows([]);
                        controls.setAppliedFilterRows([]);
                      }}
                      embedded
                    />
                  </PopoverContent>
                </Popover>

                <ColumnPreferencesPopover
                  pageKey={`aqua-hangfire-${title}`}
                  userId={user?.id}
                  columns={columns.map((column) => ({ key: column.key, label: column.label }))}
                  visibleColumns={controls.visibleColumns}
                  columnOrder={controls.columnOrder}
                  onVisibleColumnsChange={controls.setVisibleColumns}
                  onColumnOrderChange={controls.setColumnOrder}
                />
              </div>
            }
          />
        </div>
        <div className="bg-white dark:bg-blue-950/60 backdrop-blur-xl border border-slate-200 dark:border-cyan-800/30 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 flex flex-col min-h-0">
          <div className="overflow-x-auto min-h-[300px] custom-scrollbar">
            <Table className="w-full text-sm">
              <TableHeader className="bg-slate-50 dark:bg-blue-950/80 sticky top-0 z-10 backdrop-blur-sm">
                <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-cyan-800/30">
                  {visibleTableColumns.map((column) => (
                    <TableHead key={column.key} className={cn(headStyle, column.className?.includes('px-6') ? undefined : column.className)}>
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={Math.max(1, visibleTableColumns.length)} className="text-center text-slate-500 py-20 font-medium bg-white/50 dark:bg-transparent">
                      <div className="flex flex-col items-center justify-center gap-2">
                        {emptyIcon}
                        <span>{emptyText}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredRows.map((row) => {
                  const key = rowKey(row);
                  return (
                    <TableRow
                      key={key}
                      className={cn(
                        'group border-b border-slate-200 dark:border-cyan-800/30 last:border-0 hover:bg-slate-50 dark:hover:bg-blue-900/30 transition-colors duration-200',
                        onRowClick && 'cursor-pointer',
                        selectedRowKey === key && 'bg-cyan-50/60 dark:bg-cyan-500/10',
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      {visibleTableColumns.map((column) => (
                        <TableCell key={column.key} className={cn('text-sm text-slate-600 dark:text-slate-300 font-medium', column.className)} title={typeof column.render(row) === 'string' ? String(column.render(row)) : undefined}>
                          {column.render(row)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {renderStockPaging(total, page, totalPages, onPrevious, onNext)}
        </div>
      </section>
    );
  };

  return (
    <div className="w-full space-y-8 pb-10 animate-in fade-in duration-500">
      <Breadcrumb
        items={[
          { label: t('common:sidebar.accessControl') },
          { label: t('menu'), isActive: true },
        ]}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20 shadow-lg shadow-cyan-500/5 relative overflow-hidden transition-colors">
            <div className="absolute inset-0 bg-cyan-500/5 animate-pulse" />
            <Activity className="size-6 relative z-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors leading-none">
              {t('title')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium flex items-center gap-2 transition-colors">
              <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
              {t('description')}
            </p>
          </div>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          className="bg-white dark:bg-cyan-500/10 hover:bg-slate-50 dark:hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-slate-200 dark:border-cyan-500/20 h-11 px-6 rounded-xl transition-all shadow-sm active:scale-95"
        >
          <RefreshCw size={18} className={cn('mr-2', isRefreshing && 'animate-spin')} />
          {t('refresh')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {[
          { key: 'enqueued', icon: Clock, color: 'blue', val: statsQuery.data?.enqueued },
          { key: 'processing', icon: PlayCircle, color: 'amber', val: statsQuery.data?.processing },
          { key: 'succeeded', icon: CheckCircle2, color: 'emerald', val: statsQuery.data?.succeeded },
          { key: 'failed', icon: XCircle, color: 'rose', val: statsQuery.data?.failed },
        ].map((stat) => (
          <Card key={stat.key} className="backdrop-blur-xl border shadow-sm rounded-2xl overflow-hidden transition-all duration-300 bg-white dark:bg-blue-950/60 border-slate-200 dark:border-cyan-800/30">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className={cn('text-[10px] font-bold uppercase tracking-widest', stat.key === 'failed' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400')}>
                    {t(`stats.${stat.key}`)}
                  </p>
                  <h3 className={cn(
                    'text-3xl font-black mt-2 tabular-nums',
                    stat.color === 'rose' ? 'text-rose-600 dark:text-rose-500' :
                      stat.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                        stat.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                          'text-slate-900 dark:text-white',
                  )}>
                    {stat.val ?? 0}
                  </h3>
                </div>
                <div className={cn(
                  'p-2.5 rounded-xl border',
                  stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20' :
                    stat.color === 'amber' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20' :
                      stat.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' :
                        'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20',
                )}>
                  <stat.icon className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[380px_minmax(0,1fr)] gap-6">
        <Card className="bg-white dark:bg-blue-950/60 border border-slate-200 dark:border-cyan-800/30 rounded-2xl shadow-sm overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('recurring.title')}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('recurring.description')}</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('recurring.selectLabel')}
              </label>
              <Select value={selectedRecurringJobId} onValueChange={setSelectedRecurringJobId}>
                <SelectTrigger className="bg-white dark:bg-blue-950/80 border-slate-200 dark:border-cyan-800/30">
                  <SelectValue placeholder={t('recurring.selectPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {recurringItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.jobName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full rounded-xl"
              onClick={() => selectedRecurringJobId && triggerRecurringJobMutation.mutate(selectedRecurringJobId)}
              disabled={!selectedRecurringJobId || triggerRecurringJobMutation.isPending}
            >
              {triggerRecurringJobMutation.isPending ? <Loader2 className="size-4 mr-2 animate-spin" /> : <PlayCircle className="size-4 mr-2" />}
              {t('recurring.triggerButton')}
            </Button>
            <div className="rounded-xl border border-slate-200 dark:border-cyan-800/30 p-4 bg-slate-50/60 dark:bg-blue-900/20">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {selectedRecurringJob?.id || '-'}
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{selectedRecurringJob?.jobName || '-'}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">{selectedRecurringJob?.cron || '-'}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('recurring.table.nextExecution')}: {formatDate(selectedRecurringJob?.nextExecution, i18n.language)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('recurring.table.lastExecution')}: {formatDate(selectedRecurringJob?.lastExecution, i18n.language)}
              </div>
            </div>
          </CardContent>
        </Card>

        {renderPagedDataTable({
          title: t('recurring.title'),
          icon: <Clock className="size-5 text-cyan-600 dark:text-cyan-400" />,
          columns: recurringColumns,
          controls: recurringControls,
          rows: recurringRows,
          emptyText: t('recurring.empty'),
          emptyIcon: <Clock className="size-10 text-slate-400/30" />,
          rowKey: (row) => row.id,
          onRowClick: (row) => setSelectedRecurringJobId(row.id),
          selectedRowKey: selectedRecurringJob?.id ?? null,
          total: recurringTotal,
          page: recurringPage,
          totalPages: recurringTotalPages,
          onPrevious: () => setRecurringPage((p) => Math.max(1, p - 1)),
          onNext: () => setRecurringPage((p) => Math.min(recurringTotalPages, p + 1)),
          onRefresh: async () => {
            await recurringJobsQuery.refetch();
          },
        })}
      </div>

      {renderPagedDataTable({
        title: t('succeeded.title'),
        icon: <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />,
        columns: successColumns,
        controls: successControls,
        rows: successQuery.data?.items ?? [],
        emptyText: t('succeeded.empty'),
        emptyIcon: <CheckCircle2 className="size-10 text-emerald-500/20" />,
        rowKey: (row) => `success-${row.jobId}-${row.finishedAt ?? ''}`,
        total: successTotal,
        page: successPage,
        totalPages: successTotalPages,
        onPrevious: () => setSuccessPage((p) => Math.max(1, p - 1)),
        onNext: () => setSuccessPage((p) => Math.min(successTotalPages, p + 1)),
        onRefresh: async () => {
          await successQuery.refetch();
        },
      })}

      {renderPagedDataTable({
        title: t('failed.title'),
        icon: <XCircle className="size-5 text-rose-600 dark:text-rose-500" />,
        columns: failedColumns,
        controls: failedControls,
        rows: failedQuery.data?.items ?? [],
        emptyText: t('failed.empty'),
        emptyIcon: <CheckCircle2 className="size-10 text-emerald-500/20" />,
        rowKey: (row) => `failed-${row.jobId}-${row.reason ?? ''}`,
        total: failedTotal,
        page: failedPage,
        totalPages: failedTotalPages,
        onPrevious: () => setFailedPage((p) => Math.max(1, p - 1)),
        onNext: () => setFailedPage((p) => Math.min(failedTotalPages, p + 1)),
        onRefresh: async () => {
          await failedQuery.refetch();
        },
      })}

      {renderPagedDataTable({
        title: t('deadLetter.title'),
        icon: <AlertTriangle className="size-5 text-amber-600 dark:text-amber-500" />,
        headerRight: (
          <Badge variant="outline" className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-500/20 font-black text-[10px]">
            {t('deadLetter.enqueued').toUpperCase()}: {deadLetterQuery.data?.enqueued ?? 0}
          </Badge>
        ),
        columns: deadLetterColumns,
        controls: deadLetterControls,
        rows: deadLetterQuery.data?.items ?? [],
        emptyText: t('deadLetter.empty'),
        emptyIcon: <CheckCircle2 className="size-10 text-emerald-500/20" />,
        rowKey: (row) => `dead-letter-${row.jobId}-${row.reason ?? ''}`,
        total: deadLetterTotal,
        page: deadLetterPage,
        totalPages: deadLetterTotalPages,
        onPrevious: () => setDeadLetterPage((p) => Math.max(1, p - 1)),
        onNext: () => setDeadLetterPage((p) => Math.min(deadLetterTotalPages, p + 1)),
        onRefresh: async () => {
          await deadLetterQuery.refetch();
        },
      })}
    </div>
  );
}
