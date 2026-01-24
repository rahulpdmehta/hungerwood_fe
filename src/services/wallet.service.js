/**
 * Wallet Service
 * Handles all wallet and referral related API calls
 */

import api from './api';

export const walletService = {
  /**
   * Get wallet balance
   * GET /api/wallet
   */
  getWalletBalance: async () => {
    try {
      const response = await api.get('/wallet');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
      throw error;
    }
  },

  /**
   * Get wallet transaction history
   * GET /api/wallet/transactions
   */
  getTransactions: async (params = {}) => {
    try {
      const response = await api.get('/wallet/transactions', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      throw error;
    }
  },

  /**
   * Get wallet summary (balance + referral info)
   * GET /api/wallet/summary
   */
  getWalletSummary: async () => {
    try {
      const response = await api.get('/wallet/summary');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch wallet summary:', error);
      throw error;
    }
  },

  /**
   * Get user's referral code
   * GET /api/wallet/referral/code
   */
  getReferralCode: async () => {
    try {
      const response = await api.get('/wallet/referral/code');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch referral code:', error);
      throw error;
    }
  },

  /**
   * Apply a referral code
   * POST /api/wallet/referral/apply
   */
  applyReferralCode: async (referralCode) => {
    try {
      const response = await api.post('/wallet/referral/apply', { referralCode });
      return response.data;
    } catch (error) {
      console.error('Failed to apply referral code:', error);
      throw error;
    }
  },
};

export default walletService;
