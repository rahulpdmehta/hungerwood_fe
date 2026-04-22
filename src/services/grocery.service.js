import api from './api';

// Helper: build multipart body when file provided, else JSON
const toPayload = (data) => {
  if (data.image instanceof File) {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      fd.append(k, v instanceof File ? v : typeof v === 'object' ? JSON.stringify(v) : v);
    });
    return { body: fd, headers: { 'Content-Type': 'multipart/form-data' } };
  }
  return { body: data, headers: { 'Content-Type': 'application/json' } };
};

export const groceryCategoryService = {
  list: () => api.get('/admin/grocery/categories').then(r => r.data.data),
  create: (d) => { const { body, headers } = toPayload(d); return api.post('/admin/grocery/categories', body, { headers }).then(r => r.data.data); },
  update: (id, d) => { const { body, headers } = toPayload(d); return api.patch(`/admin/grocery/categories/${id}`, body, { headers }).then(r => r.data.data); },
  remove: (id) => api.delete(`/admin/grocery/categories/${id}`).then(r => r.data),
  toggle: (id) => api.patch(`/admin/grocery/categories/${id}/toggle`).then(r => r.data.data),
};

export const groceryProductService = {
  list: (params = {}) => api.get('/admin/grocery/products', { params }).then(r => r.data.data),
  get: (id) => api.get(`/admin/grocery/products/${id}`).then(r => r.data.data),
  create: (d) => { const { body, headers } = toPayload(d); return api.post('/admin/grocery/products', body, { headers }).then(r => r.data.data); },
  update: (id, d) => { const { body, headers } = toPayload(d); return api.patch(`/admin/grocery/products/${id}`, body, { headers }).then(r => r.data.data); },
  remove: (id) => api.delete(`/admin/grocery/products/${id}`).then(r => r.data),
  toggle: (id) => api.patch(`/admin/grocery/products/${id}/toggle`).then(r => r.data.data),
};

export const grocerySettingsService = {
  get: () => api.get('/admin/grocery/settings').then(r => r.data.data),
  update: (d) => api.patch('/admin/grocery/settings', d).then(r => r.data.data),
};

export const groceryAdminOrderService = {
  list: (params = {}) => api.get('/admin/grocery/orders', { params }).then(r => r.data),
  get: (id) => api.get(`/admin/grocery/orders/${id}`).then(r => r.data.data),
  updateStatus: (id, status) => api.patch(`/admin/grocery/orders/${id}/status`, { status }).then(r => r.data.data),
};
