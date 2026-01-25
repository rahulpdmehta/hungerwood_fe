/**
 * GlobalOrderStatusListener - Monitors all user orders and triggers notifications
 * Works on any page to show order status updates
 */

import { useEffect, useRef } from 'react';
import { useAnimation } from '../../contexts/AnimationContext';
import useAuthStore from '@store/useAuthStore';
import { orderService } from '@services/order.service';

const GlobalOrderStatusListener = () => {
    const { animations } = useAnimation();
    const { isAuthenticated } = useAuthStore();
    const pollIntervalRef = useRef(null);
    const knownOrders = useRef(new Map()); // Track order statuses
    const isPollingRef = useRef(false);
    const hasActiveOrdersRef = useRef(false);

    useEffect(() => {
        if (!isAuthenticated) {
            // Clear everything if user logs out
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
            }
            knownOrders.current.clear();
            isPollingRef.current = false;
            hasActiveOrdersRef.current = false;
            return;
        }

        // Start polling for order updates
        const startPolling = () => {
            if (pollIntervalRef.current) {
                return; // Already polling
            }

            console.log('🔔 Starting global order status listener (polling every 30s)...');

            const pollOrders = async () => {
                // Prevent concurrent polling
                if (isPollingRef.current) {
                    return;
                }

                isPollingRef.current = true;

                try {
                    const response = await orderService.getMyOrders();
                    const orders = response.data || [];

                    // Check if there are any active orders (not completed or cancelled)
                    const activeOrders = orders.filter(order => {
                        const status = order.status?.toUpperCase();
                        return status !== 'COMPLETED' && status !== 'CANCELLED';
                    });

                    hasActiveOrdersRef.current = activeOrders.length > 0;

                    console.log(`📊 Found ${activeOrders.length} active order(s) out of ${orders.length} total`);

                    // If no active orders, stop polling
                    if (!hasActiveOrdersRef.current && pollIntervalRef.current) {
                        console.log('🔕 No active orders - stopping polling');
                        clearInterval(pollIntervalRef.current);
                        pollIntervalRef.current = null;
                        return;
                    }

                    // Check each order for status changes
                    orders.forEach(order => {
                        const orderId = order.id;
                        const currentStatus = order.status;
                        const previousStatus = knownOrders.current.get(orderId);

                        // If status changed, trigger notification
                        if (previousStatus && previousStatus !== currentStatus) {
                            console.log(`🔔 Global notification: Order ${order.orderNumber || orderId} status changed from ${previousStatus} → ${currentStatus}`);

                            // Trigger animation on any page
                            animations.orderStatus(currentStatus);
                        }

                        // Update known status
                        knownOrders.current.set(orderId, currentStatus);
                    });
                } catch (error) {
                    console.error('❌ Error polling orders for status updates:', error);
                } finally {
                    isPollingRef.current = false;
                }
            };

            // Poll every 30 seconds (reduced from 10 seconds)
            pollIntervalRef.current = setInterval(pollOrders, 30000);

            // Initial poll after a short delay (to avoid race with page-specific fetches)
            setTimeout(pollOrders, 2000);
        };

        startPolling();

        // Cleanup on unmount
        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
            }
            knownOrders.current.clear();
            isPollingRef.current = false;
            hasActiveOrdersRef.current = false;
            console.log('🔕 Global order status listener stopped');
        };
    }, [isAuthenticated, animations]);

    return null; // No UI needed
};

export default GlobalOrderStatusListener;
