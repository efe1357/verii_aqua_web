import type { AquaCrudConfig } from '@/features/aqua-core/types/aqua-crud';

export const batchMovementsConfig: AquaCrudConfig = {
  key: 'batchMovements',
  title: 'aqua.pages.batchMovements.title',
  description: 'aqua.pages.batchMovements.description',
  endpoint: 'BatchMovement',
  readOnly: true,
  listStaleTimeMs: 30000,
  fields: [],
  columns: [
    { key: 'projectCode', label: 'aqua.fields.projectCode' },
    { key: 'projectName', label: 'aqua.fields.projectName' },
    { key: 'batchCode', label: 'aqua.fields.batchCode' },
    { key: 'fishStockName', label: 'aqua.fields.fishStockName' },
    { key: 'projectCageCode', label: 'aqua.fields.currentCageCode' },
    { key: 'fromProjectCageCode', label: 'aqua.fields.fromCageCode' },
    { key: 'toProjectCageCode', label: 'aqua.fields.toCageCode' },
    { key: 'fromStockName', label: 'aqua.fields.fromStockName' },
    { key: 'toStockName', label: 'aqua.fields.toStockName' },
    { key: 'movementTypeName', label: 'aqua.fields.movementTypeName' },
    { key: 'referenceDocumentNo', label: 'aqua.fields.referenceDocumentNo' },
    { key: 'fromAverageGram', label: 'aqua.fields.fromAverageGram' },
    { key: 'toAverageGram', label: 'aqua.fields.toAverageGram' },
    { key: 'signedCount', label: 'aqua.fields.signedCount' },
    { key: 'signedBiomassGram', label: 'aqua.fields.signedBiomassGram' },
    { key: 'movementDate', label: 'aqua.fields.movementDate' },
  ],
};
