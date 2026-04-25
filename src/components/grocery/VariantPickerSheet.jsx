import { useEffect } from 'react';
import { X } from 'lucide-react';
import useGroceryCartStore from '@store/useGroceryCartStore';
import { optimizeImage } from '@utils/image';

export default function VariantPickerSheet({ product, open, onClose }) {
  const { addItem, getQuantity, incrementQuantity, decrementQuantity } = useGroceryCartStore();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open || !product) return null;

  const productId = product.id || product._id;
  const variants = (product.variants || []).filter(v => v.isAvailable);

  const handleAdd = (v) => {
    addItem({
      productId,
      variantId: v.id || v._id,
      name: product.name,
      variantLabel: v.label,
      mrp: v.mrp,
      sellingPrice: v.sellingPrice,
      image: product.image,
    });
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 animate-in fade-in"
      />
      <div className="relative w-full sm:max-w-md bg-white dark:bg-[#211811] rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-start gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
          <img
            src={optimizeImage(product.image, 100)}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-16 h-16 rounded-lg object-cover shrink-0 bg-gray-100"
          />
          <div className="flex-1 min-w-0">
            {product.brand && <p className="text-2xs text-gray-500 font-bold uppercase tracking-wide">{product.brand}</p>}
            <h3 className="text-sm font-bold leading-tight line-clamp-2">{product.name}</h3>
            <p className="text-2xs text-gray-500 mt-1">Choose a pack size</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto p-3 space-y-2">
          {variants.length === 0 && (
            <p className="text-center py-6 text-sm text-gray-500">No pack sizes available.</p>
          )}
          {variants.map(v => {
            const key = v.id || v._id;
            const qty = getQuantity(productId, key);
            const pctOff = v.mrp > v.sellingPrice
              ? Math.round(((v.mrp - v.sellingPrice) / v.mrp) * 100)
              : 0;
            return (
              <div
                key={key}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2d221a]"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold">{v.label}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-extrabold text-gray-900 dark:text-white">₹{v.sellingPrice}</span>
                    {pctOff > 0 && (
                      <>
                        <span className="text-2xs text-gray-400 line-through">₹{v.mrp}</span>
                        <span className="text-2xs text-green-700 font-bold">{pctOff}% OFF</span>
                      </>
                    )}
                  </div>
                </div>
                {qty > 0 ? (
                  <div className="flex items-center rounded-lg border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 overflow-hidden">
                    <button onClick={() => decrementQuantity(productId, key)} className="px-3 py-1.5 text-green-800 dark:text-green-200 font-bold">-</button>
                    <span className="px-2 text-sm text-green-800 dark:text-green-200 font-bold min-w-[1.5ch] text-center">{qty}</span>
                    <button onClick={() => incrementQuantity(productId, key)} className="px-3 py-1.5 text-green-800 dark:text-green-200 font-bold">+</button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAdd(v)}
                    className="text-xs font-extrabold px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  >
                    ADD
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
