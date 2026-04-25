import { useParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ArrowLeft, ArrowUpDown, ChevronDown } from 'lucide-react';
import {
  useGroceryProductsPublic,
  useGroceryCategoriesPublic,
} from '@hooks/useGroceryCustomerQueries';
import GroceryProductCard from '@components/grocery/GroceryProductCard';
import GroceryCardSkeleton from '@components/grocery/GroceryCardSkeleton';
import StickyCartStrip from '@components/grocery/StickyCartStrip';
import GroceryBottomNavBar from '@components/layout/GroceryBottomNavBar';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Relevance' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'discount',   label: 'Discount: High → Low' },
  { value: 'name',       label: 'Name: A → Z' },
];

export default function GroceryCategory() {
  const { slug } = useParams();
  const { data: categories = [] } = useGroceryCategoriesPublic();
  const { data: allProducts = [], isLoading } = useGroceryProductsPublic({ category: slug });
  const [sort, setSort] = useState('default');

  const category = categories.find(c => c.id === slug);

  const sortedProducts = useMemo(() => {
    const p = [...allProducts];
    const cheapest = v => {
      const prices = (v.variants || []).filter(x => x.isAvailable).map(x => x.sellingPrice);
      return prices.length ? Math.min(...prices) : Infinity;
    };
    const bestDiscount = v => {
      const available = (v.variants || []).filter(x => x.isAvailable && x.mrp > 0);
      if (!available.length) return 0;
      return Math.max(...available.map(x => (x.mrp - x.sellingPrice) / x.mrp));
    };
    if (sort === 'price-asc')  p.sort((a, b) => cheapest(a) - cheapest(b));
    if (sort === 'price-desc') p.sort((a, b) => cheapest(b) - cheapest(a));
    if (sort === 'discount')   p.sort((a, b) => bestDiscount(b) - bestDiscount(a));
    if (sort === 'name')       p.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    return p;
  }, [allProducts, sort]);

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] pb-28">
      <nav className="sticky top-0 z-50 bg-white dark:bg-[#211811] border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <Link to="/grocery" className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-lg font-bold flex-1 text-center pr-10">{category?.name || 'Category'}</h2>
        </div>
        <div className="px-4 pb-3 max-w-md mx-auto flex items-center justify-between gap-3">
          <span className="text-[11px] text-gray-500 font-semibold">
            {isLoading ? '' : `${sortedProducts.length} product${sortedProducts.length === 1 ? '' : 's'}`}
          </span>
          <div className="relative">
            <ArrowUpDown size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-800 pointer-events-none" />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              aria-label="Sort products"
              className="appearance-none pl-7 pr-7 py-1.5 border border-amber-700/30 bg-white dark:bg-[#2d221a] rounded-full text-[11px] font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-700/40 shadow-sm"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-800 pointer-events-none" />
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-3 pt-4">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-2">
            {[1,2,3,4,5,6,7,8,9].map(i => <GroceryCardSkeleton key={i} />)}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No products in this category yet.</div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {sortedProducts.map(p => <GroceryProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>

      <StickyCartStrip />
      <GroceryBottomNavBar />
    </div>
  );
}
