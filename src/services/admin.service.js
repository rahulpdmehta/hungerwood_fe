/**
 * Admin Service
 * API calls for admin operations
 */

import api from './api';

// ==================== CATEGORY MANAGEMENT ====================

export const categoryService = {
  // Get all categories
  getAll: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  // Get category by ID
  getById: async (id) => {
    const response = await api.get(`/admin/categories/${id}`);
    return response.data;
  },

  // Create category
  create: async (data) => {
    const formData = new FormData();

    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.imageUrl) formData.append('imageUrl', data.imageUrl);
    if (data.isActive !== undefined) formData.append('isActive', data.isActive);

    // Handle file upload
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    const response = await api.post('/admin/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Update category
  update: async (id, data) => {
    const formData = new FormData();

    if (data.name) formData.append('name', data.name);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.imageUrl !== undefined) formData.append('imageUrl', data.imageUrl);
    if (data.isActive !== undefined) formData.append('isActive', data.isActive);

    // Handle file upload
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    const response = await api.put(`/admin/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Delete category
  delete: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },

  // Toggle category status
  toggleStatus: async (id) => {
    const response = await api.patch(`/admin/categories/${id}/toggle`);
    return response.data;
  }
};

// ==================== MENU ITEM MANAGEMENT ====================

export const menuItemService = {
  // Get all menu items
  getAll: async (params = {}) => {
    const response = await api.get('/menu/items', { params });
    return response.data;
  },

  // Get menu item by ID
  getById: async (id) => {
    const response = await api.get(`/menu/items/${id}`);
    return response.data;
  },

  // Create menu item
  create: async (data) => {
    const formData = new FormData();

    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.price) formData.append('price', data.price);
    if (data.category) formData.append('category', data.category);
    if (data.imageUrl) formData.append('imageUrl', data.imageUrl);
    if (data.isVeg !== undefined) formData.append('isVeg', data.isVeg);
    if (data.isAvailable !== undefined) formData.append('isAvailable', data.isAvailable);
    if (data.isBestSeller !== undefined) formData.append('isBestSeller', data.isBestSeller);
    if (data.discount !== undefined) formData.append('discount', data.discount);

    // Handle file upload
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    const response = await api.post('/admin/menu', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Update menu item
  update: async (id, data) => {
    const formData = new FormData();

    if (data.name) formData.append('name', data.name);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.price !== undefined) formData.append('price', data.price);
    if (data.category !== undefined) formData.append('category', data.category);
    if (data.imageUrl !== undefined) formData.append('imageUrl', data.imageUrl);
    if (data.isVeg !== undefined) formData.append('isVeg', data.isVeg);
    if (data.isAvailable !== undefined) formData.append('isAvailable', data.isAvailable);
    if (data.isBestSeller !== undefined) formData.append('isBestSeller', data.isBestSeller);
    if (data.discount !== undefined) formData.append('discount', data.discount);

    // Handle file upload
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    const response = await api.put(`/admin/menu/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Delete menu item
  delete: async (id) => {
    const response = await api.delete(`/admin/menu/${id}`);
    return response.data;
  },

  // Toggle availability
  toggleAvailability: async (id) => {
    const response = await api.patch(`/admin/menu/${id}/availability`);
    return response.data;
  }
};

// ==================== ORDER MANAGEMENT ====================

export const adminOrderService = {
  // Get all orders
  getAll: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  // Get order by ID
  getById: async (id) => {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data;
  },

  // Update order status
  updateStatus: async (id, status) => {
    const response = await api.patch(`/admin/orders/${id}/status`, { status });
    return response.data;
  }
};

// ==================== USER MANAGEMENT ====================

export const adminUserService = {
  // Get all users
  getAll: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  }
};

// ==================== DASHBOARD ANALYTICS ====================

export const dashboardService = {
  // Get dashboard stats
  getStats: async (dateFilter = 30) => {
    const response = await api.get('/admin/dashboard/stats', { params: { dateFilter } });
    return response.data;
  },

  // Get orders analytics
  getOrdersAnalytics: async (days = 30) => {
    const response = await api.get('/admin/dashboard/orders-analytics', { params: { days } });
    return response.data;
  },

  // Get menu analytics
  getMenuAnalytics: async (dateFilter = 30) => {
    const response = await api.get('/admin/dashboard/menu-analytics', { params: { dateFilter } });
    return response.data;
  },

  // Get customer analytics
  getCustomerAnalytics: async (days = 30) => {
    const response = await api.get('/admin/dashboard/customer-analytics', { params: { days } });
    return response.data;
  }
};

export default {
  category: categoryService,
  menuItem: menuItemService,
  order: adminOrderService,
  user: adminUserService,
  dashboard: dashboardService
};
