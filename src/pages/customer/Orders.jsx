import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Utensils, ShoppingBasket, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@services/api';
import { useOrders } from '@hooks/useOrderQueries';
import { useMyGroceryOrders } from '@hooks/useGroceryCustomerQueries';
import useGroceryCartStore from '@store/useGroceryCartStore';
import BottomNavBar from '@components/layout/BottomNavBar';
import GroceryBottomNavBar from '@components/layout/GroceryBottomNavBar';
import { SkeletonList } from '@components/common/Skeleton';

export default function Orders({ section }) {
  const isGrocerySection = section === 'grocery';
  const [tab, setTab] = useState(isGrocerySection ? 'grocery' : 'all');
  const [reorderingId, setReorderingId] = useState(null);
  const navigate = useNavigate();
  const addItem = useGroceryCartStore(s => s.addItem);
  const { data: foodOrders = [], isLoading: foodLoading } = useOrders();
  const { data: groceryOrders = [], isLoading: groceryLoading } = useMyGroceryOrders();

  const reorderGrocery = async (orderId) => {
    setReorderingId(orderId);
    try {
      const res = await api.post(`/grocery/orders/${orderId}/reorder`);
      const { added = [], skipped = [] } = res.data?.data || {};
      added.forEach(it => addItem(it));
      if (skipped.length > 0) {
        toast(
          `${added.length} of ${added.length + skipped.length} items added. ${skipped.length} no longer available.`,
          { duration: 4500, icon: 'ℹ️' }
        );
      } else {
        toast.success(`${added.length} items added to cart`);
      }
      navigate('/grocery/cart');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Could not reorder');
    } finally {
      setReorderingId(null);
    }
  };

  const combined = useMemo(() => {
    const food = (foodOrders || []).map(o => ({ ...o, _section: 'food' }));
    const grocery = (groceryOrders || []).map(o => ({ ...o, _section: 'grocery' }));
    return [...food, ...grocery].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [foodOrders, groceryOrders]);

  const filtered = tab === 'food'
    ? combined.filter(o => o._section === 'food')
    : tab === 'grocery'
      ? combined.filter(o => o._section === 'grocery')
      : combined;

  const isLoading = foodLoading || groceryLoading;

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f8f7f6] dark:bg-[#211811]">
      <nav className="sticky top-0 z-50 bg-[#f8f7f6]/80 dark:bg-[#211811]/80 backdrop-blur-md border-b border-[#e5e0dc] dark:border-[#3d2e24]">
        <div className="max-w-md mx-auto">
          <div className="flex items-center p-4 justify-between">
            <Link
              to={isGrocerySection ? '/grocery' : '/'}
              className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft size={20} className="text-[#181411] dark:text-white" />
            </Link>
            <h1 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
              My Orders
            </h1>
          </div>

          {/* Tabs: All | Food | Grocery */}
          <div className="flex items-center gap-6 px-4 pb-3 border-b-2 border-[#e5e0dc] dark:border-[#3d2e24]">
            {[
              { key: 'all', label: 'All' },
              { key: 'food', label: 'Food' },
              { key: 'grocery', label: 'Grocery' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`relative pb-2 text-sm font-semibold transition-colors ${
                  tab === key
                    ? 'text-[#181411] dark:text-white'
                    : 'text-[#887263] dark:text-gray-400'
                }`}
              >
                {label}
                {tab === key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7f4f13]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto pb-20 w-full">
        {isLoading ? (
          <div className="p-4">
            <SkeletonList rows={5} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <span
              className="material-symbols-outlined text-gray-300 dark:text-gray-700 mb-4"
              style={{ fontSize: '120px' }}
            >
              receipt_long
            </span>
            <h2 className="text-2xl font-bold text-[#181411] dark:text-white mb-2">No orders yet</h2>
            <p className="text-[#887263] dark:text-gray-400 mb-6">
              {tab === 'food'
                ? 'Start ordering delicious food from our menu'
                : tab === 'grocery'
                  ? 'Browse our grocery selection to place an order'
                  : 'Start ordering from our menu or grocery store'}
            </p>
            <Link
              to={tab === 'grocery' ? '/grocery' : '/menu'}
              className="bg-[#7f4f13] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#7f4f13]/90 transition-colors"
            >
              {tab === 'grocery' ? 'Browse Grocery' : 'Browse Menu'}
            </Link>
          </div>
        ) : (
          <div className="space-y-2 mt-2 px-4">
            {filtered.map(o => {
              const isFood = o._section === 'food';
              const href = isFood
                ? `/orders/${o.orderId || o._id}`
                : `/grocery/orders/${o.orderId || o._id}`;
              const Icon = isFood ? Utensils : ShoppingBasket;
              const isCompleted = ['delivered', 'completed', 'picked_up'].includes(String(o.status).toLowerCase());
              const showReorder = !isFood && isCompleted;
              return (
                <div
                  key={`${o._section}-${o._id || o.orderId}`}
                  className="flex items-center gap-3 overflow-hidden bg-white dark:bg-gray-900 rounded-lg shadow-md border-2 border-gray-200 dark:border-gray-700 p-3 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(href)}
                >
                  {/* Section icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isFood
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  {/* Order details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                          o.status?.toLowerCase() === 'completed' || o.status?.toLowerCase() === 'delivered'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : o.status?.toLowerCase() === 'cancelled'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                        }`}
                      >
                        {o.status}
                      </span>
                      <span className="text-[#887263] dark:text-[#b09d90] text-[10px] font-medium ml-auto">
                        #{o.orderId}
                      </span>
                    </div>

                    {/* Item names */}
                    {Array.isArray(o.items) && o.items.length > 0 && (
                      <p className="text-[#887263] dark:text-gray-400 text-[11px] leading-snug line-clamp-1">
                        {o.items.slice(0, 2).map((item, idx) => (
                          <span key={idx}>
                            {item.quantity}x {item.name || (isFood ? 'Food Item' : 'Grocery Item')}
                            {idx < Math.min(o.items.length - 1, 1) ? ', ' : ''}
                          </span>
                        ))}
                        {o.items.length > 2 && '…'}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[#7f4f13] text-sm font-bold leading-normal">
                        ₹{o.totalAmount}
                      </p>
                      <p className="text-[#887263] dark:text-gray-400 text-[10px]">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  {showReorder && (
                    <button
                      onClick={e => { e.stopPropagation(); reorderGrocery(o._id || o.id); }}
                      disabled={reorderingId === (o._id || o.id)}
                      className="ml-1 flex items-center gap-1 text-[10px] font-extrabold text-[#7f4f13] border border-[#7f4f13] px-2 py-1 rounded disabled:opacity-50"
                    >
                      <RotateCcw size={11} />
                      {reorderingId === (o._id || o.id) ? '…' : 'Reorder'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {isGrocerySection ? <GroceryBottomNavBar /> : <BottomNavBar />}
    </div>
  );
}
