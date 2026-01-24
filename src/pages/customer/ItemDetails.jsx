import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useCartStore from '@store/useCartStore';
import BackButton from '@components/common/BackButton';
import { menuService } from '@services/menu.service';
import PriceDisplay from '@components/common/PriceDisplay';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  // State
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState('Low');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // Sample item data (in real app, fetch from API/store)
  useEffect(() => {
    loadItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadItem = async () => {
    setLoading(true);
    try {
      // Fetch item from API
      const response = await menuService.getItemById(id);
      setItem(response.data);
    } catch (error) {
      console.error('Failed to load item:', error);
      // Fallback to sample data if API fails
      const sampleItem = {
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
      setItem(sampleItem);
    } finally {
      setLoading(false);
    }
  };

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
        title: item?.name,
        text: item?.description,
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
    let total = item.price * quantity;
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
      id: item.id,
      name: item.name,
      price: calculateTotalPrice(),
      discount: item.discount || 0,
      quantity: quantity,
      image: item.image,
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
    return (
      <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cf6317] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f7f6] dark:bg-[#211811]">
      {/* Top Navigation Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/40 to-transparent">
        <BackButton
          className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white"
          variant="minimal"
        />
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white"
          >
            <span className="material-symbols-outlined">share</span>
          </button>
          <button
            onClick={toggleFavorite}
            className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white"
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
        style={{ backgroundImage: `url("${item.image}")` }}
      ></div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 px-4 -mt-6 bg-[#f8f7f6] dark:bg-[#211811] rounded-t-xl relative z-20 pb-32 max-w-[calc(100%-10px)] ml-[5px]">
        {/* Headline & Price */}
        <div className="flex items-start justify-between pt-6 pb-2">
          <div className="flex-1">
            <h1 className="text-[#181411] dark:text-white tracking-tight text-[28px] font-bold leading-tight">
              {item.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center text-yellow-500">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="text-sm font-semibold ml-1">{item.rating}</span>
              </div>
              <span className="text-gray-400 text-sm">•</span>
              {item.bestseller && (
                <span className="text-gray-500 dark:text-gray-400 text-sm italic">
                  Bestseller in Gaya
                </span>
              )}
            </div>
          </div>
          <PriceDisplay 
            price={item.price} 
            discount={item.discount || 0} 
            size="2xl" 
          />
        </div>

        {/* Body Description */}
        <p className="text-[#181411]/70 dark:text-gray-400 text-base font-normal leading-relaxed py-3">
          {item.description}
        </p>

        <div className="h-px bg-gray-200 dark:bg-gray-800 my-4"></div>

        {/* Spice Level Selection */}
        <div className="pb-6">
          <h3 className="text-[#181411] dark:text-white text-lg font-bold mb-3">Spice Level</h3>
          <div className="flex gap-3">
            {['Low', 'Med', 'High'].map((level) => (
              <button
                key={level}
                onClick={() => setSpiceLevel(level)}
                className={`flex-1 py-3 px-4 rounded-lg border-2 font-bold text-center transition-colors ${spiceLevel === level
                  ? 'border-[#cf6317] bg-[#cf6317]/10 text-[#cf6317]'
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
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
                className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 cursor-pointer hover:border-[#cf6317]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedAddons.includes(addon.id)}
                    onChange={() => toggleAddon(addon.id)}
                    className="size-5 rounded border-gray-300 text-[#cf6317] focus:ring-[#cf6317]"
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
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#211811] border-t border-gray-100 dark:border-gray-800 p-4 pb-8 z-30 flex items-center gap-4">
        {/* Quantity Selector */}
        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-full p-1 min-w-[120px]">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-gray-700 text-[#cf6317] shadow-sm disabled:opacity-50"
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
          <span className="text-lg font-bold px-2">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="flex size-10 items-center justify-center rounded-full bg-[#cf6317] text-white shadow-sm"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        {/* Add to Cart CTA */}
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-[#cf6317] text-white h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-lg shadow-lg shadow-[#cf6317]/20 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">shopping_basket</span>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ItemDetails;
