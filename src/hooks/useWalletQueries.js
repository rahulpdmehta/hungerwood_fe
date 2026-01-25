/**
 * React Query hooks for wallet-related API calls
 */

import { useQuery } from '@tanstack/react-query';
import { walletService } from '@services/wallet.service';
import { walletKeys } from '@utils/queryKeys';

/**
 * Fetch wallet balance
 * Cache: 2 minutes, refetch on focus for real-time balance
 */
export const useWalletBalance = () => {
  return useQuery({
    queryKey: walletKeys.balance(),
    queryFn: async () => {
      const response = await walletService.getWalletBalance();
      // Service returns { balance: ... } structure
      return response?.balance || response || 0;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (balance changes frequently)
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Show latest balance
  });
};

/**
 * Fetch wallet transaction history
 * @param {Object} params - Query parameters (page, limit, etc.)
 */
export const useWalletTransactions = (params = {}) => {
  return useQuery({
    queryKey: walletKeys.transactions(params),
    queryFn: async () => {
      const response = await walletService.getTransactions(params);
      // Service returns { transactions: [...] } structure
      return response?.transactions || response || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

/**
 * Fetch wallet summary (balance + referral info)
 */
export const useWalletSummary = () => {
  return useQuery({
    queryKey: walletKeys.summary(),
    queryFn: async () => {
      const response = await walletService.getWalletSummary();
      return response || {};
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

/**
 * Fetch user's referral code
 */
export const useReferralCode = () => {
  return useQuery({
    queryKey: walletKeys.referralCode(),
    queryFn: async () => {
      const response = await walletService.getReferralCode();
      // Service returns { referralCode: ... } structure
      return response?.referralCode || response || null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes (referral code doesn't change)
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};
