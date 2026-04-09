/**
 * React Query hooks for banner-related API calls
 */

import { useQuery } from '@tanstack/react-query';
import * as bannerService from '@services/banner.service';
import { bannerKeys } from '@utils/queryKeys';

/**
 * Fetch active banners
 * Cache: 24 hours (entire day), no refetch on focus or mount
 */
export const useActiveBanners = () => {
  const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  return useQuery({
    queryKey: bannerKeys.active(),
    queryFn: async () => {
      const banners = await bannerService.getActiveBanners();
      return banners || [];
    },
    staleTime: oneDay, // Cache for entire day
    gcTime: oneDay * 2, // Keep in cache for 2 days after unmount
    refetchOnWindowFocus: false, // Don't refetch on tab switch
    refetchOnMount: false, // Don't refetch if data is fresh
  });
};

/**
 * Fetch all banners (admin)
 * @param {boolean} includeDisabled - Whether to include disabled banners
 */
export const useBanners = (includeDisabled = true) => {
  return useQuery({
    queryKey: bannerKeys.list(includeDisabled),
    queryFn: async () => {
      const banners = await bannerService.getAllBanners(includeDisabled);
      return banners || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (admin data changes more frequently)
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

/**
 * Fetch a single banner by ID
 */
export const useBanner = (id) => {
  return useQuery({
    queryKey: bannerKeys.detail(id),
    queryFn: async () => {
      if (!id) return null;
      const banner = await bannerService.getBannerById(id);
      return banner || null;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
