import type { AquaCrudConfig } from '@/features/aqua/shared/types/aqua-crud';

export const projectsConfig: AquaCrudConfig = {
  key: 'projects',
  title: 'aqua.pages.projects.title',
  description: 'aqua.pages.projects.description',
  endpoint: 'Project',
  listStaleTimeMs: 60000,
  fields: [
    { key: 'projectCode', label: 'aqua.fields.projectCode', type: 'text', required: true },
    { key: 'projectName', label: 'aqua.fields.projectName', type: 'text', required: true },
    { key: 'startDate', label: 'aqua.fields.startDate', type: 'date', required: true },
    { key: 'endDate', label: 'aqua.fields.endDate', type: 'date' },
    { key: 'note', label: 'aqua.fields.note', type: 'textarea' },
  ],
  columns: [
    { key: 'projectCode', label: 'aqua.fields.projectCode' },
    { key: 'projectName', label: 'aqua.fields.projectName' },
    { key: 'startDate', label: 'aqua.fields.startDate' },
  ],
  defaultValues: { status: 0 },
};

export const cagesConfig: AquaCrudConfig = {
  key: 'cages',
  title: 'aqua.pages.cages.title',
  description: 'aqua.pages.cages.description',
  endpoint: 'Cage',
  listStaleTimeMs: 60000,
  fields: [
    { key: 'cageCode', label: 'aqua.fields.cageCode', type: 'text', required: true },
    { key: 'cageName', label: 'aqua.fields.cageName', type: 'text', required: true },
    { key: 'capacityCount', label: 'aqua.fields.capacityCount', type: 'number' },
    { key: 'capacityGram', label: 'aqua.fields.capacityGram', type: 'number', unitTransform: 'gram-to-kg' },
  ],
  columns: [
    { key: 'cageCode', label: 'aqua.fields.cageCode' },
    { key: 'cageName', label: 'aqua.fields.cageName' },
    { key: 'capacityCount', label: 'aqua.fields.capacityCount' },
    { key: 'capacityGram', label: 'aqua.fields.capacityGram', unitTransform: 'gram-to-kg' },
  ],
};

export const cageWarehouseMappingsConfig: AquaCrudConfig = {
  key: 'cageWarehouseMappings',
  title: 'aqua.pages.cageWarehouseMappings.title',
  description: 'aqua.pages.cageWarehouseMappings.description',
  endpoint: 'CageWarehouseMapping',
  listStaleTimeMs: 60000,
  fields: [
    {
      key: 'cageId',
      label: 'aqua.fields.cageId',
      type: 'select',
      required: true,
      lookup: {
        endpoint: 'Cage',
        labelKeys: ['cageCode', 'cageName'],
        labelSeparator: ' - ',
        valueKey: 'id',
        staleTimeMs: 60000,
      },
    },
    {
      key: 'warehouseId',
      label: 'aqua.fields.netsisWarehouseId',
      type: 'select',
      required: true,
      lookup: {
        endpoint: 'Warehouse',
        labelKeys: ['erpWarehouseCode', 'warehouseName'],
        labelSeparator: ' - ',
        valueKey: 'id',
        staleTimeMs: 60000,
      },
    },
    {
      key: 'isActive',
      label: 'aqua.fields.isActive',
      type: 'select',
      required: true,
      options: [
        { label: 'aqua.common.active', value: 1 },
        { label: 'aqua.common.passive', value: 0 },
      ],
    },
    { key: 'note', label: 'aqua.fields.note', type: 'textarea' },
  ],
  columns: [
    { key: 'cageCode', label: 'aqua.fields.cageCode' },
    { key: 'cageName', label: 'aqua.fields.cageName' },
    { key: 'erpWarehouseCode', label: 'aqua.fields.erpWarehouseCode' },
    { key: 'warehouseName', label: 'aqua.fields.warehouseName' },
    { key: 'isActive', label: 'aqua.fields.isActive' },
    { key: 'note', label: 'aqua.fields.note' },
  ],
  defaultValues: { isActive: 1 },
  prepareSubmitPayload: ({ payload }) => ({
    ...payload,
    isActive: Number(payload.isActive) === 1,
  }),
};

