import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, ShoppingBasket } from 'lucide-react';
import { useGroceryProductPublic } from '@hooks/useGroceryCustomerQueries';
import useGroceryCartStore from '@store/useGroceryCartStore';
import { optimizeImage } from '@utils/image';
import FrequentlyBoughtTogether from '@components/grocery/FrequentlyBoughtTogether';
import MoreFromBrand from '@components/grocery/MoreFromBrand';
import StickyCartStrip from '@components/grocery/StickyCartStrip';

export default function GroceryProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useGroceryProductPublic(id);
  const { addItem, getQuantity, incrementQuantity, decrementQuantity } = useGroceryCartStore();
  const [selectedVariantId, setSelectedVariantId] = useState(null);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;

  const variants = (product.variants || []);
  const availableVariants = variants.filter(v => v.isAvailable);
  const selected = variants.find(v => (v.id || v._id) === selectedVariantId)
    || (availableVariants[0] || variants[0]);

  const selectedVariantKey = selected ? (selected.id || selected._id) : null;
  const quantity = selected ? getQuantity(product.id, selectedVariantKey) : 0;

  const handleAdd = () => {
    if (!selected || !selected.isAvailable) return;
    addItem({
      productId: product.id,
      variantId: selectedVariantKey,
      name: product.name,
      variantLabel: selected.label,
      mrp: selected.mrp,
      sellingPrice: selected.sellingPrice,
      image: product.image,
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] pb-32">
      <nav className="sticky top-0 z-50 bg-white dark:bg-[#211811] border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-bold flex-1 text-center pr-10 line-clamp-1">{product.name}</h2>
        </div>
      </nav>

      <main className="max-w-md mx-auto">
        <img src={optimizeImage(product.image, 448)} alt="" decoding="async" className="w-full aspect-square object-cover bg-gray-100" />

        <div className="p-4 space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            {product.brand && <p className="text-sm text-gray-500">{product.brand}</p>}
            {product.description && <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{product.description}</p>}
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Select pack size</p>
            <div className="flex flex-wrap gap-2">
              {variants.map(v => {
                const key = v.id || v._id;
                const isSelected = key === selectedVariantKey;
                const pctOff = v.mrp > v.sellingPrice ? Math.round((v.mrp - v.sellingPrice) / v.mrp * 100) : 0;
                return (
                  <button
                    key={key}
                    onClick={() => v.isAvailable && setSelectedVariantId(key)}
                    disabled={!v.isAvailable}
                    className={`px-3 py-2 rounded-lg border-2 text-left transition-colors ${
                      !v.isAvailable
                        ? 'border-gray-200 bg-gray-50 text-gray-400 line-through cursor-not-allowed'
                        : isSelected
                          ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2d221a] hover:border-green-400'
                    }`}
                  >
                    <div className="text-sm font-bold">{v.label}</div>
                    <div className="text-xs">
                      <span className="font-bold">₹{v.sellingPrice}</span>
                      {pctOff > 0 && <span className="text-gray-400 line-through ml-1">₹{v.mrp}</span>}
                    </div>
                    {pctOff > 0 && <div className="text-[10px] text-green-700 dark:text-green-400 font-bold">{pctOff}% OFF</div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <FrequentlyBoughtTogether product={product} />
        <MoreFromBrand product={product} />
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#211811] border-t-2 border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-md mx-auto">
          {quantity > 0 ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-300 dark:border-green-700 overflow-hidden flex-1">
                <button onClick={() => decrementQuantity(product.id, selectedVariantKey)} className="flex-1 py-3 text-green-800 dark:text-green-200 font-bold">-</button>
                <span className="flex-1 text-center text-green-800 dark:text-green-200 font-bold">{quantity}</span>
                <button onClick={() => incrementQuantity(product.id, selectedVariantKey)} className="flex-1 py-3 text-green-800 dark:text-green-200 font-bold">+</button>
              </div>
              <Link to="/grocery/cart" className="bg-green-600 text-white px-4 py-3 rounded-lg font-bold flex items-center gap-2">
                <ShoppingBasket size={16} /> Cart
              </Link>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={!selected || !selected.isAvailable}
              className="w-full bg-green-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-bold"
            >
              {selected?.isAvailable ? `Add to cart — ₹${selected.sellingPrice}` : 'Unavailable'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
