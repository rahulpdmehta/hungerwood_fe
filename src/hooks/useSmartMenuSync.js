import { useEffect, useRef } from 'react';
import useMenuStore from '@store/useMenuStore';

const POLL_INTERVAL = 3 * 60 * 1000; // 3 minutes

/**
 * Smart menu sync hook with visibility API and polling
 * - Polls for updates every 3 minutes when tab is active
 * - Refreshes immediately when tab becomes visible
 * - Pauses polling when tab is hidden
 */
export const useSmartMenuSync = () => {
    const { fetchItemsSmart, checkForUpdates } = useMenuStore();
    const intervalRef = useRef(null);
    const isActiveRef = useRef(!document.hidden);

    useEffect(() => {
        // Handle visibility change
        const handleVisibilityChange = () => {
            const isVisible = !document.hidden;

            if (isVisible && !isActiveRef.current) {
                // Tab became visible, refresh menu
                console.log('👁️ Tab visible, checking for menu updates');
                isActiveRef.current = true;
                fetchItemsSmart();

                // Restart polling
                startPolling();
            } else if (!isVisible) {
                // Tab hidden, stop polling
                console.log('🔕 Tab hidden, pausing menu sync');
                isActiveRef.current = false;
                stopPolling();
            }
        };

        const startPolling = () => {
            stopPolling(); // Clear any existing interval

            intervalRef.current = setInterval(() => {
                if (isActiveRef.current) {
                    console.log('🔄 Polling for menu updates');
                    checkForUpdates().then(hasUpdates => {
                        if (hasUpdates) {
                            fetchItemsSmart();
                        }
                    });
                }
            }, POLL_INTERVAL);
        };

        const stopPolling = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        // Initial setup
        document.addEventListener('visibilitychange', handleVisibilityChange);

        if (isActiveRef.current) {
            startPolling();
        }

        // Cleanup
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            stopPolling();
        };
    }, [fetchItemsSmart, checkForUpdates]);
};

export default useSmartMenuSync;
