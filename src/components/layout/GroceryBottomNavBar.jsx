import { Link, useLocation } from 'react-router-dom';

/**
 * Bottom nav for the grocery storefront. Mirrors the restaurant
 * BottomNavBar layout; only the second slot differs — Menu (/menu) is
 * replaced by Categories (/grocery/categories).
 */
const GroceryBottomNavBar = () => {
  const location = useLocation();

  const navItems = [
    { id: 'home', path: '/grocery', icon: 'home', label: 'Home' },
    { id: 'categories', path: '/grocery/categories', icon: 'category', label: 'Categories' },
    { id: 'orders', path: '/grocery/orders', icon: 'shopping_bag', label: 'Orders' },
    { id: 'profile', path: '/grocery/profile', icon: 'person', label: 'Profile' },
  ];

  const isActive = (path) => {
    // /grocery is the grocery home — only mark active on exact match so the
    // Categories / Orders tabs (which are also under /grocery/...) stay
    // distinct.
    if (path === '/grocery') return location.pathname === '/grocery';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#211811]/90 backdrop-blur-lg border-t border-gray-200 dark:border-white/10 px-6 py-3 pb-5 flex justify-between items-center z-50">
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`flex flex-col items-center gap-1 ${active ? 'text-[#7f4f13]' : 'text-[#887263]'}`}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={active ? { fontVariationSettings: '"FILL" 1' } : {}}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default GroceryBottomNavBar;
