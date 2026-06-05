export type OpeningImportTargetField =
  | 'projectCode'
  | 'projectName'
  | 'startDate'
  | 'note'
  | 'cageCode'
  | 'cageName'
  | 'assignedDate'
  | 'batchCode'
  | 'fishStockCode'
  | 'fishCount'
  | 'averageGram'
  | 'warehouseCode'
  | 'targetWarehouseCode'
  | 'asOfDate'
  | 'receiptNo'
  | 'receiptDate'
  | 'deadCount'
  | 'mortalityDate'
  | 'feedStockCode'
  | 'feedingDate'
  | 'feedingSlot'
  | 'feedGram'
  | 'shipmentDate'
  | 'currencyCode'
  | 'exchangeRate'
  | 'unitPrice';

export interface OpeningImportTargetDefinition {
  field: OpeningImportTargetField;
  label: string;
  required?: boolean;
}

export interface OpeningImportSheetDefinition {
  sheetName: 'Projects' | 'Cages' | 'OpeningStock' | 'OpeningGoodsReceipts' | 'OpeningMortality' | 'OpeningFeedings' | 'OpeningShipments';
  titleKey: string;
  targets: OpeningImportTargetDefinition[];
}

export interface ParsedImportSheet {
  sheetName: string;
  headers: string[];
  rows: Record<string, string | null>[];
  mappings: Record<string, OpeningImportTargetField | ''>;
}

export interface OpeningImportFieldMappingDto {
  sourceColumn: string;
  targetField: string;
}

export interface OpeningImportSheetPayloadDto {
  sheetName: string;
  rows: Record<string, string | null>[];
  mappings: OpeningImportFieldMappingDto[];
}

export interface OpeningImportPreviewRequestDto {
  fileName?: string;
  sourceSystem?: string;
  sheets: OpeningImportSheetPayloadDto[];
}

export interface OpeningImportSummaryDto {
  totalRows: number;
  validRows: number;
  warningRows: number;
  errorRows: number;
}

export interface OpeningImportRowResultDto {
  rowId: number;
  sheetName: string;
  rowNumber: number;
  status: string;
  messages: string[];
  rawData: Record<string, string | null>;
  normalizedData: Record<string, string | null>;
}

export interface OpeningImportPreviewResponseDto {
  jobId: number;
  status: string;
  summary: OpeningImportSummaryDto;
  rows: OpeningImportRowResultDto[];
}

export interface OpeningImportCommitResultDto {
  jobId: number;
  createdProjects: number;
  createdCages: number;
  createdCageWarehouseMappings: number;
  createdProjectCages: number;
  createdFishBatches: number;
  createdGoodsReceipts: number;
  createdFeedingHeaders: number;
  createdMortalityHeaders: number;
  createdGoodsReceiptLines: number;
  createdFeedingLines: number;
  createdFeedingDistributions: number;
  createdMortalityLines: number;
  createdShipmentHeaders: number;
  createdShipmentLines: number;
  appliedCageRows: number;
  appliedWarehouseRows: number;
  skippedRows: number;
}

export interface OpeningImportCleanupSoftDeletedResultDto {
  jobId: number;
  deletedProjects: number;
  deletedCages: number;
  deletedProjectCodes: string[];
  deletedCageCodes: string[];
}

export interface OpeningImportResetExistingDataResultDto {
  jobId: number;
  deletedProjects: number;
  deletedCages: number;
  deletedProjectCages: number;
  deletedFishBatches: number;
  deletedGoodsReceipts: number;
  deletedFeedings: number;
  deletedMortalities: number;
  deletedShipments: number;
  deletedOperationalRecords: number;
  deletedProjectCodes: string[];
  deletedCageCodes: string[];
}
