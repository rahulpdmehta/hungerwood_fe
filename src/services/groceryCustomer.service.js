import api from './api';

// Public catalog
export const groceryCatalogService = {
  listCategories: () => api.get('/grocery/categories').then(r => r.data.data),
  listProducts: (params = {}) => api.get('/grocery/products', { params }).then(r => r.data.data),
  getProduct: (id) => api.get(`/grocery/products/${id}`).then(r => r.data.data),
  getSettings: () => api.get('/grocery/settings').then(r => r.data.data),
};

// Orders (authenticated)
export const groceryOrdersService = {
  create: (payload) => api.post('/grocery/orders', payload).then(r => r.data.data),
  list: () => api.get('/grocery/orders').then(r => r.data.data),
  get: (id) => api.get(`/grocery/orders/${id}`).then(r => r.data.data),
};

// Razorpay
export const groceryPaymentService = {
  createRazorpayOrder: (amount, orderData) =>
    api.post('/grocery/payment/create-razorpay-order', { amount, orderData }).then(r => r.data),
  verify: (payload) =>
    api.post('/grocery/payment/verify', payload).then(r => r.data),
};
