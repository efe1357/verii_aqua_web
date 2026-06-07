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
