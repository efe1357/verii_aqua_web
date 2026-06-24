import { type ComponentProps, type FocusEvent, type ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays } from 'lucide-react';
import { arSA, de, enUS, es, fr, it, tr } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  formatDateOnlyForLocale,
  getLocalizedDatePlaceholder,
  parseLocalizedDateInput,
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

const DATE_PICKER_LOCALE_BY_LANGUAGE: Record<string, Locale> = {
  tr,
  en: enUS,
  de,
  es,
  fr,
  it,
  ar: arSA,
};

function resolveDatePickerLocale(language?: string): Locale {
  const shortCode = (language || 'tr').toLowerCase().split('-')[0];
  return DATE_PICKER_LOCALE_BY_LANGUAGE[shortCode] ?? tr;
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
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(() => formatDateOnlyForLocale(value, i18n.language));
  const nativeDate = parseDateOnlyToLocalDate(value);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatDateOnlyForLocale(value, i18n.language));
    }
  }, [i18n.language, value, isFocused]);

  const commitDisplayValue = (nextValue: string): void => {
    const parsed = parseLocalizedDateInput(nextValue, i18n.language);
    if (parsed !== null) {
      onChange(parsed);
      setDisplayValue(formatDateOnlyForLocale(parsed, i18n.language));
      return;
    }
    setDisplayValue(formatDateOnlyForLocale(value, i18n.language));
  };

  const handleFocus = (): void => {
    setIsFocused(true);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>): void => {
    setIsFocused(false);
    commitDisplayValue(displayValue);
    onBlur?.(event);
  };

  const input = (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      value={displayValue}
      placeholder={placeholder ?? getLocalizedDatePlaceholder(i18n.language)}
      disabled={disabled}
      className={cn(showCalendarButton && 'pr-12', className)}
      aria-label={props['aria-label'] ?? calendarButtonAriaLabel ?? placeholder ?? getLocalizedDatePlaceholder(i18n.language)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={(event) => {
        const raw = event.target.value.replace(/\D/g, '');
        let formatted = raw;
        if (raw.length >= 3 && raw.length <= 4) {
          formatted = `${raw.slice(0, 2)}.${raw.slice(2)}`;
        } else if (raw.length >= 5) {
          formatted = `${raw.slice(0, 2)}.${raw.slice(2, 4)}.${raw.slice(4, 8)}`;
        }
        setDisplayValue(formatted);
        const parsed = parseLocalizedDateInput(formatted, i18n.language);
        if (parsed !== null && parsed !== '') {
          onChange(parsed);
        }
      }}
    />
  );

  if (!showCalendarButton) {
    return input;
  }

  return (
    <div className="relative">
      {input}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-label={calendarButtonAriaLabel ?? placeholder ?? getLocalizedDatePlaceholder(i18n.language)}
            className={cn(
              'absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-cyan-600 transition-colors hover:bg-cyan-500/10 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30 dark:text-cyan-200 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-100',
              disabled && 'pointer-events-none opacity-50',
              calendarButtonClassName,
            )}
          >
            <CalendarDays size={16} aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto rounded-2xl border-cyan-500/20 bg-white p-2 shadow-2xl shadow-cyan-950/10 dark:bg-blue-950 dark:shadow-black/30">
          <Calendar
            mode="single"
            selected={nativeDate ?? undefined}
            locale={resolveDatePickerLocale(i18n.language)}
            onSelect={(selectedDate) => {
              if (!selectedDate) return;
              const isoDate = toIsoDateOnly(selectedDate);
              onChange(isoDate);
              setDisplayValue(formatDateOnlyForLocale(isoDate, i18n.language));
              setIsOpen(false);
            }}
            disabled={disabled}
            initialFocus
          />
        </PopoverContent>
      </Popover>
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