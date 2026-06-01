import { useQuery } from '@tanstack/react-query';
import { hangfireMonitoringApi } from '../api/hangfireMonitoring.api';

const REFRESH_INTERVAL_MS = 60_000;

export const HANGFIRE_QUERY_KEYS = {
  STATS: ['hangfire', 'stats'] as const,
  FAILED: (from: number, count: number) => ['hangfire', 'failed', from, count] as const,
  SUCCEEDED: (from: number, count: number) => ['hangfire', 'succeeded', from, count] as const,
  DEAD_LETTER: (from: number, count: number) => ['hangfire', 'dead-letter', from, count] as const,
  RECURRING: ['hangfire', 'recurring-jobs'] as const,
};

export function useHangfireStatsQuery() {
  return useQuery({
    queryKey: HANGFIRE_QUERY_KEYS.STATS,
    queryFn: () => hangfireMonitoringApi.getStats(),
    refetchInterval: REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });
}

export function useHangfireFailedJobsQuery(pageNumber: number, pageSize: number) {
  return useQuery({
    queryKey: HANGFIRE_QUERY_KEYS.FAILED(pageNumber, pageSize),
    queryFn: () => hangfireMonitoringApi.getFailed(pageNumber, pageSize),
    refetchInterval: REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });
}

export function useHangfireSuccessJobsQuery(pageNumber: number, pageSize: number) {
  return useQuery({
    queryKey: HANGFIRE_QUERY_KEYS.SUCCEEDED(pageNumber, pageSize),
    queryFn: () => hangfireMonitoringApi.getSuccesses(pageNumber, pageSize),
    refetchInterval: REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });
}

export function useHangfireDeadLetterQuery(pageNumber: number, pageSize: number) {
  return useQuery({
    queryKey: HANGFIRE_QUERY_KEYS.DEAD_LETTER(pageNumber, pageSize),
    refetchInterval: REFRESH_INTERVAL_MS,
    queryFn: () => hangfireMonitoringApi.getDeadLetter(pageNumber, pageSize),
    refetchIntervalInBackground: false,
  });
}

export function useHangfireRecurringJobsQuery() {
  return useQuery({
    queryKey: HANGFIRE_QUERY_KEYS.RECURRING,
    queryFn: () => hangfireMonitoringApi.getRecurringJobs(),
    refetchInterval: REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });
}
