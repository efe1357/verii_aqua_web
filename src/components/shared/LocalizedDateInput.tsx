import { type ChangeEvent, type ComponentProps, type FocusEvent, type ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';
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

export function LocalizedDateInput({
  value,
  onChange,
  onBlur,
  placeholder,
  className,
  disabled,
  showCalendarButton = false,
  calendarButtonAriaLabel,
  calendarButtonClassName,
  ...props
}: LocalizedDateInputProps): ReactElement {
  const { i18n } = useTranslation();
  const [draftValue, setDraftValue] = useState(() => formatDateOnlyForLocale(value, i18n.language));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDraftValue(formatDateOnlyForLocale(value, i18n.language));
    }
  }, [i18n.language, isFocused, value]);

  const commitValue = (): void => {
    const parsed = parseLocalizedDateInput(draftValue, i18n.language);
    if (parsed === null) {
      setDraftValue(formatDateOnlyForLocale(value, i18n.language));
      return;
    }

    onChange(parsed);
    setDraftValue(formatDateOnlyForLocale(parsed, i18n.language));
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>): void => {
    setIsFocused(false);
    commitValue();
    onBlur?.(event);
  };

  const handleChange = (nextValue: string): void => {
    setDraftValue(nextValue);
    const parsed = parseLocalizedDateInput(nextValue, i18n.language);
    if (parsed !== null) {
      onChange(parsed);
    }
  };

  const handleNativeDateChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const nextValue = event.target.value;
    onChange(nextValue);
    setDraftValue(formatDateOnlyForLocale(nextValue, i18n.language));
  };

  const nativeDate = parseDateOnlyToLocalDate(value);
  const nativeDateValue = nativeDate ? toIsoDateOnly(nativeDate) : '';

  const input = (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      value={draftValue}
      placeholder={placeholder ?? getLocalizedDatePlaceholder(i18n.language)}
      disabled={disabled}
      className={cn(showCalendarButton && 'pr-12', className)}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      onChange={(event) => handleChange(event.target.value)}
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
          'absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-cyan-600 transition-colors hover:bg-cyan-100 hover:text-cyan-700 dark:text-cyan-200 dark:hover:bg-cyan-900/40',
          disabled && 'pointer-events-none opacity-50',
          calendarButtonClassName,
        )}
      >
        <CalendarDays size={16} aria-hidden="true" />
        <input
          type="date"
          value={nativeDateValue}
          disabled={disabled}
          aria-label={calendarButtonAriaLabel ?? placeholder ?? getLocalizedDatePlaceholder(i18n.language)}
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={handleNativeDateChange}
        />
      </span>
    </div>
  );
}
