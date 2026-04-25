import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import App from './App.jsx';
import './styles/globals.css';

// Reveal Material Symbols icons only once the font is loaded (or after a 3s
// safety timeout so icons never stay hidden forever on a flaky network). CSS
// keeps .material-symbols-outlined invisible until this class is applied.
const revealIcons = () => document.documentElement.classList.add('fonts-loaded');
if (typeof document !== 'undefined' && document.fonts && typeof document.fonts.load === 'function') {
  Promise.race([
    document.fonts.load('24px "Material Symbols Outlined"'),
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ]).finally(revealIcons);
} else {
  revealIcons();
}

// Bump this when the data shape changes — the persisted cache is dropped
// (the version is part of the storage buster). Bumped automatically when
// the build hash changes via __APP_VERSION__ defined below.
const CACHE_BUSTER = '1';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // gcTime must be ≥ persist maxAge so data isn't evicted before persist
      // gets a chance to write it.
      staleTime: 5 * 60 * 1000,        // 5 min
      gcTime: 24 * 60 * 60 * 1000,     // 24 h — needed for persistence
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  key: 'hw-rq-cache',
  // Skip persisting any error state to avoid replaying a bad response.
  serialize: (data) => JSON.stringify(data),
  deserialize: (str) => JSON.parse(str),
  throttleTime: 1000,
});

// Don't persist queries that are personal/auth-bound or that hold money/order
// data — better to refetch those fresh on reload.
const shouldPersistQuery = (query) => {
  const key = JSON.stringify(query.queryKey).toLowerCase();
  if (
    key.includes('order') ||
    key.includes('wallet') ||
    key.includes('me') ||
    key.includes('admin')
  ) {
    return false;
  }
  return query.state.status === 'success';
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000, // 24h
        buster: CACHE_BUSTER,
        dehydrateOptions: { shouldDehydrateQuery: shouldPersistQuery },
      }}
    >
      <App />
    </PersistQueryClientProvider>
  </React.StrictMode>
);
