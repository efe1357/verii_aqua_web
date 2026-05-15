import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type {
  BranchErp,
  CariDto,
  ErpCustomer,
  ErpProduct,
  ErpProject,
  ErpWarehouse,
  KurDto,
  ProjeDto,
  StokGroupDto,
} from './erp-types';

const NETSIS_READ_BASE = '/api/NetsisRead';

function ensureSuccess<T>(response: ApiResponse<T>, fallbackMessage: string): T {
  if (response.success && response.data) {
    return response.data;
  }

  throw new Error(response.message || fallbackMessage);
}

export const netsisReadApi = {
  getCustomers: async (): Promise<ErpCustomer[]> => {
    const response = await api.get(`${NETSIS_READ_BASE}/getAllCustomers`) as ApiResponse<ErpCustomer[]>;
    return ensureSuccess(response, 'Cariler yuklenemedi');
  },

  getCaris: async (cariKodu?: string | null): Promise<CariDto[]> => {
    const queryParams = new URLSearchParams();
    if (cariKodu) {
      queryParams.append('cariKodu', cariKodu);
    }

    const url = `${NETSIS_READ_BASE}/getAllCustomers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get(url) as ApiResponse<CariDto[]>;
    return ensureSuccess(response, 'ERP musterileri yuklenemedi');
  },

  getProjects: async (): Promise<ErpProject[]> => {
    const response = await api.get(`${NETSIS_READ_BASE}/getProjectCodes`) as ApiResponse<ErpProject[]>;
    return ensureSuccess(response, 'Projeler yuklenemedi');
  },

  getProjectCodes: async (): Promise<ProjeDto[]> => {
    const response = await api.get<ApiResponse<ProjeDto[]>>(`${NETSIS_READ_BASE}/getProjectCodes`);
    return ensureSuccess(response, 'Proje kodlari yuklenemedi');
  },

  getWarehouses: async (depoKodu?: number): Promise<ErpWarehouse[]> => {
    const queryParams = new URLSearchParams();
    if (depoKodu != null) {
      queryParams.append('depoKodu', String(depoKodu));
    }

    const url = `${NETSIS_READ_BASE}/getAllWarehouses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get(url) as ApiResponse<ErpWarehouse[]>;
    return ensureSuccess(response, 'Depolar yuklenemedi');
  },

  getProducts: async (): Promise<ErpProduct[]> => {
    const response = await api.get(`${NETSIS_READ_BASE}/getAllProducts`) as ApiResponse<ErpProduct[]>;
    return ensureSuccess(response, 'Stoklar yuklenemedi');
  },

  getBranches: async (): Promise<BranchErp[]> => {
    const response = await api.get(`${NETSIS_READ_BASE}/getBranches`) as ApiResponse<BranchErp[]>;
    return ensureSuccess(response, 'Subeler yuklenemedi');
  },

  getExchangeRate: async (tarih?: Date, fiyatTipi: number = 1): Promise<KurDto[]> => {
    const date = tarih || new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const response = await api.get(`${NETSIS_READ_BASE}/getExchangeRate?tarih=${dateString}&fiyatTipi=${fiyatTipi}`) as ApiResponse<KurDto[]>;
    return ensureSuccess(response, 'Doviz kurlari yuklenemedi');
  },

  getStokGroup: async (grupKodu?: string): Promise<StokGroupDto[]> => {
    const grupKoduParam = grupKodu && grupKodu.trim() !== '' ? grupKodu : '';
    const response = await api.get(`${NETSIS_READ_BASE}/getStokGroup?grupKodu=${encodeURIComponent(grupKoduParam)}`) as ApiResponse<StokGroupDto[]>;
    return ensureSuccess(response, 'Stok gruplari yuklenemedi');
  },
};
