/**
 * Version Service
 * API calls for checking data versions
 */

import api from './api';

export const versionService = {
  /**
   * Get all data versions (menu, categories, banners)
   * @returns {Promise<{menu: number, categories: number, banners: number}>}
   */
  getVersions: async () => {
    const response = await api.get('/versions');
    // Response structure: { success: true, data: { menu: timestamp, categories: timestamp, banners: timestamp } }
    return response?.data?.data || response?.data || {};
  },
};
