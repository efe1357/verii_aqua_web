import { useQuery } from '@tanstack/react-query';
import { netsisReadApi } from '../netsis-read-api';
import type { ProjeDto } from '../erp-types';

export const useErpProjects = () => {
  return useQuery<ProjeDto[]>({
    queryKey: ['erpProjectCodes'],
    queryFn: () => netsisReadApi.getProjectCodes(),
    staleTime: 5 * 60 * 1000,
  });
};
