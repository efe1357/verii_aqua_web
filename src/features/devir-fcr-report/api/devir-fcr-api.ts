import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';

export interface DevirFcrProjectOption {
  id: number;
  projectCode?: string;
  projectName?: string;
  startDate?: string;
}

export interface DevirFcrRow {
  projectId: number;
  projectCode: string;
  projectName: string;
  openingFishCount: number;
  shipmentFishCount: number;
  mortalityFishCount: number;
  mortalityPct: number | null;
  endingFishCount: number;
  endingAverageGram: number;
  openingBiomassKg: number;
  endingBiomassKg: number;
  shippedBiomassKg: number;
  mortalityBiomassKg: number;
  totalFeedKg: number;
  producedBiomassKg: number;
  fcr: number | null;
}

export interface DevirFcrReport {
  fromDate: string;
  toDate: string;
  rows: DevirFcrRow[];
  totals: Omit<DevirFcrRow, 'projectId' | 'projectCode' | 'projectName'> & {
    projectCode: string;
    projectName: string;
  };
}

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
