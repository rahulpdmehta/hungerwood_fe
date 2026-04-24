import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LOCAL_STORAGE_KEYS } from '@utils/constants';

/**
 * Grocery cart — separate from the food cart. Each item references a specific
 * (productId, variantId) pair. Quantity is managed independently.
 */

const itemKey = (item) => `${item.productId}:${item.variantId}`;

const recomputeTotals = (items) => {
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.sellingPrice * i.quantity, 0);
  const mrpTotal = items.reduce((s, i) => s + i.mrp * i.quantity, 0);
  const savings = mrpTotal - subtotal;
  return { totalItems, subtotal, mrpTotal, savings };
};

const useGroceryCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      subtotal: 0,
      mrpTotal: 0,
      savings: 0,
      coupon: null, // { code, discount, freeDelivery, type, theme }

      addItem: (input) => {
        // input: { productId, variantId, name, variantLabel, mrp, sellingPrice, image }
        const items = get().items;
        const key = itemKey(input);
        const idx = items.findIndex(i => itemKey(i) === key);
        let next;
        if (idx > -1) {
          next = items.map((i, k) => k === idx ? { ...i, quantity: i.quantity + 1 } : i);
        } else {
          next = [...items, { ...input, quantity: 1 }];
        }
        set({ items: next, ...recomputeTotals(next) });
      },

      removeItem: (productId, variantId) => {
        const items = get().items.filter(i => !(i.productId === productId && i.variantId === variantId));
        set({ items, ...recomputeTotals(items) });
      },

      incrementQuantity: (productId, variantId) => {
        const items = get().items.map(i =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
        set({ items, ...recomputeTotals(items) });
      },

      decrementQuantity: (productId, variantId) => {
        const items = get().items;
        const item = items.find(i => i.productId === productId && i.variantId === variantId);
        if (!item) return;
        if (item.quantity <= 1) {
          get().removeItem(productId, variantId);
          return;
        }
        const next = items.map(i =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );
        set({ items: next, ...recomputeTotals(next) });
      },

      getQuantity: (productId, variantId) => {
        const item = get().items.find(i => i.productId === productId && i.variantId === variantId);
        return item ? item.quantity : 0;
      },

      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      clearCart: () => set({ items: [], totalItems: 0, subtotal: 0, mrpTotal: 0, savings: 0, coupon: null }),
    }),
    { name: LOCAL_STORAGE_KEYS.GROCERY_CART }
  )
);

export default useGroceryCartStore;