export const projectCageAssignmentsConfig: AquaCrudConfig = {
  key: 'projectCageAssignments',
  title: 'aqua.pages.projectCageAssignments.title',
  description: 'aqua.pages.projectCageAssignments.description',
  endpoint: 'ProjectCage',
  listStaleTimeMs: 45000,
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
      key: 'cageId',
      label: 'aqua.fields.cageId',
      type: 'select',
      required: true,
      lookup: {
        endpoint: 'Cage',
        labelKeys: ['cageCode', 'cageName'],
        labelSeparator: ' - ',
        valueKey: 'id',
        staleTimeMs: 60000,
      },
    },
    { key: 'assignedDate', label: 'aqua.fields.assignedDate', type: 'date', required: true },
    { key: 'releasedDate', label: 'aqua.fields.releasedDate', type: 'date' },
  ],
  columns: [
    { key: 'projectCode', label: 'aqua.fields.projectCode' },
    { key: 'projectName', label: 'aqua.fields.projectName' },
    { key: 'cageCode', label: 'aqua.fields.cageCode' },
    { key: 'cageName', label: 'aqua.fields.cageName' },
    { key: 'assignedDate', label: 'aqua.fields.assignedDate' },
    { key: 'releasedDate', label: 'aqua.fields.releasedDate' },
  ],
  defaultValues: { releasedDate: null },
};

export const weatherSeveritiesConfig: AquaCrudConfig = {
  key: 'weatherSeverities',
  title: 'aqua.pages.weatherSeverities.title',
  description: 'aqua.pages.weatherSeverities.description',
  endpoint: 'WeatherSeverity',
  listStaleTimeMs: 120000,
  fields: [
    { key: 'code', label: 'aqua.fields.code', type: 'text', required: true },
    { key: 'name', label: 'aqua.fields.name', type: 'text', required: true },
    { key: 'score', label: 'aqua.fields.score', type: 'number', required: true },
  ],
  columns: [
    { key: 'code', label: 'aqua.fields.code' },
    { key: 'name', label: 'aqua.fields.name' },
    { key: 'score', label: 'aqua.fields.score' },
  ],
};

export const weatherTypesConfig: AquaCrudConfig = {
  key: 'weatherTypes',
  title: 'aqua.pages.weatherTypes.title',
  description: 'aqua.pages.weatherTypes.description',
  endpoint: 'WeatherType',
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

export const seaWaterTemperaturesConfig: AquaCrudConfig = {
  key: 'seaWaterTemperatures',
  title: 'aqua.pages.seaWaterTemperatures.title',
  description: 'aqua.pages.seaWaterTemperatures.description',
  endpoint: '/api/SeaWaterTemperature',
  listStaleTimeMs: 30000,
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
      key: 'projectCageId',
      label: 'aqua.fields.projectCageId',
      type: 'select',
      required: true,
      lookup: {
        endpoint: 'ProjectCage',
        labelKeys: ['cageCode', 'cageName'],
        labelSeparator: ' - ',
        valueKey: 'id',
        staleTimeMs: 45000,
        dependsOnFieldKey: 'projectId',
        filterColumn: 'ProjectId',
      },
    },
    { key: 'recordDate', label: 'aqua.fields.recordDate', type: 'date', required: true },
    { key: 'waterTemperatureCelsius', label: 'aqua.fields.waterTemperatureCelsius', type: 'number', numberStep: '0.1' },
    { key: 'weatherDescription', label: 'aqua.fields.weatherDescription', type: 'text', required: true },
    { key: 'note', label: 'aqua.fields.note', type: 'textarea' },
  ],
  columns: [
    { key: 'projectCode', label: 'aqua.fields.projectCode' },
    { key: 'projectName', label: 'aqua.fields.projectName' },
    { key: 'cageCode', label: 'aqua.fields.cageCode' },
    { key: 'cageName', label: 'aqua.fields.cageName' },
    { key: 'recordDate', label: 'aqua.fields.recordDate' },
    { key: 'waterTemperatureCelsius', label: 'aqua.fields.waterTemperatureCelsius' },
    { key: 'weatherDescription', label: 'aqua.fields.weatherDescription' },
    { key: 'note', label: 'aqua.fields.note' },
  ],
};

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
