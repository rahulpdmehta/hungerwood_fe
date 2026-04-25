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
      bundle: null, // { slug, name, discount }

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

      applyBundle: (bundle, items) => {
        // Push bundle items into cart at their per-item sellingPrice; the
        // bundleDiscount line in cart subtracts the savings to land at the
        // bundlePrice. If a (productId, variantId) already exists, increment.
        const current = get().items;
        let merged = [...current];
        for (const it of items || []) {
          const idx = merged.findIndex(x => x.productId === String(it.productId) && x.variantId === String(it.variantId));
          if (idx > -1) {
            merged = merged.map((x, k) => k === idx ? { ...x, quantity: x.quantity + (it.quantity || 1) } : x);
          } else {
            merged = [...merged, {
              productId: String(it.productId),
              variantId: String(it.variantId),
              quantity: it.quantity || 1,
              name: it.name,
              variantLabel: it.variantLabel,
              mrp: it.mrp,
              sellingPrice: it.sellingPrice,
              image: it.image,
            }];
          }
        }
        set({ items: merged, ...recomputeTotals(merged), bundle });
      },
      removeBundle: () => set({ bundle: null }),

      clearCart: () => set({ items: [], totalItems: 0, subtotal: 0, mrpTotal: 0, savings: 0, coupon: null, bundle: null }),
    }),
    {
      name: LOCAL_STORAGE_KEYS.GROCERY_CART,
      version: 1,
      // Bump this and add a migration branch if the cart item shape
      // changes; otherwise dropping the persisted cart is safer than
      // shipping a half-broken checkout to existing users.
      migrate: (persisted, fromVersion) => {
        if (fromVersion === 1) return persisted;
        return { items: [], totalItems: 0, subtotal: 0, mrpTotal: 0, savings: 0, coupon: null, bundle: null };
      },
    }
  )
);

export default useGroceryCartStore;
