import type { AquaCrudConfig } from '@/features/aqua-core/types/aqua-crud';

export const feedingsConfig: AquaCrudConfig = {
  key: 'feedings',
  title: 'aqua.pages.feedings.title',
  description: 'aqua.pages.feedings.description',
  endpoint: 'Feeding',
  listStaleTimeMs: 10000,
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
    { key: 'feedingNo', label: 'aqua.fields.feedingNo', type: 'text', required: true },
    { key: 'feedingDate', label: 'aqua.fields.feedingDate', type: 'datetime', required: true },
    {
      key: 'feedingSlot',
      label: 'aqua.fields.feedingSlot',
      type: 'select',
      required: true,
      options: [
        { label: 'aqua.feedingSlot.morning', value: 0 },
        { label: 'aqua.feedingSlot.evening', value: 1 },
      ],
    },
    {
      key: 'sourceType',
      label: 'aqua.fields.sourceType',
      type: 'select',
      required: true,
      options: [
        { label: 'aqua.sourceType.manual', value: 0 },
        { label: 'aqua.sourceType.planned', value: 1 },
        { label: 'aqua.sourceType.auto', value: 2 },
      ],
    },
    { key: 'note', label: 'aqua.fields.note', type: 'textarea' },
  ],
  columns: [
    { key: 'feedingNo', label: 'aqua.fields.feedingNo' },
    { key: 'feedingDate', label: 'aqua.fields.feedingDate' },
    { key: 'feedingSlot', label: 'aqua.fields.feedingSlot' },
  ],
  defaultValues: { feedingSlot: 0, sourceType: 0 },
};

export const feedingLinesConfig: AquaCrudConfig = {
  key: 'feedingLines',
  title: 'aqua.pages.feedingLines.title',
  description: 'aqua.pages.feedingLines.description',
  endpoint: 'FeedingLine',
  listStaleTimeMs: 10000,
  fields: [
    {
      key: 'feedingId',
      label: 'aqua.fields.feedingId',
      type: 'select',
      required: true,
      lookup: {
        endpoint: 'Feeding',
        labelKeys: ['feedingNo'],
        valueKey: 'id',
        staleTimeMs: 30000,
      },
    },
    {
      key: 'stockId',
      label: 'aqua.fields.stockName',
      type: 'select',
      required: true,
      lookup: {
        endpoint: '/api/Stock',
        labelKeys: ['erpStockCode', 'stockName'],
        labelSeparator: ' - ',
        valueKey: 'id',
        staleTimeMs: 30000,
      },
    },
    {
      key: 'feedingSlot',
      label: 'aqua.fields.feedingSlot',
      type: 'select',
      hideInForm: true,
      options: [
        { label: 'aqua.feedingSlot.morning', value: 0 },
        { label: 'aqua.feedingSlot.evening', value: 1 },
      ],
    },
    { key: 'qtyUnit', label: 'aqua.fields.qtyUnit', type: 'number', required: true },
    { key: 'gramPerUnit', label: 'aqua.fields.gramPerUnit', type: 'number', required: true, unitTransform: 'gram-to-kg' },
    { key: 'totalGram', label: 'aqua.fields.totalGram', type: 'number', required: true, unitTransform: 'gram-to-kg' },
  ],
  columns: [
    { key: 'feedingSlot', label: 'aqua.fields.feedingSlot' },
    { key: 'cageCode', label: 'aqua.fields.cageCode' },
    { key: 'cageName', label: 'aqua.fields.cageName' },
    { key: 'stockCode', label: 'aqua.fields.stockCode' },
    { key: 'stockName', label: 'aqua.fields.stockName' },
    { key: 'qtyUnit', label: 'aqua.fields.qtyUnit' },
    { key: 'gramPerUnit', label: 'aqua.fields.gramPerUnit', unitTransform: 'gram-to-kg' },
    { key: 'totalGram', label: 'aqua.fields.totalGram', unitTransform: 'gram-to-kg' },
  ],
  defaultValues: { gramPerUnit: 1 },
};

export const feedingDistributionsConfig: AquaCrudConfig = {
  key: 'feedingDistributions',
  title: 'aqua.pages.feedingDistributions.title',
  description: 'aqua.pages.feedingDistributions.description',
  endpoint: 'FeedingDistribution',
  listStaleTimeMs: 10000,
  fields: [
    {
      key: 'feedingLineId',
      label: 'aqua.fields.feedingLineId',
      type: 'select',
      required: true,
      lookup: {
        endpoint: 'FeedingLine',
        labelKeys: ['stock.stockName', 'totalGram', 'id'],
        labelSeparator: ' - ',
        valueKey: 'id',
        staleTimeMs: 30000,
      },
    },
    {
      key: 'fishBatchId',
      label: 'aqua.fields.fishBatchId',
      type: 'select',
      required: true,
      lookup: {
        endpoint: 'FishBatch',
        labelKeys: ['batchCode'],
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
      },
    },
    { key: 'feedGram', label: 'aqua.fields.feedGram', type: 'number', required: true, unitTransform: 'gram-to-kg' },
  ],
  columns: [
    { key: 'batchCode', label: 'aqua.fields.batchCode' },
    { key: 'projectCode', label: 'aqua.fields.projectCode' },
    { key: 'cageCode', label: 'aqua.fields.cageCode' },
    { key: 'cageName', label: 'aqua.fields.cageName' },
    { key: 'feedGram', label: 'aqua.fields.feedGram', unitTransform: 'gram-to-kg' },
  ],
};
