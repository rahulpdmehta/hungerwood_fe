import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useCartStore from '@store/useCartStore';
import useMenuStore from '@store/useMenuStore';
import useWalletStore from '@store/useWalletStore';
import BottomNavBar from '@components/layout/BottomNavBar';
import FloatingCartButton from '@components/layout/FloatingCartButton';
import logo from '@assets/images/logo_1.jpeg';
import * as bannerService from '@services/banner.service';

const Home = () => {
  const navigate = useNavigate();
  const { totalItems, totalPrice, addItem } = useCartStore();
  const { fetchItems } = useMenuStore();
  const { balance: walletBalance, fetchBalance } = useWalletStore();
  const [loading, setLoading] = useState(true);
  const [bestSellers, setBestSellers] = useState([]);
  const [showWalletPill, setShowWalletPill] = useState(true);
  const [showWalletTooltip, setShowWalletTooltip] = useState(false);
  const [activeBanners, setActiveBanners] = useState([]);

  // Load data from store (with caching)
  useEffect(() => {
    loadBestSellers();
    loadWalletBalance();
    loadBanners();
  }, []);

  // Auto-hide wallet pill after 10 seconds
  useEffect(() => {
    if (walletBalance > 0 && showWalletPill) {
      const timer = setTimeout(() => {
        setShowWalletPill(false);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [walletBalance, showWalletPill]);

  const loadWalletBalance = async () => {
    try {
      console.log('🔄 Loading wallet balance from Home page (force refresh)...');
      await fetchBalance(true); // Force refresh to get latest balance
      console.log('✅ Wallet balance loaded');
    } catch (error) {
      console.error('❌ Failed to load wallet balance:', error);
    }
  };

  const loadBanners = async () => {
    try {
      const banners = await bannerService.getActiveBanners();
      setActiveBanners(banners);
      console.log('✅ Loaded active banners:', banners.length);
    } catch (error) {
      console.error('❌ Failed to load banners:', error);
      // Set empty array on error so the page still works
      setActiveBanners([]);
    }
  };

  const loadBestSellers = async () => {
    setLoading(true);
    try {
      // Fetch from store (will use cache if valid - 5 min)
      const items = await fetchItems();
      const bestSellerItems = items.filter(item => item.isBestSeller || item.bestseller).slice(0, 6);
      setBestSellers(bestSellerItems);
    } catch (error) {
      console.error('Failed to load best sellers:', error);
    } finally {
      setLoading(false);
    }
  };

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
      id: item.id,
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
              className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-[#cf6317]/20"
            />
            <div className="text-left">
              <h1 className="text-lg font-bold text-[#181411] dark:text-white tracking-tight">
                HungerWood
              </h1>
              <p className="text-[10px] text-[#cf6317] font-bold uppercase tracking-widest">
                Gaya, Bihar
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Wallet Icon */}
            <button
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-sm"
              aria-label="Wallet"
              onClick={() => navigate('/wallet')}
              onMouseEnter={() => setShowWalletTooltip(true)}
              onMouseLeave={() => setShowWalletTooltip(false)}
            >
              <span className={`material-symbols-outlined ${walletBalance > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                account_balance_wallet
              </span>

              {/* Balance Badge */}
              {walletBalance > 0 && (
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
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-sm"
              aria-label="Search"
              onClick={() => navigate('/menu?search=true')}
            >
              <span className="material-symbols-outlined text-gray-700 dark:text-white">search</span>
            </button>
          </div>
        </div>
      </header>

      {/* Wallet Balance Pill (Dismissible) */}
      {walletBalance > 0 && showWalletPill && (
        <div className="px-4 mt-2 animate-slideDown">
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-xl p-3 flex items-center justify-between shadow-sm">
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
          {activeBanners.length > 0 ? (
            activeBanners.map((banner) => (
              <div
                key={banner.id}
                className="snap-center shrink-0 w-[85%] aspect-[2/1] rounded-xl relative overflow-hidden cursor-pointer"
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
            <div className="snap-center shrink-0 w-[85%] aspect-[2/1] rounded-xl relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
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
          className="w-full bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-700 rounded-xl p-3 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group"
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
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-zinc-700">
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
              <span className="material-symbols-outlined text-[#cf6317] text-lg">payments</span>
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
          <button className="text-[#cf6317] text-xs font-bold" onClick={() => navigate('/menu')}>View All</button>
        </div>
        <div className="grid grid-cols-2 gap-3 px-4">
          {cuisines.map((cuisine) => (
            <button key={cuisine.id} className="relative aspect-square rounded-xl overflow-hidden group" onClick={() => navigate(`/menu?category=${cuisine.name}`)} >
              <img src={cuisine.image} alt={cuisine.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-3 left-3">
                <p className="text-white text-sm font-bold">{cuisine.name}</p>
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
          {bestSellers.map((item) => {
            // Handle both API format (isVeg) and fallback format (veg)
            const isVeg = item.isVeg !== undefined ? item.isVeg : item.veg;

            return (
              <div
                key={item.id}
                onClick={() => navigate(`/menu/${item.id}`)}
                className="min-w-[180px] bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="h-32 bg-cover bg-center relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  {item.favorite && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur p-1 rounded-full shadow-sm">
                      <span
                        className="material-symbols-outlined text-[#cf6317] text-sm leading-none"
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
                      className="bg-[#cf6317]/10 text-[#cf6317] px-3 py-1 rounded text-xs font-extrabold border border-[#cf6317]/20 hover:bg-[#cf6317] hover:text-white transition-colors"
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
