export const API_BASE_URL = 'https://hungerwood-be.vercel.app/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'HungerWood';

export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.CONFIRMED]: 'Confirmed',
  [ORDER_STATUS.PREPARING]: 'Preparing',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
};

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  UPI: 'upi',
};

export const FOOD_CATEGORIES = [
  'All',
  'Appetizers',
  'Main Course',
  'Desserts',
  'Beverages',
  'Salads',
  'Fast Food',
];

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  MENU: '/menu',
  ITEM_DETAILS: '/menu/:id',

  // Protected customer routes
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_TRACKING: '/orders/:id',

  // Admin routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_MENU: '/admin/menu',
  ADMIN_REPORTS: '/admin/reports',
};

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'hungerwood_token',
  USER_DATA: 'hungerwood_user',
  CART: 'hungerwood_cart',
};

// Billing & Pricing Constants
export const BILLING = {
  TAX_RATE: 0, // 5%
  PACKAGING_FEE: 0, // ₹20
  DELIVERY_FEE: 0, // ₹40
  MIN_ORDER_AMOUNT: 50, // Minimum order amount
  MAX_WALLET_USAGE_PERCENT: 50, // Maximum 50% of order can be paid via wallet
};
