import { create } from 'zustand';
import { restaurantService } from '@services/admin.service';

const useRestaurantStore = create((set, get) => ({
  isOpen: true,
  closingMessage: '',
  loading: false,
  error: null,

  fetchStatus: async () => {
    try {
      set({ loading: true, error: null });
      const resData = await restaurantService.getPublicStatus();
      const response = {
        success: true,
        data: resData
      };
      console.log('Fetch status response:', response);
      
      // Handle response - API interceptor returns response.data directly
      // Response structure: { success: true, message: "...", data: { isOpen, closingMessage } }
      if (response && response.success) {
        // Extract data from response.data (nested structure)
        const statusData = response.data;
        if (statusData) {
          console.log('Setting status from response.data:', statusData);
          set({
            isOpen: statusData.isOpen !== undefined ? statusData.isOpen : true,
            closingMessage: statusData.closingMessage || '',
            loading: false
          });
        } else {
          // Fallback: response might be the data directly
          console.log('No response.data, using response directly:', response);
          set({
            isOpen: response.isOpen !== undefined ? response.isOpen : true,
            closingMessage: response.closingMessage || '',
            loading: false
          });
        }
      } else {
        set({ loading: false, error: response?.message || 'Failed to fetch restaurant status' });
      }
    } catch (error) {
      console.error('Error fetching restaurant status:', error);
      set({ 
        loading: false, 
        error: error.response?.data?.message || error.message || 'Failed to fetch restaurant status',
        // Default to open if fetch fails
        isOpen: true
      });
    }
  },

  updateStatus: async (isOpen, closingMessage = '') => {
    try {
      set({ loading: true, error: null });
      const resData = await restaurantService.updateStatus({ isOpen, closingMessage });
      const response = {
        success: true,
        data: resData
      };
      console.log('Restaurant status update response:', response);
      
      // Handle response - API interceptor returns response.data directly
      // Backend returns: { success: true, message: "...", data: { isOpen, closingMessage } }
      if (response && response.success) {
        // Extract data from response.data (nested structure)
        const statusData = response.data;
        if (statusData) {
          const newIsOpen = statusData.isOpen !== undefined ? statusData.isOpen : isOpen;
          const newClosingMessage = statusData.closingMessage !== undefined ? statusData.closingMessage : closingMessage;
          
          console.log('Updating store with:', { isOpen: newIsOpen, closingMessage: newClosingMessage });
          
          set({
            isOpen: newIsOpen,
            closingMessage: newClosingMessage || '',
            loading: false
          });
          return { success: true, data: statusData };
        } else {
          // Fallback: response might be the data directly
          console.log('No response.data, using response directly:', response);
          const newIsOpen = response.isOpen !== undefined ? response.isOpen : isOpen;
          const newClosingMessage = response.closingMessage !== undefined ? response.closingMessage : closingMessage;
          
          set({
            isOpen: newIsOpen,
            closingMessage: newClosingMessage || '',
            loading: false
          });
          return { success: true, data: response };
        }
      } else {
        const errorMsg = response?.message || 'Failed to update status';
        console.error('Update failed:', errorMsg);
        set({ loading: false, error: errorMsg });
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error('Error updating restaurant status:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update restaurant status';
      set({ 
        loading: false, 
        error: errorMsg
      });
      return { success: false, error: errorMsg };
    }
  },

  // Admin: Fetch status from admin endpoint
  fetchAdminStatus: async () => {
    try {
      set({ loading: true, error: null });
      const response = await restaurantService.getStatus();
      
      console.log('Fetch admin status response:', response);
      
      // Handle response - API interceptor returns response.data directly
      // Response structure: { success: true, message: "...", data: { isOpen, closingMessage } }
      if (response && response.success) {
        // Extract data from response.data (nested structure)
        const statusData = response.data;
        if (statusData) {
          console.log('Setting admin status from response.data:', statusData);
          set({
            isOpen: statusData.isOpen !== undefined ? statusData.isOpen : true,
            closingMessage: statusData.closingMessage || '',
            loading: false
          });
        } else {
          // Fallback: response might be the data directly
          console.log('No response.data, using response directly:', response);
          set({
            isOpen: response.isOpen !== undefined ? response.isOpen : true,
            closingMessage: response.closingMessage || '',
            loading: false
          });
        }
      } else {
        set({ loading: false, error: response?.message || 'Failed to fetch restaurant status' });
      }
    } catch (error) {
      console.error('Error fetching restaurant status:', error);
      set({ 
        loading: false, 
        error: error.response?.data?.message || error.message || 'Failed to fetch restaurant status',
        isOpen: true
      });
    }
  }
}));

export default useRestaurantStore;
