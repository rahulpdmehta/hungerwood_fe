import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '@services/api';
import useGroceryCartStore from '@store/useGroceryCartStore';
import toast from 'react-hot-toast';
import { optimizeImage } from '@utils/image';

const fetchFbt = (id) => async () => (await api.get(`/grocery/products/${id}/fbt`)).data?.data || [];

const cheapestVariant = (p) => {
  const av = (p.variants || []).filter(v => v.isAvailable);
  if (!av.length) return null;
  return av.reduce((a, b) => a.sellingPrice < b.sellingPrice ? a : b);
};

/**
 * "Frequently bought together" combo card on the product detail page.
 * Shows the current product + 2 recommendations as thumbnails separated by
 * "+", with a combined price total and an "Add all" CTA that pushes the
 * recommended products into the grocery cart.
 */
export default function FrequentlyBoughtTogether({ product }) {
  const { data: extras = [] } = useQuery({
    queryKey: ['grocery', 'p', product.id, 'fbt'],
    queryFn: fetchFbt(product.id),
    enabled: !!product.id,
  });
  const addItem = useGroceryCartStore(s => s.addItem);

  if (!extras.length) return null;

  const curVariant = cheapestVariant(product);
  if (!curVariant) return null;
  const all = [{ ...product, _variant: curVariant }, ...extras.map(p => ({ ...p, _variant: cheapestVariant(p) })).filter(p => p._variant)];
  const total = all.reduce((s, p) => s + p._variant.sellingPrice, 0);
  const mrpSum = all.reduce((s, p) => s + (p._variant.mrp || p._variant.sellingPrice), 0);
  const savings = Math.max(0, mrpSum - total);

  const addAll = () => {
    let added = 0;
    for (const p of all.slice(1)) {
      addItem({
        productId: p.id || p._id,
        variantId: p._variant.id || p._variant._id,
        name: p.name,
        variantLabel: p._variant.label,
        mrp: p._variant.mrp,
        sellingPrice: p._variant.sellingPrice,
        image: p.image,
      });
      added++;
    }
    toast.success(`${added} item${added > 1 ? 's' : ''} added to cart`);
  };

  return (
    <div className="mx-4 my-3 bg-white dark:bg-[#2d221a] rounded-xl border border-gray-200 dark:border-gray-700 p-3">
      <h6 className="text-[12px] font-extrabold mb-2">Frequently bought together</h6>
      <div className="flex items-center gap-1.5">
        {all.map((p, i) => (
          <div key={p.id || p._id || i} className="flex items-center gap-1.5">
            {p.image ? (
              <img
                src={optimizeImage(p.image, 60)}
                alt=""
                loading="lazy"
                decoding="async"
                className={`w-14 h-14 rounded-md object-cover bg-stone-200 ${i === 0 ? 'border-2 border-green-600' : 'border border-stone-200'}`}
                aria-hidden
              />
            ) : (
              <div className={`w-14 h-14 rounded-md bg-stone-200 ${i === 0 ? 'border-2 border-green-600' : 'border border-stone-200'}`} aria-hidden />
            )}
            {i < all.length - 1 && <span className="text-stone-400 font-extrabold text-base">+</span>}
          </div>
        ))}
      </div>
      <div className="text-2xs text-stone-500 mt-1.5 line-clamp-1">
        {all.map(p => p.name).join(' · ')}
      </div>
      <div className="flex justify-between items-center mt-2.5">
        <div>
          <div className="text-[12px] font-extrabold">₹{Math.round(total)}</div>
          {savings > 0 && <div className="text-2xs text-green-700 font-bold">You save ₹{Math.round(savings)}</div>}
        </div>
        <button
          onClick={addAll}
          className="bg-green-600 text-white text-2xs font-extrabold px-3 py-1.5 rounded-md"
        >
          Add other {all.length - 1}
        </button>
      </div>
    </div>
  );
}
