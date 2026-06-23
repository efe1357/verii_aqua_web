import { type ReactElement } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { BarChart3, Fish, Loader2, RefreshCw, Warehouse } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { aquaKpiApi, type ProjectFeedFishSummaryReport } from '@/features/project-feed-fish-summary-report/api';

const REPORT_QUERY_KEY = ['aqua', 'kpi', 'project-feed-fish-summary'] as const;

function formatNumber(value: number | null | undefined, locale: string, maximumFractionDigits = 2): string {
  if (value == null || Number.isNaN(value)) return '-';
  return new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value);
}

function SummaryCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: ReactElement;
}): ReactElement {
  return (
    <Card className="border-slate-200 bg-white dark:border-cyan-800/30 dark:bg-blue-950/50 shadow-sm">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{title}</p>
            <p className="mt-2 text-2xl font-black tabular-nums text-slate-900 dark:text-white">{value}</p>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{description}</p>
          </div>
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-3 text-cyan-600 dark:border-cyan-800/40 dark:bg-cyan-950/20 dark:text-cyan-300">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProjectFeedFishSummaryReportPage(): ReactElement {
  const { t, i18n } = useTranslation('common');

  const reportQuery = useQuery<ProjectFeedFishSummaryReport>({
    queryKey: REPORT_QUERY_KEY,
    queryFn: () => aquaKpiApi.getProjectFeedFishSummary(),
  });

  const report = reportQuery.data;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Breadcrumb
        items={[
          { label: t('sidebar.aquaReports') },
          { label: t('sidebar.aquaProjectFeedFishSummaryReport'), isActive: true },
        ]}
      />

      <Card className="border-slate-200 bg-white/90 shadow-sm dark:border-cyan-800/30 dark:bg-blue-950/50">
        <CardHeader className="gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-900 dark:text-white">
              <BarChart3 className="size-5 text-cyan-500" />
              {t('aqua.projectFeedFishSummaryReport.pageTitle')}
            </CardTitle>
            <CardDescription className="mt-1">{t('aqua.projectFeedFishSummaryReport.description')}</CardDescription>
          </div>
          <Button type="button" variant="outline" onClick={() => void reportQuery.refetch()} disabled={reportQuery.isFetching}>
            {reportQuery.isFetching ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            {t('aqua.projectFeedFishSummaryReport.refresh')}
          </Button>
        </CardHeader>
      </Card>

      {reportQuery.isLoading ? (
        <Card className="border-slate-200 bg-white dark:border-cyan-800/30 dark:bg-blue-950/50">
          <CardContent className="flex items-center justify-center gap-3 py-16 text-slate-600 dark:text-slate-300">
            <Loader2 className="size-5 animate-spin" />
            {t('aqua.projectFeedFishSummaryReport.loading')}
          </CardContent>
        </Card>
      ) : reportQuery.isError ? (
        <Card className="border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20">
          <CardContent className="py-10 text-sm text-red-700 dark:text-red-300">
            {reportQuery.error instanceof Error ? reportQuery.error.message : t('aqua.projectFeedFishSummaryReport.loadFailed')}
          </CardContent>
        </Card>
      ) : report ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title={t('aqua.projectFeedFishSummaryReport.cards.totalFish')}
              value={formatNumber(report.totals.totalFish, i18n.language, 0)}
              description={t('aqua.projectFeedFishSummaryReport.cards.totalFishDescription')}
              icon={<Fish className="size-5" />}
            />
            <SummaryCard
              title={t('aqua.projectFeedFishSummaryReport.cards.totalFeed')}
              value={`${formatNumber(report.totals.totalFeedKg, i18n.language)} kg`}
              description={t('aqua.projectFeedFishSummaryReport.cards.totalFeedDescription')}
              icon={<BarChart3 className="size-5" />}
            />
            <SummaryCard
              title={t('aqua.projectFeedFishSummaryReport.cards.warehouseFish')}
              value={formatNumber(report.totals.warehouseFish, i18n.language, 0)}
              description={t('aqua.projectFeedFishSummaryReport.cards.warehouseFishDescription')}
              icon={<Warehouse className="size-5" />}
            />
            <SummaryCard
              title={t('aqua.projectFeedFishSummaryReport.cards.activeCage')}
              value={formatNumber(report.totals.activeCageCount, i18n.language, 0)}
              description={t('aqua.projectFeedFishSummaryReport.cards.activeCageDescription')}
              icon={<Fish className="size-5" />}
            />
          </div>

          <Card className="border-slate-200 bg-white dark:border-cyan-800/30 dark:bg-blue-950/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-slate-900 dark:text-white">{t('aqua.projectFeedFishSummaryReport.tableTitle')}</CardTitle>
              <CardDescription>{t('aqua.projectFeedFishSummaryReport.tableDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('aqua.projectFeedFishSummaryReport.columns.project')}</TableHead>
                    <TableHead className="text-right">{t('aqua.projectFeedFishSummaryReport.columns.cageFish')}</TableHead>
                    <TableHead className="text-right">{t('aqua.projectFeedFishSummaryReport.columns.warehouseFish')}</TableHead>
                    <TableHead className="text-right">{t('aqua.projectFeedFishSummaryReport.columns.totalFish')}</TableHead>
                    <TableHead className="text-right">{t('aqua.projectFeedFishSummaryReport.columns.cageBiomassKg')}</TableHead>
                    <TableHead className="text-right">{t('aqua.projectFeedFishSummaryReport.columns.warehouseBiomassKg')}</TableHead>
                    <TableHead className="text-right">{t('aqua.projectFeedFishSummaryReport.columns.totalBiomassKg')}</TableHead>
                    <TableHead className="text-right">{t('aqua.projectFeedFishSummaryReport.columns.totalFeedKg')}</TableHead>
                    <TableHead className="text-right">{t('aqua.projectFeedFishSummaryReport.columns.activeCageCount')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.rows.map((row) => (
                    <TableRow key={row.projectId}>
                      <TableCell className="min-w-[220px] font-medium">
                        <div className="text-slate-900 dark:text-white">{row.projectName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{row.projectCode}</div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{formatNumber(row.cageFish, i18n.language, 0)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatNumber(row.warehouseFish, i18n.language, 0)}</TableCell>
                      <TableCell className="text-right font-bold tabular-nums">{formatNumber(row.totalFish, i18n.language, 0)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatNumber(row.cageBiomassKg, i18n.language)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatNumber(row.warehouseBiomassKg, i18n.language)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatNumber(row.totalBiomassKg, i18n.language)}</TableCell>
                      <TableCell className="text-right font-bold tabular-nums">{formatNumber(row.totalFeedKg, i18n.language)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatNumber(row.activeCageCount, i18n.language, 0)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-cyan-50/70 font-bold dark:bg-cyan-950/20">
                    <TableCell>{t('aqua.projectFeedFishSummaryReport.columns.total')}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatNumber(report.totals.cageFish, i18n.language, 0)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatNumber(report.totals.warehouseFish, i18n.language, 0)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatNumber(report.totals.totalFish, i18n.language, 0)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatNumber(report.totals.cageBiomassKg, i18n.language)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatNumber(report.totals.warehouseBiomassKg, i18n.language)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatNumber(report.totals.totalBiomassKg, i18n.language)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatNumber(report.totals.totalFeedKg, i18n.language)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatNumber(report.totals.activeCageCount, i18n.language, 0)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
