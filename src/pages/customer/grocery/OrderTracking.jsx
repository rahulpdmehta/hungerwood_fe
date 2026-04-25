import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BackButton from '@components/common/BackButton';
import { formatDate, formatTime as formatTimeUtil } from '@utils/dateFormatter';
import { useMyGroceryOrder } from '@hooks/useGroceryCustomerQueries';
import RateOrderModal from '@components/grocery/RateOrderModal';

const formatTime = (t) => (t ? formatTimeUtil(t, 'h:mm A') : '');

// Map a backend status to a step index for the rail.
const getStep = (status, orderType) => {
  if (!status) return 0;
  if (orderType === 'PICKUP') {
    return { RECEIVED: 0, READY_FOR_PICKUP: 1, PICKED_UP: 2 }[status] ?? 0;
  }
  return { RECEIVED: 0, PACKED: 1, OUT_FOR_DELIVERY: 2, DELIVERED: 3 }[status] ?? 0;
};

const stepsForType = (orderType) =>
  orderType === 'PICKUP'
    ? [
        { title: 'Order Received', icon: 'check_circle' },
        { title: 'Ready for Pickup', icon: 'shopping_bag' },
        { title: 'Picked Up', icon: 'verified' },
      ]
    : [
        { title: 'Order Received', icon: 'check_circle' },
        { title: 'Packed', icon: 'inventory_2' },
        { title: 'Out for Delivery', icon: 'delivery_dining' },
        { title: 'Delivered', icon: 'verified' },
      ];

