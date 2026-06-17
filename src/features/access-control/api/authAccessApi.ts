import { api } from '@/lib/axios';
import { extractData } from '../utils/extract-api-data';
import type { ApiResponse } from '../types/access-control.types';
import type { MyPermissionsDto } from '../types/access-control.types';

export const authAccessApi = {
  getMyPermissions: async (): Promise<MyPermissionsDto> => {
    const response = await api.get<ApiResponse<MyPermissionsDto>>('/api/auth/me/permissions', {
      timeout: 12000,
    });
    return extractData(response as ApiResponse<MyPermissionsDto>);
  },
};
