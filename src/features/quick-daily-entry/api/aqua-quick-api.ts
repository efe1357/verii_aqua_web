import { api } from '@/lib/axios';
import i18n from '@/lib/i18n';
import type { ApiResponse } from '@/types/api';
import type {
  ProjectDto,
  ProjectCageDto,
  StockDto,
  WarehouseDto,
  FishBatchDto,
  WeatherSeverityDto,
  WeatherTypeDto,
  WindDirectionDto,
  CurrentDirectionDto,
  NetOperationTypeDto,
  FeedingHeaderDto,
  FeedingLineDto,
  FeedingDistributionDto,
  MortalityHeaderDto,
  NetOperationHeaderDto,
  ActiveCageBatchSnapshot,
  ActiveWarehouseBatchSnapshot,
  CreateFeedingPayload,
  CreateFeedingLinePayload,
  CreateMortalityPayload,
  CreateMortalityLinePayload,
  CreateDailyWeatherPayload,
  CreateDailyEnvironmentalEntryPayload,
  CreateSeaWaterTemperaturePayload,
  CreateWindDirectionMatchPayload,
  CreateCurrentDirectionMatchPayload,
  CreateNetOperationPayload,
  CreateNetOperationLinePayload,
  CreateTransferPayload,
  CreateTransferLinePayload,
  CreateStockConvertPayload,
  CreateStockConvertLinePayload,
  CreateShipmentLineWithAutoHeaderPayload,
  CreateCageWarehouseTransferLineWithAutoHeaderPayload,
  CreateWarehouseTransferLineWithAutoHeaderPayload,
  CreateWarehouseCageTransferLineWithAutoHeaderPayload,
  CreateTransferLineWithAutoHeaderPayload,
  CreateStockConvertLineWithAutoHeaderPayload,
  CreateFeedingLineWithAutoHeaderPayload,
  CreateMortalityLineWithAutoHeaderPayload,
  CreateNetOperationLineWithAutoHeaderPayload,
} from '../types/quick-daily-entry-types';

interface PagedResultRaw<T> {
  items?: T[];
  Items?: T[];
  data?: T[];
  Data?: T[];
}

interface StockListResponseItem {
  id: number;
  erpStockCode?: string;
  stockName?: string;
  grupKodu?: string;
  grupAdi?: string;
  kod1?: string;
  kod1Adi?: string;
  kod2?: string;
  kod2Adi?: string;
  kod3?: string;
  kod3Adi?: string;
  kod4?: string;
  kod4Adi?: string;
  kod5?: string;
  kod5Adi?: string;
}

interface WarehouseListResponseItem {
  id: number;
  erpWarehouseCode?: number;
  warehouseName?: string;
  branchCode?: number;
}

interface CageListResponseItem {
  id: number;
  cageCode?: string;
  cageName?: string;
}

interface ProjectCageListResponseItem {
  id: number;
  projectId: number;
  cageId: number;
  cageCode?: string;
  cageName?: string;
  releasedDate?: string | null;
}

interface BatchCageBalanceListResponseItem {
  projectCageId?: number;
  fishBatchId?: number;
  liveCount?: number;
  averageGram?: number;
  biomassGram?: number;
}

interface BatchWarehouseBalanceListResponseItem {
  projectId?: number;
  warehouseId?: number;
  fishBatchId?: number;
  liveCount?: number;
  averageGram?: number;
  biomassGram?: number;
  batchCode?: string;
  warehouseCode?: number;
  warehouseName?: string;
}

export function isActiveProjectCage(releasedDate?: string | null): boolean {
  if (!releasedDate) return true;
  const parsed = new Date(releasedDate);
  if (Number.isNaN(parsed.getTime())) return true;
  return parsed.getUTCFullYear() <= 1901;
}

function getNumberField(obj: Record<string, unknown>, camel: string, pascal: string): number {
  const raw = obj[camel] ?? obj[pascal];
  return Number(raw ?? 0);
}

function getStringField(
  obj: Record<string, unknown>,
  camel: string,
  pascal: string
): string | null {
  const raw = obj[camel] ?? obj[pascal];
  if (raw == null) return null;
  return String(raw);
}

function normalizeProjectCage(item: Record<string, unknown>): ProjectCageListResponseItem {
  return {
    id: getNumberField(item, 'id', 'Id'),
    projectId: getNumberField(item, 'projectId', 'ProjectId'),
    cageId: getNumberField(item, 'cageId', 'CageId'),
    cageCode: getStringField(item, 'cageCode', 'CageCode') ?? undefined,
    cageName: getStringField(item, 'cageName', 'CageName') ?? undefined,
    releasedDate: getStringField(item, 'releasedDate', 'ReleasedDate'),
  };
}

