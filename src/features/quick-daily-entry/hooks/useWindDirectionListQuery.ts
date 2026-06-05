import { useQuery } from '@tanstack/react-query';
import { aquaQuickDailyApi } from '../api/aqua-quick-api';

export function useWindDirectionListQuery() {
  return useQuery({
    queryKey: ['aqua', 'quick-daily-entry', 'wind-directions'] as const,
    queryFn: () => aquaQuickDailyApi.getWindDirections(),
    staleTime: 120_000,
    refetchOnWindowFocus: false,
  });
}
