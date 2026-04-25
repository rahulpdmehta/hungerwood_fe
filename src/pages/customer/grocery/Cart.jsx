import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import BackButton from '@components/common/BackButton';
import { optimizeImage } from '@utils/image';
import useGroceryCartStore from '@store/useGroceryCartStore';
import useAuthStore from '@store/useAuthStore';
import { useGrocerySettingsPublic } from '@hooks/useGroceryCustomerQueries';
import EmptyCart from '@components/grocery/EmptyCart';

export default function GroceryCart() {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    savings,
    coupon,
    removeCoupon,
    bundle,
    removeBundle,
    incrementQuantity,
    decrementQuantity,
    removeItem,
  } = useGroceryCartStore();
  const { isAuthenticated } = useAuthStore();
  const { data: settings } = useGrocerySettingsPublic();
  const [instructions, setInstructions] = useState('');

  const taxRate = settings?.taxRate ?? 0.05;
  const tax = Math.round(subtotal * taxRate);
  const freeThreshold = settings?.freeDeliveryThreshold;
  const deliveryFlat = settings?.deliveryFee ?? 40;
  let delivery = freeThreshold != null && subtotal >= freeThreshold ? 0 : deliveryFlat;
  if (coupon?.freeDelivery) delivery = 0;
  const couponDiscount = coupon && !coupon.freeDelivery ? Math.min(coupon.discount, subtotal) : 0;
  const bundleDiscount = bundle?.discount ? Math.max(0, Number(bundle.discount)) : 0;
  const grandTotal = Math.max(0, subtotal + tax + delivery - couponDiscount - bundleDiscount);

  const minOrderValue = settings?.minOrderValue ?? null;
  const belowMin = minOrderValue != null && subtotal < minOrderValue;
  const shopClosed = settings && !settings.isOpen;
  const canCheckout = !belowMin && !shopClosed && items.length > 0;

  const handleAddMore = () => navigate('/grocery');

  const handleCheckout = () => {
    if (!canCheckout) return;
    const checkoutState = { instructions, grandTotal };
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: '/grocery/checkout', returnState: checkoutState } });
      return;
    }
    navigate('/grocery/checkout', { state: checkoutState });
  };

  if (items.length === 0) {
    return (
      <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-[#211811] shadow-xl overflow-x-hidden">
        <div className="sticky top-0 z-10 flex items-center bg-white/90 dark:bg-[#211811]/90 backdrop-blur-md p-4 pb-2 justify-between border-b-2 border-gray-100 dark:border-gray-800 shadow-md">
          <BackButton variant="minimal" onClick={() => navigate('/grocery')} />
          <h2 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
            Grocery Cart
          </h2>
        </div>
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-[#211811] shadow-xl overflow-x-hidden">
      <div className="sticky top-0 z-10 flex items-center bg-white/90 dark:bg-[#211811]/90 backdrop-blur-md p-4 pb-2 justify-between border-b-2 border-gray-100 dark:border-gray-800 shadow-md">
        <BackButton variant="minimal" onClick={() => navigate('/grocery')} />
        <h2 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
          Grocery Cart
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Items in Cart</h3>
            <span
              onClick={handleAddMore}
              className="text-sm text-green-700 font-semibold cursor-pointer hover:underline"
            >
              Add more
            </span>
          </div>

          {items.map((item) => {
            const lineTotal = item.sellingPrice * item.quantity;
            const hasMrp = item.mrp && item.mrp > item.sellingPrice;
            const discountPct = hasMrp ? Math.round(((item.mrp - item.sellingPrice) / item.mrp) * 100) : 0;
            return (
              <div
                key={`${item.productId}:${item.variantId}`}
                className="flex items-center gap-2 overflow-hidden bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-2 last:mb-0"
              >
                <div className="relative shrink-0">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover w-[72px] h-[72px] m-2 rounded-md"
                    style={{ backgroundImage: `url("${optimizeImage(item.image, 160)}")` }}
                  />
                  {discountPct > 0 && (
                    <span className="absolute top-1 left-1 bg-green-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                      {discountPct}% OFF
                    </span>
                  )}
                </div>
                <div className="flex flex-col flex-1 justify-between py-2 pr-2 min-h-[72px]">
                  <div>
                    <p className="text-[#181411] dark:text-white text-sm font-bold leading-tight line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-[#887263] dark:text-gray-400 text-[10px] leading-snug">
                      {item.variantLabel}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-extrabold text-[#181411] dark:text-white">₹{lineTotal}</span>
                      {hasMrp && (
                        <span className="text-[10px] text-[#887263] line-through">₹{item.mrp * item.quantity}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center bg-[#f8f7f6] dark:bg-white/5 rounded-md border border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() =>
                            item.quantity === 1
                              ? removeItem(item.productId, item.variantId)
                              : decrementQuantity(item.productId, item.variantId)
                          }
                          className="text-sm font-bold flex h-7 w-7 items-center justify-center rounded-l-md hover:bg-gray-200"
                        >
                          −
                        </button>
                        <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => incrementQuantity(item.productId, item.variantId)}
                          className="text-sm font-bold flex h-7 w-7 items-center justify-center rounded-r-md text-green-700 hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 shrink-0"
                        title="Delete item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-4 py-2">
          <label className="flex flex-col w-full">
            <div className="flex items-center gap-2 pb-2">
              <span className="material-symbols-outlined text-green-700 text-lg">edit_note</span>
              <p className="text-[#181411] dark:text-white text-base font-bold">Pack notes</p>
            </div>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="form-input flex w-full resize-none overflow-hidden rounded-xl text-[#181411] dark:text-white focus:outline-0 focus:ring-2 focus:ring-green-600 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 min-h-24 placeholder:text-[#887263] p-[15px] text-sm font-normal leading-normal transition-all shadow-md"
              placeholder="e.g. Skip bruised tomatoes, ring doorbell once"
            />
          </label>
        </div>

        <div className="mt-4 mx-4">
          <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-2 pt-4">
            Bill Details
          </h3>
          <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700 shadow-md space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#887263] dark:text-gray-400 font-bold">Subtotal</span>
              <span className="font-medium">₹{subtotal}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-600 dark:text-green-400 font-bold">MRP savings</span>
                <span className="font-medium text-green-600 dark:text-green-400">−₹{savings}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#887263] dark:text-gray-400 font-bold">Taxes</span>
              <span className="font-medium">₹{tax}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#887263] dark:text-gray-400 font-bold">Delivery</span>
              <span className="font-medium">
                {delivery === 0 ? <span className="text-green-700 font-bold">FREE</span> : `₹${delivery}`}
              </span>
            </div>
            {bundle && bundleDiscount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-600 dark:text-green-400 font-bold">
                  Bundle ({bundle.name})
                  <button onClick={removeBundle} className="text-rose-600 ml-2 underline text-[10px]">remove</button>
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">−₹{Math.round(bundleDiscount)}</span>
              </div>
            )}
            {coupon && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-600 dark:text-green-400 font-bold">
                  Coupon ({coupon.code})
                  <button onClick={removeCoupon} className="text-rose-600 ml-2 underline text-[10px]">remove</button>
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  −₹{coupon.freeDelivery ? deliveryFlat : Math.round(couponDiscount)}
                </span>
              </div>
            )}
            <Link
              to="/grocery/coupons"
              className="block text-center text-green-700 text-[11px] font-bold border-t border-dashed border-gray-300 pt-2"
            >
              {coupon ? 'Change coupon ›' : '+ Apply coupon'}
            </Link>
            <div className="flex justify-between items-center pt-2 border-t-2 border-dashed border-gray-300 dark:border-gray-600">
              <span className="text-[#181411] dark:text-white text-sm font-bold uppercase tracking-wider">
                Grand Total
              </span>
              <span className="text-xl font-extrabold text-[#181411] dark:text-white">₹{grandTotal}</span>
            </div>
          </div>
        </div>

        {belowMin && (
          <div className="mx-4 mt-6 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border-2 border-orange-200 dark:border-orange-800 shadow-md">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-orange-600">info</span>
              <div>
                <p className="text-xs font-bold text-orange-600 mb-1">Below minimum order</p>
                <p className="text-[10px] text-[#887263] dark:text-gray-400 leading-relaxed">
                  Add ₹{minOrderValue - subtotal} more to place this order. Minimum is ₹{minOrderValue}.
                </p>
              </div>
            </div>
          </div>
        )}

        {shopClosed && (
          <div className="mx-4 mt-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border-2 border-red-200 dark:border-red-800 shadow-md">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-red-600">info</span>
              <div>
                <p className="text-xs font-bold text-red-600 mb-1">Grocery shop closed</p>
                <p className="text-[10px] text-[#887263] dark:text-gray-400 leading-relaxed">
                  {settings?.closingMessage || 'Please try again later.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mx-4 mt-6 p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border-2 border-green-200 dark:border-green-800 shadow-md">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-green-600">verified_user</span>
            <div>
              <p className="text-xs font-bold text-green-600 mb-1">Fresh & Quality Assured</p>
              <p className="text-[10px] text-[#887263] dark:text-gray-400 leading-relaxed uppercase tracking-tight">
                Every grocery order is hand-picked and packed fresh on the day of delivery.
              </p>
            </div>
          </div>
        </div>
      </div>

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
            disabled={!canCheckout}
            className={`flex-1 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${
              !canCheckout
                ? 'bg-gray-400 text-white cursor-not-allowed opacity-60'
                : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
            }`}
          >
            <span>{shopClosed ? 'Grocery Closed' : belowMin ? 'Add more items' : 'Proceed to Checkout'}</span>
            {canCheckout && <span className="material-symbols-outlined">chevron_right</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
