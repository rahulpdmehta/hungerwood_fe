import { useNavigate } from 'react-router-dom';
import useGroceryCartStore from '@store/useGroceryCartStore';

export default function GroceryProductCard({ product }) {
  const navigate = useNavigate();
  const { addItem, getQuantity, incrementQuantity, decrementQuantity } = useGroceryCartStore();

  // Use the cheapest available variant as the default for the card's "Add" button
  const availableVariants = (product.variants || []).filter(v => v.isAvailable);
  const defaultVariant = availableVariants.length
    ? availableVariants.reduce((a, b) => a.sellingPrice < b.sellingPrice ? a : b)
    : null;

  const variantId = defaultVariant?.id || defaultVariant?._id;
  const quantity = defaultVariant ? getQuantity(product.id || product._id, variantId) : 0;

  const openDetail = () => navigate(`/grocery/p/${product.id || product._id}`);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!defaultVariant) return;
    // If product has multiple available variants, open detail page so user picks
    if (availableVariants.length > 1) { openDetail(); return; }
    addItem({
      productId: product.id || product._id,
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
      className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <div
        className="w-full aspect-square bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url("${product.image}")` }}
      />
      <div className="p-2 space-y-1">
        <p className="text-[11px] font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">{product.name}</p>
        {product.brand && <p className="text-[10px] text-gray-500">{product.brand}</p>}

        {defaultVariant ? (
          <>
            <p className="text-[10px] text-gray-500">{defaultVariant.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-gray-900 dark:text-white">₹{defaultVariant.sellingPrice}</span>
              {pctOff > 0 && (
                <>
                  <span className="text-[10px] text-gray-400 line-through">₹{defaultVariant.mrp}</span>
                  <span className="text-[9px] text-green-700 font-bold">{pctOff}% OFF</span>
                </>
              )}
            </div>

            {quantity > 0 && availableVariants.length === 1 ? (
              <div className="flex items-center bg-green-100 rounded border border-green-300 overflow-hidden">
                <button
                  onClick={(e) => { e.stopPropagation(); decrementQuantity(product.id || product._id, variantId); }}
                  className="flex-1 py-1 text-green-800 font-bold"
                >
                  -
                </button>
                <span className="flex-1 text-center text-green-800 font-bold text-xs">{quantity}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); incrementQuantity(product.id || product._id, variantId); }}
                  className="flex-1 py-1 text-green-800 font-bold"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="w-full py-1 text-green-700 text-xs font-bold border border-green-300 rounded hover:bg-green-50"
              >
                {availableVariants.length > 1 ? 'Options' : 'ADD'}
              </button>
            )}
          </>
        ) : (
          <button disabled className="w-full py-1 text-gray-400 text-xs font-bold border border-gray-200 rounded cursor-not-allowed">
            Unavailable
          </button>
        )}
      </div>
    </div>
  );
}
