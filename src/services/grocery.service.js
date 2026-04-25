import api from './api';

// Note: the axios response interceptor in ./api.js returns `response.data`
// (the JSON body), so services already see { success, data }. Unwrap with
// `r.data`, NOT `r.data.data`.

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
  list: () => api.get('/admin/grocery/categories').then(r => r.data),
  create: (d) => { const { body, headers } = toPayload(d); return api.post('/admin/grocery/categories', body, { headers }).then(r => r.data); },
  update: (id, d) => { const { body, headers } = toPayload(d); return api.patch(`/admin/grocery/categories/${id}`, body, { headers }).then(r => r.data); },
  remove: (id) => api.delete(`/admin/grocery/categories/${id}`).then(r => r),
  toggle: (id) => api.patch(`/admin/grocery/categories/${id}/toggle`).then(r => r.data),
};

export const groceryProductService = {
  // Returns the array. Used by callers that need every product (e.g. bundles picker).
  list: (params = {}) => api.get('/admin/grocery/products', { params }).then(r => r.data),
  // Returns the full envelope `{ data, pagination }` for paginated admin views.
  listPaginated: (params = {}) => api.get('/admin/grocery/products', { params }).then(r => r),
  get: (id) => api.get(`/admin/grocery/products/${id}`).then(r => r.data),
  create: (d) => { const { body, headers } = toPayload(d); return api.post('/admin/grocery/products', body, { headers }).then(r => r.data); },
  update: (id, d) => { const { body, headers } = toPayload(d); return api.patch(`/admin/grocery/products/${id}`, body, { headers }).then(r => r.data); },
  remove: (id) => api.delete(`/admin/grocery/products/${id}`).then(r => r),
  toggle: (id) => api.patch(`/admin/grocery/products/${id}/toggle`).then(r => r.data),
};

export const grocerySettingsService = {
  get: () => api.get('/admin/grocery/settings').then(r => r.data),
  update: (d) => api.patch('/admin/grocery/settings', d).then(r => r.data),
};

export const groceryAdminOrderService = {
  // list returns the full body because the page also reads `.pagination`
  list: (params = {}) => api.get('/admin/grocery/orders', { params }).then(r => r),
  get: (id) => api.get(`/admin/grocery/orders/${id}`).then(r => r.data),
  updateStatus: (id, status) => api.patch(`/admin/grocery/orders/${id}/status`, { status }).then(r => r.data),
};
