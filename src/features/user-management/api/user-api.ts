import { api } from '@/lib/axios';
import i18n from '@/lib/i18n';
import type { ApiResponse, PagedResponse, PagedParams } from '@/types/api';
import type { UserDto, CreateUserDto, UpdateUserDto } from '../types/user-types';

export const userApi = {
  getList: async (params: PagedParams): Promise<PagedResponse<UserDto>> => {
    const response = await api.post<ApiResponse<PagedResponse<UserDto>>>(
      '/api/User/query',
      {
        pageNumber: params.pageNumber ?? 1,
        pageSize: params.pageSize ?? 10,
        sortBy: params.sortBy ?? 'Id',
        sortDirection: params.sortDirection ?? 'asc',
        filterLogic: params.filterLogic ?? 'and',
        filters: params.filters ?? [],
      }
    );
    
    if (response.success && response.data) {
      const pagedData = response.data;
      
      const rawData = pagedData as unknown as { items?: UserDto[], data?: UserDto[] };
      if (rawData.items && !rawData.data) {
        return {
          ...pagedData,
          data: rawData.items,
        };
      }
      
      return pagedData;
    }
    throw new Error(response.message || i18n.t('api.listLoadFailed', { ns: 'user-management' }));
  },

  getById: async (id: number): Promise<UserDto> => {
    const response = await api.get<ApiResponse<UserDto>>(`/api/User/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || i18n.t('api.detailLoadFailed', { ns: 'user-management' }));
  },

  create: async (data: CreateUserDto): Promise<UserDto> => {
    const payload = {
      ...data,
      managerUserId: data.managerUserId ?? null,
      permissionGroupIds: data.permissionGroupIds ?? [],
    };
    const response = await api.post<ApiResponse<UserDto>>('/api/User', payload);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || i18n.t('api.createFailed', { ns: 'user-management' }));
  },

  update: async (id: number, data: UpdateUserDto): Promise<UserDto> => {
    const response = await api.put<ApiResponse<UserDto>>(`/api/User/${id}`, {
      ...data,
      managerUserId: data.managerUserId ?? null,
    });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || i18n.t('api.updateFailed', { ns: 'user-management' }));
  },

  delete: async (id: number): Promise<void> => {
    const response = await api.delete<ApiResponse<object>>(`/api/User/${id}`);
    if (!response.success) {
      throw new Error(response.message || i18n.t('api.deleteFailed', { ns: 'user-management' }));
    }
  },
};
