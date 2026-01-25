import { Link, useLocation } from 'react-router-dom';

const BottomNavBar = () => {
    const location = useLocation();

    const navItems = [
        {
            id: 'home',
            path: '/',
            icon: 'home',
            label: 'Home',
        },
        {
            id: 'explore',
            path: '/menu',
            icon: 'search',
            label: 'Explore',
        },
        {
            id: 'orders',
            path: '/orders',
            icon: 'shopping_bag',
            label: 'Orders',
        },
        {
            id: 'profile',
            path: '/profile',
            icon: 'person',
            label: 'Profile',
        },
    ];

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#211811]/90 backdrop-blur-lg border-t border-gray-200 dark:border-white/10 px-6 py-3 flex justify-between items-center z-50">
            {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                    <Link
                        key={item.id}
                        to={item.path}
                        className={`flex flex-col items-center gap-1 ${active ? 'text-[#7f4f13]' : 'text-[#887263]'
                            }`}
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

export default BottomNavBar;
