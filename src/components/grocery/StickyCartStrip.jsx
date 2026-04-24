import { useNavigate, useLocation } from 'react-router-dom';
import useGroceryCartStore from '@store/useGroceryCartStore';
import { optimizeImage } from '@utils/image';

/**
 * Persistent green bar fixed near the bottom of grocery browse pages.
 * Appears whenever the grocery cart has items. Hidden on /grocery/cart and
 * /grocery/checkout (those have their own checkout bar).
 *
 * Blinkit-style: left side shows a stack of up to 3 item thumbnails,
 * middle shows the "View cart" label + item/₹ count, right side is a
 * chevron.
 */
export default function StickyCartStrip() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const items = useGroceryCartStore(s => s.items);
  const totalItems = useGroceryCartStore(s => s.totalItems);
  const subtotal = useGroceryCartStore(s => s.subtotal);

  if (totalItems === 0) return null;
  if (pathname.startsWith('/grocery/cart') || pathname.startsWith('/grocery/checkout')) return null;

  const thumbs = items.slice(0, 3);

  return (
    <button
      type="button"
      onClick={() => navigate('/grocery/cart')}
      className="fixed left-2 right-2 bottom-2 z-40 max-w-md mx-auto bg-green-600 text-white rounded-2xl pl-2 pr-3 py-2 flex items-center gap-3 shadow-[0_8px_24px_rgba(22,163,74,0.35)] active:scale-[.99] transition-transform animate-slideUp"
    >
      <div className="flex -space-x-2.5 shrink-0">
        {thumbs.map((item, i) => (
          <div
            key={`${item.productId}-${item.variantId}-${i}`}
            className="w-9 h-9 rounded-lg border-2 border-green-600 bg-white overflow-hidden flex items-center justify-center"
          >
            {item.image ? (
              <img
                src={optimizeImage(item.image, 56)}
                alt=""
                aria-hidden
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg opacity-60" aria-hidden>🛒</span>
            )}
          </div>
        ))}
      </div>
      <div className="flex-1 text-left leading-tight">
        <div className="text-[15px] font-extrabold">View cart</div>
        <div className="text-[11px] font-semibold opacity-90">
          {totalItems} item{totalItems > 1 ? 's' : ''} · ₹{Math.round(subtotal)}
        </div>
      </div>
      <span className="text-xl font-bold leading-none" aria-hidden>›</span>
    </button>
  );
}
