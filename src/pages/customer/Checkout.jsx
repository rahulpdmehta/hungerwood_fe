import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import useCartStore from '@store/useCartStore';
import useWalletStore from '@store/useWalletStore';
import useRestaurantStore from '@store/useRestaurantStore';
import useAuthStore from '@store/useAuthStore';
import BackButton from '@components/common/BackButton';
import { orderService } from '@services/order.service';
import { addressService } from '@services/address.service';
import { paymentService } from '@services/payment.service';
import WalletSection from '@components/checkout/WalletSection';
import { useAnimation } from '@/contexts/AnimationContext';
import PriceDisplay from '@components/common/PriceDisplay';
import { BILLING } from '@utils/constants';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, totalPrice, clearCart } = useCartStore();
  const { isOpen, closingMessage } = useRestaurantStore();
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
  
  // Refs to prevent duplicate order placement
  const isProcessingRef = useRef(false);
  const lastOrderTimeRef = useRef(0);
  const DEBOUNCE_TIME = 3000; // 3 seconds debounce

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

  // Handle address selection when returning from addresses page
  useEffect(() => {
    // Check if we have a selected address from location state (when returning from addresses page)
    if (location.state?.selectedAddress) {
      const selectedAddr = location.state.selectedAddress;
      console.log('📍 Selected address from location.state:', selectedAddr);
      // Reload addresses first to ensure we have the latest data, but skip setting default
      addressService.getAddresses().then((response) => {
        setAddresses(response.data);
        // Find the address by ID to ensure we have the latest version, or use the selected one
        const updatedAddress = response.data.find(addr => addr.id === selectedAddr.id) || selectedAddr;
        console.log('✅ Setting selected address:', updatedAddress);
        setSelectedAddress(updatedAddress);
      }).catch((error) => {
        console.error('Failed to reload addresses:', error);
        // If reload fails, still use the selected address from location state
        setSelectedAddress(selectedAddr);
      });
      // Clear the state to avoid stale data on next render
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.state?.selectedAddress]);

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
    }
  }, [items]);

  const loadAddresses = async (skipSetDefault = false) => {
    setLoadingAddresses(true);
    try {
      const response = await addressService.getAddresses();
      setAddresses(response.data);
      // Only set default address if not skipping (i.e., on initial load)
      if (!skipSetDefault) {
        const defaultAddress = response.data.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        } else if (response.data.length > 0) {
          setSelectedAddress(response.data[0]);
        }
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
    // Navigate to address management page with current checkout context
    navigate('/addresses', {
      state: {
        returnTo: '/checkout',
        fromCheckout: true
      }
    });
  };

  const handleWalletChange = (amount) => {
    setWalletAmount(amount);
    console.log('Wallet amount changed:', amount);
  };

  // Load Razorpay and handle payment
  const loadRazorpay = async (amount, orderData) => {
    try {
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh the page and try again.');
      }

      // Check if Razorpay key is configured
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error('Razorpay key not configured. Please contact support.');
      }

      // Step 1: Create order from backend
      const res = await paymentService.createRazorpayOrder(amount, orderData);
      const razorpayOrder = res.data || res;

      if (!razorpayOrder.id) {
        throw new Error('Failed to create Razorpay order');
      }

      // Get user data from auth store
      const user = useAuthStore.getState().user;

      // Step 2: Open Razorpay
      const options = {
        key: razorpayKey, // PUBLIC KEY
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'HungerWood',
        description: 'Food Order Payment',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            setIsPlacingOrder(true);
            // Step 3: Verify payment and create order
            const verifyRes = await paymentService.verifyPayment(response, orderData);
            
            if (verifyRes.success || verifyRes.data) {
              const orderId = verifyRes.data?.orderId || verifyRes.data?.order?.orderId;
              
              if (!orderId) {
                throw new Error('Order ID not found in response');
              }
              
              // 🎉 Trigger order placed animation and sound
              animations.orderPlaced({
                orderNumber: orderId,
                totalAmount: amount,
                orderType,
              });

              // Navigate to order tracking page
              setTimeout(() => {
                navigate(`/orders/${orderId}`, {
                  state: {
                    order: verifyRes.data?.order || verifyRes.data,
                    orderPlaced: true,
                    orderType,
                    paymentMethod: 'RAZORPAY',
                    totalPayable: amount,
                    cookingInstructions,
                  },
                  replace: true,
                });

                // Clear cart after navigation
                clearCart();
                
                // Reset processing flag
                isProcessingRef.current = false;
                setIsPlacingOrder(false);
              }, 5500);
            } else {
              throw new Error(verifyRes.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert(error.message || 'Payment verification failed. Please contact support.');
            setIsPlacingOrder(false);
            isProcessingRef.current = false;
          }
        },
        prefill: {
          name: user?.name || 'Customer',
          contact: user?.phone || '9999999999',
        },
        theme: { color: '#7f4f13' },
        modal: {
          ondismiss: function() {
            // User closed the payment modal
            setIsPlacingOrder(false);
            isProcessingRef.current = false;
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Failed to load Razorpay:', error);
      alert(error.message || 'Failed to initialize payment. Please try again.');
      setIsPlacingOrder(false);
      isProcessingRef.current = false;
    }
  };

  const handlePlaceOrder = useCallback(async () => {
    // Check restaurant status - block orders if closed
    if (!isOpen) {
      alert(closingMessage || 'Restaurant is currently closed. Please try again later.');
      return;
    }

    // Prevent duplicate orders - check if already processing
    if (isProcessingRef.current) {
      console.log('⏸️ Order placement already in progress, ignoring duplicate click');
      return;
    }

    // Debounce: prevent orders within DEBOUNCE_TIME seconds
    const now = Date.now();
    const timeSinceLastOrder = now - lastOrderTimeRef.current;
    if (timeSinceLastOrder < DEBOUNCE_TIME) {
      const remainingTime = Math.ceil((DEBOUNCE_TIME - timeSinceLastOrder) / 1000);
      alert(`Please wait ${remainingTime} second${remainingTime > 1 ? 's' : ''} before placing another order.`);
      return;
    }

    // Set flags to prevent duplicate calls
    isProcessingRef.current = true;
    setIsPlacingOrder(true);
    lastOrderTimeRef.current = now;

    try {
      // Validate cart items have IDs and other required fields
      const invalidItems = items.filter(item => {
        const hasId = item.id;
        const hasRequiredFields = item.name && item.price && item.quantity;
        return !hasId || !hasRequiredFields;
      });
      
      if (invalidItems.length > 0) {
        console.error('Cart items missing required fields:', invalidItems);
        // Only show alert if items are truly invalid (missing name, price, or quantity)
        const trulyInvalid = invalidItems.filter(item => !item.name || !item.price || !item.quantity);
        if (trulyInvalid.length > 0) {
          alert('Some items in your cart are invalid. Please clear your cart and add items again.');
          setIsPlacingOrder(false);
          return;
        }
        // If only missing ID, try to proceed with what we have
        console.warn('Some items missing ID, but proceeding with available data');
      }

      // Validate delivery address for delivery orders
      if (orderType === 'Delivery' && !selectedAddress) {
        alert('Please select a delivery address');
        setIsPlacingOrder(false);
        return;
      }

      // Prepare order data
      const finalPaymentMethod = walletAmount >= subtotal ? 'WALLET' : paymentMethod.toUpperCase();

      // Ensure all items have menuItem ID before creating order
      const itemsWithMenuId = items.map(item => {
        const menuItemId = item.id || item.menuItem;
        if (!menuItemId) {
          console.error('Item missing ID:', item);
          throw new Error(`Item "${item.name || 'Unknown'}" is missing a valid ID. Please remove it from cart and add it again.`);
        }
        return {
          menuItem: menuItemId,
          quantity: item.quantity,
          price: item.price,
          id: menuItemId, // Keep for backward compatibility
          name: item.name || item.title || 'Menu Item',
          image: item.image || item.imageUrl || null,
          discount: item.discount || 0,
        };
      });

      const orderData = {
        items: itemsWithMenuId,
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

      // Handle Razorpay payment
      // Only trigger Razorpay if:
      // 1. Razorpay is selected as payment method
      // 2. There's an amount to pay (totalPayable > 0)
      // 3. Wallet doesn't cover the full amount (if wallet covers full amount, use wallet payment instead)
      if (paymentMethod === 'razorpay' && totalPayable > 0) {
        // Reset flags temporarily - loadRazorpay will handle them
        isProcessingRef.current = false;
        setIsPlacingOrder(false);
        
        // Load Razorpay payment gateway
        await loadRazorpay(totalPayable, orderData);
        return; // Exit early - payment flow will handle order creation
      }

      // If Razorpay is selected but wallet covers full amount, fall through to wallet payment
      // The finalPaymentMethod logic below will handle this correctly

      // For other payment methods (UPI, CASH, WALLET), proceed with normal flow
      // Call backend API to create order
      const response = await orderService.createOrder(orderData);
      
      // Extract order ID - use orderId field from response
      const orderId = response.data?.orderId || response.data?.data?.orderId || response.data?.id || response.data?.data?.id;
      
      if (!orderId) {
        console.error('Order created but no orderId returned:', response.data);
        throw new Error('Order was created but could not retrieve order ID. Please check your orders.');
      }
      
      console.log('✅ Order created with orderId:', orderId);

      // 🎉 Trigger order placed animation and sound
      animations.orderPlaced({
        orderNumber: response.data.orderId || response.data.orderNumber || orderId,
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
        
        // Reset processing flag after navigation (order is successfully placed)
        isProcessingRef.current = false;
      }, 5500); // Wait for animation to complete (5 seconds animation + 0.5s buffer)
    } catch (error) {
      console.error('Failed to place order:', error);
      // Check if error is due to restaurant being closed
      if (error.response?.status === 403 || error.message?.includes('closed')) {
        alert(error.response?.data?.message || error.message || 'Restaurant is currently closed. Please try again later.');
      } else {
        alert(error.message || 'Failed to place order. Please try again.');
      }
      // Reset flags on error
      setIsPlacingOrder(false);
      isProcessingRef.current = false;
    }
  }, [items, orderType, selectedAddress, paymentMethod, cookingInstructions, itemTotal, deliveryFee, taxes, totalPayable, walletAmount, navigate, animations, clearCart, isOpen, closingMessage]);

  // Redirect to cart if empty (but not when placing an order)
  if (items.length === 0 && !isPlacingOrder) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-[#f8f7f6] dark:bg-[#211811] shadow-xl overflow-x-hidden">
      {/* TopAppBar */}
      <div className="sticky top-0 z-50 flex items-center bg-white dark:bg-[#2d221a] p-4 border-b-2 border-[#f4f2f0] dark:border-[#3d2e24] justify-between shadow-md">
        <BackButton
          className="text-[#181411] dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          variant="minimal"
          onClick={() => navigate('/cart')}
        />
        <h2 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
          Checkout
        </h2>
      </div>

      <main className="flex-1 pb-40">
        {/* Segmented Buttons - Order Type */}
        <div className="px-4 py-6">
          <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-white dark:bg-[#2d221a] p-1 shadow-md border-2 border-[#f4f2f0] dark:border-[#3d2e24]">
            <label
              className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-semibold transition-all ${orderType === 'Dine-in'
                ? 'bg-[#7f4f13] text-white'
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
                ? 'bg-[#7f4f13] text-white'
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
                ? 'bg-[#7f4f13] text-white'
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
                <div className="bg-white dark:bg-[#2d221a] p-4 rounded-xl shadow-md border-2 border-[#f4f2f0] dark:border-[#3d2e24]">
                  <p className="text-text-secondary text-sm">Loading addresses...</p>
                </div>
              ) : !selectedAddress ? (
                <div className="bg-white dark:bg-[#2d221a] p-4 rounded-xl shadow-md border-2 border-[#f4f2f0] dark:border-[#3d2e24]">
                  <p className="text-text-secondary text-sm mb-3">No saved addresses found</p>
                  <button
                    onClick={handleChangeAddress}
                    className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-[#7f4f13] text-white text-sm font-bold transition-colors hover:bg-[#7f4f13]/90"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#2d221a] p-4 rounded-xl shadow-md border-2 border-[#f4f2f0] dark:border-[#3d2e24]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-[2_2_0px] flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#7f4f13] text-xl">
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
                        className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-[#7f4f13]/10 text-[#7f4f13] text-sm font-bold transition-colors hover:bg-[#7f4f13]/20 w-fit"
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
          <div className="bg-white dark:bg-[#2d221a] rounded-xl border-2 border-[#f4f2f0] dark:border-[#3d2e24] overflow-hidden shadow-md">
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
          {/* <label className="flex items-center justify-between p-4 bg-white dark:bg-[#2d221a] rounded-xl border-2 border-[#f4f2f0] dark:border-[#3d2e24] cursor-pointer group shadow-md hover:shadow-lg transition-all">
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
              className="w-5 h-5 text-[#7f4f13] border-gray-300 focus:ring-[#7f4f13]"
            />
          </label> */}
          <label className="flex items-center justify-between p-4 bg-white dark:bg-[#2d221a] rounded-xl border-2 border-[#f4f2f0] dark:border-[#3d2e24] cursor-pointer group shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                <span className="material-symbols-outlined">credit_card</span>
              </div>
              <div>
                <p className="font-bold text-[#181411] dark:text-white">Razorpay</p>
                <p className="text-xs text-[#887263] dark:text-gray-400">Cards, UPI, Net Banking</p>
              </div>
            </div>
            <input
              type="radio"
              name="payment"
              value="razorpay"
              checked={paymentMethod === 'razorpay'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-5 h-5 text-[#7f4f13] border-gray-300 focus:ring-[#7f4f13]"
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
              className="w-5 h-5 text-[#7f4f13] border-gray-300 focus:ring-[#7f4f13]"
            />
          </label>
        </div>

        {/* Bill Details */}
        <div className="px-4">
          <div className="bg-white dark:bg-[#2d221a] p-4 rounded-xl border-2 border-[#f4f2f0] dark:border-[#3d2e24] space-y-3 shadow-md">
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
              <span className="font-bold text-[#7f4f13]">₹{totalPayable.toFixed(2)}</span>
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
            className="text-[#7f4f13] flex items-center gap-1 text-sm font-bold"
          >
            View Details{' '}
            <span className="material-symbols-outlined text-sm">
              {showDetails ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder || !isOpen}
          className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${
            !isOpen
              ? 'bg-gray-400 text-white cursor-not-allowed opacity-60'
              : isPlacingOrder
              ? 'bg-[#7f4f13] opacity-50 cursor-not-allowed text-white'
              : 'bg-[#7f4f13] hover:bg-[#7f4f13]/90 text-white'
          }`}
        >
          {isPlacingOrder ? (
            <>
              <span className="material-symbols-outlined animate-spin">sync</span>
              Placing Order...
            </>
          ) : (
            <>
              Place Order
              <span className="material-symbols-outlined">arrow_forward</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
