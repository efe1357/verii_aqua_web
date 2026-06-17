import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import i18n from '@/lib/i18n';
import { appendPagedQueryParams } from '@/utils/query-params';
import type { ApiResponse, PagedParams, PagedResponse } from '@/types/api';

export interface AssignableUserDto {
  id: number;
  username: string;
  email: string;
  fullName: string;
}

const getUserList = async (params: PagedParams): Promise<PagedResponse<AssignableUserDto>> => {
  const queryParams = new URLSearchParams();
  appendPagedQueryParams(queryParams, params);

  const response = await api.get<ApiResponse<PagedResponse<AssignableUserDto>>>(`/api/User?${queryParams.toString()}`);
  if (response.success && response.data) {
    const pagedData = response.data;
    const rawData = pagedData as unknown as { items?: AssignableUserDto[]; data?: AssignableUserDto[] };
    if (rawData.items && !rawData.data) {
      return {
        ...pagedData,
        data: rawData.items,
      };
    }
    return pagedData;
  }
  throw new Error(response.message || i18n.t('assignments.userListLoadFailed', { ns: 'access-control' }));
};

export const useUserListForAssignments = (params: PagedParams) =>
  useQuery({
    queryKey: ['access-control.user-list', params],
    queryFn: () => getUserList(params),
    staleTime: 30000,
  });
