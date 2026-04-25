import { Navigate } from 'react-router-dom';
import useAuthStore from '@store/useAuthStore';

const ADMIN_ROLES = ['SUPER_ADMIN', 'RESTAURANT_ADMIN', 'GROCERY_ADMIN'];

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !ADMIN_ROLES.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
