import { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { formatCodeAndKeyLabel } from '@/shared/utils/dropdown-label';
import { aquaQuickDailyApi } from '../api/aqua-quick-api';
import { feedingQuickFormSchema, type FeedingQuickFormSchema } from '../schema/quick-daily-entry-schema';
import type { StockDto } from '../types/quick-daily-entry-types';
import { ChevronRight, Info, Save } from 'lucide-react'; // Aqua konseptine uygun ikonlar eklendi
import { getPositiveNumberInputProps } from './positive-number-input';

interface FeedingQuickFormProps {
  projectId: number | null;
  projectCageId: number | null;
  feedingDate: string;
  stocks: StockDto[] | undefined;
  isLoadingStocks: boolean;
  onSubmit: (data: FeedingQuickFormSchema) => Promise<void>;
  isSubmitting: boolean;
  canSubmit: boolean;
}

export function FeedingQuickForm({
  projectId,
  projectCageId,
  feedingDate,
  stocks,
  isLoadingStocks,
  onSubmit,
  isSubmitting,
  canSubmit,
}: FeedingQuickFormProps): ReactElement {
  const { t } = useTranslation('common');
  const form = useForm<FeedingQuickFormSchema>({
    resolver: zodResolver(feedingQuickFormSchema) as Resolver<FeedingQuickFormSchema>,
    mode: 'onChange',
    defaultValues: {
      feedingSlot: 0,
      stockId: 0,
      qtyUnit: 0,
      gramPerUnit: 0.001,
    },
  });

  const handleSubmit: SubmitHandler<FeedingQuickFormSchema> = async (data) => {
    const existingLine = feedingSummaryLines.find((item) => Number(item.feedingSlot ?? 0) === Number(data.feedingSlot));
    if (existingLine?.isERPIntegrated) {
      toast.error(t('aqua.common.erpIntegratedFeedingLocked'));
      return;
    }

    await onSubmit(data);
    await feedingSummaryQuery.refetch();
    form.reset({ feedingSlot: 0, stockId: 0, qtyUnit: 0, gramPerUnit: 0.001 });
  };

  const disabled = projectId == null || projectCageId == null;

  const feedingSummaryQuery = useQuery({
    queryKey: ['aqua', 'quick-daily-entry', 'feeding-summary', projectId, projectCageId, feedingDate],
    queryFn: () => aquaQuickDailyApi.getFeedingLinesByProjectCageAndDate(
      projectId!,
      feedingDate,
      projectCageId!
    ),
    enabled:
      projectId != null &&
      projectCageId != null &&
      Boolean(feedingDate),
    staleTime: 5000,
  });
  const feedingSummaryLines = feedingSummaryQuery.data ?? [];

  const feedingSlotOptions = [
    { value: '0', label: t('aqua.quickDailyEntry.feeding.morning') },
    { value: '1', label: t('aqua.quickDailyEntry.feeding.evening') },
  ];
  const stockOptions = (Array.isArray(stocks) ? stocks : [])
    .filter((s) => String(s.grupKodu ?? '').trim().toLocaleUpperCase('tr-TR') === 'YEM')
    .map((s) => ({
      value: String(s.id),
      label: formatCodeAndKeyLabel(s.code, s.id, s.name),
    }));

  // AQUA KONSEPT STİLLERİ
  const labelStyle = "text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1 flex items-center gap-1.5";
  const inputStyle = "bg-slate-50 dark:bg-blue-950/50 border-slate-200 dark:border-cyan-800/30 text-slate-900 dark:text-white focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 h-11 rounded-xl transition-all duration-200";
  const formatKg = (value: number | null | undefined) => Number(value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 3 });

  return (
    <Card className="bg-white dark:bg-blue-950/60 backdrop-blur-xl border border-slate-200 dark:border-cyan-800/30 shadow-sm rounded-2xl overflow-hidden transition-all duration-300">
      <CardHeader className="border-b border-slate-200 dark:border-cyan-800/30 px-6 py-5 bg-slate-50/50 dark:bg-blue-950/30">
        <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          {t('aqua.quickDailyEntry.feeding.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="space-y-6">
            <div className="rounded-2xl border border-cyan-800/30 bg-blue-950/30 p-4">
              <div className="mb-4 flex items-start gap-3">
                <Info size={18} className="mt-0.5 shrink-0 text-cyan-400" />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('aqua.quickDailyEntry.feeding.summaryTitle')}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {feedingSummaryQuery.isFetching
                      ? t('common.loading')
                      : t('aqua.quickDailyEntry.feeding.summaryDescription')}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {feedingSlotOptions.map((slot) => {
                  const line = feedingSummaryLines.find((item) => Number(item.feedingSlot ?? 0) === Number(slot.value));
                  const stockLabel = line
                    ? formatCodeAndKeyLabel(line.stockCode, line.stockId, line.stockName)
                    : t('aqua.quickDailyEntry.feeding.summaryEmptySlot');

                  return (
                    <div
                      key={slot.value}
                      className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm dark:border-cyan-800/30 dark:bg-blue-950/50"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-700 dark:text-cyan-200">
                          {slot.label}
                        </span>
                        {line ? (
                          <span className={`text-xs font-semibold ${line.isERPIntegrated ? 'text-amber-600 dark:text-amber-300' : 'text-emerald-600 dark:text-emerald-300'}`}>
                            {line.isERPIntegrated
                              ? t('aqua.quickDailyEntry.feeding.summaryErpIntegrated')
                              : t('aqua.quickDailyEntry.feeding.summaryRecorded')}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {stockLabel}
                      </p>
                      {line ? (
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="rounded-xl bg-slate-100 px-3 py-2 dark:bg-blue-900/50">
                            <p className="text-slate-500 dark:text-slate-400">
                              {t('aqua.quickDailyEntry.feeding.summaryQuantityKg')}
                            </p>
                            <p className="mt-1 font-bold text-slate-900 dark:text-white">
                              {formatKg(line.qtyUnit)}
                            </p>
                          </div>
                          <div className="rounded-xl bg-slate-100 px-3 py-2 dark:bg-blue-900/50">
                            <p className="text-slate-500 dark:text-slate-400">
                              {t('aqua.quickDailyEntry.feeding.summaryTotalKg')}
                            </p>
                            <p className="mt-1 font-bold text-slate-900 dark:text-white">
                              {formatKg(Number(line.totalGram ?? 0) / 1000)}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="feedingSlot"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel required className={labelStyle}>
                        <ChevronRight size={14} className="text-cyan-500" />
                        {t('aqua.quickDailyEntry.feeding.slot')}
                      </FormLabel>
                      <FormControl>
                        <Combobox
                          options={feedingSlotOptions}
                          value={String(field.value)}
                          onValueChange={(v) => field.onChange(Number(v))}
                          placeholder={t('aqua.quickDailyEntry.feeding.slot')}
                          searchPlaceholder={t('common.search')}
                          emptyText={t('common.noResults')}
                          className={inputStyle}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stockId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel required className={labelStyle}>
                        <ChevronRight size={14} className="text-cyan-500" />
                        {t('aqua.quickDailyEntry.feeding.feedStock')}
                      </FormLabel>
                      <FormControl>
                        <Combobox
                          options={stockOptions}
                          value={field.value ? String(field.value) : ''}
                          onValueChange={(v) => field.onChange(v ? Number(v) : 0)}
                          placeholder={t('aqua.quickDailyEntry.feeding.selectStock')}
                          searchPlaceholder={t('common.search')}
                          emptyText={t('common.noResults')}
                          disabled={isLoadingStocks}
                          className={inputStyle}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="qtyUnit"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel required className={labelStyle}>
                        <ChevronRight size={14} className="text-cyan-500" />
                        {t('aqua.quickDailyEntry.feeding.qty')} (KG)
                      </FormLabel>
                      <FormControl>
	                        <Input type="number" className={inputStyle} {...getPositiveNumberInputProps(field, { allowDecimal: true, min: 0.001 })} />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
            </div>
            
            <div className="pt-4 flex justify-end border-t border-slate-200 dark:border-cyan-800/30">
                <Button 
                  type="submit" 
                  disabled={disabled || isSubmitting || !form.formState.isValid || !canSubmit} 
                  className="bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold hover:opacity-95 border-0 h-11 px-10 w-full sm:w-auto rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-200 flex items-center gap-2"
                >
                  <Save size={18} />
                  {t('aqua.quickDailyEntry.feeding.save')}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
