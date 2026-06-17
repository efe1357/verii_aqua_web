import type { PagedFilter } from '@/types/api';

type FilterInput = PagedFilter[] | Record<string, unknown> | undefined | null;

function normalizeFilters(filters: FilterInput): PagedFilter[] {
  if (!filters) return [];
  if (Array.isArray(filters)) {
    return filters.filter((filter) => filter.column && filter.value !== '');
  }

  return Object.entries(filters).flatMap(([column, value]) => {
    if (value == null || value === '') return [];
    return [{ column, operator: 'eq', value: String(value) }];
  });
}

export function appendPagedFilters(
  queryParams: URLSearchParams,
  filters: FilterInput,
  filterLogic: 'and' | 'or' = 'and'
): void {
  const normalizedFilters = normalizeFilters(filters);
  normalizedFilters.forEach((filter, index) => {
    queryParams.append(`filters[${index}].column`, filter.column);
    queryParams.append(`filters[${index}].operator`, filter.operator || 'eq');
    queryParams.append(`filters[${index}].value`, filter.value);
  });

  if (normalizedFilters.length > 0) {
    queryParams.append('filterLogic', filterLogic);
  }
}
