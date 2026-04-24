import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

// Create a QueryClient with production-ready defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default stale time: 5 minutes (data considered fresh)
      staleTime: 5 * 60 * 1000,
      // Default cache time: 10 minutes (data kept in cache after unmount)
      gcTime: 10 * 60 * 1000,
      // Retry failed requests once
      retry: 1,
      // Don't refetch on window focus by default (can be overridden per query)
      refetchOnWindowFocus: false,
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
