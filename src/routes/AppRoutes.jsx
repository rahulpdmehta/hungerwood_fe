import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoutes from './AdminRoutes';

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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/complete-profile" element={<ProfileCompletion />} />
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/menu/:id" element={<ItemDetails />} />

      {/* Protected Customer Routes */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <OrderTracking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/addresses"
        element={
          <ProtectedRoute>
            <Addresses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        }
      />
      <Route
        path="/referral"
        element={
          <ProtectedRoute>
            <Referral />
          </ProtectedRoute>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <ProtectedRoute>
            <PrivacyPolicy />
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <Help />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/about-us"
        element={<AboutUs />}
      />

      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* 404 Not Found */}
      <Route 
        path="*" 
        element={
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
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
