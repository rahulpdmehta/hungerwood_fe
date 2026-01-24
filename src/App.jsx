import { useState, useEffect } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import SplashScreen from '@components/common/SplashScreen';
import useAuthStore from '@store/useAuthStore';
import { AnimationProvider } from '@/contexts/AnimationContext';
import AnimationContainer from '@components/animations/AnimationContainer';

function AppContent() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);
  const [isReady, setIsReady] = useState(false);

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

  return (
    <div className="animate-fadeIn">
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
