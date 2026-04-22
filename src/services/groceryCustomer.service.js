import api from './api';

// Note: the axios response interceptor in ./api.js returns `response.data`
// (the JSON body), so services already see { success, data }. Unwrap with
// `r.data`, NOT `r.data.data`.

export const groceryCatalogService = {
  listCategories: () => api.get('/grocery/categories').then(r => r.data),
  listProducts: (params = {}) => api.get('/grocery/products', { params }).then(r => r.data),
  getProduct: (id) => api.get(`/grocery/products/${id}`).then(r => r.data),
  getSettings: () => api.get('/grocery/settings').then(r => r.data),
};

// Orders (authenticated)
export const groceryOrdersService = {
  create: (payload) => api.post('/grocery/orders', payload).then(r => r.data),
  list: () => api.get('/grocery/orders').then(r => r.data),
  get: (id) => api.get(`/grocery/orders/${id}`).then(r => r.data),
};

// Razorpay — backend returns a flat envelope { success, id, amount, ... }
// or { success, data, paymentId, refund }. Return the full body so callers
// can read both success flags and payload fields uniformly.
export const groceryPaymentService = {
  createRazorpayOrder: (amount, orderData) =>
    api.post('/grocery/payment/create-razorpay-order', { amount, orderData }).then(r => r),
  verify: (payload) =>
    api.post('/grocery/payment/verify', payload).then(r => r),
};
