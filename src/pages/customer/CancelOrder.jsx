import { useState } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@services/api';

const REASONS = [
  'Ordered by mistake',
  'Want to change items',
  'Delivery taking too long',
  'Found a cheaper price',
  'Other',
];

/**
 * Shared cancel-with-reason page used by both food and grocery orders.
 * Mounted at:
 *   /orders/:id/cancel              (food)
 *   /grocery/orders/:id/cancel      (grocery)
 *
 * Picks the right cancel endpoint based on the path prefix.
 */
export default function CancelOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isGrocery = pathname.startsWith('/grocery/');
  const cancelPath = isGrocery
    ? `/grocery/orders/${id}/cancel`
    : `/orders/${id}/cancel`;
  const backTo = isGrocery ? `/grocery/orders/${id}` : `/orders/${id}`;

  const [reason, setReason] = useState(REASONS[0]);
  const [other, setOther] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const finalReason = reason === 'Other' ? other.trim() : reason;
    if (!finalReason) return toast.error('Please pick or describe a reason');
    setSubmitting(true);
    try {
      await api.post(cancelPath, { reason: finalReason });
      toast.success('Order cancelled. Refund initiated.');
      navigate('/orders');
    } catch (e) {
      const msg = e?.response?.data?.message || 'Cancellation failed';
      toast.error(msg);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#211811]">
      <nav className="sticky top-0 z-30 bg-white dark:bg-[#211811] border-b border-stone-200 dark:border-gray-700">
        <div className="flex items-center p-4 max-w-md mx-auto">
          <Link to={backTo} className="flex size-10 items-center justify-center rounded-full hover:bg-stone-100">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-base font-bold ml-2">Cancel order</h2>
        </div>
      </nav>

      <main className="max-w-md mx-auto p-4">
        <div className="bg-rose-50 border-l-4 border-rose-600 p-3 text-2xs text-rose-700 rounded-r-md mb-4 leading-relaxed">
          ⚠ Cancellation is free as long as the order hasn't been packed yet.
          Refund will be credited to wallet/Razorpay within 24h.
        </div>

        <h6 className="text-[12px] font-extrabold mb-2 text-stone-700 dark:text-stone-300">
          Why are you cancelling?
        </h6>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-stone-200 dark:border-gray-700 px-3">
          {REASONS.map(r => (
            <label
              key={r}
              className="flex items-center gap-3 py-3 border-b border-dashed border-stone-200 dark:border-gray-700 last:border-b-0 text-sm cursor-pointer"
            >
              <input
                type="radio"
                name="reason"
                checked={reason === r}
                onChange={() => setReason(r)}
                className="accent-rose-600"
              />
              <span className={reason === r ? 'text-rose-700 font-bold' : ''}>{r}</span>
            </label>
          ))}
        </div>

        {reason === 'Other' && (
          <textarea
            className="w-full mt-3 border border-stone-300 rounded-lg p-3 text-sm dark:bg-gray-900 dark:border-gray-700"
            placeholder="Tell us a bit more (optional)"
            rows={3}
            value={other}
            onChange={e => setOther(e.target.value)}
            maxLength={200}
          />
        )}

        <button
          onClick={submit}
          disabled={submitting}
          className="w-full mt-5 bg-rose-600 disabled:bg-rose-300 text-white py-3 rounded-xl text-sm font-extrabold"
        >
          {submitting ? 'Cancelling…' : 'Cancel order & refund'}
        </button>
        <Link to={backTo} className="block text-center mt-3 text-stone-500 text-xs font-bold">
          Keep my order
        </Link>
      </main>
    </div>
  );
}
