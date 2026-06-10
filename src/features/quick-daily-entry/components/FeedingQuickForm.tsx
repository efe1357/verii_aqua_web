import { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver, SubmitHandler } from 'react-hook-form';
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
    await onSubmit(data);
    form.reset({ feedingSlot: 0, stockId: 0, qtyUnit: 0, gramPerUnit: 0.001 });
  };

  const disabled = projectId == null || projectCageId == null;
  const selectedFeedingSlot = useWatch({ control: form.control, name: 'feedingSlot' });

  const existingFeedingLineQuery = useQuery({
    queryKey: ['aqua', 'quick-daily-entry', 'existing-feeding-line', projectId, projectCageId, feedingDate, selectedFeedingSlot],
    queryFn: () => aquaQuickDailyApi.findExistingFeedingLine(
      projectId!,
      feedingDate,
      Number(selectedFeedingSlot),
      projectCageId
    ),
    enabled:
      projectId != null &&
      projectCageId != null &&
      Boolean(feedingDate) &&
      Number.isFinite(Number(selectedFeedingSlot)),
    staleTime: 5000,
  });
  const existingFeedingLine = existingFeedingLineQuery.data ?? null;

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

            {existingFeedingLine ? (
              <div className="rounded-2xl border border-cyan-200 bg-cyan-50/80 px-4 py-3 text-sm text-cyan-950 shadow-sm dark:border-cyan-700/50 dark:bg-cyan-950/40 dark:text-cyan-50">
                <div className="flex items-start gap-3">
                  <Info size={18} className="mt-0.5 shrink-0 text-cyan-600 dark:text-cyan-300" />
                  <div className="space-y-1">
                    <p className="font-semibold">
                      {t('aqua.quickDailyEntry.feeding.existingUpdateTitle')}
                    </p>
                    <p className="text-cyan-800 dark:text-cyan-100">
                      {t('aqua.quickDailyEntry.feeding.existingUpdateDescription', {
                        qty: Number(existingFeedingLine.qtyUnit ?? 0).toLocaleString(undefined, { maximumFractionDigits: 3 }),
                        totalKg: (Number(existingFeedingLine.totalGram ?? 0) / 1000).toLocaleString(undefined, { maximumFractionDigits: 3 }),
                      })}
                    </p>
                    {existingFeedingLine.stockCode || existingFeedingLine.stockName ? (
                      <p className="text-xs font-medium text-cyan-700 dark:text-cyan-200">
                        {formatCodeAndKeyLabel(existingFeedingLine.stockCode, existingFeedingLine.stockId, existingFeedingLine.stockName)}
                      </p>
                    ) : null}
                    {existingFeedingLine.cageCode ? (
                      <p className="text-xs font-medium text-cyan-700 dark:text-cyan-200">
                        {t('aqua.quickDailyEntry.feeding.existingCages', { cages: existingFeedingLine.cageCode })}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
            
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
