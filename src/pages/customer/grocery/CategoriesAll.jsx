import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon, X } from 'lucide-react';
import { useGroceryCategoriesPublic } from '@hooks/useGroceryCustomerQueries';
import CategoryTile from '@components/grocery/CategoryTile';
import CategoryTileSkeleton from '@components/grocery/CategoryTileSkeleton';
import StickyCartStrip from '@components/grocery/StickyCartStrip';

export default function GroceryCategoriesAll() {
  const { data: categories = [], isLoading } = useGroceryCategoriesPublic();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter(c => (c.name || '').toLowerCase().includes(term));
  }, [categories, q]);

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] pb-24">
      <nav className="sticky top-0 z-30 bg-white dark:bg-[#211811] border-b border-stone-200 dark:border-gray-700">
        <div className="flex items-center p-4 max-w-md mx-auto">
          <Link to="/grocery" className="flex size-10 items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-gray-800">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-base font-bold ml-2">All categories</h2>
        </div>
        <div className="px-4 pb-3 max-w-md mx-auto">
          <div className="flex items-center gap-2 bg-stone-100 dark:bg-[#2d221a] rounded-lg px-3 py-2">
            <SearchIcon size={14} className="text-stone-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter categories"
              className="flex-1 bg-transparent outline-none text-sm placeholder-stone-500"
              aria-label="Filter categories"
            />
            {q && (
              <button onClick={() => setQ('')} aria-label="Clear filter" className="text-stone-400">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-3 pt-4">
        {isLoading ? (
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => <CategoryTileSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-stone-500 text-sm">
            {q ? `No categories match “${q}”.` : 'No categories available yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {filtered.map(c => (
              <CategoryTile key={c.id || c._id} category={c} />
            ))}
          </div>
        )}
      </main>

      <StickyCartStrip />
    </div>
  );
}
