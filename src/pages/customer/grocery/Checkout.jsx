import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useGroceryCartStore from '@store/useGroceryCartStore';
import useAuthStore from '@store/useAuthStore';
import useWalletStore from '@store/useWalletStore';
import { useGrocerySettingsPublic, useCreateGroceryOrder } from '@hooks/useGroceryCustomerQueries';
import { groceryPaymentService } from '@services/groceryCustomer.service';
import { addressService } from '@services/address.service';
import AddressSheet from '@components/checkout/AddressSheet';

export default function GroceryCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, subtotal, clearCart, coupon, removeCoupon, bundle } = useGroceryCartStore();
  const user = useAuthStore(s => s.user);
  const { balance: walletBalance, fetchBalance } = useWalletStore();
  const { data: settings } = useGrocerySettingsPublic();
  const createOrderMut = useCreateGroceryOrder();

  const instructions = location.state?.instructions || '';

  const [orderType, setOrderType] = useState('DELIVERY');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressSheetOpen, setAddressSheetOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [walletAmount, setWalletAmount] = useState(0);
  const [isPlacing, setIsPlacing] = useState(false);
  const placingRef = useRef(false);

  const taxRate = settings?.taxRate ?? 0.05;
  const tax = Math.round(subtotal * taxRate);
  const deliveryFlat = settings?.deliveryFee ?? 40;
  const freeThreshold = settings?.freeDeliveryThreshold;
  let delivery = orderType === 'DELIVERY'
    ? (freeThreshold != null && subtotal >= freeThreshold ? 0 : deliveryFlat)
    : 0;
  if (coupon?.freeDelivery && orderType === 'DELIVERY') delivery = 0;
  const couponDiscount = coupon && !coupon.freeDelivery ? Math.min(coupon.discount, subtotal) : 0;
  const bundleDiscount = bundle?.discount ? Math.max(0, Number(bundle.discount)) : 0;
  const total = Math.max(0, subtotal + tax + delivery - couponDiscount - bundleDiscount);
  const totalPayable = Math.max(0, total - walletAmount);

  useEffect(() => {
    if (items.length === 0) navigate('/grocery/cart');
  }, [items.length, navigate]);

  useEffect(() => {
    (async () => {
      try {
        const res = await addressService.getAddresses();
        const list = res.data || [];
        const def = list.find(a => a.isDefault) || list[0];
        if (def) setSelectedAddress(def);
      } catch { /* ignore */ }
    })();
    fetchBalance(true).catch(() => {});
  }, [fetchBalance]);

  const loadRazorpay = async (amount, orderData) => {
    if (!window.Razorpay) { toast.error('Payment SDK not loaded'); return; }
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) { toast.error('Payment gateway not configured'); return; }

    const res = await groceryPaymentService.createRazorpayOrder(amount, orderData);
    if (!res.id) throw new Error('Failed to create Razorpay order');

    const options = {
      key: razorpayKey,
      amount: res.amount,
      currency: 'INR',
      name: 'HungerWood Grocery',
      description: 'Grocery order',
      order_id: res.id,
      handler: async (response) => {
        try {
          setIsPlacing(true);
          const verifyRes = await groceryPaymentService.verify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderData,
          });
          if (verifyRes.success) {
            const orderId = verifyRes.data?.orderId;
            toast.success('Order placed!');
            clearCart();
            navigate(`/grocery/orders/${orderId}`, { replace: true, state: { justPlaced: true } });
          } else {
            throw new Error(verifyRes.message || 'Verification failed');
          }
        } catch (err) {
          toast.error(err.message || 'Payment verification failed');
        } finally {
          setIsPlacing(false);
          placingRef.current = false;
        }
      },
      prefill: { name: user?.name || '', contact: user?.phone || '' },
      theme: { color: '#16a34a' },
      modal: { ondismiss: () => { setIsPlacing(false); placingRef.current = false; } },
    };
    new window.Razorpay(options).open();
  };

  const handlePlace = useCallback(async () => {
    if (placingRef.current) return;
    if (orderType === 'DELIVERY' && !selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    placingRef.current = true;
    setIsPlacing(true);

    const orderData = {
      items: items.map(i => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
      orderType,
      deliveryAddress: orderType === 'DELIVERY' ? {
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
      } : null,
      paymentMethod: paymentMethod === 'razorpay' ? 'RAZORPAY' : paymentMethod === 'cash' ? 'CASH' : 'WALLET',
      walletUsed: walletAmount,
      totalAmount: total,
      instructions,
      couponCode: coupon?.code,
      bundleSlug: bundle?.slug,
    };

    try {
      if (paymentMethod === 'razorpay' && totalPayable > 0) {
        await loadRazorpay(totalPayable, orderData);
        return; // Razorpay handler navigates on success
      }

      const data = await createOrderMut.mutateAsync(orderData);
      toast.success('Order placed!');
      clearCart();
      navigate(`/grocery/orders/${data._id || data.id || data.orderId}`, { replace: true, state: { justPlaced: true } });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to place order');
      setIsPlacing(false);
      placingRef.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, orderType, selectedAddress, paymentMethod, walletAmount, total, totalPayable, instructions, createOrderMut, clearCart, navigate]);

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] pb-32">
      <nav className="sticky top-0 z-50 bg-white dark:bg-[#211811] border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center p-4 max-w-md mx-auto">
          <Link to="/grocery/cart" className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-lg font-bold ml-2">Checkout</h2>
        </div>
      </nav>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Order type */}
        <div>
          <div className="flex bg-white dark:bg-[#2d221a] rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            {['DELIVERY', 'PICKUP'].map(t => (
              <button
                key={t}
                onClick={() => setOrderType(t)}
                className={`flex-1 py-2 rounded-md text-sm font-bold ${orderType === t ? 'bg-green-600 text-white' : 'text-gray-500'}`}
              >
                {t === 'DELIVERY' ? 'Delivery' : 'Pickup'}
              </button>
            ))}
          </div>
        </div>

        {orderType === 'DELIVERY' && (
          <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-2">
            <h3 className="font-bold">Delivery address</h3>
            {selectedAddress ? (
              <div className="text-sm">
                <div className="font-medium flex items-center gap-2">
                  {selectedAddress.label}
                  {selectedAddress.isDefault && (
                    <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">DEFAULT</span>
                  )}
                </div>
                <div className="text-gray-600 dark:text-gray-300">{selectedAddress.street}, Gaya - {selectedAddress.pincode || '824201'}</div>
                <button onClick={() => setAddressSheetOpen(true)} className="text-green-700 dark:text-green-400 text-sm font-semibold mt-2">
                  Change ›
                </button>
              </div>
            ) : (
              <button onClick={() => setAddressSheetOpen(true)} className="text-green-700 dark:text-green-400 text-sm font-semibold">
                + Choose address
              </button>
            )}
          </div>
        )}

        {walletBalance > 0 && (
          <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Use wallet</span>
              <span className="text-sm text-gray-500">Balance: ₹{walletBalance}</span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.min(walletBalance, total)}
              value={walletAmount}
              onChange={e => setWalletAmount(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-center mt-1">Using ₹{walletAmount}</div>
          </div>
        )}

        <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-2">
          <h3 className="font-bold mb-2">Payment method</h3>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="pm" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />
            Razorpay (UPI / Card / Wallet)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="pm" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
            Cash on Delivery
          </label>
        </div>

        <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-1 text-sm">
          <div className="flex justify-between"><span>Item total</span><span>₹{subtotal}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>₹{tax}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
          {bundle && bundleDiscount > 0 && (
            <div className="flex justify-between text-green-700 dark:text-green-400">
              <span>Bundle ({bundle.name})</span>
              <span>−₹{Math.round(bundleDiscount)}</span>
            </div>
          )}
          {coupon && (
            <div className="flex justify-between text-green-700 dark:text-green-400">
              <span>Coupon ({coupon.code})</span>
              <span>−₹{coupon.freeDelivery ? deliveryFlat : Math.round(couponDiscount)}</span>
            </div>
          )}
          {walletAmount > 0 && <div className="flex justify-between text-green-700 dark:text-green-400"><span>Wallet</span><span>-₹{walletAmount}</span></div>}
          <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 font-bold"><span>To pay</span><span>₹{totalPayable}</span></div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#211811] border-t-2 border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={handlePlace}
            disabled={isPlacing}
            className="w-full bg-green-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold"
          >
            {isPlacing ? 'Placing order…' : `Place order · ₹${totalPayable}`}
          </button>
        </div>
      </div>

      <AddressSheet
        open={addressSheetOpen}
        onClose={() => setAddressSheetOpen(false)}
        selectedId={selectedAddress?.id || selectedAddress?._id}
        onSelect={setSelectedAddress}
      />
    </div>
  );
}
