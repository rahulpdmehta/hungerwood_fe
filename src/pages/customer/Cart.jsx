import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useCartStore from '@store/useCartStore';
import useRestaurantStore from '@store/useRestaurantStore';
import BackButton from '@components/common/BackButton';
import PriceDisplay from '@components/common/PriceDisplay';
import { BILLING } from '@utils/constants';

const Cart = () => {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, incrementQuantity, decrementQuantity, removeItem } = useCartStore();
  const { isOpen, closingMessage } = useRestaurantStore();
  const [cookingInstructions, setCookingInstructions] = useState('');

  // Calculate bill details
  const itemTotal = totalPrice;
  // Calculate total discount
  const originalTotal = items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  const totalDiscount = originalTotal - itemTotal;

  const taxes = Math.round(itemTotal * BILLING.TAX_RATE);
  const packagingFee = BILLING.PACKAGING_FEE;
  const grandTotal = itemTotal + taxes + packagingFee;

  const handleAddMore = () => {
    navigate('/menu');
  };

  const handleCheckout = () => {
    // Block checkout if restaurant is closed
    if (!isOpen) {
      alert(closingMessage || 'Restaurant is currently closed. Please try again later.');
      return;
    }
    
    // In real app, pass cart data and cooking instructions
    navigate('/checkout', {
      state: {
        cookingInstructions,
        grandTotal,
      },
    });
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-[#211811] shadow-xl overflow-x-hidden">
        {/* TopAppBar */}
        <div className="sticky top-0 z-10 flex items-center bg-white/90 dark:bg-[#211811]/90 backdrop-blur-md p-4 pb-2 justify-between border-b-2 border-gray-100 dark:border-gray-800 shadow-md">
          <BackButton variant="minimal" />
          <h2 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
            Cart
          </h2>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <span className="material-symbols-outlined text-gray-300 dark:text-gray-700 mb-4" style={{ fontSize: '120px' }}>
            shopping_cart
          </span>
          <h3 className="text-2xl font-bold text-[#181411] dark:text-white mb-2">Your cart is empty</h3>
          <p className="text-[#887263] dark:text-gray-400 mb-6">
            Add some delicious items from our menu to get started!
          </p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-[#7f4f13] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#7f4f13]/90 transition-colors"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-[#211811] shadow-xl overflow-x-hidden">
      {/* TopAppBar */}
      <div className="sticky top-0 z-10 flex items-center bg-white/90 dark:bg-[#211811]/90 backdrop-blur-md p-4 pb-2 justify-between border-b-2 border-gray-100 dark:border-gray-800 shadow-md">
        <BackButton variant="minimal" onClick={() => navigate('/')}/>
        <h2 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
          Cart
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Items Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Items in Cart</h3>
            <span
              onClick={handleAddMore}
              className="text-sm text-[#7f4f13] font-semibold cursor-pointer hover:underline"
            >
              Add more
            </span>
          </div>

          {/* Cart Items */}
          {items.map((item) => {
            // Handle both API format (isVeg) and fallback format (veg)
            const isVeg = item.isVeg !== undefined ? item.isVeg : item.veg;
            
            return (
              <div
                key={item.id || item._id}
                className="flex items-center gap-2 overflow-hidden bg-white dark:bg-gray-900 rounded-lg shadow-md border-2 border-gray-200 dark:border-gray-700 mb-2 last:mb-0"
              >
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover w-[110px] h-[110px] shrink-0"
                  style={{ backgroundImage: `url("${item.image}")` }}
                ></div>
                <div className="flex flex-col flex-1 justify-between min-h-[110px] p-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1 relative">
                      {isVeg !== undefined && (
                        <span
                          className={`w-3 h-3 border absolute top-0 right-0 z-10 ${isVeg ? 'border-green-500' : 'border-red-500'
                            } p-[1px] flex items-center justify-center`}
                        >
                          <span
                            className={`w-full h-full rounded-full ${isVeg ? 'bg-green-500' : 'bg-red-500'}`}
                          ></span>
                        </span>
                      )}
                    </div>
                    <p className="text-[#181411] dark:text-white text-base font-bold leading-tight pr-6 mb-2">{item.name}</p>
                    {/* {item.description && (
                      <p className="text-[#887263] dark:text-gray-400 text-[11px] leading-snug line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    )} */}
                     <PriceDisplay
                      price={item.price}
                      discount={item.discount || 0}
                      size="sm"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                   <p className="total-price text-sm font-bold">Price: ₹{Math.round((item.price - (item.price*item.discount/100)) * item.quantity)}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-[#181411] dark:text-white bg-[#f8f7f6] dark:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => {
                            if (item.quantity === 1) {
                              removeItem(item.id);
                            } else {
                              decrementQuantity(item.id);
                            }
                          }}
                          className="text-base font-bold flex h-8 w-8 items-center justify-center rounded-l-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => incrementQuantity(item.id)}
                          className="text-base font-bold flex h-8 w-8 items-center justify-center rounded-r-lg text-[#7f4f13] hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-200 dark:border-red-800 shrink-0"
                        title="Delete item"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cooking Instructions */}
        <div className="px-4 py-2">
          <label className="flex flex-col w-full">
            <div className="flex items-center gap-2 pb-2">
              <span className="material-symbols-outlined text-[#7f4f13] text-lg">edit_note</span>
              <p className="text-[#181411] dark:text-white text-base font-bold">Cooking Instructions</p>
            </div>
            <textarea
              value={cookingInstructions}
              onChange={(e) => setCookingInstructions(e.target.value)}
              className="form-input flex w-full resize-none overflow-hidden rounded-xl text-[#181411] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#7f4f13] border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 min-h-24 placeholder:text-[#887263] p-[15px] text-sm font-normal leading-normal transition-all shadow-md"
              placeholder="e.g. Make it extra spicy, no onions etc."
            />
          </label>
        </div>

        {/* Bill Details */}
        <div className="mt-4 mx-4">
          <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4">
            Bill Details
          </h3>
          <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700 shadow-md space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#887263] dark:text-gray-400">Item Total</span>
              <span className="font-medium">₹{originalTotal}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-600 dark:text-green-400">Total Discount</span>
                <span className="font-medium text-green-600 dark:text-green-400">-₹{totalDiscount}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <span className="text-[#887263] dark:text-gray-400">Taxes & Charges</span>
                <span className="material-symbols-outlined text-[14px] text-gray-400">info</span>
              </div>
              <span className="font-medium">₹{taxes}</span>
            </div>
            <div className="flex justify-between items-center text-sm pb-3 border-b-2 border-dashed border-gray-300 dark:border-gray-600">
              <span className="text-[#887263] dark:text-gray-400">Packaging Fee</span>
              <span className="font-medium">₹{packagingFee}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-[#181411] dark:text-white text-base font-bold uppercase tracking-wider">
                Grand Total
              </span>
              <span className="text-xl font-extrabold text-[#181411] dark:text-white">₹{grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Restaurant Closed Warning */}
        {!isOpen && (
          <div className="mx-4 mt-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border-2 border-red-200 dark:border-red-800 shadow-md">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-red-600">info</span>
              <div>
                <p className="text-xs font-bold text-red-600 mb-1">Restaurant Closed</p>
                <p className="text-[10px] text-[#887263] dark:text-gray-400 leading-relaxed">
                  {closingMessage || 'Restaurant is currently closed. Orders cannot be placed at this time.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Policy */}
        <div className="mx-4 mt-6 p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border-2 border-green-200 dark:border-green-800 shadow-md">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-green-600">verified_user</span>
            <div>
              <p className="text-xs font-bold text-green-600 mb-1">Safety & Quality Assured</p>
              <p className="text-[10px] text-[#887263] dark:text-gray-400 leading-relaxed uppercase tracking-tight">
                Orders cannot be cancelled once accepted by the kitchen to avoid food waste.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Checkout */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 dark:bg-[#211811]/95 backdrop-blur-md border-t-2 border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#887263] dark:text-gray-400 uppercase font-bold tracking-widest">
              To Pay
            </span>
            <span className="text-lg font-extrabold">₹{grandTotal}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={!isOpen}
            className={`flex-1 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${
              isOpen
                ? 'bg-[#7f4f13] text-white hover:bg-[#7f4f13]/90 active:scale-95 shadow-[#7f4f13]/25'
                : 'bg-gray-400 text-white cursor-not-allowed opacity-60'
            }`}
          >
            <span>{isOpen ? 'Proceed to Checkout' : 'Restaurant Closed'}</span>
            {isOpen && <span className="material-symbols-outlined">chevron_right</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
