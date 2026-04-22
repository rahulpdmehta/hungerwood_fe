import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ProtectedRoute from './ProtectedRoute';
import AdminRoutes from './AdminRoutes';
import PageTransition from '@components/common/PageTransition';

// Auth Pages
import Login from '@pages/auth/Login';
import ProfileCompletion from '@pages/auth/ProfileCompletion';

// Customer Pages
import Home from '@pages/customer/Home';
import Menu from '@pages/customer/Menu';
import ItemDetails from '@pages/customer/ItemDetails';
import Cart from '@pages/customer/Cart';
import Checkout from '@pages/customer/Checkout';
import Orders from '@pages/customer/Orders';
import OrderTracking from '@pages/customer/OrderTracking';
import Profile from '@pages/customer/Profile';
import Addresses from '@pages/customer/Addresses';
import EditProfile from '@pages/customer/EditProfile';
import Wallet from '@pages/customer/Wallet';
import Referral from '@pages/customer/Referral';
import PrivacyPolicy from '@pages/customer/PrivacyPolicy';
import Help from '@pages/customer/Help';
import Settings from '@pages/customer/Settings';
import AboutUs from '@pages/customer/AboutUs';
import GroceryHome from '@pages/customer/grocery/Home';
import GroceryCategory from '@pages/customer/grocery/Category';
import GroceryProductDetail from '@pages/customer/grocery/ProductDetail';

const Animated = ({ children }) => <PageTransition>{children}</PageTransition>;

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login" element={<Animated><Login /></Animated>} />
        <Route path="/complete-profile" element={<Animated><ProfileCompletion /></Animated>} />
        <Route path="/" element={<Animated><Home /></Animated>} />
        <Route path="/menu" element={<Animated><Menu /></Animated>} />
        <Route path="/menu/:id" element={<Animated><ItemDetails /></Animated>} />
        <Route path="/grocery" element={<Animated><GroceryHome /></Animated>} />
        <Route path="/grocery/c/:slug" element={<Animated><GroceryCategory /></Animated>} />
        <Route path="/grocery/p/:id" element={<Animated><GroceryProductDetail /></Animated>} />

        {/* Protected Customer Routes */}
        <Route path="/cart" element={<Animated><Cart /></Animated>} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Animated><Checkout /></Animated>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Animated><Orders /></Animated>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <Animated><OrderTracking /></Animated>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Animated><Profile /></Animated>
            </ProtectedRoute>
          }
        />
        <Route
          path="/addresses"
          element={
            <ProtectedRoute>
              <Animated><Addresses /></Animated>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <Animated><EditProfile /></Animated>
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <Animated><Wallet /></Animated>
            </ProtectedRoute>
          }
        />
        <Route
          path="/referral"
          element={
            <ProtectedRoute>
              <Animated><Referral /></Animated>
            </ProtectedRoute>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <ProtectedRoute>
              <Animated><PrivacyPolicy /></Animated>
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <Animated><Help /></Animated>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Animated><Settings /></Animated>
            </ProtectedRoute>
          }
        />
        <Route
          path="/about-us"
          element={<Animated><AboutUs /></Animated>}
        />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* 404 Not Found */}
        <Route
          path="*"
          element={
            <Animated>
              <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f7f6] dark:bg-[#211811] p-4">
                <div className="text-center max-w-md">
                  <h1 className="text-4xl font-bold text-[#7f4f13] dark:text-[#d4a574] mb-4">404</h1>
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Page Not Found</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    The page you're looking for doesn't exist or has been moved.
                  </p>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="bg-[#7f4f13] hover:bg-[#7f4f13]/90 text-white font-bold py-3 px-6 rounded-xl transition-all"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            </Animated>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
