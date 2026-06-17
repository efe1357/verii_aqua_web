import { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
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
import { aquaQuickDailyApi } from '../api/aqua-quick-api';
import { mortalityQuickFormSchema, type MortalityQuickFormSchema } from '../schema/quick-daily-entry-schema';
import { ChevronRight, Info, Save, TrendingDown } from 'lucide-react';
import { getPositiveNumberInputProps } from './positive-number-input';

interface MortalityQuickFormProps {
  projectId: number | null;
  projectCageId: number | null;
  mortalityDate: string;
  onSubmit: (data: MortalityQuickFormSchema) => Promise<void>;
  isSubmitting: boolean;
  canSubmit: boolean;
}

export function MortalityQuickForm({
  projectId,
  projectCageId,
  mortalityDate,
  onSubmit,
  isSubmitting,
  canSubmit,
}: MortalityQuickFormProps): ReactElement {
  const { t } = useTranslation('common');
  const form = useForm<MortalityQuickFormSchema>({
    resolver: zodResolver(mortalityQuickFormSchema) as Resolver<MortalityQuickFormSchema>,
    mode: 'onChange',
    defaultValues: { deadCount: 0 },
  });

  const handleSubmit: SubmitHandler<MortalityQuickFormSchema> = async (data) => {
    await onSubmit(data);
    form.reset({ deadCount: 0 });
  };

  const disabled = projectId == null || projectCageId == null;
  const mortalityStatusQuery = useQuery({
    queryKey: ['aqua', 'quick-daily-entry', 'mortality-status', projectId, mortalityDate],
    queryFn: () => aquaQuickDailyApi.findMortalityHeaderByProjectAndDate(projectId!, mortalityDate),
    enabled: projectId != null && Boolean(mortalityDate),
    staleTime: 5000,
  });
  const mortalityStatus = mortalityStatusQuery.data;
  const isErpIntegrated = mortalityStatus?.isERPIntegrated === true;

  // AQUA KONSEPT STİLLERİ
  const labelStyle = "text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5";
  const inputStyle = "bg-slate-50 dark:bg-blue-950/40 border-slate-200 dark:border-cyan-800/30 text-slate-900 dark:text-white focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 h-12 rounded-xl transition-all duration-300 font-medium text-sm";

  return (
    <Card className="bg-white dark:bg-blue-950/60 backdrop-blur-xl border border-slate-200 dark:border-cyan-800/30 shadow-sm rounded-2xl overflow-hidden transition-all duration-300 relative">
      {/* Kart içine hafif bir Aqua / Rose (fire vurgusu için) parıltı */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />
      
      <CardHeader className="border-b border-slate-200 dark:border-cyan-800/30 px-6 py-5 bg-slate-50/50 dark:bg-blue-900/10 relative z-10">
        <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 shadow-sm">
            <TrendingDown className="size-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          {/* ÇEVİRİ HATASI BURADA DEFAULT VALUE İLE ÇÖZÜLDÜ */}
          {t('aqua.quickDailyEntry.mortality.title')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 sm:p-8 relative z-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="space-y-8">
            <div
              className={`rounded-2xl border p-4 transition-colors duration-200 ${
                mortalityStatus
                  ? isErpIntegrated
                    ? 'border-red-400/60 bg-red-500/10 dark:border-red-400/40 dark:bg-red-950/30'
                    : 'border-emerald-400/50 bg-emerald-500/10 dark:border-emerald-400/35 dark:bg-emerald-950/20'
                  : 'border-cyan-800/30 bg-blue-950/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <Info size={18} className={`mt-0.5 shrink-0 ${isErpIntegrated ? 'text-red-400' : mortalityStatus ? 'text-emerald-400' : 'text-cyan-400'}`} />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('aqua.quickDailyEntry.mortality.summaryTitle')}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {mortalityStatusQuery.isFetching
                      ? t('common.loading')
                      : mortalityStatus
                        ? isErpIntegrated
                          ? t('aqua.quickDailyEntry.mortality.summaryErpIntegrated')
                          : t('aqua.quickDailyEntry.mortality.summaryRecorded')
                        : t('aqua.quickDailyEntry.mortality.summaryEmpty')}
                  </p>
                </div>
              </div>
            </div>
            <div className="max-w-md">
              <FormField
                control={form.control}
                name="deadCount"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel required className={labelStyle}>
                      <ChevronRight size={14} className="text-cyan-500" />
                      {/* ÇEVİRİ HATASI BURADA DEFAULT VALUE İLE ÇÖZÜLDÜ */}
                      {t('aqua.quickDailyEntry.mortality.deadCount')}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
	                        className={inputStyle} 
	                        placeholder={t('aqua.quickDailyEntry.mortality.exampleCount')}
	                        {...getPositiveNumberInputProps(field)}
	                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500 font-medium" />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-6 flex justify-end border-t border-slate-200 dark:border-cyan-800/20">
                <Button 
                  type="submit" 
                  disabled={disabled || isSubmitting || !form.formState.isValid || !canSubmit} 
                  className="bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-[0.98] text-white font-bold border-0 h-11 px-10 w-full sm:w-auto rounded-xl shadow-lg shadow-cyan-500/20 transition-all duration-200 flex items-center gap-2"
                >
                  <Save size={18} />
                  {/* ÇEVİRİ HATASI BURADA DEFAULT VALUE İLE ÇÖZÜLDÜ */}
                  {t('aqua.quickDailyEntry.mortality.save')}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
