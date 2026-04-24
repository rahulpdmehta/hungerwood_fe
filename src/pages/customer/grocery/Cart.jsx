import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { optimizeImage } from '@utils/image';
import useGroceryCartStore from '@store/useGroceryCartStore';
import useAuthStore from '@store/useAuthStore';
import { useGrocerySettingsPublic } from '@hooks/useGroceryCustomerQueries';
import SavingsStrip from '@components/grocery/SavingsStrip';
import FreeDeliveryProgress from '@components/grocery/FreeDeliveryProgress';
import GroceryStepper from '@components/grocery/GroceryStepper';
import EmptyCart from '@components/grocery/EmptyCart';

export default function GroceryCart() {
  const navigate = useNavigate();
  const { items, subtotal, savings, coupon, removeCoupon, bundle, removeBundle, incrementQuantity, decrementQuantity, removeItem } = useGroceryCartStore();
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
      <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] flex flex-col">
        <nav className="bg-white dark:bg-[#211811] border-b border-gray-200 dark:border-gray-700 p-4 flex items-center">
          <Link to="/grocery" className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-lg font-bold ml-2">Grocery Cart</h2>
        </nav>
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] pb-40">
      <nav className="sticky top-0 z-50 bg-white dark:bg-[#211811] border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center p-4 max-w-md mx-auto">
          <Link to="/grocery" className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-lg font-bold ml-2">Grocery Cart ({items.length})</h2>
        </div>
      </nav>

      <main className="max-w-md mx-auto p-4 space-y-4">
        <SavingsStrip savings={savings} />
        <FreeDeliveryProgress subtotal={subtotal} threshold={freeThreshold} />

        {items.map(item => {
          const lineTotal = item.sellingPrice * item.quantity;
          return (
            <div key={`${item.productId}:${item.variantId}`} className="flex gap-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3 shadow-sm">
              <img src={optimizeImage(item.image, 80)} alt="" loading="lazy" decoding="async" className="w-20 h-20 rounded object-cover shrink-0 bg-gray-100" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">{item.variantLabel}</p>
                <p className="text-sm font-bold text-green-700 dark:text-green-300 mt-1">₹{item.sellingPrice} × {item.quantity} = ₹{lineTotal}</p>
              </div>
              <div className="flex flex-col items-end justify-between gap-2">
                <button onClick={() => removeItem(item.productId, item.variantId)} className="text-red-600 p-1" aria-label="Remove">
                  <Trash2 size={16} />
                </button>
                <GroceryStepper
                  qty={item.quantity}
                  onInc={() => incrementQuantity(item.productId, item.variantId)}
                  onDec={() => decrementQuantity(item.productId, item.variantId)}
                />
              </div>
            </div>
          );
        })}

        <div>
          <label className="block text-sm font-bold mb-2">Pack notes (optional)</label>
          <textarea
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            rows={2}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2d221a] rounded-lg text-sm"
            placeholder="e.g. skip bruised tomatoes"
          />
        </div>

        <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
          {savings > 0 && (
            <div className="flex justify-between text-green-700 dark:text-green-400">
              <span>MRP savings</span>
              <span>-₹{savings}</span>
            </div>
          )}
          <div className="flex justify-between"><span>Tax</span><span>₹{tax}</span></div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{delivery === 0 ? <span className="text-green-700 dark:text-green-400 font-bold">FREE</span> : `₹${delivery}`}</span>
          </div>
          {bundle && bundleDiscount > 0 && (
            <div className="flex justify-between text-green-700 dark:text-green-400">
              <span>Bundle savings ({bundle.name}) <button onClick={removeBundle} className="text-rose-600 ml-1 underline text-[10px]">remove</button></span>
              <span>−₹{Math.round(bundleDiscount)}</span>
            </div>
          )}
          {coupon && (
            <div className="flex justify-between text-green-700 dark:text-green-400">
              <span>Coupon ({coupon.code}) <button onClick={removeCoupon} className="text-rose-600 ml-1 underline text-[10px]">remove</button></span>
              <span>−₹{coupon.freeDelivery ? deliveryFlat : Math.round(couponDiscount)}</span>
            </div>
          )}
          <Link to="/grocery/coupons" className="block text-center text-amber-700 text-[11px] font-bold border-t border-dashed border-stone-200 pt-2 mt-1">
            {coupon ? 'Change coupon ›' : '+ Apply coupon'}
          </Link>
          <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 font-bold">
            <span>Total</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>

        {belowMin && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 text-sm text-orange-800 dark:text-orange-200">
            Add ₹{minOrderValue - subtotal} more to place this order. Minimum is ₹{minOrderValue}.
          </div>
        )}
        {shopClosed && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-800 dark:text-red-200">
            Grocery shop is currently closed. {settings?.closingMessage}
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#211811] border-t-2 border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleCheckout}
            disabled={!canCheckout}
            className="w-full bg-green-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold"
          >
            Proceed to Checkout · ₹{grandTotal}
          </button>
        </div>
      </div>
    </div>
  );
}
