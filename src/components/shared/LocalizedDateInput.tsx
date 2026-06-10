import { type ComponentProps, type FocusEvent, type ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import {
  formatDateOnlyForLocale,
  getLocalizedDatePlaceholder,
  parseLocalizedDateInput,
} from '@/lib/date-localization';

interface LocalizedDateInputProps extends Omit<ComponentProps<typeof Input>, 'type' | 'value' | 'onChange'> {
  value?: string | null;
  onChange: (value: string) => void;
}

export function LocalizedDateInput({
  value,
  onChange,
  onBlur,
  placeholder,
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

  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      value={draftValue}
      placeholder={placeholder ?? getLocalizedDatePlaceholder(i18n.language)}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      onChange={(event) => handleChange(event.target.value)}
    />
  );
}
