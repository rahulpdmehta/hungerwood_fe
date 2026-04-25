import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo_1.jpeg'],
      manifest: {
        name: 'HungerWood - Food Ordering',
        short_name: 'HungerWood',
        description: 'Order delicious food online',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/logo_1.jpeg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: '/logo_1.jpeg',
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/_/, /^\/sw\.js/, /^\/workbox-/],
        // Match the API regardless of host — local dev uses 192.168.1.2:5001,
        // staging the Vercel preview, prod the Vercel prod alias. Workbox sees
        // the path on the URL object so we just check pathname.
        runtimeCaching: [
          // Static catalog endpoints — cache hard, refresh in the background.
          {
            urlPattern: ({ url, request }) =>
              request.method === 'GET' &&
              /\/api\/(menu(\/items|\/categories)?|banners\/active|photos|grocery\/categories|grocery\/settings|grocery\/bundles|restaurant\/status|versions)(\?|$|\/)/.test(url.pathname),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'hw-static-api',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 }, // 1h
              cacheableResponse: { statuses: [200] },
            },
          },

          // Public grocery products list — large but slow-changing.
          {
            urlPattern: ({ url, request }) =>
              request.method === 'GET' &&
              /\/api\/grocery\/products(\?|$|\/)/.test(url.pathname),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'hw-grocery-products',
              expiration: { maxEntries: 30, maxAgeSeconds: 10 * 60 }, // 10m
              cacheableResponse: { statuses: [200] },
            },
          },

          // User-specific reads — keep fresh, but tolerate brief offline.
          {
            urlPattern: ({ url, request }) =>
              request.method === 'GET' &&
              /\/api\/(orders|wallet|grocery\/orders|grocery\/me|addresses)(\?|$|\/)/.test(url.pathname),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'hw-user-api',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 60, maxAgeSeconds: 30 },
              cacheableResponse: { statuses: [200] },
            },
          },

          // App shell / pages.
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'hw-pages',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [200] },
            },
          },
          // Anything else (auth, payment, admin) is intentionally NOT cached
          // — those endpoints either mutate state or carry sensitive
          // per-user data, and a stale response is worse than a network hit.
        ],
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@store': path.resolve(__dirname, './src/store'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@config': path.resolve(__dirname, './src/config')
    }
  },
  server: {
    host: true,        // 0.0.0.0 — needed so phones/tablets on the same Wi-Fi
                       // can reach the dev server. Vite still prints both
                       // Local: + Network: URLs on startup.
    port: 3000,
    strictPort: true,  // Fail loudly if port 3000 is taken instead of silently
                       // shifting to 3001 (the backend CORS allowlist + the
                       // .env.local file both assume 3000).
    open: true,
  }
});
