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

      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* 404 Not Found */}
      <Route path="*" element={<div className="text-center mt-20 text-2xl">Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
