import { type ComponentProps, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  getLocalizedDatePlaceholder,
  parseDateOnlyToLocalDate,
  toIsoDateOnly,
} from '@/lib/date-localization';

interface LocalizedDateInputProps extends Omit<ComponentProps<typeof Input>, 'type' | 'value' | 'onChange'> {
  value?: string | null;
  onChange: (value: string) => void;
  showCalendarButton?: boolean;
  calendarButtonAriaLabel?: string;
  calendarButtonClassName?: string;
}

interface LocalizedDateTimeInputProps extends Omit<ComponentProps<typeof Input>, 'type' | 'value' | 'onChange'> {
  value?: string | null;
  onChange: (value: string) => void;
  calendarButtonAriaLabel?: string;
  calendarButtonClassName?: string;
}

export function LocalizedDateInput({
  value,
  onChange,
  onBlur,
  placeholder,
  className,
  disabled,
  showCalendarButton = true,
  calendarButtonAriaLabel,
  calendarButtonClassName,
  ...props
}: LocalizedDateInputProps): ReactElement {
  const { i18n } = useTranslation();
  const nativeDate = parseDateOnlyToLocalDate(value);
  const nativeDateValue = nativeDate ? toIsoDateOnly(nativeDate) : '';
  const input = (
    <Input
      {...props}
      type="date"
      value={nativeDateValue}
      placeholder={placeholder ?? getLocalizedDatePlaceholder(i18n.language)}
      disabled={disabled}
      className={cn(showCalendarButton && 'pr-12', className)}
      aria-label={props['aria-label'] ?? calendarButtonAriaLabel ?? placeholder ?? getLocalizedDatePlaceholder(i18n.language)}
      onBlur={onBlur}
      onChange={(event) => onChange(event.target.value)}
    />
  );

  if (!showCalendarButton) {
    return input;
  }

  return (
    <div className="relative">
      {input}
      <span
        className={cn(
          'pointer-events-none absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-cyan-600 dark:text-cyan-200',
          disabled && 'pointer-events-none opacity-50',
          calendarButtonClassName,
        )}
      >
        <CalendarDays size={16} aria-hidden="true" />
      </span>
    </div>
  );
}

function normalizeDateTimeLocalValue(value: string | null | undefined): string {
  if (!value) return '';
  const normalized = String(value).replace(' ', 'T');
  return normalized.length >= 16 ? normalized.slice(0, 16) : normalized;
}

export function LocalizedDateTimeInput({
  value,
  onChange,
  className,
  disabled,
  placeholder,
  calendarButtonAriaLabel,
  calendarButtonClassName,
  ...props
}: LocalizedDateTimeInputProps): ReactElement {
  const nativeValue = normalizeDateTimeLocalValue(value);

  return (
    <div className="relative">
      <Input
        {...props}
        type="datetime-local"
        value={nativeValue}
        placeholder={placeholder}
        disabled={disabled}
        className={cn('pr-12', className)}
        onChange={(event) => onChange(event.target.value)}
      />
      <span
        className={cn(
          'pointer-events-none absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-cyan-600 dark:text-cyan-200',
          disabled && 'opacity-50',
          calendarButtonClassName,
        )}
      >
        <CalendarDays size={16} aria-hidden="true" />
        <span className="sr-only">{calendarButtonAriaLabel ?? placeholder}</span>
      </span>
    </div>
  );
}
