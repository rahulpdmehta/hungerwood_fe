/**
 * Wallet Store
 * Manages wallet balance, transactions, and referral data with caching
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { walletService } from '@services/wallet.service';

// Cache duration: 2 minutes (wallet data changes more frequently)
const CACHE_DURATION = 2 * 60 * 1000;

const useWalletStore = create(
  persist(
    (set, get) => ({
      // State
      balance: 0,
      transactions: [],
      referralCode: null,
      referralStats: {
        totalReferrals: 0,
        totalEarnings: 0,
        pendingReferrals: 0,
        referredFriends: [],
      },
      loading: false,
      error: null,

      // Cache timestamps
      balanceLastFetch: null,
      transactionsLastFetch: null,
      referralLastFetch: null,

      // Check if cache is still valid
      isCacheValid: (lastFetchTime) => {
        if (!lastFetchTime) return false;
        const now = Date.now();
        return now - lastFetchTime < CACHE_DURATION;
      },

      /**
       * Fetch wallet balance with caching
       */
      fetchBalance: async (force = false) => {
        const { balance, balanceLastFetch, isCacheValid } = get();

        // Return cached data if valid and not forced
        if (!force && balance > 0 && isCacheValid(balanceLastFetch)) {
          console.log('📦 Using cached wallet balance');
          return balance;
        }

        console.log('🔄 Fetching wallet balance from API');
        set({ loading: true, error: null });

        try {
          const response = await walletService.getWalletBalance();
          console.log('💰 Wallet balance API response:', response);

          const fetchedBalance = response?.balance ?? 0;
          console.log('💰 Fetched balance:', fetchedBalance);

          set({
            balance: fetchedBalance,
            balanceLastFetch: Date.now(),
            loading: false,
          });

          return fetchedBalance;
        } catch (error) {
          console.error('Failed to fetch wallet balance:', error);
          console.error('Error details:', error.response?.data || error.message);
          set({ error: error.message, loading: false, balance: 0 });
          return 0; // Return 0 on error
        }
      },

      /**
       * Fetch wallet transactions with caching
       */
      fetchTransactions: async (force = false) => {
        const { transactions, transactionsLastFetch, isCacheValid } = get();

        // Return cached data if valid and not forced
        console.log('🔄 Fetching transactions from API', transactions, transactionsLastFetch, isCacheValid(transactionsLastFetch));
        if (!force && transactions.length > 0 && isCacheValid(transactionsLastFetch)) {
          console.log('📦 Using cached transactions');
          return transactions;
        }

        console.log('🔄 Fetching transactions from API');
        set({ loading: true, error: null });

        try {
          const response = await walletService.getTransactions();
          const fetchedTransactions = response?.transactions || [];

          set({
            transactions: fetchedTransactions,
            transactionsLastFetch: Date.now(),
            loading: false,
          });

          return fetchedTransactions;
        } catch (error) {
          console.error('Failed to fetch transactions:', error);
          set({ error: error.message, loading: false });
          return transactions;
        }
      },

      /**
       * Fetch wallet summary (balance + referral stats)
       */
      fetchSummary: async (force = false) => {
        const { referralLastFetch, isCacheValid } = get();

        // Return cached data if valid and not forced
        if (!force && isCacheValid(referralLastFetch)) {
          console.log('📦 Using cached wallet summary');
          return {
            balance: get().balance,
            referralStats: get().referralStats,
          };
        }

        console.log('🔄 Fetching wallet summary from API');
        set({ loading: true, error: null });

        try {
          const response = await walletService.getWalletSummary();
          console.log('📊 Full API response:', JSON.stringify(response, null, 2));

          // Handle nested response structure
          let data = { ...response };
          console.log('📊 Extracted data:', JSON.stringify(data, null, 2));

          // if (!data) {
          //   console.error('❌ No data in response');
          //   throw new Error('Invalid API response: no data');
          // }

          // Handle different response structures with better null checking
          const walletBalance = data?.wallet?.balance ?? data?.balance ?? 0;
          const referralCode = data?.referral?.code ?? data?.referralCode ?? null;
          const referralCount = data?.referral?.referralCount ?? data?.totalReferrals ?? 0;
          const referralEarnings = data?.referral?.earnings ?? data?.totalEarnings ?? 0;
          const referredUsers = data?.referral?.referredUsers ?? data?.referredFriends ?? [];

          console.log('✅ Parsed values:', {
            walletBalance,
            referralCode,
            referralCount,
            referralEarnings,
            referredUsers
          });

          set({
            balance: walletBalance,
            referralCode: referralCode,
            referralStats: {
              totalReferrals: referralCount,
              totalEarnings: referralEarnings,
              pendingReferrals: 0,
              referredFriends: referredUsers,
            },
            balanceLastFetch: Date.now(),
            referralLastFetch: Date.now(),
            loading: false,
            error: null,
          });

          return {
            balance: walletBalance,
            referralCode: referralCode,
            totalReferrals: referralCount,
            totalEarnings: referralEarnings,
            referredFriends: referredUsers,
          };
        } catch (error) {
          console.error('❌ Failed to fetch wallet summary:', error);
          console.error('❌ Error details:', error?.response?.data || error?.message);
          console.error('❌ Full error object:', JSON.stringify(error, null, 2));

          // Set default values on error instead of throwing
          set({
            error: error?.message || 'Failed to load wallet data',
            loading: false,
            balance: 0,
            referralCode: null,
            referralStats: {
              totalReferrals: 0,
              totalEarnings: 0,
              pendingReferrals: 0,
              referredFriends: [],
            }
          });

          // Don't throw, just return defaults
          return {
            balance: 0,
            referralCode: null,
            totalReferrals: 0,
            totalEarnings: 0,
            referredFriends: [],
          };
        }
      },

      /**
       * Fetch referral code
       */
      fetchReferralCode: async (force = false) => {
        const { referralCode, referralLastFetch, isCacheValid } = get();

        // Return cached data if valid and not forced
        if (!force && referralCode && isCacheValid(referralLastFetch)) {
          console.log('📦 Using cached referral code');
          return referralCode;
        }

        console.log('🔄 Fetching referral code from API');
        set({ loading: true, error: null });

        try {
          const response = await walletService.getReferralCode();
          const code = response.data?.data?.code || null;

          set({
            referralCode: code,
            referralLastFetch: Date.now(),
            loading: false,
          });

          return code;
        } catch (error) {
          console.error('Failed to fetch referral code:', error);
          set({ error: error.message, loading: false });
          return referralCode;
        }
      },

      /**
       * Apply referral code
       */
      applyReferralCode: async (code) => {
        set({ loading: true, error: null });

        try {
          const response = await walletService.applyReferralCode(code);

          // Refresh balance and summary after applying
          await get().fetchSummary(true);

          set({ loading: false });
          return response;
        } catch (error) {
          console.error('Failed to apply referral code:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      /**
       * Force refresh all wallet data
       */
      refreshWalletData: async () => {
        console.log('🔄 Force refreshing all wallet data');
        await Promise.all([
          get().fetchBalance(true),
          get().fetchTransactions(true),
          get().fetchSummary(true),
        ]);
      },

      /**
       * Clear cache (useful for logout)
       */
      clearCache: () => {
        set({
          balance: 0,
          transactions: [],
          referralCode: null,
          referralStats: {
            totalReferrals: 0,
            totalEarnings: 0,
            pendingReferrals: 0,
            referredFriends: [],
          },
          balanceLastFetch: null,
          transactionsLastFetch: null,
          referralLastFetch: null,
        });
      },

      /**
       * Force clear all cache and reload
       */
      hardRefresh: async () => {
        console.log('🔄 Hard refresh: Clearing cache and reloading all data');

        // Clear localStorage
        localStorage.removeItem('hungerwood-wallet-store');

        // Reset state
        set({
          balance: 0,
          transactions: [],
          referralCode: null,
          referralStats: {
            totalReferrals: 0,
            totalEarnings: 0,
            pendingReferrals: 0,
            referredFriends: [],
          },
          balanceLastFetch: null,
          transactionsLastFetch: null,
          referralLastFetch: null,
          loading: false,
          error: null,
        });

        // Fetch fresh data
        await get().refreshWalletData();
      },
    }),
    {
      name: 'hungerwood-wallet-store',
      partialize: (state) => ({
        // Only persist wallet data, not UI state
        balance: state.balance,
        transactions: state.transactions,
        referralCode: state.referralCode,
        referralStats: state.referralStats,
        balanceLastFetch: state.balanceLastFetch,
        transactionsLastFetch: state.transactionsLastFetch,
        referralLastFetch: state.referralLastFetch,
      }),
    }
  )
);

export default useWalletStore;
