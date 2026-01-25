import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BackButton from '@components/common/BackButton';
import { orderService } from '@services/order.service';
import { useOrderSSE } from '@hooks/useOrderSSE';
import PriceDisplay from '@components/common/PriceDisplay';
import { formatDate, formatTime as formatTimeUtil } from '@utils/dateFormatter';

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Use SSE hook for real-time updates
  const { orderData: sseOrderData, isConnected, error: sseError } = useOrderSSE(id);

  // State for order data
  const [order, setOrder] = useState(location.state?.order || {});
  const [loading, setLoading] = useState(!location.state?.order && !sseOrderData);
  const previousStatus = useRef(order.status);

  // Update order when SSE data arrives
  useEffect(() => {
    if (sseOrderData) {
      console.log('📦 Updating order from SSE data:', sseOrderData);
      console.log('🍽️ SSE Order items:', sseOrderData?.items);

      // Note: Status change notifications are now handled globally by GlobalOrderStatusListener
      // This ensures notifications appear on all pages, not just order tracking
      if (sseOrderData.status && sseOrderData.status !== previousStatus.current) {
        console.log(`🎬 Status changed: ${previousStatus.current} → ${sseOrderData.status}`);
        previousStatus.current = sseOrderData.status;
      }

      setOrder(sseOrderData);
      setLoading(false);
    }
  }, [sseOrderData]);

  // Fallback: Fetch order if SSE hasn't provided data yet
  useEffect(() => {
    if (!location.state?.order && !sseOrderData && id) {
      fetchOrder();
    }
  }, [id, sseOrderData]);

  const fetchOrder = async () => {
    try {
      const response = await orderService.getOrderById(id);
      console.log('📦 Fetched order:', response.data);
      console.log('🍽️ Order items details:', response.data?.items);

      // Log each item to debug
      if (Array.isArray(response.data?.items)) {
        response.data.items.forEach((item, idx) => {
          console.log(`  Item ${idx + 1}:`, {
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            id: item.id
          });
        });
      }

      setOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      // Set empty order to show error state
      setOrder({});
    } finally {
      setLoading(false);
    }
  };

  // Get data from order
  const orderData = location.state || {};
  const {
    orderType = order.orderType || 'Delivery',
    paymentMethod = order.paymentMethod || 'upi',
    totalPayable = order.totalAmount || order.total || 420,
    cookingInstructions = order.specialInstructions || ''
  } = orderData;

  // Order items - ensure it's always an array
  const orderItems = Array.isArray(order.items)
    ? order.items
    : Array.isArray(orderData.items)
      ? orderData.items
      : [];
  const orderNumber = order.orderNumber || `HW${id}`;
  const orderStatus = order.status || 'preparing';

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7f4f13] mx-auto mb-4"></div>
          <p className="text-[#887263]">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Show error if no order data
  if (!order || Object.keys(order).length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] flex items-center justify-center">
        <div className="text-center px-4">
          <span className="material-symbols-outlined text-[#887263] text-6xl mb-4">error</span>
          <h3 className="text-xl font-bold text-[#181411] dark:text-white mb-2">Order Not Found</h3>
          <p className="text-[#887263] dark:text-gray-400 mb-6">
            We couldn't find this order. It may have been removed or doesn't exist.
          </p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-[#7f4f13] hover:bg-[#7f4f13]/90 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  // Timer state
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);

  // Order status - synced with real-time updates
  const [currentStep, setCurrentStep] = useState(0);

  // Map order status from backend to step number
  const getStepFromStatus = (status) => {
    const statusMap = {
      'RECEIVED': 0,
      'CONFIRMED': 0,
      'PREPARING': 1,
      'READY': 2,
      'OUT_FOR_DELIVERY': 3,
      'COMPLETED': 4,  // Delivered step
      'pending': 0 // Legacy support
    };
    return statusMap[status] ?? 0;
  };

  // Update currentStep when order status changes (from SSE or initial load)
  useEffect(() => {
    if (order?.status) {
      const step = getStepFromStatus(order.status);
      console.log('📊 Updating UI step from status:', order.status, '→ step:', step);
      setCurrentStep(step);
    }
  }, [order?.status]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [minutes, seconds]);

  const handleBack = () => {
    navigate('/');
  };

  const handleHelp = () => {
    alert('Help & Support coming soon!');
  };

  const handleCallRestaurant = () => {
    window.location.href = 'tel:+919876543210';
  };

  const handleChat = () => {
    alert('Chat support coming soon!');
  };

  // Helper to format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return formatTimeUtil(timestamp, 'h:mm A');
  };

  // Get status history timestamp
  const getStatusTime = (status) => {
    if (!order?.statusHistory || !Array.isArray(order.statusHistory)) return '';
    const statusEntry = order.statusHistory.find(s => s.status === status);
    return statusEntry ? formatTime(statusEntry.timestamp) : '';
  };

  // Get dynamic subtitle based on current status
  const getStepSubtitle = (stepIndex) => {
    const currentOrderStatus = order?.status?.toUpperCase() || 'RECEIVED';

    if (stepIndex === 0) {
      const time = getStatusTime('RECEIVED') || getStatusTime('CONFIRMED') || formatTime(order?.createdAt);
      return time ? `Confirmed at ${time}` : 'Confirmed';
    } else if (stepIndex === 1) {
      if (currentOrderStatus === 'PREPARING') {
        return 'Our chefs are working their magic!';
      }
      const time = getStatusTime('PREPARING');
      return time ? `Started at ${time}` : 'Pending';
    } else if (stepIndex === 2) {
      if (currentOrderStatus === 'READY') {
        const time = getStatusTime('READY') || formatTime(order?.estimatedDeliveryTime);
        return time ? `Ready at ${time}` : 'Ready for pickup!';
      }
      return order?.estimatedDeliveryTime ? `Estimated ${formatTime(order.estimatedDeliveryTime)}` : 'Pending';
    } else if (stepIndex === 3) {
      if (currentOrderStatus === 'OUT_FOR_DELIVERY') {
        const time = getStatusTime('OUT_FOR_DELIVERY');
        return time ? `Started at ${time}` : 'On the way!';
      }
      const time = getStatusTime('OUT_FOR_DELIVERY');
      return time ? `Picked up at ${time}` : 'Pending';
    } else if (stepIndex === 4) {
      if (currentOrderStatus === 'COMPLETED') {
        const time = getStatusTime('COMPLETED');
        return time ? `Delivered at ${time}` : 'Order completed!';
      }
      return 'Almost there!';
    }
    return '';
  };

  const orderSteps = [
    {
      title: 'Order Received',
      subtitle: getStepSubtitle(0),
      icon: 'check_circle',
      index: 0,
    },
    {
      title: 'Preparing Your Meal',
      subtitle: getStepSubtitle(1),
      icon: 'restaurant',
      index: 1,
    },
    {
      title: 'Ready for Pickup',
      subtitle: getStepSubtitle(2),
      icon: 'shopping_bag',
      index: 2,
    },
    {
      title: 'Out for Delivery',
      subtitle: getStepSubtitle(3),
      icon: 'delivery_dining',
      index: 3,
    },
    {
      title: 'Delivered',
      subtitle: getStepSubtitle(4),
      icon: 'verified',
      index: 4,
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-[#f8f7f6] dark:bg-[#211811] shadow-xl overflow-x-hidden pb-4">
      {/* TopAppBar */}
      <div className="sticky top-0 z-50 flex items-center bg-white dark:bg-[#2d221a] p-4 border-b border-[#f4f2f0] dark:border-[#3d2e24] justify-between">
        <BackButton
          className="text-[#181411] dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          variant="minimal"
          onClick={() => navigate('/orders')}
        />
        <div className="flex-1 text-center pr-10">
          <p className="text-[#887263] dark:text-gray-400 text-xs font-medium">
            {order?.createdAt && (
              <span className="ml-2">
                • {formatDate(order.createdAt, 'D MMM, YYYY')}
              </span>
            )}
          </p>
          <h2 className="text-[#181411] dark:text-white text-lg font-bold leading-tight">Track Order</h2>
        </div>
        <button
          onClick={handleHelp}
          className="text-[#7f4f13] text-sm font-bold hover:underline absolute right-4"
        >
          Help
        </button>
      </div>

      <main className="flex-1 px-4 pt-6">
        {/* Real-time Connection Indicator */}
        {/* {isConnected && (
          <div className="flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-700 dark:text-green-400 text-xs font-medium">
              Live updates active
            </span>
          </div>
        )} */}

        {/* SSE Error */}
        <h3 className="text-[#181411] dark:text-white text-lg font-bold mb-3 text-center">Order #{orderNumber}</h3>
        {sseError && (
          <div className="flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-sm">
              warning
            </span>
            <span className="text-yellow-700 dark:text-yellow-400 text-xs font-medium">
              {sseError}
            </span>
          </div>
        )}

        {/* Countdown Header */}
        <div className="text-center mb-8">
          {order?.status === 'CANCELLED' ? (
            <>
              <div className="flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-red-500 text-5xl">
                  cancel
                </span>
              </div>
              <h3 className="text-red-600 dark:text-red-500 text-xl font-bold mb-2">
                Order Cancelled
              </h3>
              <p className="text-[#887263] dark:text-gray-400 text-base">
                This order has been cancelled.
              </p>
              {order?.statusHistory && order.statusHistory.find(s => s.status === 'CANCELLED') && (
                <p className="text-[#887263] dark:text-gray-400 text-sm mt-2">
                  Cancelled on {formatDate(order.statusHistory.find(s => s.status === 'CANCELLED').timestamp, 'MMM D h:mm A')}
                </p>
              )}
            </>
          ) : (
            <>
              <h3 className="text-[#7f4f13] text-xl font-bold mb-2">
                {order?.status === 'COMPLETED'
                  ? 'Order Delivered!'
                  : order?.status === 'OUT_FOR_DELIVERY'
                    ? 'On the way!'
                    : order?.status === 'READY'
                      ? 'Ready for Pickup!'
                      : `Arriving in ${minutes} mins`}
              </h3>
              <p className="text-[#887263] dark:text-gray-400 text-base italic">
                {order?.status === 'COMPLETED'
                  ? 'Enjoy your meal! 🎉'
                  : order?.status === 'OUT_FOR_DELIVERY'
                    ? 'Your order is being delivered to you.'
                    : order?.status === 'READY'
                      ? 'Your order is ready for pickup!'
                      : order?.status === 'PREPARING'
                        ? 'Our chefs are working their magic!'
                        : 'Hang tight! We\'re preparing your order.'}
              </p>
            </>
          )}
        </div>

        {/* Timer Display */}
        {/* <div className="flex gap-4 mb-8 justify-center">
          <div className="flex-1 max-w-[140px] bg-white dark:bg-[#2d221a] rounded-xl p-4 text-center shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24]">
            <div className="text-[#7f4f13] text-xl font-bold mb-1">{minutes}</div>
            <div className="text-[#887263] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
              Minutes
            </div>
          </div>
          <div className="flex-1 max-w-[140px] bg-white dark:bg-[#2d221a] rounded-xl p-4 text-center shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24]">
            <div className="text-[#181411] dark:text-white text-xl font-bold mb-1">{seconds}</div>
            <div className="text-[#887263] dark:text-white text-xs font-bold uppercase tracking-wider">
              Seconds
            </div>
          </div>
        </div> */}

        {/* Order Timeline */}
        {order?.status !== 'CANCELLED' ? (
          <div className="mb-8">
            {orderSteps.map((step, index) => (
              <div key={step.index} className="flex items-start gap-4 mb-0 last:mb-0">
                {/* Icon Column */}
                <div className="flex flex-col items-center pt-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${step.index < currentStep
                      ? 'bg-[#7f4f13] text-white'
                      : step.index === currentStep
                        ? 'bg-[#7f4f13] text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                      }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {step.index < currentStep ? 'check' : step.icon}
                    </span>
                  </div>
                  {index < orderSteps.length - 1 && (
                    <div
                      className={`w-0.5 h-12 ${step.index < currentStep
                        ? 'bg-[#7f4f13]'
                        : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                    ></div>
                  )}
                </div>

                {/* Content Column */}
                <div className="flex-1 pt-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-bold text-base ${step.index === currentStep
                        ? 'text-[#181411] dark:text-white'
                        : step.index < currentStep
                          ? 'text-[#181411] dark:text-white'
                          : 'text-[#887263] dark:text-gray-400'
                        }`}
                    >
                      {step.title}
                    </h3>
                    {step.index === currentStep && (
                      <span className="w-2 h-2 rounded-full bg-[#7f4f13] animate-pulse"></span>
                    )}
                  </div>
                  <p
                    className={`text-sm ${step.index === currentStep
                      ? 'text-[#7f4f13] italic font-medium'
                      : 'text-[#887263] dark:text-gray-400'
                      }`}
                  >
                    {step.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Cancelled Order Info */
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500 text-2xl">
                info
              </span>
              <div className="flex-1">
                <h4 className="text-red-700 dark:text-red-400 font-bold text-sm mb-1">
                  Order Cancellation
                </h4>
                <p className="text-red-600 dark:text-red-500 text-sm">
                  Your order was cancelled and no charges have been made. If you have any questions, please contact our support team.
                </p>
                {order?.cancellationReason && (
                  <p className="text-red-600 dark:text-red-500 text-sm mt-2">
                    <span className="font-medium">Reason:</span> {order.cancellationReason}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="mb-6">
          <h3 className="text-[#181411] dark:text-white text-lg font-bold mb-3">Order Details</h3>
          <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 shadow-md border-2 border-[#f4f2f0] dark:border-[#3d2e24]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-[#181411] dark:text-white font-bold text-base mb-1">HungerWood Gaya</h4>
                <p className="text-[#887263] dark:text-gray-400 text-sm">Order #{orderNumber}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#7f4f13]/10 flex items-center justify-center text-[#7f4f13]">
                <span className="material-symbols-outlined">restaurant</span>
              </div>
            </div>

            {/* Menu Items */}
            {orderItems?.length > 0 && (
              <div className="border-t border-[#f4f2f0] dark:border-[#3d2e24] pt-4">
                <h5 className="text-[#181411] dark:text-white font-semibold text-sm mb-3">Items Ordered</h5>
                <div className="space-y-2">
                  {orderItems?.map((item, index) => {
                    // Debug log for each item
                    if (index === 0) {
                      console.log('🍽️ Rendering order items. First item structure:', item);
                    }

                    // Handle both formats: item with menuItem object or flat item structure
                    const itemName = item?.name || 'Menu Item';
                    const itemPrice = item?.price || 0;
                    const itemDiscount = item?.discount || 0;

                    return (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-[#887263] dark:text-gray-400 font-medium min-w-[30px]">
                            {item.quantity}x
                          </span>
                          <span className="text-[#181411] dark:text-white">
                            {itemName}
                          </span>
                        </div>
                        <PriceDisplay
                          price={itemPrice}
                          discount={itemDiscount}
                          size="sm"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          {order?.status === 'CANCELLED' ? (
            <button
              onClick={handleCallRestaurant}
              className="flex-1 bg-[#887263] hover:bg-[#887263]/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">support_agent</span>
              Contact Support
            </button>
          ) : (
            <>
              <button
                onClick={handleCallRestaurant}
                className="flex-1 bg-[#7f4f13] hover:bg-[#7f4f13]/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">call</span>
                Call Restaurant
              </button>
              <button
                onClick={handleChat}
                className="w-14 h-14 bg-white dark:bg-[#2d221a] border-2 border-[#f4f2f0] dark:border-[#3d2e24] rounded-xl flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="material-symbols-outlined text-[#181411] dark:text-white">chat</span>
              </button>
            </>
          )}
        </div>

        {/* Bill Details */}
        <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 shadow-md border-2 border-[#f4f2f0] dark:border-[#3d2e24] mb-6">
          <h3 className="text-[#181411] dark:text-white text-base font-bold mb-4">Bill Details</h3>

          <div className="space-y-3">
            {/* Item Total */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#887263] dark:text-gray-400">Item Total</span>
              <span className="text-[#181411] dark:text-white font-medium">
                ₹{order.itemTotal || totalPayable}
              </span>
            </div>

            {/* Discount */}
            {Number(order?.discount || 0) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600">Discount</span>
                <span className="text-green-600 font-medium">
                  -₹{order.discount}
                </span>
              </div>
            )}

            {/* Delivery Fee */}
            {Number(order?.deliveryFee || 0) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#887263] dark:text-gray-400">Delivery Fee</span>
                <span className="text-[#181411] dark:text-white font-medium">
                  ₹{order.deliveryFee}
                </span>
              </div>
            )}

            {/* Taxes */}
            {Number(order?.tax || 0) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#887263] dark:text-gray-400">Taxes & Charges</span>
                <span className="text-[#181411] dark:text-white font-medium">
                  ₹{order.tax}
                </span>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-[#f4f2f0] dark:border-[#3d2e24] pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[#181411] dark:text-white font-bold text-base">Total Amount</span>
                <span className="text-[#7f4f13] text-2xl font-bold">₹{totalPayable.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        {orderType === 'Delivery' && (
          <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 shadow-md border-2 border-[#f4f2f0] dark:border-[#3d2e24]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7f4f13]/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#7f4f13]">location_on</span>
              </div>
              <div>
                <p className="text-[#887263] dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                  Delivering To
                </p>
                <p className="text-[#181411] dark:text-white text-sm font-medium leading-relaxed">
                  123, Gandhi Nagar, Near Main Market, Gaya, Bihar
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderTracking;
