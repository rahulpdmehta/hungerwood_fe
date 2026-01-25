import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import useCartStore from '@store/useCartStore';
import { useMenuItems } from '@hooks/useMenuQueries';
import { useWalletBalance } from '@hooks/useWalletQueries';
import { useActiveBanners } from '@hooks/useBannerQueries';
import BottomNavBar from '@components/layout/BottomNavBar';
import FloatingCartButton from '@components/layout/FloatingCartButton';
import { BannerSkeleton } from '@components/common/Loader';
import logo from '@assets/images/logo_1.jpeg';

const Home = () => {
  const navigate = useNavigate();
  const { totalItems, totalPrice, addItem } = useCartStore();

  // React Query hooks for data fetching
  const { data: menuItems = [], isLoading: itemsLoading } = useMenuItems();
  const { data: walletBalance = 0, isLoading: walletLoading } = useWalletBalance();
  const { data: activeBanners = [], isLoading: bannersLoading } = useActiveBanners();

  const [showWalletPill, setShowWalletPill] = useState(true);
  const [showWalletTooltip, setShowWalletTooltip] = useState(false);

  // Auto-hide wallet pill after 10 seconds
  useEffect(() => {
    if (walletBalance > 0 && showWalletPill) {
      const timer = setTimeout(() => {
        setShowWalletPill(false);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [walletBalance, showWalletPill]);

  // Filter best sellers from menu items
  const bestSellers = useMemo(() => {
    return menuItems
      .filter(item => item.isBestSeller || item.bestseller)
      .slice(0, 6);
  }, [menuItems]);

  const isLoading = itemsLoading || walletLoading || bannersLoading;

  // Cuisines
  const cuisines = [
    {
      id: 1,
      name: 'North Indian',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80',
    },
    {
      id: 2,
      name: 'Chinese',
      image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&q=80',
    },
    {
      id: 3,
      name: 'Tandoor',
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80',
    },
    {
      id: 4,
      name: 'Continental',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80',
    },
  ];


  const handleAddToCart = (item) => {
    addItem({
      id: item.id || item._id,
      _id: item._id || item.id, // Preserve both for compatibility
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] pb-20">
      {/* Header */}
      <header className="bg-[#f8f7f6]/80 dark:bg-[#211811]/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Restaurant Name */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="HungerWood Logo"
              className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-[#543918]/30 dark:border-[#543918]/40"
            />
            <div className="text-left">
              <h1 className="text-lg font-bold text-[#181411] dark:text-white tracking-tight">
                HungerWood
              </h1>
              <p className="text-[10px] text-[#543918] font-bold uppercase tracking-widest">
                Gaya, Bihar
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Wallet Icon */}
            <button
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-md border border-gray-200 dark:border-zinc-700 hover:shadow-lg transition-shadow"
              aria-label="Wallet"
              onClick={() => navigate('/wallet')}
              onMouseEnter={() => setShowWalletTooltip(true)}
              onMouseLeave={() => setShowWalletTooltip(false)}
            >
              <span className={`material-symbols-outlined ${walletBalance > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                account_balance_wallet
              </span>

              {/* Balance Badge */}
              {!walletLoading && walletBalance > 0 && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                  ₹{walletBalance}
                </div>
              )}

              {/* Tooltip */}
              {showWalletTooltip && (
                <div className="absolute top-12 right-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10">
                  Use wallet balance & save more
                  <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                </div>
              )}
            </button>

            {/* Search Icon */}
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-md border border-gray-200 dark:border-zinc-700 hover:shadow-lg transition-shadow"
              aria-label="Search"
              onClick={() => navigate('/menu?search=true')}
            >
              <span className="material-symbols-outlined text-gray-700 dark:text-white">search</span>
            </button>
          </div>
        </div>
      </header>

      {/* Wallet Balance Pill (Dismissible) */}
      {!walletLoading && walletBalance > 0 && showWalletPill && (
        <div className="px-4 mt-2 animate-slideDown">
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-200 dark:border-green-700 rounded-xl p-3 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2 flex-1">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">
                account_balance_wallet
              </span>
              <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                Wallet balance: ₹{walletBalance}
              </p>
              <button
                onClick={() => navigate('/checkout')}
                className="ml-2 text-xs font-bold text-green-600 dark:text-green-400 underline"
              >
                Use now →
              </button>
            </div>
            <button
              onClick={() => setShowWalletPill(false)}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-green-200 dark:hover:bg-green-700/30 transition-colors"
              aria-label="Dismiss"
            >
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm">
                close
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Promotional Carousel */}
      <div className="mt-2">
        <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 gap-4">
          {bannersLoading ? (
            <BannerSkeleton />
          ) : activeBanners.length > 0 ? (
            activeBanners.map((banner, index) => (
              <div
                key={banner.id || banner._id || `banner-${index}`}
                className="snap-center shrink-0 w-[85%] aspect-[2/1] rounded-xl relative overflow-hidden cursor-pointer shadow-lg border border-gray-200 dark:border-zinc-700 hover:shadow-xl transition-shadow"
                onClick={() => banner.ctaLink && navigate(banner.ctaLink)}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute inset-0 p-5 flex flex-col justify-center text-white">
                  {banner.badge && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded w-fit mb-2 text-white"
                      style={{ backgroundColor: banner.badgeColor }}
                    >
                      {banner.badge}
                    </span>
                  )}
                  <h3 className="text-xl font-extrabold leading-tight text-white">
                    {banner.title}
                    {banner.subtitle && (
                      <>
                        <br />
                        {banner.subtitle}
                      </>
                    )}
                  </h3>
                  {banner.description && (
                    <p className="text-xs mt-1 text-gray-200">{banner.description}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            // Fallback banner if no active banners
            <div className="snap-center shrink-0 w-[85%] aspect-[2/1] rounded-xl relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg border border-orange-400">
              <div className="text-center text-white p-5">
                <h3 className="text-2xl font-extrabold">Welcome to HungerWood</h3>
                <p className="text-sm mt-2">Gaya's Premium Dining Experience</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Refer & Earn Banner */}
      <div className="px-4 mt-4">
        <button
          onClick={() => navigate('/referral')}
          className="w-full bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-700 rounded-xl p-3 flex items-center justify-between shadow-md hover:shadow-lg transition-shadow group"
        >
          {/* Left: Icon & Text */}
          <div className="flex items-center gap-3 flex-1">
            {/* Gift Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-2xl">🎁</span>
            </div>

            {/* Text */}
            <div className="text-left">
              <h3 className="text-base font-bold text-green-800 dark:text-green-300 leading-tight">
                Refer & Earn ₹50
              </h3>
              <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                Invite friends & earn wallet cash
              </p>
            </div>
          </div>

          {/* Right: CTA Button */}
          <div className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm transition-colors group-hover:shadow-md">
            <span className="text-sm font-bold">Invite</span>
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </div>
        </button>
      </div>

      {/* Restaurant Info Card */}
      <div className="px-4 mt-6">
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-lg border-2 border-gray-200 dark:border-zinc-700">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-xl font-extrabold text-[#181411] dark:text-white">HungerWood</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Multi-cuisine • Premium Dining</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-lg text-sm font-bold">
                <span>4.5</span>
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                  star
                </span>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 font-medium">1.2k+ reviews</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50 dark:border-zinc-700">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-green-500 text-lg">schedule</span>
              <span className="text-xs font-bold text-green-600">Open Now</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[#543918] text-lg">payments</span>
              <span className="text-xs font-semibold">₹400 for two</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-gray-400 text-lg">distance</span>
              <span className="text-xs font-semibold">2.4 km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Explore Cuisines Section */}
      <div className="mt-8">
        <div className="px-4 flex justify-between items-end mb-4">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-[#181411] dark:text-white">
              Explore Cuisines
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Authentic flavors from around the world</p>
          </div>
          <button className="text-[#543918] text-xs font-bold" onClick={() => navigate('/menu')}>View All</button>
        </div>
        <div className="grid grid-cols-2 gap-3 px-4">
          {cuisines.map((cuisine) => (
            <button 
              key={cuisine.id} 
              className="relative aspect-square rounded-xl overflow-hidden group shadow-md border-2 border-gray-200 dark:border-zinc-700 hover:shadow-lg transition-shadow" 
              onClick={() => navigate(`/menu?category=${cuisine.name}`)}
            >
              <img src={cuisine.image} alt={cuisine.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-3 left-3">
                <p className="text-white text-sm font-bold drop-shadow-lg">{cuisine.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="mt-8 mb-2">
        <div className="px-4 flex justify-between items-end mb-4">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-[#181411] dark:text-white">Best Sellers</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Most loved dishes in Gaya</p>
          </div>
        </div>
        <div className="flex overflow-x-auto scrollbar-hide gap-4 px-4 pb-4">
          {isLoading ? (
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[180px] bg-white dark:bg-zinc-800 rounded-xl shadow-md border-2 border-gray-200 dark:border-zinc-700 overflow-hidden animate-pulse">
                  <div className="h-32 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            bestSellers.map((item, index) => {
            // Handle both API format (isVeg) and fallback format (veg)
            const isVeg = item.isVeg !== undefined ? item.isVeg : item.veg;
            const itemId = item.id || item._id || `best-seller-${index}`;

            return (
              <div
                key={itemId}
                onClick={() => navigate(`/menu/${itemId}`)}
                className="min-w-[180px] bg-white dark:bg-zinc-800 rounded-xl shadow-md border-2 border-gray-200 dark:border-zinc-700 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="h-32 bg-cover bg-center relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  {item.favorite && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur p-1 rounded-full shadow-sm">
                      <span
                        className="material-symbols-outlined text-[#543918] text-sm leading-none"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                      >
                        favorite
                      </span>
                    </div>
                  )}
                  {isVeg && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-[8px] font-bold px-1 rounded">
                      VEG
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-bold line-clamp-1 text-[#181411] dark:text-white">{item.name}</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{item.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-bold text-[#181411] dark:text-white">₹{item.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className="bg-[#543918]/10 text-[#543918] px-3 py-1 rounded text-xs font-extrabold border border-[#543918]/20 hover:bg-[#543918] hover:text-white transition-colors"
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            );
          }))}
        </div>
      </div>

      {/* Floating Cart Button */}
      <FloatingCartButton />

      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </div>
  );
};

export default Home;
