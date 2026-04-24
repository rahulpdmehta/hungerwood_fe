import { useNavigate, useLocation } from 'react-router-dom';
import useGroceryCartStore from '@store/useGroceryCartStore';

/**
 * Persistent green bar fixed near the bottom of grocery browse pages.
 * Appears whenever the grocery cart has items. Hidden on /grocery/cart and
 * /grocery/checkout (those have their own checkout bar).
 */
export default function StickyCartStrip() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const totalItems = useGroceryCartStore(s => s.totalItems);
  const subtotal = useGroceryCartStore(s => s.subtotal);

  if (totalItems === 0) return null;
  if (pathname.startsWith('/grocery/cart') || pathname.startsWith('/grocery/checkout')) return null;

  return (
    <button
      type="button"
      onClick={() => navigate('/grocery/cart')}
      className="fixed left-2 right-2 bottom-2 z-40 max-w-md mx-auto bg-green-600 text-white rounded-xl px-3 py-2.5 flex items-center justify-between shadow-[0_8px_16px_rgba(22,163,74,0.30)] active:scale-[.99] transition-transform animate-slideUp"
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center text-sm">🛒</div>
        <div className="text-left leading-tight">
          <div className="text-[11px] font-bold opacity-90">{totalItems} item{totalItems > 1 ? 's' : ''}</div>
          <div className="text-[14px] font-extrabold">₹{Math.round(subtotal)}</div>
        </div>
      </div>
      <div className="text-[12px] font-extrabold flex items-center gap-1">View cart <span aria-hidden>›</span></div>
    </button>
  );
}
