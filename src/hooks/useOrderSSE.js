/**
 * useOrderSSE Hook
 * React hook for Server-Sent Events to receive real-time order status updates
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '@utils/constants';

/**
 * Custom hook to subscribe to real-time order status updates via SSE
 * @param {string} orderId - The order ID to subscribe to
 * @returns {object} { orderData, isConnected, error }
 */
export const useOrderSSE = (orderId) => {
    const [orderData, setOrderData] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const eventSourceRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttemptsRef = useRef(0);

    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_DELAY = 3000; // 3 seconds

    // Cleanup function
    const cleanup = useCallback(() => {
        if (eventSourceRef.current) {
            console.log('🔌 Closing SSE connection for order:', orderId);
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
    }, [orderId]);

    // Connect to SSE
    const connectSSE = useCallback(() => {
        if (!orderId || orderId === 'undefined' || orderId === 'null') {
            console.warn('⚠️ No valid orderId provided for SSE connection:', orderId);
            setError('Invalid order ID');
            return;
        }

        // Prevent multiple connections
        if (eventSourceRef.current) {
            console.log('🔄 SSE connection already exists for order:', orderId);
            return;
        }

        try {
            // API_BASE_URL already includes /api, so we don't need to add it again
            const url = `${API_BASE_URL}/orders/${orderId}/stream`;
            console.log('🔗 Connecting to SSE:', url);

            const eventSource = new EventSource(url);
            eventSourceRef.current = eventSource;

            // Connection opened
            eventSource.onopen = () => {
                console.log('✅ SSE connection established for order:', orderId);
                setIsConnected(true);
                setError(null);
                reconnectAttemptsRef.current = 0; // Reset reconnect counter
            };

            // Message received
            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('📨 SSE message received:', data);

                    if (data.type === 'initial') {
                        // Initial order data
                        console.log('📦 Initial order data received');
                        setOrderData(data.order);
                    } else if (data.type === 'connected') {
                        // Connection confirmation
                        console.log('🎉 SSE connection confirmed:', data.message);
                    } else if (data.type === 'statusUpdate') {
                        // Status update
                        console.log('🔄 Order status update:', data.status);
                        setOrderData((prev) => ({
                            ...prev,
                            status: data.status,
                            statusHistory: data.statusHistory,
                            updatedAt: data.updatedAt
                        }));

                        // Show toast notification with formatted status
                        const formattedStatus = data.status.replace(/_/g, ' ');
                        toast.success(`Order status: ${formattedStatus}`, {
                            icon: '🔔',
                            duration: 4000
                        });
                    } else if (data.type === 'error') {
                        console.error('❌ SSE error message:', data.message);
                        setError(data.message);
                    }
                } catch (parseError) {
                    console.error('Failed to parse SSE message:', parseError);
                }
            };

            // Connection error
            eventSource.onerror = (err) => {
                console.error('❌ SSE connection error:', err);
                setIsConnected(false);

                // Close the current connection
                eventSource.close();
                eventSourceRef.current = null;

                // Attempt to reconnect with exponential backoff
                if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
                    reconnectAttemptsRef.current += 1;
                    const delay = RECONNECT_DELAY * reconnectAttemptsRef.current;

                    console.log(
                        `🔄 Reconnecting in ${delay / 1000}s (attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`
                    );

                    reconnectTimeoutRef.current = setTimeout(() => {
                        connectSSE();
                    }, delay);
                } else {
                    console.error('❌ Max reconnection attempts reached');
                    setError('Unable to connect to real-time updates. Please refresh the page.');
                    toast.error('Connection lost. Please refresh the page.', {
                        duration: 6000
                    });
                }
            };
        } catch (err) {
            console.error('Failed to create SSE connection:', err);
            setError('Failed to establish real-time connection');
            setIsConnected(false);
        }
    }, [orderId]);

    // Connect on mount and when orderId changes
    useEffect(() => {
        if (orderId) {
            connectSSE();
        }

        // Cleanup on unmount
        return () => {
            cleanup();
        };
    }, [orderId, connectSSE, cleanup]);

    // Handle visibility change (reconnect when tab becomes visible)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && !eventSourceRef.current && orderId) {
                console.log('👁️ Tab visible, reconnecting SSE...');
                connectSSE();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [orderId, connectSSE]);

    return {
        orderData,
        isConnected,
        error
    };
};

export default useOrderSSE;
