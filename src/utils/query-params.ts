import type { PagedParams, PagedFilter } from '@/types/api';

type FilterInput = PagedFilter[] | Record<string, unknown> | undefined | null;

export const appendIndexedFilterParams = (
  queryParams: URLSearchParams,
  filters: FilterInput,
  filterLogic: 'and' | 'or' = 'and'
): URLSearchParams => {
  if (!filters) return queryParams;

  const normalizedFilters = Array.isArray(filters)
    ? filters.filter((filter) => filter.column && filter.value !== undefined && filter.value !== null && filter.value !== '')
    : Object.entries(filters).flatMap(([column, value]) => {
        if (value == null || value === '') return [];
        return [{ column, operator: 'eq', value: String(value) }];
      });

  normalizedFilters.forEach((filter, index) => {
    queryParams.append(`filters[${index}].column`, filter.column);
    queryParams.append(`filters[${index}].operator`, filter.operator || 'eq');
    queryParams.append(`filters[${index}].value`, String(filter.value));
  });

  if (normalizedFilters.length > 0) {
    queryParams.append('filterLogic', filterLogic);
  }

  return queryParams;
};

export const appendPagedQueryParams = (
  queryParams: URLSearchParams,
  params: PagedParams & { filters?: FilterInput; search?: string },
  options?: {
    pageParamName?: string;
    pageSizeParamName?: string;
  }
): URLSearchParams => {
  const pageParamName = options?.pageParamName ?? 'pageNumber';
  const pageSizeParamName = options?.pageSizeParamName ?? 'pageSize';

  if (params.pageNumber) queryParams.append(pageParamName, params.pageNumber.toString());
  if (params.pageSize) queryParams.append(pageSizeParamName, params.pageSize.toString());
  if (params.search?.trim()) queryParams.append('search', params.search.trim());
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
  appendIndexedFilterParams(queryParams, params.filters, params.filterLogic ?? 'and');

  return queryParams;
};

export const normalizeQueryParams = (
  params: Omit<PagedParams, 'filters'> & { filters?: PagedFilter[] | Record<string, unknown> }
): {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
  filtersKey?: string;
  filterLogic?: 'and' | 'or';
} => {
  return {
    pageNumber: params.pageNumber,
    pageSize: params.pageSize,
    sortBy: params.sortBy,
    sortDirection: params.sortDirection,
    ...(params.filters != null ? { filtersKey: JSON.stringify(params.filters) } : {}),
    filterLogic: params.filterLogic,
  };
};
