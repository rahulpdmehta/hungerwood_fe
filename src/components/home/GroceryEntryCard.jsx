import { Link } from 'react-router-dom';
import useCartStore from '@store/useCartStore';
import useGroceryCartStore from '@store/useGroceryCartStore';

// Flipkart-style quick-access strip showing the two HungerWood sections.
// "Restaurant" takes the user to the food menu; "Grocery" takes the user to
// the grocery store home. Cart badges flip between sections.
const SectionTilesStrip = () => {
  const foodCount = useCartStore(s => s.totalItems);
  const groceryCount = useGroceryCartStore(s => s.totalItems);

  return (
    <div className="px-4 pt-3">
      <div className="flex gap-3">
        <Link
          to="/menu"
          className="relative flex-1 flex flex-col items-center justify-center h-20 rounded-xl bg-white dark:bg-[#2d221a] border-2 border-[#7f4f13]/20 dark:border-[#7f4f13]/40 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-9 h-9 rounded-full bg-[#7f4f13]/10 dark:bg-[#7f4f13]/20 flex items-center justify-center mb-1">
            <span className="material-symbols-outlined text-[#7f4f13] dark:text-[#d4a676]" style={{ fontSize: 20 }}>
              restaurant
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#181411] dark:text-white leading-none">Restaurant</span>
          {foodCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#7f4f13] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {foodCount}
            </span>
          )}
        </Link>

        <Link
          to="/grocery"
          className="relative flex-1 flex flex-col items-center justify-center h-20 rounded-xl bg-white dark:bg-[#2d221a] border-2 border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-1">
            <span className="material-symbols-outlined text-green-700 dark:text-green-300" style={{ fontSize: 20 }}>
              shopping_basket
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#181411] dark:text-white leading-none">Grocery</span>
          {groceryCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {groceryCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default SectionTilesStrip;
