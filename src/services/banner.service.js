/**
 * Banner Service
 * API calls for banner management
 */

import api from './api';

/**
 * Get all active banners (public)
 * @returns {Promise<Array>} List of active banners
 */
export const getActiveBanners = async () => {
  try {
    const response = await api.get('/banners/active');
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch active banners:', error);
    throw error;
  }
};

/**
 * Get all banners (admin)
 * @param {boolean} includeDisabled - Whether to include disabled banners
 * @returns {Promise<Array>} List of all banners
 */
export const getAllBanners = async (includeDisabled = true) => {
  try {
    const response = await api.get(`/banners/all?includeDisabled=${includeDisabled}`);
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch all banners:', error);
    throw error;
  }
};

/**
 * Get banner by ID
 * @param {string} id - Banner ID
 * @returns {Promise<Object>} Banner details
 */
export const getBannerById = async (id) => {
  try {
    const response = await api.get(`/banners/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch banner:', error);
    throw error;
  }
};

/**
 * Create new banner (admin)
 * @param {Object} bannerData - Banner data
 * @returns {Promise<Object>} Created banner
 */
export const createBanner = async (bannerData) => {
  try {
    const response = await api.post('/banners', bannerData);
    return response.data;
  } catch (error) {
    console.error('Failed to create banner:', error);
    throw error;
  }
};

/**
 * Update banner (admin)
 * @param {string} id - Banner ID
 * @param {Object} updateData - Updated banner data
 * @returns {Promise<Object>} Updated banner
 */
export const updateBanner = async (id, updateData) => {
  try {
    const response = await api.put(`/banners/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Failed to update banner:', error);
    throw error;
  }
};

/**
 * Toggle banner status (admin)
 * @param {string} id - Banner ID
 * @returns {Promise<Object>} Updated banner
 */
export const toggleBannerStatus = async (id) => {
  try {
    const response = await api.patch(`/banners/${id}/toggle`);
    return response.data;
  } catch (error) {
    console.error('Failed to toggle banner status:', error);
    throw error;
  }
};

/**
 * Delete banner (admin)
 * @param {string} id - Banner ID
 * @returns {Promise<void>}
 */
export const deleteBanner = async (id) => {
  try {
    await api.delete(`/banners/${id}`);
  } catch (error) {
    console.error('Failed to delete banner:', error);
    throw error;
  }
};

/**
 * Helper function to check if banner is valid
 * @param {Object} banner - Banner object
 * @returns {boolean} Whether banner is currently valid
 */
export const isBannerValid = (banner) => {
  if (!banner.enabled) return false;
  
  const now = new Date();
  
  if (banner.validFrom) {
    const validFrom = new Date(banner.validFrom);
    if (now < validFrom) return false;
  }
  
  if (banner.validUntil) {
    const validUntil = new Date(banner.validUntil);
    if (now > validUntil) return false;
  }
  
  if (banner.applicableOn && banner.applicableOn.length > 0) {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const currentDay = days[now.getDay()];
    if (!banner.applicableOn.includes(currentDay)) return false;
  }
  
  return true;
};

export const BANNER_TYPES = {
  OFFER: 'OFFER',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  PROMOTION: 'PROMOTION',
  EVENT: 'EVENT',
};

export default {
  getActiveBanners,
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  toggleBannerStatus,
  deleteBanner,
  isBannerValid,
  BANNER_TYPES,
};
