/**
 * React Query hooks for wallet-related API calls
 */

import { useQuery } from '@tanstack/react-query';
import { walletService } from '@services/wallet.service';
import { walletKeys } from '@utils/queryKeys';
import useAuthStore from '@store/useAuthStore';

/**
 * Fetch wallet balance
 * Cache: 2 minutes, refetch on focus for real-time balance
 * Guarded by auth state so logged-out users don't trigger a 401.
 */
export const useWalletBalance = () => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return useQuery({
    queryKey: walletKeys.balance(),
    queryFn: async () => {
      const response = await walletService.getWalletBalance();
      if (typeof response === 'object' && response !== null) {
        return typeof response.balance === 'number' ? response.balance : 0;
      }
      return typeof response === 'number' ? response : 0;
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

/**
 * Fetch wallet transaction history
 * @param {Object} params - Query parameters (page, limit, etc.)
 */
export const useWalletTransactions = (params = {}) => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return useQuery({
    queryKey: walletKeys.transactions(params),
    queryFn: async () => {
      const response = await walletService.getTransactions(params);
      return response?.transactions || response || [];
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

/**
 * Fetch wallet summary (balance + referral info)
 */
export const useWalletSummary = () => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return useQuery({
    queryKey: walletKeys.summary(),
    queryFn: async () => {
      const response = await walletService.getWalletSummary();
      return response || {};
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

/**
 * Fetch user's referral code
 */
export const useReferralCode = () => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return useQuery({
    queryKey: walletKeys.referralCode(),
    queryFn: async () => {
      const response = await walletService.getReferralCode();
      return response?.referralCode || response || null;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
