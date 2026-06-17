import { api } from '@/lib/axios';
import { appendPagedQueryParams } from '@/utils/query-params';
import type { ApiResponse, PagedParams, PagedResponse } from '@/types/api';
import type { UserAuthorityDto } from '../types/user-types';

function toPagedData<T>(raw: { items?: T[]; data?: T[] } & PagedResponse<T>): PagedResponse<T> {
  const list = raw.items ?? raw.data ?? [];
  return { ...raw, data: list };
}

export const userAuthorityApi = {
  getList: async (params: PagedParams): Promise<PagedResponse<UserAuthorityDto>> => {
    const queryParams = new URLSearchParams();
    appendPagedQueryParams(queryParams, params);
    const response = await api.get<ApiResponse<PagedResponse<UserAuthorityDto>>>(
      `/api/UserAuthority?${queryParams.toString()}`
    );
    if (response.success && response.data) {
      return toPagedData(response.data as { items?: UserAuthorityDto[] } & PagedResponse<UserAuthorityDto>);
    }
    throw new Error(response.message ?? 'Role list could not be loaded');
  },
};
