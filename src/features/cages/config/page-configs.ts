import type { AquaCrudConfig } from '@/features/aqua-core/types/aqua-crud';

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
