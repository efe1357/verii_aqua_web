import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';

export interface DevirFcrProjectOption {
  id: number;
  projectCode?: string;
  projectName?: string;
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

function clampDate(value: string): string {
  return value.slice(0, 10);
}

function ensureSuccess<T>(response: ApiResponse<T>, fallback: string): T {
  if (!response.success || response.data == null) {
    throw new Error(response.message || fallback);
  }
  return response.data;
}

export const devirFcrApi = {
  getProjects: async (): Promise<DevirFcrProjectOption[]> => {
    const response = await api.get<ApiResponse<DevirFcrProjectOption[]>>('/api/kpi-report/projects');
    return ensureSuccess(response, 'Projects could not be loaded.');
  },

  getReport: async (projectIds: number[], fromDate: string, toDate: string): Promise<DevirFcrReport> => {
    const safeFromDate = clampDate(fromDate);
    const safeToDate = clampDate(toDate);
    const response = await api.post<ApiResponse<DevirFcrReport>>('/api/kpi-report/devir-fcr', {
      projectIds,
      fromDate: safeFromDate,
      toDate: safeToDate,
    });
    return ensureSuccess(response, 'Devir / FCR report could not be loaded.');
  },
};
