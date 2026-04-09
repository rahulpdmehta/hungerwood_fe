import { create } from 'zustand';

/**
 * Menu Store - UI State Only
 * 
 * This store now only manages UI state (filtering, search).
 * Data fetching is handled by React Query hooks.
 * 
 * Note: This store is kept for backward compatibility with CategoryTabs component.
 * Consider migrating CategoryTabs to use local state or props instead.
 */
const useMenuStore = create((set) => ({
  // UI State only - no data fetching
  selectedCategory: 'All',
  searchQuery: '',

  // Simple setters for UI state
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // Legacy methods for backward compatibility
  filterByCategory: (category) => set({ selectedCategory: category }),
  searchItems: (query) => set({ searchQuery: query }),
  
  reset: () => set({ selectedCategory: 'All', searchQuery: '' }),
}));

export default useMenuStore;
