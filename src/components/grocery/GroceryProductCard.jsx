import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGroceryCartStore from '@store/useGroceryCartStore';
import { optimizeImage } from '@utils/image';
import GroceryAddButton from './GroceryAddButton';
import GroceryStepper from './GroceryStepper';
import VariantPickerSheet from './VariantPickerSheet';

export default function GroceryProductCard({ product }) {
  const navigate = useNavigate();
  const { addItem, getQuantity, incrementQuantity, decrementQuantity } = useGroceryCartStore();
  const [variantPickerOpen, setVariantPickerOpen] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const productId = product.id || product._id;
  const availableVariants = (product.variants || []).filter(v => v.isAvailable);
  const defaultVariant = availableVariants.length
    ? availableVariants.reduce((a, b) => a.sellingPrice < b.sellingPrice ? a : b)
    : null;

  const variantId = defaultVariant?.id || defaultVariant?._id;
  const quantity = defaultVariant ? getQuantity(productId, variantId) : 0;
  const hasMultipleVariants = availableVariants.length > 1;

  const openDetail = () => navigate(`/grocery/p/${productId}`);

  const handleAdd = (e) => {
    e?.stopPropagation?.();
    if (!defaultVariant) return;
    if (hasMultipleVariants) { setVariantPickerOpen(true); return; }
    addItem({
      productId,
      variantId,
      name: product.name,
      variantLabel: defaultVariant.label,
      mrp: defaultVariant.mrp,
      sellingPrice: defaultVariant.sellingPrice,
      image: product.image,
    });
  };

  const pctOff = defaultVariant && defaultVariant.mrp > defaultVariant.sellingPrice
    ? Math.round(((defaultVariant.mrp - defaultVariant.sellingPrice) / defaultVariant.mrp) * 100)
    : 0;

  return (
    <div
      onClick={openDetail}
      className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex flex-col h-full"
    >
      <div className="relative">
        {product.image && !imgFailed ? (
          <img
            src={optimizeImage(product.image, 160)}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
            className="w-full aspect-square object-cover bg-gray-100 dark:bg-gray-800"
          />
        ) : (
          <div
            aria-hidden
            className="w-full aspect-square flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 dark:from-[#2a1f15] dark:to-[#3a2a1c]"
          >
            <span className="text-5xl opacity-40 select-none">🛒</span>
          </div>
        )}
        {pctOff > 0 && (
          <span className="absolute top-1.5 left-1.5 bg-green-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
            {pctOff}% OFF
          </span>
        )}
      </div>
      <div className="p-2 flex flex-col flex-1 gap-1">
        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wide min-h-[12px]">{product.brand || ''}</p>
        <p className="text-[11px] font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 min-h-[28px]">{product.name}</p>

        {defaultVariant ? (
          <>
            <div className="min-h-[18px]">
              {hasMultipleVariants ? (
                <span className="inline-flex w-fit items-center gap-1 text-[9px] font-bold text-gray-700 bg-amber-700/5 border border-amber-200 px-1.5 py-0.5 rounded-full">
                  {defaultVariant.label} ▾
                </span>
              ) : (
                <span className="inline-flex w-fit items-center text-[9px] font-bold text-gray-500 px-1.5 py-0.5">
                  {defaultVariant.label}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-1 mt-auto pt-1">
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-[11px] font-extrabold text-gray-900 dark:text-white">₹{defaultVariant.sellingPrice}</span>
                {pctOff > 0 && <span className="text-[9px] text-gray-400 line-through">₹{defaultVariant.mrp}</span>}
              </div>
              {quantity > 0 && !hasMultipleVariants ? (
                <GroceryStepper
                  qty={quantity}
                  onInc={() => incrementQuantity(productId, variantId)}
                  onDec={() => decrementQuantity(productId, variantId)}
                />
              ) : (
                <GroceryAddButton onClick={handleAdd} label={hasMultipleVariants ? 'ADD ▾' : 'ADD'} />
              )}
            </div>
          </>
        ) : (
          <button
            disabled
            className="w-full py-1 text-gray-400 text-xs font-bold border border-gray-200 rounded cursor-not-allowed mt-auto"
          >
            Out of stock
          </button>
        )}
      </div>

      <VariantPickerSheet
        product={product}
        open={variantPickerOpen}
        onClose={() => setVariantPickerOpen(false)}
      />
    </div>
  );
}
