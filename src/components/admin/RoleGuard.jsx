import { Navigate } from 'react-router-dom';
import useAuthStore from '@store/useAuthStore';

export default function RoleGuard({ allow = [], children }) {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (user?.role === 'SUPER_ADMIN') return children;
  if (!allow.includes(user?.role)) return <Navigate to="/admin" replace />;
  return children;
}
