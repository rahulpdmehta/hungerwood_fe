import { useNavigate } from 'react-router-dom';
import PriceDisplay from '@components/common/PriceDisplay';
import useCartStore from '@store/useCartStore';

const MenuItemCard = ({ item, onAddToCart }) => {
    const navigate = useNavigate();
    const { getItemQuantity, incrementQuantity, decrementQuantity, addItem, removeItem } = useCartStore();
    const quantity = getItemQuantity(item.id);

    // Handle both API format (isVeg, isBestSeller) and fallback format (veg, bestseller)
    const isVeg = item.isVeg !== undefined ? item.isVeg : item.veg;
    const isBestSeller = item.isBestSeller !== undefined ? item.isBestSeller : item.bestseller;

    const handleCardClick = () => {
        navigate(`/menu/${item.id}`);
    };

    const handleAddClick = (e) => {
        e.stopPropagation(); // Prevent card click when clicking Add button
        if (onAddToCart) {
            onAddToCart(item);
        } else {
            addItem({
                id: item.id,
                name: item.name,
                price: item.price,
                discount: item.discount || 0,
                quantity: 1,
                image: item.image,
            });
        }
    };

    const handleIncrement = (e) => {
        e.stopPropagation();
        if (quantity === 0) {
            handleAddClick(e);
        } else {
            incrementQuantity(item.id);
        }
    };

    const handleDecrement = (e) => {
        e.stopPropagation();
        if (quantity > 1) {
            decrementQuantity(item.id);
        } else if (quantity === 1) {
            // Remove item if quantity is 1
            removeItem(item.id);
        }
    };

    return (
        <div
            onClick={handleCardClick}
            className="flex items-center gap-2 overflow-hidden  bg-white dark:bg-gray-900 rounded-lg shadow-md border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
        >
            <div
                className="bg-center bg-no-repeat aspect-square bg-cover w-30 h-30 shrink-0 min-h-[110px]"
                style={{ backgroundImage: `url("${item.image}")` }}
            ></div>
            <div className="flex flex-col flex-1 justify-between min-h-[96px] p-2">
                <div>
                    <div className="flex items-center gap-1 mb-1 relative">
                        <span
                            className={`w-3 h-3 border absolute top-0 right-0 ${isVeg ? 'border-green-500' : 'border-red-500'
                                } p-[1px] flex items-center justify-center`}
                        >
                            <span
                                className={`w-full h-full rounded-full ${isVeg ? 'bg-green-500' : 'bg-red-500'}`}
                            ></span>
                        </span>
                        {isBestSeller && (
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">
                                Bestseller
                            </span>
                        )}
                    </div>
                    <p className="text-[#181411] dark:text-white text-base font-bold leading-tight">{item.name}</p>
                    <p className="text-[#887263] dark:text-gray-400 text-[11px] leading-snug line-clamp-2 mt-1">
                        {item.description}
                    </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <PriceDisplay
                        price={item.price}
                        discount={item.discount || 0}
                        size="sm"
                    />
                    {quantity > 0 ? (
                        <div className="flex items-center gap-2 text-[#181411] dark:text-white bg-[#f8f7f6] dark:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700">
                            <button
                                onClick={handleDecrement}
                                className="text-base font-bold flex h-8 w-8 items-center justify-center rounded-l-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                            >
                                -
                            </button>
                            <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                            <button
                                onClick={handleIncrement}
                                className="text-base font-bold flex h-8 w-8 items-center justify-center rounded-r-lg text-[#7f4f13] hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAddClick}
                            className="flex min-w-[70px] cursor-pointer items-center justify-center rounded-lg h-8 px-3 bg-[#7f4f13]/10 text-[#7f4f13] border border-[#7f4f13]/20 text-xs font-bold hover:bg-[#7f4f13] hover:text-white transition-colors"
                        >
                            <span className="truncate">+ Add</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;
