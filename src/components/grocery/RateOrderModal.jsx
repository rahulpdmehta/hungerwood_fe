import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@services/api';

const TAGS = ['Fresh produce', 'On time', 'Well packed', 'Could be better', 'Polite delivery'];

/**
 * One-time post-delivery rating modal. Picks endpoint based on isGrocery
 * prop. Closing (✕ or backdrop) records a dismissal in localStorage so we
 * don't keep nagging the customer.
 */
export default function RateOrderModal({ open, orderId, isGrocery, onClose }) {
  const [stars, setStars] = useState(0);
  const [tags, setTags] = useState([]);
  const [comment, setComment] = useState('');

  const submitMut = useMutation({
    mutationFn: () => {
      const path = isGrocery
        ? `/grocery/orders/${orderId}/rating`
        : `/orders/${orderId}/rating`;
      return api.post(path, { stars, tags, comment });
    },
    onSuccess: () => {
      toast.success('Thanks for the rating!');
      try { localStorage.setItem(`rated:${orderId}`, '1'); } catch { /* ignore */ }
      onClose?.();
    },
    onError: (e) => toast.error(e?.response?.data?.message || 'Could not submit rating'),
  });

  if (!open) return null;

  const toggleTag = (t) =>
    setTags(prev => (prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]));

  const dismiss = () => {
    try { localStorage.setItem(`rated:${orderId}`, '1'); } catch { /* ignore */ }
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={dismiss}>
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-[#211811] rounded-2xl p-5 w-full max-w-sm text-center shadow-2xl"
      >
        <div className="flex justify-end -mt-1 -mr-1">
          <button onClick={dismiss} aria-label="Close" className="p-1 text-stone-400">
            <X size={16} />
          </button>
        </div>
        <h5 className="text-lg font-extrabold">How was your order?</h5>
        <p className="text-xs text-stone-500 mt-0.5">Your feedback helps us improve.</p>

        <div className="flex justify-center gap-1.5 my-3">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => setStars(n)} aria-label={`${n} stars`}>
              <Star
                size={32}
                className={n <= stars ? 'text-amber-400 fill-amber-400' : 'text-stone-300'}
              />
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 mb-3">
          {TAGS.map(t => (
            <button
              key={t}
              onClick={() => toggleTag(t)}
              className={`text-[10px] font-bold px-2 py-1 rounded-full border ${tags.includes(t) ? 'bg-green-100 border-green-600 text-green-700' : 'bg-stone-50 border-stone-200 text-stone-600'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={2}
          placeholder="Tell us more (optional)"
          className="w-full text-xs p-2.5 border border-stone-200 rounded-lg bg-stone-50 dark:bg-[#2d221a] dark:border-gray-700"
          maxLength={500}
        />

        <button
          onClick={() => submitMut.mutate()}
          disabled={!stars || submitMut.isPending}
          className="w-full mt-3 bg-green-600 disabled:bg-stone-300 text-white font-extrabold text-sm py-2.5 rounded-xl"
        >
          {submitMut.isPending ? 'Submitting…' : 'Submit'}
        </button>
        <button onClick={dismiss} className="text-stone-400 text-[11px] mt-2">Maybe later</button>
      </div>
    </div>
  );
}
