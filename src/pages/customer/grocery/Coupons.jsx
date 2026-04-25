import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@services/api';
import useGroceryCartStore from '@store/useGroceryCartStore';
import CouponCard from '@components/grocery/CouponCard';

const fetchAvailable = async () => (await api.get('/grocery/coupons')).data?.data || [];

export default function GroceryCoupons() {
  const navigate = useNavigate();
  const subtotal = useGroceryCartStore(s => s.subtotal);
  const coupon = useGroceryCartStore(s => s.coupon);
  const applyCoupon = useGroceryCartStore(s => s.applyCoupon);
  const removeCoupon = useGroceryCartStore(s => s.removeCoupon);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);

  const { data: available = [] } = useQuery({
    queryKey: ['grocery', 'coupons', 'available'],
    queryFn: fetchAvailable,
  });

  const apply = async (rawCode) => {
    setBusy(true);
    try {
      const res = await api.post('/grocery/coupons/apply', {
        code: rawCode,
        subtotal,
      });
      applyCoupon(res.data);
      toast.success(`Coupon ${res.data.code} applied`);
      navigate('/grocery/cart');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Could not apply coupon');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811]">
      <nav className="sticky top-0 z-30 bg-white dark:bg-[#211811] border-b border-stone-200 dark:border-gray-700">
        <div className="flex items-center p-4 max-w-md mx-auto">
          <Link to="/grocery/cart" className="flex size-10 items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-gray-800">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-base font-bold ml-2">Apply coupon</h2>
        </div>
      </nav>

      <main className="max-w-md mx-auto p-3">
        <div className="bg-white dark:bg-[#2d221a] border-[1.5px] border-amber-700 rounded-xl p-2.5 flex items-center gap-2 shadow-sm">
          <input
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="flex-1 bg-transparent outline-none text-sm"
            maxLength={30}
          />
          <button
            disabled={!code.trim() || busy}
            onClick={() => apply(code.trim())}
            className="bg-amber-700 text-white text-xs font-extrabold px-4 py-1.5 rounded disabled:bg-stone-300"
          >
            {busy ? '…' : 'APPLY'}
          </button>
        </div>
        {coupon && (
          <div className="text-xs text-green-700 dark:text-green-400 font-bold mt-2 text-center">
            ✓ Coupon {coupon.code} is currently applied{' '}
            <button onClick={() => { removeCoupon(); toast.success('Coupon removed'); }} className="underline ml-1">remove</button>
          </div>
        )}

        <div className="mt-5 mb-1 px-1 text-[11px] font-extrabold text-stone-500 uppercase tracking-wider">
          Available coupons
        </div>

        {available.length === 0 ? (
          <div className="text-center text-stone-500 text-sm py-10">
            No coupons available right now.
          </div>
        ) : (
          available.map(c => (
            <CouponCard
              key={c._id}
              coupon={c}
              applied={coupon?.code === c.code}
              onApply={() => apply(c.code)}
              onRemove={() => { removeCoupon(); toast.success('Coupon removed'); }}
            />
          ))
        )}
      </main>
    </div>
  );
}
