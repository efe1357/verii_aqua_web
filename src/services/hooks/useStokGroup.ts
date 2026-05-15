import { useQuery } from '@tanstack/react-query';
import { netsisReadApi } from '../netsis-read-api';

export const useStokGroup = (grupKodu?: string) => {
  return useQuery({
    queryKey: ['stokGroup', grupKodu || 'all'],
    queryFn: () => netsisReadApi.getStokGroup(grupKodu),
    staleTime: 5 * 60 * 1000,
  });
};
