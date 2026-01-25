import { Link } from 'react-router-dom';
import useCartStore from '@store/useCartStore';

const FloatingCartButton = () => {
    const { totalItems, totalPrice } = useCartStore();

    if (totalItems === 0) {
        document.body.classList.remove('no-floating-cart');
        return null;
    } else {
        document.body.classList.add('no-floating-cart');
    }

    return (
        <div className="fixed bottom-20 left-0 right-0 px-6 z-40">
            <Link to="/cart">
                <button className="w-full bg-[#543918] text-white h-14 rounded-2xl shadow-xl flex items-center justify-between px-6 active:scale-95 transition-transform">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 px-2 py-0.5 rounded-md text-xs font-bold">
                            {totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'}
                        </div>
                        <div className="h-4 w-[1px] bg-white/30"></div>
                        <span className="font-bold text-sm">₹{totalPrice}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold uppercase tracking-wider">View Cart</span>
                        <span className="material-symbols-outlined text-lg">shopping_bag</span>
                    </div>
                </button>
            </Link>
        </div>
    );
};

export default FloatingCartButton;
