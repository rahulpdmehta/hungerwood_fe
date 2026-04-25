import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useGroceryCategoriesPublic,
  useGroceryProductsPublic,
  useGrocerySettingsPublic,
} from '@hooks/useGroceryCustomerQueries';
import { getActiveBanners } from '@services/banner.service';
import { useQuery } from '@tanstack/react-query';
import GroceryProductCard from '@components/grocery/GroceryProductCard';
import GroceryCardSkeleton from '@components/grocery/GroceryCardSkeleton';
import CategoryTileSkeleton from '@components/grocery/CategoryTileSkeleton';
import SectionTilesStrip from '@components/home/GroceryEntryCard';
import StickyCartStrip from '@components/grocery/StickyCartStrip';
import GroceryBottomNavBar from '@components/layout/GroceryBottomNavBar';
import SavingsWidget from '@components/grocery/SavingsWidget';
import CategoryTile from '@components/grocery/CategoryTile';
import HomeHeader from '@components/layout/HomeHeader';

const DEFAULT_BG = 'linear-gradient(135deg, #FFE9C8 0%, #F5C16C 50%, #E59B40 100%)';
const DEFAULT_TEXT = '#451a03';
const DEFAULT_BADGE = '#92400e';

function HeroBanner({ banners }) {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(() => setIdx(i => (i + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [banners.length]);
  if (!banners.length) return null;
  const b = banners[idx];
  const bg = b.backgroundColor && b.backgroundColor !== '#ffffff' ? b.backgroundColor : DEFAULT_BG;
  const textColor = b.textColor && b.textColor !== '#000000' ? b.textColor : DEFAULT_TEXT;
  const badgeBg = b.badgeColor && b.badgeColor !== '#000000' ? b.badgeColor : DEFAULT_BADGE;
  const handleClick = () => {
    const link = b.ctaLink?.trim();
    if (!link) return;
    if (/^https?:\/\//i.test(link)) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link);
    }
  };
  return (
    <div
      role={b.ctaLink ? 'button' : undefined}
      tabIndex={b.ctaLink ? 0 : undefined}
      onClick={b.ctaLink ? handleClick : undefined}
      onKeyDown={b.ctaLink ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } } : undefined}
      className={`mx-4 my-3 h-32 rounded-2xl relative overflow-hidden shadow-lg ${b.ctaLink ? 'cursor-pointer active:scale-[.99] transition-transform' : ''}`}
      style={{ background: bg, color: textColor }}
    >
      {b.image && (
        <img
          src={b.image}
          alt=""
          aria-hidden
          className="absolute right-0 top-0 h-full w-1/3 object-cover"
          style={{ maskImage: 'linear-gradient(to left, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      )}
      <div className="absolute inset-0 p-4 flex flex-col justify-center">
        {b.badge && (
          <span
            className="self-start inline-block text-white text-2xs font-extrabold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: badgeBg }}
          >
            {b.badge}
          </span>
        )}
        <h3 className="mt-2 text-lg font-extrabold leading-tight max-w-[60%]" style={{ color: textColor }}>
          {b.title}
        </h3>
        {b.subtitle && (
          <p className="text-2xs mt-0.5 opacity-90 max-w-[60%]" style={{ color: textColor }}>
            {b.subtitle}
          </p>
        )}
      </div>
      {banners.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {banners.map((_, i) => (
            <span
              key={i}
              className="h-1 rounded-full transition-all"
              style={{
                width: i === idx ? 16 : 6,
                backgroundColor: textColor,
                opacity: i === idx ? 0.85 : 0.3,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

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
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] pb-24">
      <HomeHeader brandName="M-Mart" searchPath="/grocery/search" />

      <main className="max-w-md mx-auto">
        <SectionTilesStrip />

        <HeroBanner banners={banners} />
        <SavingsWidget />

        <div className="px-4 pt-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-extrabold">Shop by category</h3>
            <Link to="/grocery/categories" className="text-xs text-[#7f4f13] font-bold">View all &rarr;</Link>
          </div>
          {catsLoading ? (
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => <CategoryTileSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {categories.slice(0, 10).map(c => <CategoryTile key={c.id || c._id} category={c} />)}
            </div>
          )}
        </div>

        {bestsellers.length > 0 && (
          <div className="pt-6">
            <h3 className="text-base font-extrabold mb-2 px-4">Bestsellers</h3>
            <div className="flex gap-2 overflow-x-auto px-4 scrollbar-hide pb-1">
              {bestsellers.map(p => (
                <div key={p.id} className="min-w-[110px] max-w-[110px]">
                  <GroceryProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 px-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-extrabold">Smart bundles</h3>
            <Link to="/grocery/bundles" className="text-xs text-[#7f4f13] font-bold">Browse all &rarr;</Link>
          </div>
          <Link
            to="/grocery/bundles"
            className="block rounded-2xl p-4 relative overflow-hidden text-amber-950 shadow-md"
            style={{ background: 'linear-gradient(135deg, #FFEED4, #F3CD93)' }}
          >
            <span className="text-2xs bg-rose-600 text-white font-extrabold px-1.5 py-0.5 rounded">SAVE MORE</span>
            <h5 className="mt-2 font-extrabold text-base">Hand-picked combos</h5>
            <p className="text-2xs opacity-80 mt-0.5">Atta + oil + tea + biscuits — and more</p>
            <span className="absolute right-3 -bottom-3 text-6xl opacity-30 pointer-events-none select-none" aria-hidden>📦</span>
          </Link>
        </div>

        <div className="px-4 pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-extrabold">Daily essentials</h3>
            {categories.length > 0 && (
              <Link to={`/grocery/c/${categories[0].id}`} className="text-xs text-[#7f4f13] font-bold">
                Browse all &rarr;
              </Link>
            )}
          </div>
          {prodLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map(i => <GroceryCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {allProducts.slice(0, 12).map(p => <GroceryProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </main>

      <StickyCartStrip />
      <GroceryBottomNavBar />
    </div>
  );
}
