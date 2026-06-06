import type { AquaCrudConfig } from '@/features/aqua-core/types/aqua-crud';

const goodsReceiptItemTypeOptions = [
  { label: 'aqua.goodsReceiptItemType.feed', value: 0 },
  { label: 'aqua.goodsReceiptItemType.fish', value: 1 },
];

const currencyCodeOptions = [
  { label: 'TRY', value: 'TRY' },
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'GBP', value: 'GBP' },
];

export const goodsReceiptsConfig: AquaCrudConfig = {
  key: 'goodsReceipts',
  title: 'aqua.pages.goodsReceipts.title',
  description: 'aqua.pages.goodsReceipts.description',
  endpoint: 'GoodsReceipt',
  postingSlug: 'goods-receipt',
  autoPostOnSave: true,
  listStaleTimeMs: 15000,
  fields: [
    {
      key: 'projectId',
      label: 'aqua.fields.projectId',
      type: 'select',
      lookup: {
        endpoint: 'Project',
        labelKeys: ['projectCode', 'projectName'],
        labelSeparator: ' - ',
        valueKey: 'id',
        staleTimeMs: 60000,
      },
    },
    { key: 'receiptNo', label: 'aqua.fields.receiptNo', type: 'text', required: true },
    { key: 'receiptDate', label: 'aqua.fields.receiptDate', type: 'date', required: true },
    { key: 'supplierId', label: 'aqua.fields.supplierId', type: 'number' },
    {
      key: 'warehouseId',
      label: 'aqua.fields.warehouseName',
      type: 'select',
      lookup: {
        endpoint: 'Warehouse',
        labelKeys: ['erpWarehouseCode', 'warehouseName'],
        labelSeparator: ' - ',
        valueKey: 'id',
        staleTimeMs: 60000,
      },
    },
    { key: 'note', label: 'aqua.fields.note', type: 'textarea' },
  ],
  columns: [
    { key: 'receiptNo', label: 'aqua.fields.receiptNo' },
    { key: 'receiptDate', label: 'aqua.fields.receiptDate' },
    { key: 'projectCode', label: 'aqua.fields.projectCode' },
    { key: 'projectName', label: 'aqua.fields.projectName' },
    { key: 'warehouseCode', label: 'aqua.fields.warehouseCode' },
    { key: 'warehouseName', label: 'aqua.fields.warehouseName' },
  ],
  defaultValues: { status: 0 },
};

export const goodsReceiptLinesConfig: AquaCrudConfig = {
  key: 'goodsReceiptLines',
  title: 'aqua.pages.goodsReceiptLines.title',
  description: 'aqua.pages.goodsReceiptLines.description',
  endpoint: 'GoodsReceiptLine',
  listStaleTimeMs: 10000,
  fields: [
    {
      key: 'goodsReceiptId',
      label: 'aqua.fields.goodsReceiptId',
      type: 'select',
      required: true,
      lookup: {
        endpoint: 'GoodsReceipt',
        labelKeys: ['receiptNo'],
        valueKey: 'id',
        staleTimeMs: 30000,
      },
    },
    { key: 'itemType', label: 'aqua.fields.itemType', type: 'select', required: true, options: goodsReceiptItemTypeOptions },
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
    { key: 'qtyUnit', label: 'aqua.fields.qtyUnit', type: 'number', visibleWhen: { fieldKey: 'itemType', values: [0] } },
    { key: 'gramPerUnit', label: 'aqua.fields.gramPerUnit', type: 'number', unitTransform: 'gram-to-kg', visibleWhen: { fieldKey: 'itemType', values: [0] } },
    { key: 'totalGram', label: 'aqua.fields.totalGram', type: 'number', unitTransform: 'gram-to-kg', visibleWhen: { fieldKey: 'itemType', values: [0] } },
    { key: 'fishCount', label: 'aqua.fields.fishCount', type: 'number', visibleWhen: { fieldKey: 'itemType', values: [1] } },
    { key: 'fishAverageGram', label: 'aqua.fields.fishAverageGram', type: 'number', unitTransform: 'gram-to-kg', visibleWhen: { fieldKey: 'itemType', values: [1] } },
    { key: 'fishTotalGram', label: 'aqua.fields.fishTotalGram', type: 'number', unitTransform: 'gram-to-kg', visibleWhen: { fieldKey: 'itemType', values: [1] } },
    { key: 'currencyCode', label: 'aqua.fields.currencyCode', type: 'select', options: currencyCodeOptions },
    { key: 'exchangeRate', label: 'aqua.fields.exchangeRate', type: 'number' },
    { key: 'unitPrice', label: 'aqua.fields.unitPrice', type: 'number' },
    { key: 'localUnitPrice', label: 'aqua.fields.localUnitPrice', type: 'number' },
    { key: 'lineAmount', label: 'aqua.fields.lineAmount', type: 'number' },
    { key: 'localLineAmount', label: 'aqua.fields.localLineAmount', type: 'number' },
    {
      key: 'fishBatchId',
      label: 'aqua.fields.fishBatchId',
      type: 'select',
      visibleWhen: { fieldKey: 'itemType', values: [1] },
      lookup: {
        endpoint: 'FishBatch',
        labelKeys: ['batchCode'],
        valueKey: 'id',
        staleTimeMs: 30000,
      },
    },
  ],
  columns: [
    { key: 'itemType', label: 'aqua.fields.itemType' },
    { key: 'stock.erpStockCode', label: 'aqua.fields.stockCode' },
    { key: 'stock.stockName', label: 'aqua.fields.stockName' },
    { key: 'batchCode', label: 'aqua.fields.batchCode' },
    { key: 'fishCount', label: 'aqua.fields.fishCount' },
    { key: 'totalGram', label: 'aqua.fields.totalGram', unitTransform: 'gram-to-kg' },
    { key: 'fishTotalGram', label: 'aqua.fields.fishTotalGram', unitTransform: 'gram-to-kg' },
    { key: 'currencyCode', label: 'aqua.fields.currencyCode' },
    { key: 'unitPrice', label: 'aqua.fields.unitPrice' },
    { key: 'localLineAmount', label: 'aqua.fields.localLineAmount' },
  ],
  defaultValues: { currencyCode: 'TRY', exchangeRate: 1 },
};

export const goodsReceiptFishDistributionsConfig: AquaCrudConfig = {
  key: 'goodsReceiptFishDistributions',
  title: 'aqua.pages.goodsReceiptFishDistributions.title',
  description: 'aqua.pages.goodsReceiptFishDistributions.description',
  endpoint: 'GoodsReceiptFishDistribution',
  listStaleTimeMs: 10000,
  fields: [
    {
      key: 'goodsReceiptLineId',
      label: 'aqua.fields.goodsReceiptLineId',
      type: 'select',
      required: true,
      lookup: {
        endpoint: 'GoodsReceiptLine',
        labelKeys: ['stock.stockName', 'itemType', 'id'],
        labelSeparator: ' - ',
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
    { key: 'fishCount', label: 'aqua.fields.fishCount', type: 'number', required: true },
  ],
  columns: [
    { key: 'stockCode', label: 'aqua.fields.stockCode' },
    { key: 'stockName', label: 'aqua.fields.stockName' },
    { key: 'batchCode', label: 'aqua.fields.batchCode' },
    { key: 'projectCode', label: 'aqua.fields.projectCode' },
    { key: 'cageCode', label: 'aqua.fields.cageCode' },
    { key: 'cageName', label: 'aqua.fields.cageName' },
    { key: 'fishCount', label: 'aqua.fields.fishCount' },
  ],
};
