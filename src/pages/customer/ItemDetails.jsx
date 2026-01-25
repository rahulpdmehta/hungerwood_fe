import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useCartStore from '@store/useCartStore';
import BackButton from '@components/common/BackButton';
import { useMenuItem } from '@hooks/useMenuQueries';
import { ItemDetailsSkeleton } from '@components/common/Loader';
import PriceDisplay from '@components/common/PriceDisplay';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  // React Query hook for fetching menu item
  const { data: item, isLoading: loading, error } = useMenuItem(id);

  // State
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState('Low');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fallback item data (in case API fails)
  const fallbackItem = {
    id: parseInt(id) || 1,
    name: 'Signature Butter Chicken',
    description: 'A rich, creamy tomato-based gravy with tender pieces of tandoori chicken, slow-cooked with authentic spices and finished with a dollop of fresh cream and white butter. Served with love from HungerWood kitchen.',
    price: 349,
    rating: 4.8,
    bestseller: true,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80',
    category: 'Tandoor',
    veg: false,
  };

  // Use API data if available, otherwise use fallback
  const displayItem = item || fallbackItem;

  // Add-ons configuration
  const addons = [
    { id: 'extra-butter', name: 'Extra Butter', price: 40 },
    { id: 'mint-chutney', name: 'Mint Chutney', price: 20 },
    { id: 'lachha-pyaz', name: 'Lachha Pyaz', price: 15 },
  ];

  // Handlers
  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: displayItem?.name,
        text: displayItem?.description,
        url: window.location.href,
      });
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const toggleAddon = (addonId) => {
    setSelectedAddons(prev => {
      if (prev.includes(addonId)) {
        return prev.filter(id => id !== addonId);
      }
      return [...prev, addonId];
    });
  };

  const calculateTotalPrice = () => {
    let total = displayItem.price * quantity;
    selectedAddons.forEach(addonId => {
      const addon = addons.find(a => a.id === addonId);
      if (addon) {
        total += addon.price * quantity;
      }
    });
    return total;
  };

  const handleAddToCart = () => {
    addItem({
      id: displayItem.id || displayItem._id,
      _id: displayItem._id || displayItem.id, // Preserve both for compatibility
      name: displayItem.name,
      price: calculateTotalPrice(),
      discount: displayItem.discount || 0,
      quantity: quantity,
      image: displayItem.image,
      customizations: {
        spiceLevel,
        addons: selectedAddons.map(addonId => {
          const addon = addons.find(a => a.id === addonId);
          return { id: addonId, name: addon.name, price: addon.price };
        }),
      },
    });
    navigate('/cart');
  };

  if (loading) {
    return <ItemDetailsSkeleton />;
  }

  if (!displayItem) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f6] dark:bg-[#211811]">
      {/* Top Navigation Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/40 to-transparent backdrop-blur-sm">
          <BackButton
          className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border-2 border-white/30 shadow-md hover:shadow-lg transition-shadow"
          variant="minimal"
        />
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border-2 border-white/30 shadow-md hover:shadow-lg transition-shadow"
          >
            <span className="material-symbols-outlined">share</span>
          </button>
          <button
            onClick={toggleFavorite}
            className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border-2 border-white/30 shadow-md hover:shadow-lg transition-shadow"
          >
            <span
              className="material-symbols-outlined"
              style={isFavorite ? { fontVariationSettings: '"FILL" 1' } : {}}
            >
              favorite
            </span>
          </button>
        </div>
      </div>

      {/* Header Image Section */}
      <div
        className="relative w-full aspect-[4/3] sm:aspect-video bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url("${displayItem.image}")` }}
      ></div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 px-4 -mt-6 bg-[#f8f7f6] dark:bg-[#211811] rounded-t-xl relative z-20 pb-32 max-w-[calc(100%-10px)] ml-[5px] shadow-2xl border-t-2 border-gray-200 dark:border-gray-700">
        {/* Headline & Price */}
        <div className="flex items-start justify-between pt-6 pb-2">
          <div className="flex-1">
            <h1 className="text-[#181411] dark:text-white tracking-tight text-[28px] font-bold leading-tight">
              {displayItem.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center text-yellow-500">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="text-sm font-semibold ml-1">{displayItem.rating || 4.5}</span>
              </div>
              <span className="text-gray-400 text-sm">•</span>
              {(displayItem.bestseller || displayItem.isBestSeller) && (
                <span className="text-gray-500 dark:text-gray-400 text-sm italic">
                  Bestseller in Gaya
                </span>
              )}
            </div>
          </div>
          <PriceDisplay 
            price={displayItem.price} 
            discount={displayItem.discount || 0} 
            size="2xl" 
          />
        </div>

        {/* Body Description */}
        <p className="text-[#181411]/70 dark:text-gray-400 text-base font-normal leading-relaxed py-3">
          {displayItem.description}
        </p>

        <div className="h-0.5 bg-gray-300 dark:bg-gray-700 my-4"></div>

        {/* Spice Level Selection */}
        <div className="pb-6">
          <h3 className="text-[#181411] dark:text-white text-lg font-bold mb-3">Spice Level</h3>
          <div className="flex gap-3">
            {['Low', 'Med', 'High'].map((level) => (
              <button
                key={level}
                onClick={() => setSpiceLevel(level)}
                className={`flex-1 py-3 px-4 rounded-lg border-2 font-bold text-center transition-all shadow-sm ${spiceLevel === level
                  ? 'border-[#543918] bg-[#543918]/10 text-[#543918] shadow-md'
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:shadow-md'
                  }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Add-ons Selection */}
        <div className="pb-6">
          <h3 className="text-[#181411] dark:text-white text-lg font-bold mb-3">Add-ons</h3>
          <div className="space-y-3">
            {addons.map((addon) => (
              <label
                key={addon.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 cursor-pointer hover:border-[#543918]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedAddons.includes(addon.id)}
                    onChange={() => toggleAddon(addon.id)}
                    className="size-5 rounded border-gray-300 text-[#543918] focus:ring-[#543918]"
                  />
                  <span className="font-medium">{addon.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-500">+₹{addon.price}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#211811] border-t-2 border-gray-200 dark:border-gray-700 p-4 pb-8 z-30 flex items-center gap-4 shadow-2xl">
        {/* Quantity Selector */}
        <div className="flex items-center justify-between bg-gray-200 dark:bg-gray-800 rounded-full p-1 min-w-[120px]">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-gray-700 text-[#543918] shadow-sm disabled:opacity-50"
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
          <span className="text-lg font-bold px-2">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="flex size-10 items-center justify-center rounded-full bg-[#543918] text-white shadow-sm"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        {/* Add to Cart CTA */}
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-[#543918] text-white h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-lg shadow-xl border-2 border-[#543918] hover:shadow-2xl active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">shopping_basket</span>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ItemDetails;
