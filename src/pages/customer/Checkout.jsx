import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useCartStore from '@store/useCartStore';
import useWalletStore from '@store/useWalletStore';
import BackButton from '@components/common/BackButton';
import { orderService } from '@services/order.service';
import { addressService } from '@services/address.service';
import WalletSection from '@components/checkout/WalletSection';
import { useAnimation } from '@/contexts/AnimationContext';
import PriceDisplay from '@components/common/PriceDisplay';
import { BILLING } from '@utils/constants';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, totalPrice, clearCart } = useCartStore();
  const { animations } = useAnimation();

  // Get data from cart page
  const cookingInstructions = location.state?.cookingInstructions || '';
  const cartGrandTotal = location.state?.grandTotal || 0;

  const [orderType, setOrderType] = useState('Delivery');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [showDetails, setShowDetails] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Wallet state
  const { balance: walletBalance, loading: walletLoading, fetchBalance } = useWalletStore();
  const [walletAmount, setWalletAmount] = useState(0);

  // Calculations
  const itemTotal = totalPrice;
  const deliveryFee = orderType === 'Delivery' ? BILLING.DELIVERY_FEE : 0;
  const taxes = Math.round(itemTotal * BILLING.TAX_RATE);
  const subtotal = itemTotal + deliveryFee + taxes;
  const totalPayable = subtotal - walletAmount;

  // Load addresses and wallet balance on mount
  useEffect(() => {
    loadAddresses();
    loadWalletBalance();
  }, []);

  const loadWalletBalance = async () => {
    try {
      console.log('🔄 Loading wallet balance for checkout (force refresh)...');
      await fetchBalance(true); // Force refresh to get latest balance
      console.log('✅ Wallet balance loaded for checkout');
    } catch (error) {
      console.error('❌ Failed to load wallet balance:', error);
    }
  };

  // Debug cart items
  useEffect(() => {
    console.log('=== CART DEBUG ===');
    console.log('Cart items:', items);
    console.log('Number of items:', items.length);
    if (items.length > 0) {
      console.log('First item:', items[0]);
      console.log('First item has id?', !!items[0].id);
      console.log('First item has _id?', !!items[0]._id);
    }
  }, [items]);

  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await addressService.getAddresses();
      setAddresses(response.data);
      // Set default address as selected
      const defaultAddress = response.data.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (response.data.length > 0) {
        setSelectedAddress(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleChangeAddress = () => {
    // Navigate to address management page
    navigate('/addresses');
  };

  const handleWalletChange = (amount) => {
    setWalletAmount(amount);
    console.log('Wallet amount changed:', amount);
  };

  const handlePlaceOrder = async () => {
    // Set flag to prevent empty cart redirect during order placement
    setIsPlacingOrder(true);

    try {
      // Validate cart items have IDs
      const invalidItems = items.filter(item => !item.id && !item._id);
      if (invalidItems.length > 0) {
        console.error('Cart items missing IDs:', invalidItems);
        alert('Some items in your cart are invalid. Please clear your cart and add items again.');
        setIsPlacingOrder(false);
        return;
      }

      // Validate delivery address for delivery orders
      if (orderType === 'Delivery' && !selectedAddress) {
        alert('Please select a delivery address');
        setIsPlacingOrder(false);
        return;
      }

      // Prepare order data
      const finalPaymentMethod = walletAmount >= subtotal ? 'WALLET' : paymentMethod.toUpperCase();

      const orderData = {
        items: items.map(item => ({
          menuItem: item.id || item._id,
          quantity: item.quantity,
          price: item.price,
          id: item.id || item._id,
          name: item.name || item.title || 'Menu Item',
          image: item.image || item.imageUrl || null,
          discount: item.discount || 0,
        })),
        orderType: orderType.toUpperCase(),
        deliveryAddress: orderType === 'Delivery' && selectedAddress ? {
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
        } : null,
        paymentMethod: finalPaymentMethod,
        specialInstructions: cookingInstructions,
        itemTotal,
        discount: 0, // TODO: Add discount logic
        deliveryFee,
        tax: taxes,
        walletUsed: walletAmount, // Backend expects "walletUsed"
        totalAmount: totalPayable,
      };

      console.log('💰 Wallet amount being sent:', walletAmount);
      console.log('🛒 Cart items with details:', items);
      console.log('📦 Order payload:', JSON.stringify(orderData, null, 2));

      // Call backend API to create order
      const response = await orderService.createOrder(orderData);
      const orderId = response.data.id || response.data._id;

      // 🎉 Trigger order placed animation and sound
      animations.orderPlaced({
        orderNumber: response.data.orderNumber || orderId,
        totalAmount: totalPayable,
        orderType,
      });

      // Navigate to order tracking page BEFORE clearing cart
      // This prevents the empty cart redirect from interfering
      setTimeout(() => {
        navigate(`/orders/${orderId}`, {
          state: {
            order: response.data,
            orderPlaced: true,
            orderType,
            paymentMethod,
            totalPayable,
            cookingInstructions,
          },
          replace: true, // Replace history entry so back button doesn't go to checkout
        });

        // Clear cart after navigation is initiated
        clearCart();
      }, 5500); // Wait for animation to complete (5 seconds animation + 0.5s buffer)
    } catch (error) {
      console.error('Failed to place order:', error);
      alert(error.message || 'Failed to place order. Please try again.');
      setIsPlacingOrder(false); // Reset flag on error
    }
  };

  // Redirect to cart if empty (but not when placing an order)
  if (items.length === 0 && !isPlacingOrder) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-[#f8f7f6] dark:bg-[#211811] shadow-xl overflow-x-hidden">
      {/* TopAppBar */}
      <div className="sticky top-0 z-50 flex items-center bg-white dark:bg-[#2d221a] p-4 border-b border-[#f4f2f0] dark:border-[#3d2e24] justify-between">
        <BackButton
          className="text-[#181411] dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          variant="minimal"
        />
        <h2 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
          Checkout
        </h2>
      </div>

      <main className="flex-1 pb-40">
        {/* Segmented Buttons - Order Type */}
        <div className="px-4 py-6">
          <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-white dark:bg-[#2d221a] p-1 shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24]">
            <label
              className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-semibold transition-all ${orderType === 'Dine-in'
                ? 'bg-[#cf6317] text-white'
                : 'text-[#887263] dark:text-gray-400'
                }`}
            >
              <span className="truncate">Dine-in</span>
              <input
                type="radio"
                name="order-type"
                value="Dine-in"
                checked={orderType === 'Dine-in'}
                onChange={(e) => setOrderType(e.target.value)}
                className="invisible w-0"
              />
            </label>
            <label
              className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-semibold transition-all ${orderType === 'Takeaway'
                ? 'bg-[#cf6317] text-white'
                : 'text-[#887263] dark:text-gray-400'
                }`}
            >
              <span className="truncate">Takeaway</span>
              <input
                type="radio"
                name="order-type"
                value="Takeaway"
                checked={orderType === 'Takeaway'}
                onChange={(e) => setOrderType(e.target.value)}
                className="invisible w-0"
              />
            </label>
            <label
              className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-semibold transition-all ${orderType === 'Delivery'
                ? 'bg-[#cf6317] text-white'
                : 'text-[#887263] dark:text-gray-400'
                }`}
            >
              <span className="truncate">Delivery</span>
              <input
                type="radio"
                name="order-type"
                value="Delivery"
                checked={orderType === 'Delivery'}
                onChange={(e) => setOrderType(e.target.value)}
                className="invisible w-0"
              />
            </label>
          </div>
        </div>

        {/* Delivery Address (only show if Delivery is selected) */}
        {orderType === 'Delivery' && (
          <>
            <div className="flex items-center justify-between px-4 pb-2">
              <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                Delivery Address
              </h3>
            </div>
            <div className="px-4 mb-6">
              {loadingAddresses ? (
                <div className="bg-white dark:bg-[#2d221a] p-4 rounded-xl shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24]">
                  <p className="text-text-secondary text-sm">Loading addresses...</p>
                </div>
              ) : !selectedAddress ? (
                <div className="bg-white dark:bg-[#2d221a] p-4 rounded-xl shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24]">
                  <p className="text-text-secondary text-sm mb-3">No saved addresses found</p>
                  <button
                    onClick={handleChangeAddress}
                    className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-[#cf6317] text-white text-sm font-bold transition-colors hover:bg-[#cf6317]/90"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#2d221a] p-4 rounded-xl shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-[2_2_0px] flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#cf6317] text-xl">
                          {selectedAddress.label === 'Home' ? 'home' : selectedAddress.label === 'Office' ? 'work' : 'location_on'}
                        </span>
                        <p className="text-[#181411] dark:text-white text-base font-bold leading-tight">
                          {selectedAddress.label}
                        </p>
                      </div>
                      <p className="text-[#887263] dark:text-gray-400 text-sm font-normal leading-normal">
                        {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                      </p>
                      <button
                        onClick={handleChangeAddress}
                        className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-[#cf6317]/10 text-[#cf6317] text-sm font-bold transition-colors hover:bg-[#cf6317]/20 w-fit"
                      >
                        Change
                      </button>
                    </div>
                    <div
                      className="w-32 h-24 bg-center bg-no-repeat bg-cover rounded-lg shrink-0"
                      style={{
                        backgroundImage:
                          'url("https://api.mapbox.com/styles/v1/mapbox/light-v10/static/85.1,24.8,12,0/128x96@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw")',
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Menu Items */}
        <div className="px-4 pb-2 pt-4">
          <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            Your Order ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h3>
        </div>
        <div className="px-4 space-y-3 mb-8">
          <div className="bg-white dark:bg-[#2d221a] rounded-xl border border-[#f4f2f0] dark:border-[#3d2e24] overflow-hidden">
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className={`flex items-center gap-3 p-3 ${index !== items.length - 1 ? 'border-b border-[#f4f2f0] dark:border-[#3d2e24]' : ''}`}
              >
                {/* Item Image */}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#181411] dark:text-white text-sm truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[#887263] dark:text-gray-400">
                      Qty: {item.quantity}
                    </span>
                    <span className="text-xs text-[#887263] dark:text-gray-400">•</span>
                    <PriceDisplay
                      price={item.price}
                      discount={item.discount || 0}
                      size="sm"
                    />
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-[#181411] dark:text-white">
                    ₹{Math.round(item.price * (1 - (item.discount || 0) / 100)) * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wallet Section */}
        <div className="px-4">
          <WalletSection
            walletBalance={walletBalance}
            orderTotal={subtotal}
            maxWalletUsage={BILLING.MAX_WALLET_USAGE_PERCENT}
            onWalletChange={handleWalletChange}
            isLoading={walletLoading}
          />
        </div>

        {/* Payment Method */}
        <div className="px-4 pb-2">
          <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            Payment Method
          </h3>
        </div>
        <div className="px-4 space-y-3 mb-8">
          <label className="flex items-center justify-between p-4 bg-white dark:bg-[#2d221a] rounded-xl border border-[#f4f2f0] dark:border-[#3d2e24] cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </div>
              <div>
                <p className="font-bold text-[#181411] dark:text-white">UPI Payment</p>
                <p className="text-xs text-[#887263] dark:text-gray-400">Google Pay, PhonePe, Paytm</p>
              </div>
            </div>
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-5 h-5 text-[#cf6317] border-gray-300 focus:ring-[#cf6317]"
            />
          </label>
          <label className="flex items-center justify-between p-4 bg-white dark:bg-[#2d221a] rounded-xl border border-[#f4f2f0] dark:border-[#3d2e24] cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <div>
                <p className="font-bold text-[#181411] dark:text-white">Cash on Delivery</p>
                <p className="text-xs text-[#887263] dark:text-gray-400">Pay at your doorstep</p>
              </div>
            </div>
            <input
              type="radio"
              name="payment"
              value="CASH"
              checked={paymentMethod === 'CASH'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-5 h-5 text-[#cf6317] border-gray-300 focus:ring-[#cf6317]"
            />
          </label>
        </div>

        {/* Bill Details */}
        <div className="px-4">
          <div className="bg-white dark:bg-[#2d221a] p-4 rounded-xl border border-[#f4f2f0] dark:border-[#3d2e24] space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#887263] dark:text-gray-400">Item Total</span>
              <span className="font-medium">₹{itemTotal.toFixed(2)}</span>
            </div>
            {orderType === 'Delivery' && (
              <div className="flex justify-between text-sm">
                <span className="text-[#887263] dark:text-gray-400">Delivery Fee</span>
                <span className="font-medium">₹{deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-[#887263] dark:text-gray-400">Taxes & Charges</span>
              <span className="font-medium">₹{taxes.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-[#f4f2f0] dark:border-[#3d2e24] flex justify-between">
              <span className="font-bold">Total Payable</span>
              <span className="font-bold text-[#cf6317]">₹{totalPayable.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#2d221a] border-t border-[#f4f2f0] dark:border-[#3d2e24] max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4 px-2">
          <div>
            <p className="text-xs text-[#887263] dark:text-gray-400 font-medium">TOTAL PRICE</p>
            <p className="text-xl font-bold text-[#181411] dark:text-white">₹{totalPayable.toFixed(2)}</p>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-[#cf6317] flex items-center gap-1 text-sm font-bold"
          >
            View Details{' '}
            <span className="material-symbols-outlined text-sm">
              {showDetails ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-[#cf6317] hover:bg-[#cf6317]/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
        >
          Place Order
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default Checkout;
