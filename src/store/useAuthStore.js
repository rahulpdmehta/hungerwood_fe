import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LOCAL_STORAGE_KEYS } from '@utils/constants';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      },

      updateUser: userData => {
        set(state => ({
          user: { ...state.user, ...userData },
        }));
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },

      isCustomer: () => {
        const { user } = get();
        return user?.role === 'customer';
      },
    }),
    {
      name: LOCAL_STORAGE_KEYS.USER_DATA,
      partialize: state => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