function normalizeCage(item: Record<string, unknown>): CageListResponseItem {
  return {
    id: getNumberField(item, 'id', 'Id'),
    cageCode: getStringField(item, 'cageCode', 'CageCode') ?? undefined,
    cageName: getStringField(item, 'cageName', 'CageName') ?? undefined,
  };
}

function ensureSuccess<T>(response: ApiResponse<T>, fallback: string): T {
  if (!response.success) {
    throw new Error(response.message || fallback);
  }
  if (response.data == null) {
    throw new Error(fallback);
  }
  return response.data;
}

function extractPagedItems<T>(raw: PagedResultRaw<T>): T[] {
  return raw.items ?? raw.Items ?? raw.data ?? raw.Data ?? [];
}

function buildPagedQuery(
  pageNumber: number,
  pageSize: number,
  filters?: Array<{ column: string; operator: string; value: string }>,
  sortDirection: 'asc' | 'desc' = 'asc',
  filterLogic: 'and' | 'or' = 'and'
): string {
  const query = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
    sortBy: 'Id',
    sortDirection,
  });

  if (filters && filters.length > 0) {
    query.append('filters', JSON.stringify(filters));
    query.append('filterLogic', filterLogic);
  }

  return query.toString();
}

function extractStockList(raw: PagedResultRaw<StockListResponseItem>): StockDto[] {
  return extractPagedItems(raw).map((item) => ({
    id: item.id,
    code: item.erpStockCode,
    name: item.stockName,
    grupKodu: item.grupKodu,
    grupAdi: item.grupAdi,
    kod1: item.kod1,
    kod1Adi: item.kod1Adi,
    kod2: item.kod2,
    kod2Adi: item.kod2Adi,
    kod3: item.kod3,
    kod3Adi: item.kod3Adi,
    kod4: item.kod4,
    kod4Adi: item.kod4Adi,
    kod5: item.kod5,
    kod5Adi: item.kod5Adi,
  }));
}

function extractWarehouseList(raw: PagedResultRaw<WarehouseListResponseItem>): WarehouseDto[] {
  return extractPagedItems(raw).map((item) => ({
    id: Number(item.id),
    erpWarehouseCode: Number(item.erpWarehouseCode ?? 0),
    warehouseName: String(item.warehouseName ?? ''),
    branchCode: item.branchCode != null ? Number(item.branchCode) : undefined,
  }));
}

function hasPositiveLiveCount(item: Record<string, unknown>): boolean {
  return getNumberField(item, 'liveCount', 'LiveCount') > 0;
}

async function getAllAquaItems<T>(endpoint: string, pageSize = 500): Promise<T[]> {
  const all: T[] = [];
  let page = 1;

  while (true) {
    const response = await api.get<ApiResponse<PagedResultRaw<T>>>(`/api/aqua/${endpoint}?${buildPagedQuery(page, pageSize)}`);
    const raw = ensureSuccess(response, i18n.t('aqua.api.listLoadFailed', { ns: 'common' }));
    const items = extractPagedItems(raw);
    all.push(...items);

    if (items.length < pageSize) break;
    page += 1;
  }

  return all;
}

