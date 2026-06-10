const APP_LOCALE_BY_LANGUAGE: Record<string, string> = {
  tr: 'tr-TR',
  en: 'en-US',
  de: 'de-DE',
  es: 'es-ES',
  fr: 'fr-FR',
  it: 'it-IT',
  ar: 'ar-SA',
};

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function resolveAppLocale(language?: string): string {
  const normalized = (language || 'tr').toLowerCase();
  const shortCode = normalized.split('-')[0];
  return APP_LOCALE_BY_LANGUAGE[shortCode] ?? language ?? 'tr-TR';
}

export function isDayFirstLocale(language?: string): boolean {
  const shortCode = (language || 'tr').toLowerCase().split('-')[0];
  return shortCode !== 'en';
}

export function parseDateOnlyToLocalDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  const trimmed = String(value).trim();
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function toIsoDateOnly(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function formatDateOnlyForLocale(value: string | Date | null | undefined, language?: string): string {
  const date = parseDateOnlyToLocalDate(value);
  if (!date) return value ? String(value) : '';

  return new Intl.DateTimeFormat(resolveAppLocale(language), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatDateTimeForLocale(value: string | Date | null | undefined, language?: string): string {
  const date = value instanceof Date ? value : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return value ? String(value) : '';

  return new Intl.DateTimeFormat(resolveAppLocale(language), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function parseLocalizedDateInput(value: string, language?: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return '';

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : toIsoDateOnly(parsed);
  }

  const localizedMatch = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/.exec(trimmed);
  if (!localizedMatch) return null;

  const [, first, second, year] = localizedMatch;
  const day = isDayFirstLocale(language) ? Number(first) : Number(second);
  const month = isDayFirstLocale(language) ? Number(second) : Number(first);
  const parsed = new Date(Number(year), month - 1, day);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== Number(year) ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return toIsoDateOnly(parsed);
}

export function getLocalizedDatePlaceholder(language?: string): string {
  return isDayFirstLocale(language) ? 'gg.aa.yyyy' : 'mm/dd/yyyy';
}
