import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { menuService } from '@services/menu.service';

// Cache duration: 5 minutes (in milliseconds)
const CACHE_DURATION = 5 * 60 * 1000;

const useMenuStore = create(
  persist(
    (set, get) => ({
      categories: [],
      items: [],
      filteredItems: [],
      selectedCategory: 'All',
      searchQuery: '',
      loading: false,
      error: null,

      // Cache timestamps
      categoriesLastFetch: null,
      itemsLastFetch: null,

      // Version tracking
      version: null,
      lastServerCheck: null,

      // Check if cache is still valid
      isCacheValid: (lastFetchTime) => {
        if (!lastFetchTime) return false;
        const now = Date.now();
        return now - lastFetchTime < CACHE_DURATION;
      },

      // Fetch categories with caching
      fetchCategories: async (force = false) => {
        const { categories, categoriesLastFetch, isCacheValid } = get();

        // Return cached data if valid and not forced
        if (!force && categories.length > 0 && isCacheValid(categoriesLastFetch)) {
          console.log('📦 Using cached categories');
          return categories;
        }

        console.log('🔄 Fetching fresh categories from API');
        set({ loading: true, error: null });

        try {
          const response = await menuService.getCategories();
          const fetchedCategories = response.data || [];

          set({
            categories: fetchedCategories,
            categoriesLastFetch: Date.now(),
            loading: false,
          });

          return fetchedCategories;
        } catch (error) {
          console.error('Failed to fetch categories:', error);
          set({ error: error.message, loading: false });
          return categories; // Return cached data on error
        }
      },

      // Fetch items with caching
      fetchItems: async (force = false) => {
        const { items, itemsLastFetch, isCacheValid } = get();

        // Return cached data if valid and not forced
        if (!force && items.length > 0 && isCacheValid(itemsLastFetch)) {
          console.log('📦 Using cached menu items');
          return items;
        }

        console.log('🔄 Fetching fresh menu items from API');
        set({ loading: true, error: null });

        try {
          const response = await menuService.getAllItems();
          const fetchedItems = response.data || [];

          set({
            items: fetchedItems,
            filteredItems: fetchedItems,
            itemsLastFetch: Date.now(),
            loading: false,
          });

          return fetchedItems;
        } catch (error) {
          console.error('Failed to fetch menu items:', error);
          set({ error: error.message, loading: false });
          return items; // Return cached data on error
        }
      },

      // Check for menu updates (lightweight)
      checkForUpdates: async () => {
        try {
          const response = await menuService.getVersion();
          const serverVersion = response.data.version;
          const currentVersion = get().version;

          set({ lastServerCheck: Date.now() });

          if (!currentVersion) {
            // First time, save version
            set({ version: serverVersion });
            return true; // Force fetch on first load
          }

          if (serverVersion !== currentVersion) {
            console.log('📢 Menu updates available');
            return true;
          }

          console.log('✅ Menu is up to date');
          return false;
        } catch (error) {
          console.error('Failed to check menu version:', error);
          return false;
        }
      },

      // Smart fetch with version check
      fetchItemsSmart: async () => {
        const hasUpdates = await get().checkForUpdates();

        if (hasUpdates) {
          console.log('🔄 Fetching updated menu items');
          const items = await get().fetchItems(true);

          // Update version after successful fetch
          const versionResponse = await menuService.getVersion();
          set({ version: versionResponse.data.version });

          return items;
        }

        // Use cached data if no updates
        return get().fetchItems(false);
      },

      // Force refresh both categories and items
      refreshMenuData: async () => {
        console.log('🔄 Manual refresh triggered');
        const items = await get().fetchItems(true);
        const versionResponse = await menuService.getVersion();
        set({ version: versionResponse.data.version });
        return items;
      },

      setCategories: categories => {
        set({ categories, categoriesLastFetch: Date.now() });
      },

      setItems: items => {
        set({
          items,
          filteredItems: items,
          itemsLastFetch: Date.now(),
        });
      },

      setLoading: loading => {
        set({ loading });
      },

      setError: error => {
        set({ error });
      },

      filterByCategory: category => {
        const { items, searchQuery } = get();
        let filtered = items;

        if (category !== 'All') {
          filtered = filtered.filter(item => item.category === category);
        }

        if (searchQuery) {
          filtered = filtered.filter(
            item =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        set({
          selectedCategory: category,
          filteredItems: filtered,
        });
      },

      searchItems: query => {
        const { items, selectedCategory } = get();
        let filtered = items;

        if (selectedCategory !== 'All') {
          filtered = filtered.filter(item => item.category === selectedCategory);
        }

        if (query) {
          filtered = filtered.filter(
            item =>
              item.name.toLowerCase().includes(query.toLowerCase()) ||
              item.description.toLowerCase().includes(query.toLowerCase())
          );
        }

        set({
          searchQuery: query,
          filteredItems: filtered,
        });
      },

      getItemById: itemId => {
        const { items } = get();
        return items.find(item => item.id === itemId);
      },

      reset: () => {
        set({
          selectedCategory: 'All',
          searchQuery: '',
          filteredItems: get().items,
        });
      },

      // Clear cache (useful for logout or manual refresh)
      clearCache: () => {
        set({
          categories: [],
          items: [],
          filteredItems: [],
          categoriesLastFetch: null,
          itemsLastFetch: null,
        });
      },
    }),
    {
      name: 'hungerwood-menu-store', // localStorage key
      partialPersist: (state) => ({
        // Only persist menu data, not UI state
        categories: state.categories,
        items: state.items,
        categoriesLastFetch: state.categoriesLastFetch,
        itemsLastFetch: state.itemsLastFetch,
        version: state.version,
      }),
    }
  )
);

export default useMenuStore;
