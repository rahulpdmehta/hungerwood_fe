import api from './api';

// Helper to transform _id to id for frontend consistency
const transformItem = (item) => {
  if (!item) return item;
  return {
    ...item,
    id: item._id || item.id,
  };
};

const transformItems = (items) => {
  if (!Array.isArray(items)) return items;
  return items.map(transformItem);
};

export const menuService = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get('/menu/categories');
    if (response.data) {
      response.data = transformItems(response.data);
    }
    return response;
  },

  // Get all menu items
  getAllItems: async () => {
    const response = await api.get('/menu/items');
    if (response.data) {
      response.data = transformItems(response.data);
    }
    return response;
  },

  // Get menu item by ID
  getItemById: async (id) => {
    const response = await api.get(`/menu/items/${id}`);
    if (response.data) {
      response.data = transformItem(response.data);
    }
    return response;
  },

  // Search menu items (if needed in future)
  searchItems: async (query) => {
    const response = await api.get('/menu/items', {
      params: { search: query },
    });
    if (response.data) {
      response.data = transformItems(response.data);
    }
    return response;
  },

  // Get menu version (lightweight check)
  getVersion: async () => {
    const response = await api.get('/menu/version');
    return response;
  },
};

export default menuService;
