import { useState, useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useVersionChecker } from '@hooks/useVersionChecker';
import AppRoutes from '@/routes/AppRoutes';
import SplashScreen from '@components/common/SplashScreen';
import RestaurantStatusBanner from '@components/common/RestaurantStatusBanner';
import useAuthStore from '@store/useAuthStore';
import useRestaurantStore from '@store/useRestaurantStore';
import { AnimationProvider } from '@/contexts/AnimationContext';
import AnimationContainer from '@components/animations/AnimationContainer';
import { menuService } from '@services/menu.service';
import { menuKeys } from '@utils/queryKeys';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { isOpen, closingMessage, fetchStatus } = useRestaurantStore();
  const [showSplash, setShowSplash] = useState(true);
  const [isReady, setIsReady] = useState(false);
  
  // Version checker - runs globally to detect data changes and invalidate cache
  useVersionChecker();

  // Fetch restaurant status on app load
  useEffect(() => {
    if (isReady) {
      fetchStatus();
      // Refresh status every 30 seconds
      const interval = setInterval(() => {
        fetchStatus();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isReady, fetchStatus]);

  useEffect(() => {
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem('splashShown');

    if (splashShown === 'true') {
      // If already shown, skip splash
      setShowSplash(false);
      setIsReady(true);
    }

  }, []);

  useEffect(() => {
    // After splash is done and app is ready, check authentication
    if (isReady && !showSplash) {
      const currentPath = window.location.pathname;

      // Don't redirect if already on login page or public pages
      const publicPaths = ['/login', '/menu'];
      const isPublicPath = publicPaths.some(path => currentPath.startsWith(path));

      if (!isAuthenticated && !isPublicPath) {
        navigate('/login', { replace: true });
      }

      if (window.location.pathname === '/home' || window.location.pathname === '/' || window.location.pathname === '/menu') {
        //document.body.classList.add('no-floating-cart');
      } else {
        document.body.classList.remove('no-floating-cart');
      }
    }
  }, [isReady, showSplash, isAuthenticated, navigate]);

  const handleSplashFinish = () => {
    // Mark splash as shown for this session
    sessionStorage.setItem('splashShown', 'true');

    // Prefetch menu data for better UX
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    queryClient.prefetchQuery({
      queryKey: menuKeys.items(),
      queryFn: async () => {
        const response = await menuService.getAllItems();
        return response?.data || response || [];
      },
      staleTime: oneDay, // Cache for entire day
    });

    queryClient.prefetchQuery({
      queryKey: menuKeys.categories(),
      queryFn: async () => {
        const response = await menuService.getCategories();
        return response?.data || response || [];
      },
      staleTime: oneDay, // Cache for entire day
    });

    // Add fade out animation
    setShowSplash(false);
    setTimeout(() => {
      setIsReady(true);
    }, 300);
  };

  // Show splash screen
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Show main app after splash
  if (!isReady) {
    return null;
  }

  // Check if we're on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="animate-fadeIn">
      {/* Show banner only on customer routes when restaurant is closed */}
      {/* {!isAdminRoute && !isOpen && (
        <RestaurantStatusBanner closingMessage={closingMessage} />
      )} */}
      <AppRoutes />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimationProvider>
        <AppContent />
        <AnimationContainer />
      </AnimationProvider>
    </BrowserRouter>
  );
}

export default App;
