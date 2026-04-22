import { Link } from 'react-router-dom';
import { Utensils, ShoppingBasket } from 'lucide-react';
import useCartStore from '@store/useCartStore';
import useGroceryCartStore from '@store/useGroceryCartStore';
import useWalletStore from '@store/useWalletStore';
import useAuthStore from '@store/useAuthStore';

export default function SectionPicker() {
  const { totalItems: foodItems } = useCartStore();
  const { totalItems: groceryItems } = useGroceryCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const { balance } = useWalletStore();

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] px-4 pt-6 pb-20 max-w-md mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-[#181411] dark:text-white">HungerWood</h1>
        <p className="text-[10px] text-[#7f4f13] font-bold uppercase tracking-widest mt-1">Gaya, Bihar</p>
      </header>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <Link
          to="/menu"
          className="relative bg-white dark:bg-[#2d221a] rounded-2xl shadow-md border-2 border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#7f4f13]/10 flex items-center justify-center">
              <Utensils className="text-[#7f4f13]" size={28} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">Food</h2>
              <p className="text-sm text-gray-500">Restaurant menu, cooked fresh</p>
            </div>
            {foodItems > 0 && (
              <span className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full">{foodItems}</span>
            )}
          </div>
        </Link>

        <Link
          to="/grocery"
          className="relative bg-white dark:bg-[#2d221a] rounded-2xl shadow-md border-2 border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <ShoppingBasket className="text-green-700" size={28} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">Grocery</h2>
              <p className="text-sm text-gray-500">Atta, dal, snacks, and more</p>
            </div>
            {groceryItems > 0 && (
              <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">{groceryItems}</span>
            )}
          </div>
        </Link>
      </div>

      {isAuthenticated && (
        <div className="bg-white dark:bg-[#2d221a] rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Hi, {user?.name || 'there'}</span>
            <Link to="/orders" className="text-[#7f4f13] font-semibold">My Orders →</Link>
          </div>
          {balance > 0 && (
            <div className="mt-2 text-xs text-gray-500">Wallet balance: ₹{balance}</div>
          )}
        </div>
      )}
    </div>
  );
}
