/**
 * React Query hook for fetching data versions
 * Polls /api/versions every 30 seconds to check for updates
 */

import { useQuery } from '@tanstack/react-query';
import { versionService } from '@services/version.service';
import { versionKeys } from '@utils/queryKeys';

/**
 * Fetch all data versions (menu, categories, banners)
 * Polls every 30 seconds to check for updates
 * Cache: 30 seconds (matches polling interval)
 */
export const useDataVersions = () => {
  const POLLING_INTERVAL = 30 * 1000; // 30 seconds
  
  return useQuery({
    queryKey: versionKeys.current(),
    queryFn: async () => {
      const versions = await versionService.getVersions();
      return versions;
    },
    staleTime: POLLING_INTERVAL, // Consider data stale after polling interval
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchInterval: POLLING_INTERVAL, // Poll every 30 seconds
    refetchOnWindowFocus: true, // Also check when user returns to tab
    refetchOnMount: true, // Check on component mount
    retry: 2, // Retry up to 2 times on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};
