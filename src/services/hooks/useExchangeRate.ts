import { useQuery } from '@tanstack/react-query';
import { netsisReadApi } from '../netsis-read-api';

export const useExchangeRate = (tarih?: Date, fiyatTipi: number = 1) => {
  return useQuery({
    queryKey: ['exchangeRate', tarih?.toISOString().split('T')[0] || 'today', fiyatTipi],
    queryFn: () => netsisReadApi.getExchangeRate(tarih, fiyatTipi),
    staleTime: 5 * 60 * 1000,
  });
};
