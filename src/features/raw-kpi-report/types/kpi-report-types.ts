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
