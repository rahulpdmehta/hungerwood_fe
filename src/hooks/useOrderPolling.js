/**
 * useOrderPolling Hook
 * React hook for polling order status updates via REST API
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { orderService } from '@services/order.service';

// Active order statuses that should trigger polling
const ACTIVE_STATUSES = [
  'RECEIVED',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'OUT_FOR_DELIVERY'
];

// Polling interval: 3 minutes
const POLLING_INTERVAL = 3 * 60 * 1000; // 180,000ms

/**
 * Check if order status is active (should continue polling)
 * @param {string} status - Order status
 * @returns {boolean} - Whether status is active
 */
const isActiveStatus = (status) => {
  if (!status) return false;
  return ACTIVE_STATUSES.includes(status.toUpperCase());
};

/**
 * Custom hook to poll order status updates via REST API
 * @param {string} orderId - The order ID to poll
 * @param {string} currentStatus - Current order status (to determine if polling should continue)
 * @returns {object} { orderData, isLoading, error, refreshOrder, isRefreshing }
 */
export const useOrderPolling = (orderId, currentStatus) => {
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const intervalRef = useRef(null);
  const lastRefreshTimeRef = useRef(0);
  const isPageVisibleRef = useRef(true);
  const currentStatusRef = useRef(currentStatus);

  // Fetch order data
  const fetchOrder = useCallback(async (isManualRefresh = false) => {
    if (!orderId || orderId === 'undefined' || orderId === 'null') {
      console.warn('⚠️ No valid orderId provided for polling:', orderId);
      setError('Invalid order ID');
      return;
    }

    // Check if manual refresh is within debounce period (30 seconds)
    if (isManualRefresh) {
      const now = Date.now();
      const timeSinceLastRefresh = now - lastRefreshTimeRef.current;
      const DEBOUNCE_PERIOD = 30 * 1000; // 30 seconds

      if (timeSinceLastRefresh < DEBOUNCE_PERIOD) {
        const remainingTime = Math.ceil((DEBOUNCE_PERIOD - timeSinceLastRefresh) / 1000);
        console.log(`⏳ Manual refresh debounced. Please wait ${remainingTime} seconds.`);
        return;
      }
      lastRefreshTimeRef.current = now;
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      console.log(`📡 Fetching order status for: ${orderId}`);
      const response = await orderService.getOrderById(orderId);
      
      if (response.data) {
        console.log('📦 Order data fetched:', response.data);
        setOrderData(response.data);
        // Update status ref when order data changes
        if (response.data.status) {
          currentStatusRef.current = response.data.status;
        }
        setError(null);
      }
    } catch (err) {
      console.error('❌ Failed to fetch order:', err);
      setError(err.message || 'Failed to fetch order status');
      // Don't clear existing order data on error
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [orderId]);

  // Manual refresh function (with debouncing)
  const refreshOrder = useCallback(() => {
    fetchOrder(true);
  }, [fetchOrder]);

  // Update status ref when currentStatus prop changes
  useEffect(() => {
    currentStatusRef.current = currentStatus;
  }, [currentStatus]);

  // Setup polling interval
  useEffect(() => {
    // Don't poll if order is not active
    if (!isActiveStatus(currentStatus)) {
      console.log(`⏸️ Order status is ${currentStatus}, stopping polling`);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Don't poll if page is not visible
    if (!isPageVisibleRef.current) {
      console.log('👁️ Page not visible, pausing polling');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Setup polling interval
    console.log(`🔄 Starting polling for order ${orderId} (every ${POLLING_INTERVAL / 1000}s)`);
    
    // Initial fetch
    fetchOrder(false);

    // Set up interval for polling
    intervalRef.current = setInterval(() => {
      // Check if still active before polling using ref (always has latest value)
      if (isPageVisibleRef.current && isActiveStatus(currentStatusRef.current)) {
        fetchOrder(false);
      } else {
        // Stop polling if status is no longer active
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, POLLING_INTERVAL);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        console.log('🛑 Clearing polling interval');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [orderId, currentStatus, fetchOrder]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      isPageVisibleRef.current = isVisible;

      if (isVisible) {
        console.log('👁️ Page visible, resuming polling');
        // Resume polling if order is active
        if (isActiveStatus(currentStatusRef.current) && !intervalRef.current) {
          fetchOrder(false);
          intervalRef.current = setInterval(() => {
            if (isPageVisibleRef.current && isActiveStatus(currentStatusRef.current)) {
              fetchOrder(false);
            } else {
              // Stop polling if status is no longer active
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
            }
          }, POLLING_INTERVAL);
        }
      } else {
        console.log('👁️ Page hidden, pausing polling');
        // Pause polling when page is hidden
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentStatus, fetchOrder]);

  return {
    orderData,
    isLoading,
    error,
    refreshOrder,
    isRefreshing
  };
};

export default useOrderPolling;
