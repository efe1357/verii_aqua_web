import type { AquaCrudConfig } from '@/features/aqua-core/types/aqua-crud';

export const netOperationTypesConfig: AquaCrudConfig = {
  key: 'netOperationTypes',
  title: 'aqua.pages.netOperationTypes.title',
  description: 'aqua.pages.netOperationTypes.description',
  endpoint: 'NetOperationType',
  listStaleTimeMs: 120000,
  fields: [
    { key: 'code', label: 'aqua.fields.code', type: 'text', required: true },
    { key: 'name', label: 'aqua.fields.name', type: 'text', required: true },
  ],
  columns: [
    { key: 'code', label: 'aqua.fields.code' },
    { key: 'name', label: 'aqua.fields.name' },
  ],
};

export const netOperationsConfig: AquaCrudConfig = {
  key: 'netOperations',
  title: 'aqua.pages.netOperations.title',
  description: 'aqua.pages.netOperations.description',
  endpoint: 'NetOperation',
  postingSlug: 'net-operation',
  autoPostOnSave: true,
  listStaleTimeMs: 15000,
  fields: [
    {
      key: 'projectId',
      label: 'aqua.fields.projectId',
      type: 'select',
      required: true,
      lookup: {
        endpoint: 'Project',
        labelKeys: ['projectCode', 'projectName'],
        labelSeparator: ' - ',
        valueKey: 'id',
        staleTimeMs: 60000,
      },
    },
    {
      key: 'operationTypeId',
      label: 'aqua.fields.operationTypeId',
      type: 'select',
      required: true,
      lookup: {
        endpoint: 'NetOperationType',
        labelKey: 'name',
        valueKey: 'id',
        staleTimeMs: 120000,
      },
    },
    { key: 'operationNo', label: 'aqua.fields.operationNo', type: 'text', required: true },
    { key: 'operationDate', label: 'aqua.fields.operationDate', type: 'date', required: true },
    { key: 'note', label: 'aqua.fields.note', type: 'textarea' },
  ],
  columns: [
    { key: 'operationNo', label: 'aqua.fields.operationNo' },
    { key: 'operationDate', label: 'aqua.fields.operationDate' },
    { key: 'operationTypeName', label: 'aqua.fields.operationTypeId' },
  ],
  defaultValues: { status: 0 },
};

export const netOperationLinesConfig: AquaCrudConfig = {
  key: 'netOperationLines',
  title: 'aqua.pages.netOperationLines.title',
  description: 'aqua.pages.netOperationLines.description',
  endpoint: 'NetOperationLine',
  listStaleTimeMs: 10000,
  fields: [
    {
      key: 'netOperationId',
      label: 'aqua.fields.netOperationId',
      type: 'select',
      required: true,
      lookup: {
        endpoint: 'NetOperation',
        labelKeys: ['operationNo'],
        valueKey: 'id',
        staleTimeMs: 30000,
      },
    },
    {
      key: 'projectCageId',
      label: 'aqua.fields.projectCageId',
      type: 'select',
      required: true,
      lookup: {
        endpoint: 'ProjectCage',
        labelKeys: ['projectCode', 'cageCode'],
        labelSeparator: ' - ',
        valueKey: 'id',
        staleTimeMs: 30000,
        contextFilters: [{ sourceKey: 'projectId', column: 'ProjectId' }],
      },
    },
    {
      key: 'fishBatchId',
      label: 'aqua.fields.fishBatchId',
      type: 'select',
      lookup: {
        endpoint: 'FishBatch',
        labelKeys: ['batchCode'],
        valueKey: 'id',
        staleTimeMs: 30000,
        contextFilters: [{ sourceKey: 'projectId', column: 'ProjectId' }],
      },
    },
    { key: 'note', label: 'aqua.fields.note', type: 'textarea' },
  ],
  columns: [
    { key: 'batchCode', label: 'aqua.fields.batchCode' },
    { key: 'projectCode', label: 'aqua.fields.projectCode' },
    { key: 'cageCode', label: 'aqua.fields.cageCode' },
    { key: 'cageName', label: 'aqua.fields.cageName' },
    { key: 'note', label: 'aqua.fields.note' },
  ],
};
