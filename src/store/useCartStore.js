import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LOCAL_STORAGE_KEYS } from '@utils/constants';
import { calculateCartTotal, calculateCartTotalWithOutDiscount } from '@utils/helpers';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      totalPriceWithOutDiscount: 0,
      addItem: item => {
        const { items } = get();
        const existingItemIndex = items.findIndex(i => i.id === item.id);

        let updatedItems;
        if (existingItemIndex > -1) {
          // Item exists, update quantity
          updatedItems = items.map((i, index) =>
            index === existingItemIndex ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          // New item, add to cart
          updatedItems = [...items, { ...item, quantity: 1 }];
        }

        const totalItems = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
        const totalPrice = calculateCartTotal(updatedItems);
        const totalPriceWithOutDiscount = calculateCartTotalWithOutDiscount(updatedItems);
        set({
          items: updatedItems,
          totalItems,
          totalPrice,
          totalPriceWithOutDiscount,
        });
      },

      removeItem: itemId => {
        const { items } = get();
        const updatedItems = items.filter(item => item.id !== itemId);
        const totalItems = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
        const totalPrice = calculateCartTotal(updatedItems);
        const totalPriceWithOutDiscount = calculateCartTotalWithOutDiscount(updatedItems);

        set({
          items: updatedItems,
          totalItems,
          totalPrice,
          totalPriceWithOutDiscount,
        });
      },

      updateQuantity: (itemId, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const updatedItems = items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );

        const totalItems = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
        const totalPrice = calculateCartTotal(updatedItems);
        const totalPriceWithOutDiscount = calculateCartTotalWithOutDiscount(updatedItems);
        set({
          items: updatedItems,
          totalItems,
          totalPrice,
          totalPriceWithOutDiscount,
        });
      },

      incrementQuantity: itemId => {
        const { items } = get();
        const item = items.find(i => i.id === itemId);
        if (item) {
          get().updateQuantity(itemId, item.quantity + 1);
        }
      },

      decrementQuantity: itemId => {
        const { items } = get();
        const item = items.find(i => i.id === itemId);
        if (item && item.quantity > 1) {
          get().updateQuantity(itemId, item.quantity - 1);
        } else if (item && item.quantity === 1) {
          get().removeItem(itemId);
        }
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },

      getItemQuantity: itemId => {
        const { items } = get();
        const item = items.find(i => i.id === itemId);
        return item ? item.quantity : 0;
      },

      isItemInCart: itemId => {
        const { items } = get();
        return items.some(i => i.id === itemId);
      },
    }),
    {
      name: LOCAL_STORAGE_KEYS.CART,
    }
  )
);

export default useCartStore;
