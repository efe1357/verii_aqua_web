import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { ProjectDetailReport, ProjectDto } from '../types/project-detail-report-types';

function ensureSuccess<T>(response: ApiResponse<T>, fallback: string): T {
  if (!response.success || response.data == null) {
    throw new Error(response.message || fallback);
  }
  return response.data;
}

export const projectDetailReportApi = {
  getProjects: async (): Promise<ProjectDto[]> => {
    const response = await api.get<ApiResponse<ProjectDto[]>>('/api/kpi-report/projects');
    return ensureSuccess(response, 'Projects could not be loaded.');
  },

  getProjectDetailReports: async (projectIds: number[]): Promise<ProjectDetailReport[]> => {
    const uniqueProjectIds = Array.from(new Set(projectIds)).filter(Number.isFinite);
    return Promise.all(uniqueProjectIds.map((projectId) => projectDetailReportApi.getProjectDetailReport(projectId)));
  },

  getProjectDetailReport: async (projectId: number): Promise<ProjectDetailReport> => {
    const response = await api.get<ApiResponse<ProjectDetailReport>>(`/api/kpi-report/project-detail/${projectId}`);
    return ensureSuccess(response, 'Project detail report could not be loaded.');
  },
};
