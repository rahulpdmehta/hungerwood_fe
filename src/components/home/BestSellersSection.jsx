import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useMenuItems } from '@hooks/useMenuQueries';
import useCartStore from '@store/useCartStore';
import { MenuSkeleton } from '@components/common/Loader';

const BestSellersSection = () => {
  const navigate = useNavigate();
  const { addItem, getItemQuantity, incrementQuantity, decrementQuantity, removeItem } = useCartStore();
  const { data: menuItems = [], isLoading: itemsLoading } = useMenuItems();

  // Filter best sellers from menu items
  const bestSellers = useMemo(() => {
    return menuItems
      .filter(item => item.isBestSeller || item.bestseller)
      .slice(0, 6);
  }, [menuItems]);

  const handleAddToCart = (item) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      discount: item.discount || 0,
      quantity: 1,
      image: item.image,
    });
  };

  const handleIncrement = (item, e) => {
    e.stopPropagation();
    const quantity = getItemQuantity(item.id);
    if (quantity === 0) {
      handleAddToCart(item);
    } else {
      incrementQuantity(item.id);
    }
  };

  const handleDecrement = (item, e) => {
    e.stopPropagation();
    const quantity = getItemQuantity(item.id);
    if (quantity > 1) {
      decrementQuantity(item.id);
    } else if (quantity === 1) {
      removeItem(item.id);
    }
  };

  return (
    <div className="mt-4 mb-2">
      <div className="px-4 flex justify-between items-end mb-2">
        <div>
          <h3 className="text-lg font-extrabold tracking-tight text-[#181411] dark:text-white">Best Sellers</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Most loved dishes in Gaya</p>
        </div>
      </div>
      <div className="flex overflow-x-auto scrollbar-hide gap-2 px-4 pb-4">
        {itemsLoading ? (
          <div className="flex gap-2">
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
            const itemId = item.id || `best-seller-${index}`;

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
                        className="material-symbols-outlined text-[#7f4f13] text-sm leading-none"
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
                    {(() => {
                      const quantity = getItemQuantity(item.id);
                      return quantity > 0 ? (
                        <div className="flex items-center gap-1.5 text-[#181411] dark:text-white bg-[#f8f7f6] dark:bg-white/5 rounded border border-gray-200 dark:border-gray-700">
                          <button
                            onClick={(e) => handleDecrement(item, e)}
                            className="text-xs font-bold flex h-6 w-6 items-center justify-center rounded-l hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                          <button
                            onClick={(e) => handleIncrement(item, e)}
                            className="text-xs font-bold flex h-6 w-6 items-center justify-center rounded-r text-[#7f4f13] hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          className="bg-[#7f4f13]/10 text-[#7f4f13] px-3 py-1 rounded text-xs font-extrabold border border-[#7f4f13]/20 hover:bg-[#7f4f13] hover:text-white transition-colors"
                        >
                          ADD
                        </button>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BestSellersSection;
