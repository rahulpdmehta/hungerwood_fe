import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '@store/useAuthStore';
import useCartStore from '@store/useCartStore';
import { APP_NAME } from '@utils/constants';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { totalItems } = useCartStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo_1.jpeg" alt={APP_NAME} className="h-10 w-10 rounded-full" />
            <span className="text-2xl font-bold text-primary-600">{APP_NAME}</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Home
            </Link>
            <Link
              to="/menu"
              className="text-gray-700 hover:text-primary-600 font-medium transition"
            >
              Menu
            </Link>
            {isAuthenticated && (
              <Link
                to="/orders"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
              >
                Orders
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <svg
                className="w-6 h-6 text-gray-700 hover:text-primary-600 transition"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700 hidden sm:block">
                  Hi, {user?.name || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-lg transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
