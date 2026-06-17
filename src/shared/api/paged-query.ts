import type { PagedFilter } from '@/types/api';
import { appendIndexedFilterParams } from '@/utils/query-params';

type FilterInput = PagedFilter[] | Record<string, unknown> | undefined | null;

export function appendPagedFilters(
  queryParams: URLSearchParams,
  filters: FilterInput,
  filterLogic: 'and' | 'or' = 'and'
): void {
  appendIndexedFilterParams(queryParams, filters, filterLogic);
}
