import { type ReactElement, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useUIStore } from '@/stores/ui-store';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Database, Search, RefreshCw, ArrowLeft, ArrowRight, Boxes, Building2, UsersRound, GitBranch } from 'lucide-react';
import { netsisMirrorApi, type NetsisMirrorKind, type NetsisMirrorRow } from '../api/netsisMirrorApi';

const PAGE_SIZE = 20;

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
  const value = raw[key] ?? raw[pascalKey];
  if (value == null || value === '') return '-';
  return String(value);
}

function NetsisMirrorPage({ kind }: NetsisMirrorPageProps): ReactElement {
  const { t } = useTranslation(['netsis-mirror', 'common']);
  const { setPageTitle } = useUIStore();
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const columns = COLUMNS_BY_KIND[kind];
  const Icon = ICON_BY_KIND[kind];

  useEffect(() => {
    setPageTitle(t(`pages.${kind}.title`));
    return () => setPageTitle(null);
  }, [kind, setPageTitle, t]);

  useEffect(() => {
    setPageNumber(1);
  }, [deferredSearch]);

  const query = useQuery({
    queryKey: ['netsis-mirror', kind, pageNumber, PAGE_SIZE, deferredSearch],
    queryFn: () => netsisMirrorApi.getPaged<NetsisMirrorRow>({
      kind,
      pageNumber,
      pageSize: PAGE_SIZE,
      search: deferredSearch,
    }),
    staleTime: 30_000,
  });

  const rows = query.data?.data ?? [];
  const totalCount = query.data?.totalCount ?? 0;
  const totalPages = Math.max(1, query.data?.totalPages ?? Math.ceil(totalCount / PAGE_SIZE));
  const rangeStart = totalCount === 0 ? 0 : (pageNumber - 1) * PAGE_SIZE + 1;
  const rangeEnd = totalCount === 0 ? 0 : Math.min(pageNumber * PAGE_SIZE, totalCount);

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

      <div className="flex flex-col gap-5 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-white via-cyan-50/60 to-blue-50 p-5 shadow-sm dark:from-blue-950/80 dark:via-blue-950/60 dark:to-cyan-950/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/25 bg-cyan-500/10 text-cyan-600 shadow-lg shadow-cyan-500/10 dark:text-cyan-300">
              <Icon className="size-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">{pageMeta.title}</h1>
                <Badge className="rounded-full bg-cyan-500/10 text-cyan-700 hover:bg-cyan-500/10 dark:text-cyan-300">
                  {pageMeta.badge}
                </Badge>
              </div>
              <p className="mt-2 max-w-3xl text-sm font-medium text-slate-600 dark:text-slate-300">{pageMeta.description}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
            className="h-11 rounded-xl border-cyan-500/20 bg-white/80 text-cyan-700 hover:bg-cyan-50 dark:bg-cyan-500/10 dark:text-cyan-200 dark:hover:bg-cyan-500/20"
          >
            <RefreshCw className={cn('mr-2 size-4', query.isFetching && 'animate-spin')} />
            {t('actions.refresh')}
          </Button>
        </div>

        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t(`pages.${kind}.searchPlaceholder`)}
            className="h-12 rounded-2xl border-cyan-500/20 bg-white/90 pl-11 font-semibold shadow-sm dark:bg-blue-950/70"
          />
        </div>
      </div>

      <Card className="overflow-hidden rounded-3xl border-slate-200 bg-white shadow-sm dark:border-cyan-800/30 dark:bg-blue-950/60">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-5 py-4 dark:border-cyan-800/30 dark:bg-blue-900/25">
            <div className="flex items-center gap-3">
              <Database className="size-5 text-cyan-600 dark:text-cyan-300" />
              <span className="text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{t('table.title')}</span>
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t('table.range', { from: rangeStart, to: rangeEnd, total: totalCount })}
            </span>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 dark:bg-blue-900/40">
                <TableRow className="border-b border-slate-200 hover:bg-transparent dark:border-cyan-800/30">
                  {columns.map((column) => (
                    <TableHead key={column.key} className="whitespace-nowrap py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      {t(column.labelKey)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="py-16 text-center text-sm font-bold text-slate-500">
                      {t('table.loading')}
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="py-16 text-center text-sm font-bold text-slate-500">
                      {query.isError ? t('table.error') : t('table.empty')}
                    </TableCell>
                  </TableRow>
                ) : rows.map((row, index) => (
                  <TableRow key={`${kind}-${pageNumber}-${index}`} className="border-b border-slate-100 transition-colors hover:bg-cyan-50/50 dark:border-cyan-800/10 dark:hover:bg-cyan-500/10">
                    {columns.map((column) => (
                      <TableCell key={column.key} className={cn('max-w-[320px] truncate py-4 text-sm font-semibold text-slate-700 dark:text-slate-200', column.className)} title={readCell(row, column.key)}>
                        {readCell(row, column.key)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/70 px-5 py-4 dark:border-cyan-800/30 dark:bg-blue-950/40 sm:flex-row">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t('table.page', { page: pageNumber, totalPages })}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPageNumber((page) => Math.max(1, page - 1))} disabled={pageNumber <= 1 || query.isFetching} className="rounded-xl">
                <ArrowLeft className="mr-2 size-4" />
                {t('common:common.previous')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPageNumber((page) => Math.min(totalPages, page + 1))} disabled={pageNumber >= totalPages || query.isFetching} className="rounded-xl">
                {t('common:common.next')}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
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
