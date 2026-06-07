import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { DevirFcrProjectOption, DevirFcrReport } from '@/features/devir-fcr-report/types';

function ensureSuccess<T>(response: ApiResponse<T>, fallbackKey: string): T {
  if (!response.success || response.data == null) {
    throw new Error(fallbackKey);
  }
  return response.data;
}

export const devirFcrApi = {
  getProjects: async (): Promise<DevirFcrProjectOption[]> => {
    const response = await api.get<ApiResponse<DevirFcrProjectOption[]>>('/api/kpi-report/projects');
    return ensureSuccess(response, 'aqua.devirFcrReport.loadFailed');
  },

  getReport: async (projectIds: number[]): Promise<DevirFcrReport> => {
    const response = await api.post<ApiResponse<DevirFcrReport>>('/api/kpi-report/devir-fcr', {
      projectIds,
    });
    return ensureSuccess(response, 'aqua.devirFcrReport.loadFailed');
  },
};
