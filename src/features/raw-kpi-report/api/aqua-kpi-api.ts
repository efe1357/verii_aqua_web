import { api } from '@/lib/axios';
import i18n from '@/lib/i18n';
import type { ApiResponse } from '@/types/api';
import type { ProjectDto } from '@/features/project-detail-report/types/project-detail-report-types';

export interface KpiMetricDefinition {
  key: string;
  labelKey: string;
  descriptionKey: string;
  formulaKey: string;
}

export interface RawKpiRow {
  projectCageId: number;
  cageLabel: string;
  daysInSea: number;
  stockedFish: number;
  liveFish: number;
  deadFish: number;
  initialAverageGram: number;
  currentAverageGram: number;
  currentBiomassKg: number;
  totalFeedKg: number;
  biomassGainKg: number;
  survivalPct: number | null;
  mortalityPct: number | null;
  adgGramPerDay: number | null;
  sgrPctPerDay: number | null;
  fcr: number | null;
  densityPct: number | null;
  forecastBiomassKg30d: number;
}

export interface RawKpiReport {
  projectId: number;
  projectCode: string;
  projectName: string;
  daysInSea: number;
  stockedFish: number;
  liveFish: number;
  warehouseFish: number;
  totalSystemFish: number;
  deadFish: number;
  initialAverageGram: number;
  currentAverageGram: number;
  currentBiomassKg: number;
  warehouseBiomassKg: number;
  totalSystemBiomassKg: number;
  totalFeedKg: number;
  biomassGainKg: number;
  survivalPct: number | null;
  mortalityPct: number | null;
  adgGramPerDay: number | null;
  sgrPctPerDay: number | null;
  fcr: number | null;
  densityPct: number | null;
  forecastBiomassKg30d: number;
  rows: RawKpiRow[];
  metricDefinitions: KpiMetricDefinition[];
}

export interface BusinessKpiRow {
  projectCageId: number;
  cageLabel: string;
  targetWeightProgressPct: number;
  daysToTarget: number | null;
  estimatedHarvestDate: string | null;
  forecastConfidencePct: number;
  harvestReadinessPct: number;
  estimatedFeedCost: number;
  feedCostPerCurrentKg: number | null;
  projectedHarvestBiomassKg: number;
  projectedRevenue: number;
  projectedGrossMargin: number;
  projectedMarginPct: number | null;
}

export interface BusinessKpiReport {
  projectId: number;
  projectCode: string;
  projectName: string;
  estimatedFeedCost: number;
  feedCostPerCurrentKg: number | null;
  projectedHarvestBiomassKg: number;
  projectedRevenue: number;
  projectedGrossMargin: number;
  projectedMarginPct: number | null;
  targetWeightProgressPct: number;
  daysToTarget: number | null;
  estimatedHarvestDate: string | null;
  forecastConfidencePct: number;
  harvestReadinessPct: number;
  assumptions: {
    forecastDays: number;
    targetHarvestGram: number;
    feedCostPerKg: number;
    salePricePerKg: number;
  };
  rows: BusinessKpiRow[];
  metricDefinitions: KpiMetricDefinition[];
}

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
