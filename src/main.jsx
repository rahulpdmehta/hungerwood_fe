import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import './styles/globals.css';

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
