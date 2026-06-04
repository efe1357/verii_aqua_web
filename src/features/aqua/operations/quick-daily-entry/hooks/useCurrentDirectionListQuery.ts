import { useQuery } from '@tanstack/react-query';
import { aquaQuickDailyApi } from '../api/aqua-quick-api';

export function useCurrentDirectionListQuery() {
  return useQuery({
    queryKey: ['aqua', 'currentDirections'],
    queryFn: () => aquaQuickDailyApi.getCurrentDirections(),
    staleTime: 120000,
  });
}