export const aquaQuickDailyApi = {
  getProjects: async (): Promise<ProjectDto[]> => {
    const query = buildPagedQuery(1, 500);
    const response = await api.get<ApiResponse<PagedResultRaw<ProjectDto>>>(`/api/aqua/Project?${query}`);
    const raw = ensureSuccess(response, i18n.t('aqua.api.listLoadFailed', { ns: 'common' }));
    const projects = extractPagedItems(raw);

    try {
      const [projectCages, cageBalances, warehouseBalances] = await Promise.all([
        getAllAquaItems<ProjectCageListResponseItem>('ProjectCage'),
        getAllAquaItems<BatchCageBalanceListResponseItem>('BatchCageBalance'),
        getAllAquaItems<BatchWarehouseBalanceListResponseItem>('BatchWarehouseBalance'),
      ]);

      const activeProjectIdByProjectCageId = new Map<number, number>();
      (projectCages as unknown as Record<string, unknown>[]).forEach((item) => {
        const id = getNumberField(item, 'id', 'Id');
        const projectId = getNumberField(item, 'projectId', 'ProjectId');
        const releasedDate = getStringField(item, 'releasedDate', 'ReleasedDate');
        if (id > 0 && projectId > 0 && isActiveProjectCage(releasedDate)) {
          activeProjectIdByProjectCageId.set(id, projectId);
        }
      });

      const activeProjectIds = new Set<number>();
      (cageBalances as unknown as Record<string, unknown>[]).forEach((item) => {
        if (!hasPositiveLiveCount(item)) return;
        const projectCageId = getNumberField(item, 'projectCageId', 'ProjectCageId');
        const projectId = activeProjectIdByProjectCageId.get(projectCageId);
        if (projectId && projectId > 0) {
          activeProjectIds.add(projectId);
        }
      });

      (warehouseBalances as unknown as Record<string, unknown>[]).forEach((item) => {
        if (!hasPositiveLiveCount(item)) return;
        const projectId = getNumberField(item, 'projectId', 'ProjectId');
        if (projectId > 0) {
          activeProjectIds.add(projectId);
        }
      });

      return projects.filter((project) => activeProjectIds.has(Number(project.id)));
    } catch {
      return projects;
    }
  },

  getProjectCages: async (projectId: number): Promise<ProjectCageDto[]> => {
    const items = await getAllAquaItems<ProjectCageDto>('ProjectCage');
    return (items as unknown as Record<string, unknown>[])
      .map(normalizeProjectCage)
      .filter((x) => Number(x.projectId) === projectId)
      .map((x) => ({
        id: x.id,
        projectId: x.projectId,
        cageId: x.cageId,
        cageCode: x.cageCode,
        cageName: x.cageName,
        releasedDate: x.releasedDate,
      }));
  },

  getTransferTargetProjectCages: async (targetProjectId: number): Promise<ProjectCageDto[]> => {
    const [allCages, allAssignments] = await Promise.all([
      getAllAquaItems<CageListResponseItem>('Cage'),
      getAllAquaItems<ProjectCageListResponseItem>('ProjectCage'),
    ]);
    const normalizedCages = (allCages as unknown as Record<string, unknown>[])
      .map(normalizeCage)
      .filter((x) => Number.isFinite(x.id) && x.id > 0);
    const normalizedAssignments = (allAssignments as unknown as Record<string, unknown>[])
      .map(normalizeProjectCage)
      .filter((x) => Number.isFinite(x.id) && x.id > 0);
    const cageById = new Map<number, CageListResponseItem>(normalizedCages.map((x) => [x.id, x]));

    return normalizedAssignments
      .filter((x) => isActiveProjectCage(x.releasedDate))
      .filter((x) => Number(x.projectId) === targetProjectId)
      .map((x) => {
        const cage = cageById.get(Number(x.cageId));
        return {
          id: x.id,
          projectId: x.projectId,
          cageId: x.cageId,
          cageCode: x.cageCode ?? cage?.cageCode,
          cageName: x.cageName ?? cage?.cageName,
        } satisfies ProjectCageDto;
      });
  },

  getStocks: async (): Promise<StockDto[]> => {
    const query = new URLSearchParams({
      page: '1',
      pageSize: '500',
      sortBy: 'Id',
      sortDirection: 'asc',
      filters: JSON.stringify([{ column: 'GrupKodu', operator: 'eq', value: 'YEM' }]),
      filterLogic: 'and',
    });
    const response = await api.get<ApiResponse<PagedResultRaw<StockListResponseItem>>>(`/api/Stock?${query.toString()}`);
    const raw = ensureSuccess(response, i18n.t('aqua.api.listLoadFailed', { ns: 'common' }));
    return extractStockList(raw);
  },

  getWarehouses: async (): Promise<WarehouseDto[]> => {
    const query = buildPagedQuery(1, 500);
    const response = await api.get<ApiResponse<PagedResultRaw<WarehouseListResponseItem>>>(`/api/aqua/Warehouse?${query}`);
    const raw = ensureSuccess(response, i18n.t('aqua.api.listLoadFailed', { ns: 'common' }));
    return extractWarehouseList(raw);
  },

  getFishBatches: async (projectId: number): Promise<FishBatchDto[]> => {
    const query = buildPagedQuery(1, 500, [{ column: 'ProjectId', operator: 'eq', value: String(projectId) }]);
    const response = await api.get<ApiResponse<PagedResultRaw<FishBatchDto>>>(`/api/aqua/FishBatch?${query}`);
    const raw = ensureSuccess(response, i18n.t('aqua.api.listLoadFailed', { ns: 'common' }));
    return extractPagedItems(raw);
  },

  findActiveFishBatchByProjectCage: async (
    projectCageId: number
  ): Promise<ActiveCageBatchSnapshot | null> => {
    const query = buildPagedQuery(
      1,
      200,
      [{ column: 'ProjectCageId', operator: 'eq', value: String(projectCageId) }],
      'desc'
    );
    const response = await api.get<ApiResponse<PagedResultRaw<BatchCageBalanceListResponseItem>>>(
      `/api/aqua/BatchCageBalance?${query}`
    );
    const raw = ensureSuccess(response, i18n.t('aqua.api.queryFailed', { ns: 'common' }));
    const items = extractPagedItems(raw);
    const active = items.find((x) => Number(x.liveCount ?? 0) > 0);
    const fishBatchId = Number(active?.fishBatchId ?? 0);
    if (fishBatchId <= 0) return null;
    return {
      fishBatchId,
      liveCount: Number(active?.liveCount ?? 0),
      averageGram: Number(active?.averageGram ?? 0),
      biomassGram: Number(active?.biomassGram ?? 0),
      batchCode: getStringField(active as unknown as Record<string, unknown>, 'batchCode', 'BatchCode') ?? undefined,
    };
  },

  getActiveFishBatchSnapshotsByProjectCageIds: async (
    projectCageIds: number[]
  ): Promise<Record<number, ActiveCageBatchSnapshot | null>> => {
    const normalizedIds = Array.from(new Set(projectCageIds.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0)));
    if (normalizedIds.length === 0) return {};

    const chunkSize = 25;
    const balanceRows: BatchCageBalanceListResponseItem[] = [];
    const normalizedIdSet = new Set(normalizedIds);

    try {
      for (let index = 0; index < normalizedIds.length; index += chunkSize) {
        const idChunk = normalizedIds.slice(index, index + chunkSize);
        const query = buildPagedQuery(
          1,
          Math.max(idChunk.length * 20, 100),
          idChunk.map((id) => ({ column: 'ProjectCageId', operator: 'eq', value: String(id) })),
          'desc',
          'or'
        );
        const response = await api.get<ApiResponse<PagedResultRaw<BatchCageBalanceListResponseItem>>>(
          `/api/aqua/BatchCageBalance?${query}`
        );
        const raw = ensureSuccess(response, i18n.t('aqua.api.queryFailed', { ns: 'common' }));
        balanceRows.push(...extractPagedItems(raw));
      }
    } catch {
      const allRows = await getAllAquaItems<BatchCageBalanceListResponseItem>('BatchCageBalance');
      balanceRows.push(
        ...(allRows as unknown as Record<string, unknown>[])
          .filter((row) => normalizedIdSet.has(getNumberField(row, 'projectCageId', 'ProjectCageId')))
          .map((row) => row as unknown as BatchCageBalanceListResponseItem)
      );
    }

    const rowsByProjectCageId = new Map<number, BatchCageBalanceListResponseItem[]>();
    balanceRows.forEach((row) => {
      const projectCageId = getNumberField(row as unknown as Record<string, unknown>, 'projectCageId', 'ProjectCageId');
      if (projectCageId <= 0) return;
      const current = rowsByProjectCageId.get(projectCageId) ?? [];
      current.push(row);
      rowsByProjectCageId.set(projectCageId, current);
    });

    return normalizedIds.reduce<Record<number, ActiveCageBatchSnapshot | null>>((acc, projectCageId) => {
      const rows = rowsByProjectCageId.get(projectCageId) ?? [];
      const active = rows.find((item) => Number(item.liveCount ?? 0) > 0);
      const fishBatchId = Number(active?.fishBatchId ?? 0);
          acc[projectCageId] = fishBatchId > 0
        ? {
            fishBatchId,
            liveCount: Number(active?.liveCount ?? 0),
            averageGram: Number(active?.averageGram ?? 0),
            biomassGram: Number(active?.biomassGram ?? 0),
            batchCode: getStringField(active as unknown as Record<string, unknown>, 'batchCode', 'BatchCode') ?? undefined,
          }
        : null;
      return acc;
    }, {});
  },

  getActiveFishBatchSnapshotsByWarehouseIds: async (
    projectId: number,
    warehouseIds: number[]
  ): Promise<Record<number, ActiveWarehouseBatchSnapshot[]>> => {
    const normalizedIds = Array.from(new Set(warehouseIds.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0)));
    if (normalizedIds.length === 0 || !Number.isFinite(projectId) || projectId <= 0) return {};
    const query = buildPagedQuery(
      1,
      Math.max(normalizedIds.length * 20, 200),
      [{ column: 'ProjectId', operator: 'eq', value: String(projectId) }],
      'desc',
      'and'
    );
    const response = await api.get<ApiResponse<PagedResultRaw<BatchWarehouseBalanceListResponseItem>>>(
      `/api/aqua/BatchWarehouseBalance?${query}`
    );
    const raw = ensureSuccess(response, i18n.t('aqua.api.queryFailed', { ns: 'common' }));
    const balanceRows = extractPagedItems(raw);

    return normalizedIds.reduce<Record<number, ActiveWarehouseBatchSnapshot[]>>((acc, warehouseId) => {
      const items = balanceRows
        .filter((row) => Number(row.projectId ?? 0) === projectId && Number(row.warehouseId ?? 0) === warehouseId)
        .filter((row) => Number(row.liveCount ?? 0) > 0)
        .map((row) => ({
          warehouseId,
          fishBatchId: Number(row.fishBatchId ?? 0),
          liveCount: Number(row.liveCount ?? 0),
          averageGram: Number(row.averageGram ?? 0),
          biomassGram: Number(row.biomassGram ?? 0),
          batchCode: row.batchCode,
          warehouseCode: row.warehouseCode,
          warehouseName: row.warehouseName,
        }))
        .filter((row) => row.fishBatchId > 0);

      acc[warehouseId] = items;
      return acc;
    }, {});
  },

  getWeatherSeverities: async (): Promise<WeatherSeverityDto[]> => {
    const query = buildPagedQuery(1, 500);
    const response = await api.get<ApiResponse<PagedResultRaw<WeatherSeverityDto>>>(`/api/aqua/WeatherSeverity?${query}`);
    const raw = ensureSuccess(response, i18n.t('aqua.api.listLoadFailed', { ns: 'common' }));
    return extractPagedItems(raw);
  },

  getWeatherTypes: async (): Promise<WeatherTypeDto[]> => {
    const query = buildPagedQuery(1, 500);
    const response = await api.get<ApiResponse<PagedResultRaw<WeatherTypeDto>>>(`/api/aqua/WeatherType?${query}`);
    const raw = ensureSuccess(response, i18n.t('aqua.api.listLoadFailed', { ns: 'common' }));
    return extractPagedItems(raw);
  },

  getWindDirections: async (): Promise<WindDirectionDto[]> => {
    const query = buildPagedQuery(1, 500);
    const response = await api.get<ApiResponse<PagedResultRaw<WindDirectionDto>>>(`/api/WindDirection?${query}`);
    const raw = ensureSuccess(response, i18n.t('aqua.api.listLoadFailed', { ns: 'common' }));
    return extractPagedItems(raw);
  },

  getCurrentDirections: async (): Promise<CurrentDirectionDto[]> => {
    const query = buildPagedQuery(1, 500);
    const response = await api.get<ApiResponse<PagedResultRaw<CurrentDirectionDto>>>(`/api/CurrentDirection?${query}`);
    const raw = ensureSuccess(response, i18n.t('aqua.api.listLoadFailed', { ns: 'common' }));
    return extractPagedItems(raw);
  },

  getNetOperationTypes: async (): Promise<NetOperationTypeDto[]> => {
    const query = buildPagedQuery(1, 500);
    const response = await api.get<ApiResponse<PagedResultRaw<NetOperationTypeDto>>>(`/api/aqua/NetOperationType?${query}`);
    const raw = ensureSuccess(response, i18n.t('aqua.api.listLoadFailed', { ns: 'common' }));
    return extractPagedItems(raw);
  },

  findFeedingHeaderByProjectAndDate: async (
    projectId: number,
    feedingDate: string
  ): Promise<FeedingHeaderDto | null> => {
    const query = buildPagedQuery(1, 1, [
      { column: 'ProjectId', operator: 'eq', value: String(projectId) },
      { column: 'FeedingDate', operator: 'eq', value: feedingDate },
    ]);
    const response = await api.get<ApiResponse<PagedResultRaw<FeedingHeaderDto>>>(`/api/aqua/Feeding?${query}`);
    const raw = ensureSuccess(response, i18n.t('aqua.api.queryFailed', { ns: 'common' }));
    const items = extractPagedItems(raw);
    return items.length > 0 ? items[0] : null;
  },

  findExistingFeedingLine: async (
    projectId: number,
    feedingDate: string,
    feedingSlot: number,
    projectCageId?: number | null
  ): Promise<FeedingLineDto | null> => {
    const headerQuery = buildPagedQuery(1, 1, [
      { column: 'ProjectId', operator: 'eq', value: String(projectId) },
      { column: 'FeedingDate', operator: 'eq', value: feedingDate },
      { column: 'FeedingSlot', operator: 'eq', value: String(feedingSlot) },
    ]);
    const headerResponse = await api.get<ApiResponse<PagedResultRaw<FeedingHeaderDto>>>(`/api/aqua/Feeding?${headerQuery}`);
    const headerRaw = ensureSuccess(headerResponse, i18n.t('aqua.api.queryFailed', { ns: 'common' }));
    const header = extractPagedItems(headerRaw)[0];
    if (!header?.id) return null;

    const distributionQuery = buildPagedQuery(1, 1, [
      { column: 'FeedingId', operator: 'eq', value: String(header.id) },
      { column: 'ProjectCageId', operator: 'eq', value: String(projectCageId ?? 0) },
    ]);
    const distributionResponse = await api.get<ApiResponse<PagedResultRaw<FeedingDistributionDto>>>(`/api/aqua/FeedingDistribution?${distributionQuery}`);
    const distributionRaw = ensureSuccess(distributionResponse, i18n.t('aqua.api.queryFailed', { ns: 'common' }));
    const distribution = extractPagedItems(distributionRaw)[0];
    if (!distribution?.feedingLineId) return null;

    const lineQuery = buildPagedQuery(1, 1, [
      { column: 'FeedingId', operator: 'eq', value: String(header.id) },
      { column: 'Id', operator: 'eq', value: String(distribution.feedingLineId) },
    ]);
    const lineResponse = await api.get<ApiResponse<PagedResultRaw<FeedingLineDto>>>(`/api/aqua/FeedingLine?${lineQuery}`);
    const lineRaw = ensureSuccess(lineResponse, i18n.t('aqua.api.queryFailed', { ns: 'common' }));
    const line = extractPagedItems(lineRaw)[0];
    return line ?? null;
  },

  findMortalityHeaderByProjectAndDate: async (
    projectId: number,
    mortalityDate: string
  ): Promise<MortalityHeaderDto | null> => {
    const query = buildPagedQuery(1, 1, [
      { column: 'ProjectId', operator: 'eq', value: String(projectId) },
      { column: 'MortalityDate', operator: 'eq', value: mortalityDate },
    ]);
    const response = await api.get<ApiResponse<PagedResultRaw<MortalityHeaderDto>>>(`/api/aqua/Mortality?${query}`);
    const raw = ensureSuccess(response, i18n.t('aqua.api.queryFailed', { ns: 'common' }));
    const items = extractPagedItems(raw);
    return items.length > 0 ? items[0] : null;
  },

  findNetOperationHeaderByProjectAndDate: async (
    projectId: number,
    operationDate: string
  ): Promise<NetOperationHeaderDto | null> => {
    const query = buildPagedQuery(1, 1, [
      { column: 'ProjectId', operator: 'eq', value: String(projectId) },
      { column: 'OperationDate', operator: 'eq', value: operationDate },
    ]);
    const response = await api.get<ApiResponse<PagedResultRaw<NetOperationHeaderDto>>>(`/api/aqua/NetOperation?${query}`);
    const raw = ensureSuccess(response, i18n.t('aqua.api.queryFailed', { ns: 'common' }));
    const items = extractPagedItems(raw);
    return items.length > 0 ? items[0] : null;
  },

  createFeeding: async (
    payload: CreateFeedingPayload
  ): Promise<{ id: number }> => {
    const response = await api.post<ApiResponse<{ id: number }>>(
      '/api/aqua/Feeding',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createFeedingLine: async (
    payload: CreateFeedingLinePayload
  ): Promise<{ id: number }> => {
    const response = await api.post<ApiResponse<{ id: number }>>(
      '/api/aqua/FeedingLine',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createFeedingLineWithAutoHeader: async (
    payload: CreateFeedingLineWithAutoHeaderPayload
  ): Promise<{ id: number; feedingId: number }> => {
    const response = await api.post<ApiResponse<{ id: number; feedingId: number }>>(
      '/api/aqua/FeedingLine/auto-header',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createMortality: async (
    payload: CreateMortalityPayload
  ): Promise<{ id: number }> => {
    const response = await api.post<ApiResponse<{ id: number }>>(
      '/api/aqua/Mortality',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createMortalityLine: async (
    payload: CreateMortalityLinePayload
  ): Promise<{ id: number }> => {
    const response = await api.post<ApiResponse<{ id: number }>>(
      '/api/aqua/MortalityLine',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createMortalityLineWithAutoHeader: async (
    payload: CreateMortalityLineWithAutoHeaderPayload
  ): Promise<{ id: number; mortalityId: number }> => {
    const response = await api.post<ApiResponse<{ id: number; mortalityId: number }>>(
      '/api/aqua/MortalityLine/auto-header',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createDailyWeather: async (
    payload: CreateDailyWeatherPayload
  ): Promise<{ id: number }> => {
    const response = await api.post<ApiResponse<{ id: number }>>(
      '/api/aqua/posting/daily-weather',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createDailyEnvironmentalEntry: async (
    payload: CreateDailyEnvironmentalEntryPayload
  ): Promise<{
    dailyWeatherId: number;
    seaWaterTemperatureId: number;
    windDirectionMatchId: number;
    currentDirectionMatchId: number;
  }> => {
    const response = await api.post<ApiResponse<{
      dailyWeatherId: number;
      seaWaterTemperatureId: number;
      windDirectionMatchId: number;
      currentDirectionMatchId: number;
    }>>(
      '/api/aqua/posting/daily-environmental-entry',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createSeaWaterTemperature: async (
    payload: CreateSeaWaterTemperaturePayload
  ): Promise<{ id: number }> => {
    const response = await api.post<ApiResponse<{ id: number }>>(
      '/api/SeaWaterTemperature',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createWindDirectionMatch: async (
    payload: CreateWindDirectionMatchPayload
  ): Promise<{ id: number }> => {
    const response = await api.post<ApiResponse<{ id: number }>>(
      '/api/WindDirectionMatch',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createCurrentDirectionMatch: async (
    payload: CreateCurrentDirectionMatchPayload
  ): Promise<{ id: number }> => {
    const response = await api.post<ApiResponse<{ id: number }>>(
      '/api/CurrentDirectionMatch',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createNetOperation: async (
    payload: CreateNetOperationPayload
  ): Promise<{ id: number }> => {
    const response = await api.post<ApiResponse<{ id: number }>>(
      '/api/aqua/NetOperation',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createNetOperationLine: async (
    payload: CreateNetOperationLinePayload
  ): Promise<{ id: number }> => {
    const response = await api.post<ApiResponse<{ id: number }>>(
      '/api/aqua/NetOperationLine',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createNetOperationLineWithAutoHeader: async (
    payload: CreateNetOperationLineWithAutoHeaderPayload
  ): Promise<{ id: number; netOperationId: number }> => {
    const response = await api.post<ApiResponse<{ id: number; netOperationId: number }>>(
      '/api/aqua/NetOperationLine/auto-header',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createTransfer: async (
    payload: CreateTransferPayload
  ): Promise<{ id: number }> => {
    const response = await api.post<ApiResponse<{ id: number }>>(
      '/api/aqua/Transfer',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createTransferLine: async (
    payload: CreateTransferLinePayload
  ): Promise<{ id: number }> => {
    const response = await api.post<ApiResponse<{ id: number }>>(
      '/api/aqua/TransferLine',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createTransferLineWithAutoHeader: async (
    payload: CreateTransferLineWithAutoHeaderPayload
  ): Promise<{ id: number; transferId: number }> => {
    const response = await api.post<ApiResponse<{ id: number; transferId: number }>>(
      '/api/aqua/TransferLine/auto-header',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  postTransfer: async (transferId: number): Promise<boolean> => {
    const response = await api.post<ApiResponse<boolean>>(
      `/api/aqua/posting/transfer/${transferId}`
    );
    return ensureSuccess(response, i18n.t('aqua.api.postFailed', { ns: 'common' }));
  },

  postMortality: async (mortalityId: number): Promise<boolean> => {
    const response = await api.post<ApiResponse<boolean>>(
      `/api/aqua/posting/mortality/${mortalityId}`
    );
    return ensureSuccess(response, i18n.t('aqua.api.postFailed', { ns: 'common' }));
  },

  postNetOperation: async (netOperationId: number): Promise<boolean> => {
    const response = await api.post<ApiResponse<boolean>>(
      `/api/aqua/posting/net-operation/${netOperationId}`
    );
    return ensureSuccess(response, i18n.t('aqua.api.postFailed', { ns: 'common' }));
  },

  postStockConvert: async (stockConvertId: number): Promise<boolean> => {
    const response = await api.post<ApiResponse<boolean>>(
      `/api/aqua/posting/stock-convert/${stockConvertId}`
    );
    return ensureSuccess(response, i18n.t('aqua.api.postFailed', { ns: 'common' }));
  },

  createShipmentLineWithAutoHeader: async (
    payload: CreateShipmentLineWithAutoHeaderPayload
  ): Promise<{ id: number; shipmentId: number }> => {
    const response = await api.post<ApiResponse<{ id: number; shipmentId: number }>>(
      '/api/aqua/ShipmentLine/auto-header',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  postShipment: async (shipmentId: number): Promise<boolean> => {
    const response = await api.post<ApiResponse<boolean>>(
      `/api/aqua/posting/shipment/${shipmentId}`
    );
    return ensureSuccess(response, i18n.t('aqua.api.postFailed', { ns: 'common' }));
  },

  createCageWarehouseTransferLineWithAutoHeader: async (
    payload: CreateCageWarehouseTransferLineWithAutoHeaderPayload
  ): Promise<{ id: number; cageWarehouseTransferId: number }> => {
    const response = await api.post<ApiResponse<{ id: number; cageWarehouseTransferId: number }>>(
      '/api/aqua/CageWarehouseTransferLine/auto-header',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createWarehouseTransferLineWithAutoHeader: async (
    payload: CreateWarehouseTransferLineWithAutoHeaderPayload
  ): Promise<{ id: number; warehouseTransferId: number }> => {
    const response = await api.post<ApiResponse<{ id: number; warehouseTransferId: number }>>(
      '/api/aqua/WarehouseTransferLine/auto-header',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createWarehouseCageTransferLineWithAutoHeader: async (
    payload: CreateWarehouseCageTransferLineWithAutoHeaderPayload
  ): Promise<{ id: number; warehouseCageTransferId: number }> => {
    const response = await api.post<ApiResponse<{ id: number; warehouseCageTransferId: number }>>(
      '/api/aqua/WarehouseCageTransferLine/auto-header',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  postWarehouseTransfer: async (warehouseTransferId: number): Promise<boolean> => {
    const response = await api.post<ApiResponse<boolean>>(
      `/api/aqua/posting/warehouse-transfer/${warehouseTransferId}`
    );
    return ensureSuccess(response, i18n.t('aqua.api.postFailed', { ns: 'common' }));
  },

  postCageWarehouseTransfer: async (cageWarehouseTransferId: number): Promise<boolean> => {
    const response = await api.post<ApiResponse<boolean>>(
      `/api/aqua/posting/cage-warehouse-transfer/${cageWarehouseTransferId}`
    );
    return ensureSuccess(response, i18n.t('aqua.api.postFailed', { ns: 'common' }));
  },

  postWarehouseCageTransfer: async (warehouseCageTransferId: number): Promise<boolean> => {
    const response = await api.post<ApiResponse<boolean>>(
      `/api/aqua/posting/warehouse-cage-transfer/${warehouseCageTransferId}`
    );
    return ensureSuccess(response, i18n.t('aqua.api.postFailed', { ns: 'common' }));
  },

  createStockConvert: async (
    payload: CreateStockConvertPayload
  ): Promise<{ id: number }> => {
    const response = await api.post<ApiResponse<{ id: number }>>(
      '/api/aqua/StockConvert',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createStockConvertLine: async (
    payload: CreateStockConvertLinePayload
  ): Promise<{ id: number }> => {
    const response = await api.post<ApiResponse<{ id: number }>>(
      '/api/aqua/StockConvertLine',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },

  createStockConvertLineWithAutoHeader: async (
    payload: CreateStockConvertLineWithAutoHeaderPayload
  ): Promise<{ id: number; stockConvertId: number }> => {
    const response = await api.post<ApiResponse<{ id: number; stockConvertId: number }>>(
      '/api/aqua/StockConvertLine/auto-header',
      payload
    );
    return ensureSuccess(response, i18n.t('aqua.api.createFailed', { ns: 'common' }));
  },
};
