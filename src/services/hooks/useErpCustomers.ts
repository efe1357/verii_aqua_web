import { useQuery } from '@tanstack/react-query';
import { netsisReadApi } from '../netsis-read-api';
import type { CariDto } from '../erp-types';

export const useErpCustomers = (cariKodu?: string | null) => {
  return useQuery<CariDto[]>({
    queryKey: ['erpCustomers', cariKodu || 'all'],
    queryFn: () => netsisReadApi.getCaris(cariKodu),
    staleTime: 5 * 60 * 1000,
  });
};
