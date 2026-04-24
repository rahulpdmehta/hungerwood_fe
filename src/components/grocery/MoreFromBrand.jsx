import { useQuery } from '@tanstack/react-query';
import api from '@services/api';
import GroceryProductCard from './GroceryProductCard';

const fetchMore = (id) => async () => (await api.get(`/grocery/products/${id}/more-from-brand`)).data?.data || [];

/**
 * Horizontal rail of other products from the same brand. Hidden if no
 * brand-mates exist.
 */
export default function MoreFromBrand({ product }) {
  const { data: items = [] } = useQuery({
    queryKey: ['grocery', 'p', product.id, 'brand'],
    queryFn: fetchMore(product.id),
    enabled: !!product.id && !!product.brand,
  });

  if (!product.brand || !items.length) return null;

  return (
    <div className="pt-4">
      <h6 className="text-[12px] font-extrabold mb-2 px-4">More from {product.brand}</h6>
      <div className="flex gap-2 overflow-x-auto px-4 scrollbar-hide pb-1">
        {items.map(p => (
          <div key={p.id} className="min-w-[140px]">
            <GroceryProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
