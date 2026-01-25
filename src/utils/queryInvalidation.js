/**
 * Query invalidation utilities
 * Helper functions to invalidate queries after mutations
 */

import { useQueryClient } from '@tanstack/react-query';
import { menuKeys, bannerKeys, walletKeys, orderKeys } from './queryKeys';

/**
 * Hook to get query invalidation functions
 */
export const useQueryInvalidation = () => {
  const queryClient = useQueryClient();

  return {
    // Invalidate all menu-related queries
    invalidateMenu: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.all });
    },

    // Invalidate menu items only
    invalidateMenuItems: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.items() });
    },

    // Invalidate a specific menu item
    invalidateMenuItem: (id) => {
      queryClient.invalidateQueries({ queryKey: menuKeys.item(id) });
    },

    // Invalidate categories
    invalidateCategories: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.categories() });
    },

    // Invalidate all banner queries
    invalidateBanners: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
    },

    // Invalidate wallet balance
    invalidateWalletBalance: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.balance() });
    },

    // Invalidate wallet transactions
    invalidateWalletTransactions: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.transactions() });
    },

    // Invalidate all wallet queries
    invalidateWallet: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
    },

    // Invalidate all order queries
    invalidateOrders: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },

    // Invalidate a specific order
    invalidateOrder: (id) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
    },
  };
};
