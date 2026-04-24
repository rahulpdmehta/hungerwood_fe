import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import {
  useGroceryCategoriesPublic,
  useGroceryProductsPublic,
  useGrocerySettingsPublic,
} from '@hooks/useGroceryCustomerQueries';
import { getActiveBanners } from '@services/banner.service';
import { useQuery } from '@tanstack/react-query';
import GroceryProductCard from '@components/grocery/GroceryProductCard';
import SectionTilesStrip from '@components/home/GroceryEntryCard';
import StickyCartStrip from '@components/grocery/StickyCartStrip';

export default function GroceryHome() {
  const { data: categories = [], isLoading: catsLoading } = useGroceryCategoriesPublic();
  const { data: allProducts = [], isLoading: prodLoading } = useGroceryProductsPublic();
  const { data: settings } = useGrocerySettingsPublic();
  const { data: banners = [] } = useQuery({
    queryKey: ['grocery-banners-active'],
    queryFn: () => getActiveBanners({ section: 'grocery' }),
  });

  const bestsellers = useMemo(
    () => allProducts.filter(p => p.tags?.isBestseller).slice(0, 8),
    [allProducts]
  );

  if (settings && !settings.isOpen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#f8f7f6]">
        <h2 className="text-2xl font-bold mb-2">Grocery shop closed</h2>
        <p className="text-gray-600 text-center mb-6">{settings.closingMessage || 'Check back later.'}</p>
        <Link to="/" className="text-[#7f4f13] font-semibold">&larr; Back to sections</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] pb-20">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#211811]/80 backdrop-blur-md border-b-2 border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center p-4 pb-2 justify-between max-w-md mx-auto">
          <Link to="/" className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-md border border-gray-200">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-lg font-bold">Grocery</h2>
          <Link to="/grocery/search" className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-md border border-gray-200">
            <Search size={20} />
          </Link>
        </div>
      </nav>

      <main className="max-w-md mx-auto">
        {/* Section switcher (Restaurant / Grocery) */}
        <SectionTilesStrip />

        {banners.length > 0 && (
          <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {banners.map(b => (
              <div key={b._id || b.id} className="min-w-[280px] h-32 bg-cover bg-center rounded-xl shadow-md" style={{ backgroundImage: `url("${b.image}")` }}>
                <div className="h-full w-full bg-gradient-to-t from-black/60 to-transparent rounded-xl flex items-end p-3">
                  <div>
                    <h3 className="text-white font-bold">{b.title}</h3>
                    {b.subtitle && <p className="text-white/80 text-xs">{b.subtitle}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Categories */}
        <div className="px-4 pt-4">
          <h3 className="text-lg font-bold mb-3">Shop by category</h3>
          {catsLoading ? (
            <div className="grid grid-cols-4 gap-3">
              {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />)}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {categories.map(c => (
                <Link key={c.id} to={`/grocery/c/${c.id}`} className="text-center">
                  <div className="aspect-square bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden mb-1">
                    <img src={c.image || 'https://via.placeholder.com/80'} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[11px] font-medium line-clamp-1">{c.name}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Bestsellers */}
        {bestsellers.length > 0 && (
          <div className="px-4 pt-6">
            <h3 className="text-lg font-bold mb-3">Bestsellers</h3>
            <div className="grid grid-cols-2 gap-2">
              {bestsellers.map(p => (
                <GroceryProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* All products preview */}
        <div className="px-4 pt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold">All products</h3>
            {categories.length > 0 && (
              <Link to={`/grocery/c/${categories[0].id}`} className="text-sm text-[#7f4f13] font-semibold">
                Browse all &rarr;
              </Link>
            )}
          </div>
          {prodLoading ? (
            <div className="grid grid-cols-2 gap-2">
              {[1,2,3,4].map(i => <div key={i} className="aspect-[3/5] bg-gray-200 animate-pulse rounded-lg" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {allProducts.slice(0, 10).map(p => <GroceryProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </main>

      <StickyCartStrip />
    </div>
  );
}
