import { type ReactElement, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Boxes, Building2, UsersRound, GitBranch, ChevronDown, Filter } from 'lucide-react';
import { netsisMirrorApi, type NetsisMirrorKind, type NetsisMirrorRow } from '../api/netsisMirrorApi';
import { applyFilterRowsClient, type FilterColumnConfig, type FilterRow } from '@/lib/advanced-filter-types';
import { loadColumnPreferences } from '@/lib/column-preferences';

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

interface ColumnDefinition {
  key: string;
  labelKey: string;
  className?: string;
}

const COLUMNS_BY_KIND: Record<NetsisMirrorKind, ColumnDefinition[]> = {
  customers: [
    { key: 'cariKod', labelKey: 'columns.customerCode', className: 'font-mono' },
    { key: 'cariIsim', labelKey: 'columns.customerName' },
    { key: 'cariTel', labelKey: 'columns.phone' },
    { key: 'cariIl', labelKey: 'columns.city' },
    { key: 'cariIlce', labelKey: 'columns.district' },
    { key: 'vergiNumarasi', labelKey: 'columns.taxNumber' },
  ],
  stocks: [
    { key: 'stokKodu', labelKey: 'columns.stockCode', className: 'font-mono' },
    { key: 'stokAdi', labelKey: 'columns.stockName' },
    { key: 'olcuBr1', labelKey: 'columns.unit' },
    { key: 'grupKodu', labelKey: 'columns.groupCode' },
    { key: 'grupIsim', labelKey: 'columns.groupName' },
    { key: 'ureticiKodu', labelKey: 'columns.producerCode' },
  ],
  warehouses: [
    { key: 'depoKodu', labelKey: 'columns.warehouseCode', className: 'font-mono' },
    { key: 'depoIsmi', labelKey: 'columns.warehouseName' },
    { key: 'cariKodu', labelKey: 'columns.customerCode' },
    { key: 'subeKodu', labelKey: 'columns.branchCode' },
    { key: 'depoKilitLe', labelKey: 'columns.locked' },
    { key: 'eksibakiye', labelKey: 'columns.negativeBalance' },
  ],
  branches: [
    { key: 'subeKodu', labelKey: 'columns.branchCode', className: 'font-mono' },
    { key: 'unvan', labelKey: 'columns.branchName' },
  ],
};

const ICON_BY_KIND = {
  customers: UsersRound,
  stocks: Boxes,
  warehouses: Building2,
  branches: GitBranch,
} as const;

interface NetsisMirrorPageProps {
  kind: NetsisMirrorKind;
}

function readCell(row: NetsisMirrorRow, key: string): string {
  const raw = row as unknown as Record<string, unknown>;
  const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
  const fallbackKeyByColumn: Record<string, string[]> = {
    grupIsim: ['grupAdi', 'GrupAdi'],
    grupAdi: ['grupIsim', 'GrupIsim'],
  };
  const fallbackValue = fallbackKeyByColumn[key]?.map((fallbackKey) => raw[fallbackKey]).find((candidate) => candidate != null && candidate !== '');
  const value = raw[key] ?? raw[pascalKey] ?? fallbackValue;
  if (value == null || value === '') return '-';
  return String(value);
}

