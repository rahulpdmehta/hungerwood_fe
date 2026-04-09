/**
 * React Query hooks for menu-related API calls
 * Handles menu items, categories, and version checking
 */

import { useQuery } from '@tanstack/react-query';
import { menuService } from '@services/menu.service';
import { menuKeys } from '@utils/queryKeys';

/**
 * Fetch all menu items
 * Cache: 24 hours (entire day), no refetch on focus or mount
 */
export const useMenuItems = () => {
  const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  return useQuery({
    queryKey: menuKeys.items(),
    queryFn: async () => {
      const response = await menuService.getAllItems();
      // Service returns { data: [...] } structure
      return response?.data || response || [];
    },
    staleTime: oneDay, // Cache for entire day
    gcTime: oneDay * 2, // Keep in cache for 2 days after unmount
    refetchOnWindowFocus: false, // Don't refetch on tab switch
    refetchOnMount: false, // Don't refetch if data is fresh
    refetchInterval: false, // No background refetching
  });
};

/**
 * Fetch all categories
 * Cache: 24 hours (entire day), no refetch on focus or mount
 */
export const useCategories = () => {
  const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  return useQuery({
    queryKey: menuKeys.categories(),
    queryFn: async () => {
      const response = await menuService.getCategories();
      // Service returns { data: [...] } structure
      return response?.data || response || [];
    },
    staleTime: oneDay, // Cache for entire day
    gcTime: oneDay * 2, // Keep in cache for 2 days after unmount
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

/**
 * Fetch a single menu item by ID
 * Cache: 24 hours (entire day), no refetch on focus
 */
export const useMenuItem = (id) => {
  const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  return useQuery({
    queryKey: menuKeys.item(id),
    queryFn: async () => {
      if (!id) return null;
      const response = await menuService.getItemById(id);
      // Service returns { data: {...} } structure
      return response?.data || response || null;
    },
    enabled: !!id, // Only fetch if ID is provided
    staleTime: oneDay, // Cache for entire day
    gcTime: oneDay * 2, // Keep in cache for 2 days after unmount
    refetchOnWindowFocus: false,
  });
};

/**
 * Fetch menu version (lightweight check for updates)
 * Cache: 1 minute, refetch on focus
 */
export const useMenuVersion = () => {
  return useQuery({
    queryKey: menuKeys.version(),
    queryFn: async () => {
      const response = await menuService.getVersion();
      // Service returns { data: { version: ... } } structure
      return response?.data?.version || response?.version || null;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Check for updates on focus
  });
};