export default function GroceryOrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { data: order, isLoading } = useMyGroceryOrder(id);
  const [justPlaced, setJustPlaced] = useState(state?.justPlaced === true);
  const [rateOpen, setRateOpen] = useState(false);

  useEffect(() => {
    if (justPlaced) {
      const t = setTimeout(() => setJustPlaced(false), 5000);
      return () => clearTimeout(t);
    }
  }, [justPlaced]);

  useEffect(() => {
    if (!order) return;
    const isComplete = ['DELIVERED', 'PICKED_UP'].includes(order.status);
    const alreadyRated = order.rating?.submittedAt;
    const dismissed = (() => {
      try { return !!localStorage.getItem(`rated:${order._id || order.id}`); } catch { return false; }
    })();
    if (isComplete && !alreadyRated && !dismissed) {
      const t = setTimeout(() => setRateOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, [order]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-[#887263]">Loading order details...</p>
        </div>
      </div>
    );
  }
  if (!order) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] flex items-center justify-center">
        <div className="text-center px-4">
          <span className="material-symbols-outlined text-[#887263] text-6xl mb-4">error</span>
          <h3 className="text-xl font-bold text-[#181411] dark:text-white mb-2">Order Not Found</h3>
          <p className="text-[#887263] dark:text-gray-400 mb-6">
            We couldn't find this order. It may have been removed or doesn't exist.
          </p>
          <button
            onClick={() => navigate('/grocery/orders')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  const orderType = order.orderType === 'PICKUP' ? 'PICKUP' : 'DELIVERY';
  const steps = stepsForType(orderType);
  const currentStep = getStep(order.status, orderType);
  const isCancelled = order.status === 'CANCELLED';
  const canCancel = order.status === 'RECEIVED';
  const orderNumber = order.orderId;

  const getStatusTime = (status) => {
    if (!Array.isArray(order.statusHistory)) return '';
    const entry = order.statusHistory.find((s) => s.status === status);
    return entry ? formatTime(entry.timestamp) : '';
  };

  const stepSubtitle = (idx) => {
    if (idx === 0) {
      const t = getStatusTime('RECEIVED') || formatTime(order.createdAt);
      return t ? `Confirmed at ${t}` : 'Confirmed';
    }
    if (orderType === 'DELIVERY') {
      if (idx === 1) {
        if (order.status === 'PACKED') return 'Packing complete!';
        const t = getStatusTime('PACKED');
        return t ? `Packed at ${t}` : 'Pending';
      }
      if (idx === 2) {
        if (order.status === 'OUT_FOR_DELIVERY') return 'On the way!';
        const t = getStatusTime('OUT_FOR_DELIVERY');
        return t ? `Started at ${t}` : 'Pending';
      }
      if (idx === 3) {
        if (order.status === 'DELIVERED') {
          const t = getStatusTime('DELIVERED');
          return t ? `Delivered at ${t}` : 'Order delivered!';
        }
        return 'Almost there!';
      }
    } else {
      if (idx === 1) {
        if (order.status === 'READY_FOR_PICKUP') return 'Ready for pickup!';
        const t = getStatusTime('READY_FOR_PICKUP');
        return t ? `Ready at ${t}` : 'Pending';
      }
      if (idx === 2) {
        if (order.status === 'PICKED_UP') {
          const t = getStatusTime('PICKED_UP');
          return t ? `Picked up at ${t}` : 'Picked up';
        }
        return 'Pending';
      }
    }
    return '';
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-[#f8f7f6] dark:bg-[#211811] shadow-xl overflow-x-hidden pb-4">
      <div className="sticky top-0 z-50 flex items-center bg-white dark:bg-[#2d221a] p-4 border-b border-[#f4f2f0] dark:border-[#3d2e24] justify-between">
        <BackButton
          className="text-[#181411] dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          variant="minimal"
          onClick={() => navigate('/grocery/orders')}
        />
        <div className="flex-1 text-center pr-10">
          <p className="text-[#887263] dark:text-gray-400 text-xs font-medium">
            {order.createdAt && (
              <span className="ml-2">• {formatDate(order.createdAt, 'D MMM, YYYY')}</span>
            )}
          </p>
          <h2 className="text-[#181411] dark:text-white text-lg font-bold leading-tight">Track Order</h2>
        </div>
      </div>

      <main className="flex-1 px-3 pt-4">
        <h3 className="text-[#181411] dark:text-white text-sm font-bold mb-2 text-center">
          Order #{orderNumber}
        </h3>

        <div className="text-center mb-5">
          {isCancelled ? (
            <>
              <div className="flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-red-500 text-4xl">cancel</span>
              </div>
              <h3 className="text-red-600 dark:text-red-500 text-base font-bold mb-1">Order Cancelled</h3>
              <p className="text-[#887263] dark:text-gray-400 text-xs">This order has been cancelled.</p>
            </>
          ) : (
            <>
              <h3 className="text-green-700 text-base font-bold mb-1">
                {order.status === 'DELIVERED'
                  ? 'Order Delivered!'
                  : order.status === 'PICKED_UP'
                  ? 'Order Picked Up!'
                  : order.status === 'OUT_FOR_DELIVERY'
                  ? 'On the way!'
                  : order.status === 'READY_FOR_PICKUP'
                  ? 'Ready for Pickup!'
                  : order.status === 'PACKED'
                  ? 'Packed & ready'
                  : 'Arriving soon'}
              </h3>
              <p className="text-[#887263] dark:text-gray-400 text-xs italic">
                {order.status === 'DELIVERED'
                  ? 'Enjoy your groceries! 🎉'
                  : order.status === 'PICKED_UP'
                  ? 'Thanks for shopping with us.'
                  : order.status === 'OUT_FOR_DELIVERY'
                  ? 'Your order is on its way.'
                  : order.status === 'READY_FOR_PICKUP'
                  ? 'Pick up at your convenience.'
                  : order.status === 'PACKED'
                  ? 'Heading out for delivery soon.'
                  : "Hang tight! We're getting your order ready."}
              </p>
            </>
          )}
        </div>

        {!isCancelled ? (
          <div className="relative z-10 mb-5 bg-white dark:bg-[#2d221a] rounded-xl p-4 shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24]">
            {steps.map((step, idx) => (
              <div key={step.title} className="flex items-start gap-3 mb-0 last:mb-0">
                <div className="flex flex-col items-center pt-0.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      idx <= currentStep
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {idx < currentStep ? 'check' : step.icon}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-0.5 h-7 ${
                        idx < currentStep ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 pt-0 pb-3 last:pb-0">
                  <div className="flex items-center gap-1.5">
                    <h3
                      className={`font-bold text-sm leading-tight ${
                        idx <= currentStep
                          ? 'text-[#181411] dark:text-white'
                          : 'text-[#887263] dark:text-gray-400'
                      }`}
                    >
                      {step.title}
                    </h3>
                    {idx === currentStep && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                    )}
                  </div>
                  <p
                    className={`text-xs leading-snug ${
                      idx === currentStep
                        ? 'text-green-700 italic font-medium'
                        : 'text-[#887263] dark:text-gray-400'
                    }`}
                  >
                    {stepSubtitle(idx)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-red-500 text-lg">info</span>
              <div className="flex-1">
                <h4 className="text-red-700 dark:text-red-400 font-bold text-xs mb-0.5">Order Cancellation</h4>
                <p className="text-red-600 dark:text-red-500 text-xs">
                  Your order was cancelled and no charges have been made.
                </p>
                {order.cancellationReason && (
                  <p className="text-red-600 dark:text-red-500 text-xs mt-1">
                    <span className="font-medium">Reason:</span> {order.cancellationReason}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-[#181411] dark:text-white text-sm font-bold mb-2">Order Details</h3>
          <div className="bg-white dark:bg-[#2d221a] rounded-xl p-3 shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-[#181411] dark:text-white font-bold text-sm">HungerWood Grocery</h4>
                <p className="text-[#887263] dark:text-gray-400 text-[11px]">Order #{orderNumber}</p>
              </div>
              <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center text-green-700">
                <span className="material-symbols-outlined text-base">shopping_basket</span>
              </div>
            </div>

            <div className="space-y-1.5 mb-3">
              {(order.items || []).map((it, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <div className="font-medium text-[#181411] dark:text-white truncate">{it.name}</div>
                    <div className="text-[10px] text-[#887263]">{it.variantLabel} × {it.quantity}</div>
                  </div>
                  <span className="font-medium whitespace-nowrap">₹{(it.sellingPrice || 0) * (it.quantity || 0)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-200 dark:border-gray-600 pt-2 space-y-1 text-xs">
              <div className="flex justify-between text-[#887263]"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
              <div className="flex justify-between text-[#887263]"><span>Tax</span><span>₹{order.tax}</span></div>
              <div className="flex justify-between text-[#887263]"><span>Delivery</span><span>₹{order.delivery}</span></div>
              {order.walletUsed > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Wallet used</span><span>−₹{order.walletUsed}</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-1.5 border-t border-gray-200 dark:border-gray-700 text-sm">
                <span>Total</span><span>₹{order.totalAmount}</span>
              </div>
              <div className="text-[10px] text-gray-500 pt-0.5">
                Payment: {order.paymentMethod} ({order.paymentStatus || 'pending'})
              </div>
            </div>
          </div>
        </div>

        {order.deliveryAddress && (
          <div className="mb-4">
            <h3 className="text-[#181411] dark:text-white text-sm font-bold mb-2">Delivery Address</h3>
            <div className="bg-white dark:bg-[#2d221a] rounded-xl p-3 shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24] text-xs">
              <div>{order.deliveryAddress.street}</div>
              <div>{order.deliveryAddress.city} - {order.deliveryAddress.pincode}</div>
            </div>
          </div>
        )}

        {order.instructions && (
          <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3 text-xs">
            <div className="font-bold mb-0.5 text-yellow-800 dark:text-yellow-200">Pack notes</div>
            <div>{order.instructions}</div>
          </div>
        )}

        {canCancel && (
          <button
            onClick={() => navigate(`/grocery/orders/${id}/cancel`)}
            className="w-full mb-4 flex items-center justify-center gap-1.5 py-2.5 border border-rose-300 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-50"
          >
            <span className="material-symbols-outlined text-sm">cancel</span> Cancel order
          </button>
        )}
      </main>

      <RateOrderModal
        open={rateOpen}
        orderId={order._id || order.id}
        isGrocery
        onClose={() => setRateOpen(false)}
      />
    </div>
  );
}
