import { api } from '@/lib/axios';
import i18n from '@/lib/i18n';
import type { ApiResponse } from '@/types/api';
import type { ProjectDto } from '@/features/project-detail-report/types/project-detail-report-types';
import type { BusinessKpiReport, RawKpiReport } from '@/features/raw-kpi-report/types';

function ensureSuccess<T>(response: ApiResponse<T>, fallback: string): T {
  if (!response.success || response.data == null) {
    throw new Error(response.message || fallback);
  }
  return response.data;
}

export const aquaKpiApi = {
  getProjects: async (): Promise<ProjectDto[]> => {
    const response = await api.get<ApiResponse<ProjectDto[]>>('/api/kpi-report/projects');
    return ensureSuccess(response, i18n.t('errors.listLoadFailed', { ns: 'dashboard' }));
  },

  getRawKpiReport: async (projectId: number): Promise<RawKpiReport> => {
    const response = await api.get<ApiResponse<RawKpiReport>>(`/api/kpi-report/raw-kpi/${projectId}`);
    return ensureSuccess(response, i18n.t('errors.reportLoadFailed', { ns: 'dashboard' }));
  },

  getBusinessKpiReport: async (projectId: number): Promise<BusinessKpiReport> => {
    const response = await api.get<ApiResponse<BusinessKpiReport>>(`/api/kpi-report/business-kpi/${projectId}`);
    return ensureSuccess(response, i18n.t('errors.reportLoadFailed', { ns: 'dashboard' }));
  },
};
