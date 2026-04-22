import { useParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  useGroceryProductsPublic,
  useGroceryCategoriesPublic,
} from '@hooks/useGroceryCustomerQueries';
import GroceryProductCard from '@components/grocery/GroceryProductCard';
import useGroceryCartStore from '@store/useGroceryCartStore';

export default function GroceryCategory() {
  const { slug } = useParams();
  const { data: categories = [] } = useGroceryCategoriesPublic();
  const { data: allProducts = [], isLoading } = useGroceryProductsPublic({ category: slug });
  const cartCount = useGroceryCartStore(s => s.totalItems);
  const [sort, setSort] = useState('default');

  const category = categories.find(c => c.id === slug);

  const sortedProducts = useMemo(() => {
    const p = [...allProducts];
    const cheapest = v => {
      const prices = (v.variants || []).filter(x => x.isAvailable).map(x => x.sellingPrice);
      return prices.length ? Math.min(...prices) : Infinity;
    };
    if (sort === 'price-asc') p.sort((a, b) => cheapest(a) - cheapest(b));
    if (sort === 'price-desc') p.sort((a, b) => cheapest(b) - cheapest(a));
    return p;
  }, [allProducts, sort]);

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] pb-20">
      <nav className="sticky top-0 z-50 bg-white dark:bg-[#211811] border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <Link to="/grocery" className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-lg font-bold flex-1 text-center pr-10">{category?.name || 'Category'}</h2>
        </div>
        <div className="px-4 pb-3 max-w-md mx-auto">
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2d221a] rounded-lg text-sm"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 pt-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-2">
            {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-[3/5] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />)}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No products in this category yet.</div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {sortedProducts.map(p => <GroceryProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>

      {cartCount > 0 && (
        <Link
          to="/grocery/cart"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-40 font-bold text-sm"
        >
          View cart ({cartCount})
        </Link>
      )}
    </div>
  );
}
