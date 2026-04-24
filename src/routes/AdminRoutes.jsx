import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleGuard from '@components/admin/RoleGuard';

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
import AdminSuperUsers from '@pages/admin/super/Users';
import GroceryDashboard from '@pages/admin/grocery/Dashboard';
import GroceryCategories from '@pages/admin/grocery/Categories';
import GroceryProducts from '@pages/admin/grocery/Products';
import GroceryOrders from '@pages/admin/grocery/Orders';
import GrocerySettings from '@pages/admin/grocery/Settings';
import GroceryBanners from '@pages/admin/grocery/Banners';
import GroceryCouponsAdmin from '@pages/admin/grocery/Coupons';
import GroceryBundlesAdmin from '@pages/admin/grocery/Bundles';

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
      <Route
        path="/super/users"
        element={
          <ProtectedRoute requireAdmin>
            <RoleGuard allow={['SUPER_ADMIN']}>
              <AdminSuperUsers />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/grocery"
        element={
          <ProtectedRoute requireAdmin>
            <RoleGuard allow={['GROCERY_ADMIN']}>
              <GroceryDashboard />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/grocery/categories"
        element={
          <ProtectedRoute requireAdmin>
            <RoleGuard allow={['GROCERY_ADMIN']}>
              <GroceryCategories />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/grocery/products"
        element={
          <ProtectedRoute requireAdmin>
            <RoleGuard allow={['GROCERY_ADMIN']}>
              <GroceryProducts />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/grocery/orders"
        element={
          <ProtectedRoute requireAdmin>
            <RoleGuard allow={['GROCERY_ADMIN']}>
              <GroceryOrders />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/grocery/settings"
        element={
          <ProtectedRoute requireAdmin>
            <RoleGuard allow={['GROCERY_ADMIN']}>
              <GrocerySettings />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/grocery/banners"
        element={
          <ProtectedRoute requireAdmin>
            <RoleGuard allow={['GROCERY_ADMIN']}>
              <GroceryBanners />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/grocery/coupons"
        element={
          <ProtectedRoute requireAdmin>
            <RoleGuard allow={['GROCERY_ADMIN']}>
              <GroceryCouponsAdmin />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/grocery/bundles"
        element={
          <ProtectedRoute requireAdmin>
            <RoleGuard allow={['GROCERY_ADMIN']}>
              <GroceryBundlesAdmin />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