function NetsisMirrorPage({ kind }: NetsisMirrorPageProps): ReactElement {
  const { t } = useTranslation(['netsis-mirror', 'stock', 'common']);
  const { setPageTitle } = useUIStore();
  const { user } = useAuthStore();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [draftFilterRows, setDraftFilterRows] = useState<FilterRow[]>([]);
  const [appliedFilterRows, setAppliedFilterRows] = useState<FilterRow[]>([]);
  const deferredSearch = useDeferredValue(search);
  const columns = COLUMNS_BY_KIND[kind];
  const Icon = ICON_BY_KIND[kind];
  const defaultColumnKeys = useMemo(() => columns.map((column) => column.key), [columns]);
  const [columnOrder, setColumnOrder] = useState<string[]>(() => defaultColumnKeys);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => defaultColumnKeys);

  useEffect(() => {
    setPageTitle(t(`pages.${kind}.title`));
    return () => setPageTitle(null);
  }, [kind, setPageTitle, t]);

  useEffect(() => {
    const prefs = loadColumnPreferences(`aqua-netsis-mirror-${kind}`, user?.id, defaultColumnKeys, defaultColumnKeys[0]);
    setVisibleColumns(prefs.visibleKeys);
    setColumnOrder(prefs.order);
  }, [defaultColumnKeys, kind, user?.id]);

  useEffect(() => {
    setPageNumber(1);
  }, [deferredSearch, pageSize, appliedFilterRows]);

  const query = useQuery({
    queryKey: ['netsis-mirror', kind, pageNumber, pageSize, deferredSearch],
    queryFn: () => netsisMirrorApi.getPaged<NetsisMirrorRow>({
      kind,
      pageNumber,
      pageSize,
      search: deferredSearch,
    }),
    staleTime: 30_000,
  });

  const rows = query.data?.data ?? [];
  const totalCount = query.data?.totalCount ?? 0;
  const totalPages = Math.max(1, query.data?.totalPages ?? Math.ceil(totalCount / pageSize));
  const filterColumns = useMemo<(FilterColumnConfig & { translatedLabel: string })[]>(() => columns.map((column) => ({
    value: column.key,
    type: column.key.toLowerCase().includes('kilit') || column.key.toLowerCase().includes('locked') ? 'boolean' : 'string',
    labelKey: column.labelKey,
    translatedLabel: t(column.labelKey),
  })), [columns, t]);
  const activeColumns = useMemo(() => {
    const byKey = new Map(columns.map((column) => [column.key, column]));
    const ordered = columnOrder.map((key) => byKey.get(key)).filter((column): column is ColumnDefinition => Boolean(column));
    const missing = columns.filter((column) => !columnOrder.includes(column.key));
    return [...ordered, ...missing].filter((column) => visibleColumns.includes(column.key));
  }, [columnOrder, columns, visibleColumns]);
  const filteredRows = useMemo(() => applyFilterRowsClient(rows, appliedFilterRows, filterColumns), [appliedFilterRows, filterColumns, rows]);
  const hasFiltersActive = appliedFilterRows.some((row) => row.value.trim());

  const pageMeta = useMemo(() => ({
    title: t(`pages.${kind}.title`),
    description: t(`pages.${kind}.description`),
    badge: t(`pages.${kind}.badge`),
  }), [kind, t]);

  return (
    <div className="w-full space-y-6 pb-10 animate-in fade-in duration-500">
      <Breadcrumb
        items={[
          { label: t('common:sidebar.netsisMirror') },
          { label: pageMeta.title, isActive: true },
        ]}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20 shadow-lg shadow-cyan-500/5">
              <Icon className="size-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 transition-colors">
                {pageMeta.title}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors mt-1">
                {pageMeta.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-white dark:bg-blue-950/60 backdrop-blur-xl border border-slate-200 dark:border-cyan-800/30 rounded-2xl p-5 flex flex-col gap-5 shadow-sm transition-all duration-300">
        <PageToolbar
          searchPlaceholder={t(`pages.${kind}.searchPlaceholder`)}
          searchValue={search}
          onSearchChange={setSearch}
          onRefresh={async () => {
            await query.refetch();
          }}
          rightSlot={
            <div className="flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 bg-slate-50 dark:bg-blue-900/30 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-cyan-800/30 hover:bg-slate-100 dark:hover:bg-blue-900/50 hover:text-slate-900 dark:hover:text-white">
                    <span className="font-medium text-sm">{pageSize}</span>
                    <ChevronDown size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-20 bg-white dark:bg-blue-950 border border-slate-200 dark:border-cyan-800/30 shadow-2xl rounded-xl overflow-hidden p-1">
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <DropdownMenuItem key={size} onSelect={() => setPageSize(size)} className={cn('flex items-center justify-center text-xs font-medium px-2 py-1.5 rounded-lg cursor-pointer transition-colors', pageSize === size ? 'bg-cyan-50 dark:bg-cyan-800/30 text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-blue-900/50 hover:text-slate-900 dark:hover:text-white')}>
                      {size}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover open={showFilters} onOpenChange={setShowFilters}>
                <PopoverTrigger asChild>
                  <Button variant={hasFiltersActive ? 'default' : 'outline'} className={cn('h-10 px-3 sm:px-4 rounded-xl border transition-all duration-300', hasFiltersActive ? 'bg-cyan-50 dark:bg-cyan-800/30 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-700 hover:bg-cyan-100 dark:hover:bg-cyan-800/50' : 'bg-slate-50 dark:bg-blue-900/30 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-cyan-800/30 hover:bg-slate-100 dark:hover:bg-blue-900/50 hover:text-slate-900 dark:hover:text-white')}>
                    <Filter className="sm:mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{t('common:filters')}</span>
                    {hasFiltersActive && <span className="ml-2 flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />}
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="start" className="w-[calc(100vw-2rem)] sm:w-[420px] p-0 bg-white dark:bg-blue-950 border border-slate-200 dark:border-cyan-800/30 shadow-2xl rounded-2xl overflow-hidden z-50">
                  <AdvancedFilter
                    columns={filterColumns}
                    defaultColumn={filterColumns[0]?.value ?? ''}
                    draftRows={draftFilterRows}
                    onDraftRowsChange={setDraftFilterRows}
                    onSearch={() => {
                      setAppliedFilterRows(draftFilterRows);
                      setShowFilters(false);
                    }}
                    onClear={() => {
                      setDraftFilterRows([]);
                      setAppliedFilterRows([]);
                    }}
                    embedded
                  />
                </PopoverContent>
              </Popover>

              <ColumnPreferencesPopover
                pageKey={`aqua-netsis-mirror-${kind}`}
                userId={user?.id}
                columns={columns.map((column) => ({ key: column.key, label: t(column.labelKey) }))}
                visibleColumns={visibleColumns}
                columnOrder={columnOrder}
                onVisibleColumnsChange={setVisibleColumns}
                onColumnOrderChange={setColumnOrder}
              />
            </div>
          }
        />
      </div>

      <div className="relative z-10 bg-white dark:bg-blue-950/60 backdrop-blur-xl border border-slate-200 dark:border-cyan-800/30 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
        <div className="bg-transparent flex flex-col min-h-0">
          <div className="overflow-x-auto min-h-[300px] custom-scrollbar">
            <Table className="w-full text-sm">
              <TableHeader className="bg-slate-50 dark:bg-blue-950/80 sticky top-0 z-10 backdrop-blur-sm">
                <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-cyan-800/30">
                  {activeColumns.map((column) => (
                    <TableHead key={column.key} className="whitespace-nowrap py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t(column.labelKey)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={Math.max(1, activeColumns.length)} className="py-16 text-center text-sm font-bold text-slate-500">
                      {t('table.loading')}
                    </TableCell>
                  </TableRow>
                ) : filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={Math.max(1, activeColumns.length)} className="py-16 text-center text-sm font-bold text-slate-500">
                      {query.isError ? t('table.error') : t('table.empty')}
                    </TableCell>
                  </TableRow>
                ) : filteredRows.map((row, index) => (
                  <TableRow key={`${kind}-${pageNumber}-${index}`} className="group border-b border-slate-200 dark:border-cyan-800/30 last:border-0 hover:bg-slate-50 dark:hover:bg-blue-900/30 transition-colors duration-200">
                    {activeColumns.map((column) => (
                      <TableCell key={column.key} className={cn('max-w-[320px] truncate py-4 text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400', column.className)} title={readCell(row, column.key)}>
                        {readCell(row, column.key)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 bg-slate-50 dark:bg-blue-950/50 border-t border-slate-200 dark:border-cyan-800/30 gap-4 shrink-0 rounded-b-2xl">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t('stock:list.total')} <span className="font-bold text-slate-900 dark:text-white mx-1">{totalCount}</span> {t('stock:list.recordsListed')}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg text-xs bg-white border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-transparent dark:border-cyan-800/50 dark:text-slate-300 dark:hover:bg-blue-900/50 dark:hover:text-white disabled:opacity-50 transition-colors" onClick={() => setPageNumber((page) => Math.max(1, page - 1))} disabled={pageNumber <= 1 || query.isFetching}>
                <ArrowLeft className="w-3 h-3 mr-1" /> {t('stock:list.previous')}
              </Button>
              <div className="text-xs font-semibold bg-white border border-slate-200 text-slate-800 dark:bg-blue-950 dark:border-cyan-800/50 px-3 py-1.5 rounded-md min-w-12 text-center dark:text-slate-200 shadow-sm">
                {pageNumber} / {totalPages}
              </div>
              <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg text-xs bg-white border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-transparent dark:border-cyan-800/50 dark:text-slate-300 dark:hover:bg-blue-900/50 dark:hover:text-white disabled:opacity-50 transition-colors" onClick={() => setPageNumber((page) => Math.min(totalPages, page + 1))} disabled={pageNumber >= totalPages || query.isFetching}>
                {t('stock:list.next')} <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NetsisMirrorCustomersPage(): ReactElement {
  return <NetsisMirrorPage kind="customers" />;
}

export function NetsisMirrorStocksPage(): ReactElement {
  return <NetsisMirrorPage kind="stocks" />;
}

export function NetsisMirrorWarehousesPage(): ReactElement {
  return <NetsisMirrorPage kind="warehouses" />;
}

export function NetsisMirrorBranchesPage(): ReactElement {
  return <NetsisMirrorPage kind="branches" />;
}
