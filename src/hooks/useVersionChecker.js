/**
 * Version Checker Hook
 * Compares current versions with stored versions and invalidates cache when mismatches are detected
 */

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useDataVersions } from './useDataVersions';
import { menuKeys, bannerKeys } from '@utils/queryKeys';

/**
 * Hook that checks for version mismatches and invalidates React Query cache
 * Should be used at the App level to run globally
 */
export const useVersionChecker = () => {
  const queryClient = useQueryClient();
  const { data: currentVersions, isLoading, error } = useDataVersions();
  const previousVersionsRef = useRef(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Skip if still loading or if there's an error
    if (isLoading || error || !currentVersions) {
      return;
    }

    // Initialize previous versions on first load
    if (!hasInitializedRef.current) {
      previousVersionsRef.current = {
        menu: currentVersions.menu || 0,
        categories: currentVersions.categories || 0,
        banners: currentVersions.banners || 0,
      };
      hasInitializedRef.current = true;
      return;
    }

    const previous = previousVersionsRef.current;
    const current = currentVersions;

    // Check for menu version mismatch
    if (current.menu && current.menu !== previous.menu) {
      console.log('🔄 Menu version changed, invalidating cache...', {
        previous: previous.menu,
        current: current.menu,
      });
      queryClient.invalidateQueries({ queryKey: menuKeys.items() });
      queryClient.invalidateQueries({ queryKey: menuKeys.categories() });
      previous.menu = current.menu;
      previous.categories = current.categories; // Categories are part of menu, so update both
    }

    // Check for categories version mismatch (only if menu didn't change)
    if (current.categories && current.categories !== previous.categories && current.menu === previous.menu) {
      console.log('🔄 Categories version changed, invalidating cache...', {
        previous: previous.categories,
        current: current.categories,
      });
      queryClient.invalidateQueries({ queryKey: menuKeys.categories() });
      previous.categories = current.categories;
    }

    // Check for banners version mismatch
    if (current.banners && current.banners !== previous.banners) {
      console.log('🔄 Banners version changed, invalidating cache...', {
        previous: previous.banners,
        current: current.banners,
      });
      queryClient.invalidateQueries({ queryKey: bannerKeys.active() });
      previous.banners = current.banners;
    }

    // Update previous versions ref
    previousVersionsRef.current = { ...previous };
  }, [currentVersions, isLoading, error, queryClient]);

  // Log errors but don't break the app
  if (error) {
    console.warn('⚠️ Version check failed:', error);
  }
};
