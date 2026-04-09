import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Admin Pages
import Dashboard from '@pages/admin/Dashboard';
import Categories from '../pages/admin/Categories';
import AdminMenu from '@pages/admin/Menu';
import AdminOrders from '@pages/admin/Orders';
import AdminUsers from '@pages/admin/Users';
import AdminBanners from '@pages/admin/Banners';
import AdminPhotos from '@pages/admin/Photos';
import Reports from '@pages/admin/Reports';
import Settings from '@pages/admin/Settings';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute requireAdmin>
            <Navigate to="/admin/dashboard" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requireAdmin>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute requireAdmin>
            <Categories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu"
        element={
          <ProtectedRoute requireAdmin>
            <AdminMenu />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute requireAdmin>
            <AdminOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute requireAdmin>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/banners"
        element={
          <ProtectedRoute requireAdmin>
            <AdminBanners />
          </ProtectedRoute>
        }
      />
      <Route
        path="/photos"
        element={
          <ProtectedRoute requireAdmin>
            <AdminPhotos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute requireAdmin>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute requireAdmin>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
