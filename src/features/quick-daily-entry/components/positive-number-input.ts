import type { ChangeEvent } from 'react';

type PositiveNumberInputField = {
  name: string;
  value: unknown;
  onBlur: () => void;
  onChange: (value: number | '') => void;
  ref: (instance: HTMLInputElement | null) => void;
};

function normalizeNumericText(value: string, allowDecimal: boolean): string {
  const decimalNormalized = value.replace(',', '.');
  const unsigned = decimalNormalized.replace(/-/g, '');
  const filtered = unsigned.replace(allowDecimal ? /[^0-9.]/g : /[^0-9]/g, '');
  if (!allowDecimal) return filtered.replace(/^0+(?=\d)/, '');

  const [integerPartRaw, ...decimalParts] = filtered.split('.');
  const integerPart = integerPartRaw.replace(/^0+(?=\d)/, '');
  const decimalPart = decimalParts.join('');
  return decimalParts.length > 0 ? `${integerPart || '0'}.${decimalPart}` : integerPart;
}

export function getPositiveNumberInputProps(
  field: PositiveNumberInputField,
  options: { allowDecimal?: boolean; min?: number; step?: string } = {}
) {
  const allowDecimal = options.allowDecimal ?? false;
  const min = options.min ?? 1;

  return {
    name: field.name,
    ref: field.ref,
    value: Number(field.value) > 0 ? String(field.value) : '',
    inputMode: allowDecimal ? 'decimal' as const : 'numeric' as const,
    min,
    step: options.step ?? (allowDecimal ? '0.001' : '1'),
    onBlur: field.onBlur,
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      const normalized = normalizeNumericText(event.target.value, allowDecimal);
      if (!normalized) {
        field.onChange('');
        return;
      }

      const numeric = Number(normalized);
      field.onChange(Number.isFinite(numeric) && numeric >= min ? numeric : '');
    },
  };
}
