import { useNavigate } from 'react-router-dom';
import PriceDisplay from '@components/common/PriceDisplay';

const MenuItemCard = ({ item, onAddToCart }) => {
    const navigate = useNavigate();

    // Handle both API format (isVeg, isBestSeller) and fallback format (veg, bestseller)
    const isVeg = item.isVeg !== undefined ? item.isVeg : item.veg;
    const isBestSeller = item.isBestSeller !== undefined ? item.isBestSeller : item.bestseller;

    const handleCardClick = () => {
        navigate(`/menu/${item.id}`);
    };

    const handleAddClick = (e) => {
        e.stopPropagation(); // Prevent card click when clicking Add button
        onAddToCart(item);
    };

    return (
        <div
            onClick={handleCardClick}
            className="flex items-center gap-4 bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-md border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
        >
            <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl w-24 h-24 shrink-0"
                style={{ backgroundImage: `url("${item.image}")` }}
            ></div>
            <div className="flex flex-col flex-1 justify-between min-h-[96px] py-1">
                <div>
                    <div className="flex items-center gap-1 mb-1">
                        <span
                            className={`w-3 h-3 border ${isVeg ? 'border-green-500' : 'border-red-500'
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
                        size="base"
                    />
                    <button
                        onClick={handleAddClick}
                        className="flex min-w-[70px] cursor-pointer items-center justify-center rounded-lg h-8 px-3 bg-[#7f4f13]/10 text-[#7f4f13] border border-[#7f4f13]/20 text-xs font-bold hover:bg-[#7f4f13] hover:text-white transition-colors"
                    >
                        <span className="truncate">+ Add</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;
