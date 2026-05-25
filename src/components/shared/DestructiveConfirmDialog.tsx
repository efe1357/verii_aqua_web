import { type ReactElement } from 'react';
import { AlertTriangle, Loader2, ShieldAlert, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

type DestructiveConfirmTone = 'delete' | 'warning' | 'critical';

interface DestructiveConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  pendingLabel?: string;
  isPending?: boolean;
  onConfirm: () => void | Promise<void>;
  contextLabel?: string;
  tone?: DestructiveConfirmTone;
}

const TONES = {
  delete: {
    Icon: Trash2,
    accent: 'from-rose-500 via-red-500 to-orange-400',
    icon: 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400',
    action: 'bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-500 shadow-rose-500/20',
  },
  warning: {
    Icon: AlertTriangle,
    accent: 'from-amber-400 via-orange-500 to-rose-500',
    icon: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-400',
    action: 'bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500 shadow-amber-500/20',
  },
  critical: {
    Icon: ShieldAlert,
    accent: 'from-rose-600 via-red-600 to-orange-500',
    icon: 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400',
    action: 'bg-red-700 hover:bg-red-800 focus-visible:ring-red-500 shadow-red-600/30',
  },
} satisfies Record<DestructiveConfirmTone, {
  Icon: typeof Trash2;
  accent: string;
  icon: string;
  action: string;
}>;

export function DestructiveConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Hayır',
  pendingLabel = 'İşleniyor...',
  isPending = false,
  onConfirm,
  contextLabel,
  tone = 'delete',
}: DestructiveConfirmDialogProps): ReactElement {
  const toneStyle = TONES[tone];
  const Icon = toneStyle.Icon;

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) onOpenChange(nextOpen);
      }}
    >
      <AlertDialogContent className="w-[calc(100vw-1rem)] max-w-md gap-0 overflow-hidden rounded-[28px] border-slate-200/90 bg-white p-0 text-slate-900 shadow-2xl dark:border-cyan-800/30 dark:bg-blue-950 dark:text-white">
        <div className={cn('h-1.5 w-full bg-linear-to-r', toneStyle.accent)} />
        <div className="p-5 sm:p-7">
          <AlertDialogHeader className="space-y-4 text-left">
            <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl border', toneStyle.icon)}>
              <Icon className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <AlertDialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
                {description}
              </AlertDialogDescription>
            </div>
            {contextLabel ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600 dark:border-cyan-800/30 dark:bg-blue-900/25 dark:text-slate-300">
                {contextLabel}
              </div>
            ) : null}
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-7 dark:border-cyan-800/20 dark:bg-blue-950/60">
          <AlertDialogCancel
            disabled={isPending}
            className="h-11 rounded-xl border-slate-200 bg-white px-6 font-bold text-slate-700 hover:bg-slate-100 dark:border-cyan-800/40 dark:bg-transparent dark:text-slate-200 dark:hover:bg-blue-900/40"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              void onConfirm();
            }}
            className={cn('h-11 rounded-xl border-0 px-6 font-bold text-white shadow-lg transition-colors', toneStyle.action)}
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isPending ? pendingLabel : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
