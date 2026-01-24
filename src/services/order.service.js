import api from './api';

// Helper to transform _id to id for frontend consistency
const transformOrder = (order) => {
  if (!order) return order;
  return {
    ...order,
    id: order._id || order.id,
  };
};

const transformOrders = (orders) => {
  if (!Array.isArray(orders)) return orders;
  return orders.map(transformOrder);
};

export const orderService = {
  // Create new order
  createOrder: async orderData => {
    const response = await api.post('/orders', orderData);
    if (response.data) {
      response.data = transformOrder(response.data);
    }
    return response;
  },

  // Get all orders (customer's own orders)
  getMyOrders: async () => {
    const response = await api.get('/orders/my');
    if (response.data) {
      response.data = transformOrders(response.data);
    }
    return response;
  },

  // Get order by ID
  getOrderById: async id => {
    const response = await api.get(`/orders/${id}`);
    if (response.data) {
      response.data = transformOrder(response.data);
    }
    return response;
  },

  // Cancel order
  cancelOrder: async id => {
    const response = await api.patch(`/orders/${id}/cancel`);
    return response;
  },

  // Track order
  trackOrder: async id => {
    const response = await api.get(`/orders/${id}/track`);
    if (response.data) {
      response.data = transformOrder(response.data);
    }
    return response;
  },

  // Admin: Get all orders
  getAllOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    if (response.data) {
      response.data = transformOrders(response.data);
    }
    return response;
  },

  // Admin: Update order status
  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response;
  },

  // Admin: Get order statistics
  getOrderStats: async (startDate, endDate) => {
    const response = await api.get('/orders/stats', {
      params: { startDate, endDate },
    });
    return response;
  },

  // Admin: Assign delivery person
  assignDelivery: async (orderId, deliveryPersonId) => {
    const response = await api.patch(`/orders/${orderId}/assign`, {
      deliveryPersonId,
    });
    return response;
  },

  // Get order history with pagination
  getOrderHistory: async (page = 1, limit = 10) => {
    const response = await api.get('/orders/history', {
      params: { page, limit },
    });
    return response;
  },
};

export default orderService;
