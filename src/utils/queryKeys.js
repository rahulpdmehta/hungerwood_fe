/**
 * Centralized query keys for React Query
 * Ensures consistency across the application
 */

export const menuKeys = {
  all: ['menu'],
  items: () => [...menuKeys.all, 'items'],
  item: (id) => [...menuKeys.all, 'item', id],
  categories: () => [...menuKeys.all, 'categories'],
  version: () => [...menuKeys.all, 'version'],
};

export const bannerKeys = {
  all: ['banners'],
  active: () => [...bannerKeys.all, 'active'],
  list: (includeDisabled) => [...bannerKeys.all, 'list', includeDisabled],
  detail: (id) => [...bannerKeys.all, 'detail', id],
};

export const walletKeys = {
  all: ['wallet'],
  balance: () => [...walletKeys.all, 'balance'],
  transactions: (params) => [...walletKeys.all, 'transactions', params],
  summary: () => [...walletKeys.all, 'summary'],
  referralCode: () => [...walletKeys.all, 'referral', 'code'],
};

export const orderKeys = {
  all: ['orders'],
  my: () => [...orderKeys.all, 'my'],
  detail: (id) => [...orderKeys.all, 'detail', id],
  track: (id) => [...orderKeys.all, 'track', id],
  admin: (params) => [...orderKeys.all, 'admin', params],
  stats: (params) => [...orderKeys.all, 'stats', params],
};
