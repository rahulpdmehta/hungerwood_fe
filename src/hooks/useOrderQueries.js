/**
 * React Query hooks for order-related API calls
 */

import { useQuery } from '@tanstack/react-query';
import { orderService } from '@services/order.service';
import { orderKeys } from '@utils/queryKeys';

/**
 * Fetch user's orders
 * Cache: 1 minute, refetch on focus (order status changes)
 */
export const useOrders = () => {
  return useQuery({
    queryKey: orderKeys.my(),
    queryFn: async () => {
      const response = await orderService.getMyOrders();
      // Service returns { data: [...] } structure
      return response?.data || response || [];
    },
    staleTime: 1 * 60 * 1000, // 1 minute (order status changes)
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Show latest order status
  });
};

/**
 * Fetch a single order by ID
 * @param {string} id - Order ID
 */
export const useOrder = (id) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      if (!id) return null;
      const response = await orderService.getOrderById(id);
      // Service returns { data: {...} } structure
      return response?.data || response || null;
    },
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for active orders
  });
};

/**
 * Track order (real-time tracking)
 * @param {string} id - Order ID
 */
export const useOrderTracking = (id) => {
  return useQuery({
    queryKey: orderKeys.track(id),
    queryFn: async () => {
      if (!id) return null;
      const response = await orderService.trackOrder(id);
      // Service returns { data: {...} } structure
      return response?.data || response || null;
    },
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds (real-time tracking)
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 10 * 1000, // Refetch every 10 seconds for tracking
    refetchOnWindowFocus: true,
  });
};
