import { api } from '@/lib/axios';
import type { ApiResponse, PagedResponse } from '@/types/api';
import type { BranchErp, CariDto, ErpProduct, ErpWarehouse } from '@/services/erp-types';

export type NetsisMirrorKind = 'customers' | 'stocks' | 'warehouses' | 'branches';

export type NetsisMirrorRow = CariDto | ErpProduct | ErpWarehouse | BranchErp;

export interface NetsisMirrorPagedParams {
  kind: NetsisMirrorKind;
  pageNumber: number;
  pageSize: number;
  search?: string;
}

const ENDPOINT_BY_KIND: Record<NetsisMirrorKind, string> = {
  customers: '/api/NetsisRead/getAllCustomers/paged',
  stocks: '/api/NetsisRead/getAllProducts/paged',
  warehouses: '/api/NetsisRead/getAllWarehouses/paged',
  branches: '/api/NetsisRead/getBranches/paged',
};

function normalizePaged<T>(response: ApiResponse<PagedResponse<T> & { items?: T[]; Items?: T[] }>): PagedResponse<T> {
  if (!response.success || !response.data) {
    throw new Error(response.message || response.exceptionMessage || 'Mirror verisi yuklenemedi');
  }

  const raw = response.data;
  const data = raw.data ?? raw.items ?? raw.Items ?? [];
  const totalCount = raw.totalCount ?? (raw as unknown as { TotalCount?: number }).TotalCount ?? data.length;
  const pageNumber = raw.pageNumber ?? (raw as unknown as { PageNumber?: number }).PageNumber ?? 1;
  const pageSize = raw.pageSize ?? (raw as unknown as { PageSize?: number }).PageSize ?? data.length;
  const totalPages = raw.totalPages ?? (raw as unknown as { TotalPages?: number }).TotalPages ?? Math.max(1, Math.ceil(totalCount / Math.max(pageSize, 1)));

  return {
    data,
    totalCount,
    pageNumber,
    pageSize,
    totalPages,
    hasPreviousPage: raw.hasPreviousPage ?? pageNumber > 1,
    hasNextPage: raw.hasNextPage ?? pageNumber < totalPages,
  };
}

export const netsisMirrorApi = {
  async getPaged<T extends NetsisMirrorRow>(params: NetsisMirrorPagedParams): Promise<PagedResponse<T>> {
    const query = new URLSearchParams({
      pageNumber: String(params.pageNumber),
      pageSize: String(params.pageSize),
    });

    if (params.search?.trim()) {
      query.set('search', params.search.trim());
    }

    const response = await api.get<ApiResponse<PagedResponse<T> & { items?: T[]; Items?: T[] }>>(
      `${ENDPOINT_BY_KIND[params.kind]}?${query.toString()}`,
    );

    return normalizePaged(response);
  },
};
