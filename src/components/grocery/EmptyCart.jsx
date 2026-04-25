import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@services/api';
import useAuthStore from '@store/useAuthStore';

const fetchLastOrder = async () => {
  const res = await api.get('/grocery/orders');
  return res.data?.data?.[0] || null;
};

/**
 * Polished empty-cart state shown on /grocery/cart when the cart has no
 * items. Soft green halo around the basket emoji with a dashed ring.
 */
export default function EmptyCart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { data: lastOrder } = useQuery({
    queryKey: ['grocery', 'orders', 'last'],
    queryFn: fetchLastOrder,
    enabled: isAuthenticated,
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-3 min-h-[60vh]">
      <div
        className="relative w-36 h-36 rounded-full flex items-center justify-center text-6xl"
        style={{ background: 'radial-gradient(circle at center, #DCFCE7, transparent 70%)' }}
      >
        <span aria-hidden>🛒</span>
        <span className="absolute -inset-2 border-2 border-dashed border-green-600/40 rounded-full" />
      </div>
      <h4 className="text-base font-extrabold mt-2">Your cart is empty</h4>
      <p className="text-xs text-stone-500 max-w-[240px]">
        Looks like you haven't added anything yet. Browse our bestsellers to get started.
      </p>
      <button
        onClick={() => navigate('/grocery')}
        className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold mt-2"
      >
        Browse bestsellers
      </button>
      {lastOrder && (
        <button
          onClick={() => navigate(`/grocery/orders/${lastOrder._id || lastOrder.id}`)}
          className="text-amber-700 text-2xs font-bold mt-1"
        >
          View last order ›
        </button>
      )}
    </div>
  );
}
