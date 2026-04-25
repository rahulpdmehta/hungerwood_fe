import { Link, useLocation } from 'react-router-dom';
import useCartStore from '@store/useCartStore';
import useGroceryCartStore from '@store/useGroceryCartStore';

// Flipkart-style quick-access strip showing the two HungerWood sections.
// The tile matching the current route is rendered in its brand "active"
// state (filled background + ring); the other is "inactive" (white,
// muted). Cart badges still reflect each section's cart count regardless.
const SectionTilesStrip = () => {
  const { pathname } = useLocation();
  const isGrocery = pathname.startsWith('/grocery');
  const isRestaurantActive = !isGrocery;
  const isGroceryActive = isGrocery;

  const foodCount = useCartStore(s => s.totalItems);
  const groceryCount = useGroceryCartStore(s => s.totalItems);

  const restaurantClasses = isRestaurantActive
    ? 'bg-[#7f4f13]/10 dark:bg-[#7f4f13]/20 border-[#7f4f13] ring-2 ring-[#7f4f13]/20 shadow-md'
    : 'bg-white dark:bg-[#2d221a] border-gray-200 dark:border-gray-700 shadow-sm opacity-90';
  const restaurantIconBg = isRestaurantActive ? 'bg-[#7f4f13]' : 'bg-[#7f4f13]/10 dark:bg-[#7f4f13]/20';
  const restaurantIconColor = isRestaurantActive ? 'text-white' : 'text-[#7f4f13] dark:text-[#d4a676]';
  const restaurantLabelColor = isRestaurantActive
    ? 'text-[#7f4f13] dark:text-[#d4a676]'
    : 'text-gray-500 dark:text-gray-400';

  const groceryClasses = isGroceryActive
    ? 'bg-green-50 dark:bg-green-900/20 border-green-600 ring-2 ring-green-600/20 shadow-md'
    : 'bg-white dark:bg-[#2d221a] border-gray-200 dark:border-gray-700 shadow-sm opacity-90';
  const groceryIconBg = isGroceryActive ? 'bg-green-600' : 'bg-green-100 dark:bg-green-900/30';
  const groceryIconColor = isGroceryActive ? 'text-white' : 'text-green-700 dark:text-green-300';
  const groceryLabelColor = isGroceryActive
    ? 'text-green-700 dark:text-green-300'
    : 'text-gray-500 dark:text-gray-400';

  return (
    <div className="px-4 pt-3">
      <div className="flex gap-3">
        <Link
          to="/"
          className={`relative flex-1 flex flex-col items-center justify-center h-20 rounded-xl border-2 transition-all ${restaurantClasses}`}
          aria-current={isRestaurantActive ? 'page' : undefined}
        >
          <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-1 ${restaurantIconBg}`}>
            <span className={`material-symbols-outlined ${restaurantIconColor}`} style={{ fontSize: 20 }}>
              restaurant
            </span>
          </div>
          <span className={`text-2xs font-bold leading-none ${restaurantLabelColor}`}>Restaurant</span>
          {foodCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#7f4f13] text-white text-2xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {foodCount}
            </span>
          )}
        </Link>

        <Link
          to="/grocery"
          className={`relative flex-1 flex flex-col items-center justify-center h-20 rounded-xl border-2 transition-all ${groceryClasses}`}
          aria-current={isGroceryActive ? 'page' : undefined}
        >
          <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-1 ${groceryIconBg}`}>
            <span className={`material-symbols-outlined ${groceryIconColor}`} style={{ fontSize: 20 }}>
              shopping_basket
            </span>
          </div>
          <span className={`text-2xs font-bold leading-none ${groceryLabelColor}`}>Grocery</span>
          {groceryCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-2xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {groceryCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default SectionTilesStrip;
