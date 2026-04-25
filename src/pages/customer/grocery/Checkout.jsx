import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import BackButton from '@components/common/BackButton';
import useGroceryCartStore from '@store/useGroceryCartStore';
import useAuthStore from '@store/useAuthStore';
import useWalletStore from '@store/useWalletStore';
import { useGrocerySettingsPublic, useCreateGroceryOrder } from '@hooks/useGroceryCustomerQueries';
import { groceryPaymentService } from '@services/groceryCustomer.service';
import { addressService } from '@services/address.service';
import AddressSheet from '@components/checkout/AddressSheet';

const ORDER_TYPES = [
  { value: 'DELIVERY', label: 'Delivery' },
  { value: 'PICKUP', label: 'Pickup' },
];

const PAYMENT_OPTIONS = [
  {
    id: 'razorpay',
    title: 'Razorpay',
    subtitle: 'Cards, UPI, Net Banking',
    icon: 'credit_card',
    iconBg: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-600',
  },
  {
    id: 'cash',
    title: 'Cash on Delivery',
    subtitle: 'Pay at your doorstep',
    icon: 'payments',
    iconBg: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-600',
  },
];

export default function GroceryCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, subtotal, savings, clearCart, coupon, bundle } = useGroceryCartStore();
  const user = useAuthStore((s) => s.user);
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
  let delivery =
    orderType === 'DELIVERY' ? (freeThreshold != null && subtotal >= freeThreshold ? 0 : deliveryFlat) : 0;
  if (coupon?.freeDelivery && orderType === 'DELIVERY') delivery = 0;
  const couponDiscount = coupon && !coupon.freeDelivery ? Math.min(coupon.discount, subtotal) : 0;
  const bundleDiscount = bundle?.discount ? Math.max(0, Number(bundle.discount)) : 0;
  const total = Math.max(0, subtotal + tax + delivery - couponDiscount - bundleDiscount);
  const totalPayable = Math.max(0, total - walletAmount);

  useEffect(() => {
    if (items.length === 0 && !isPlacing) navigate('/grocery/cart');
  }, [items.length, navigate, isPlacing]);

  useEffect(() => {
    (async () => {
      try {
        const res = await addressService.getAddresses();
        const list = res.data || [];
        const def = list.find((a) => a.isDefault) || list[0];
        if (def) setSelectedAddress(def);
      } catch {
        /* ignore */
      }
    })();
    fetchBalance(true).catch(() => {});
  }, [fetchBalance]);

  const loadRazorpay = async (amount, orderData) => {
    if (!window.Razorpay) {
      toast.error('Payment SDK not loaded');
      return;
    }
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      toast.error('Payment gateway not configured');
      return;
    }
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
      modal: {
        ondismiss: () => {
          setIsPlacing(false);
          placingRef.current = false;
        },
      },
    };
    new window.Razorpay(options).open();
  };

  const handlePlace = useCallback(
    async () => {
      if (placingRef.current) return;
      if (orderType === 'DELIVERY' && !selectedAddress) {
        toast.error('Please select a delivery address');
        return;
      }
      placingRef.current = true;
      setIsPlacing(true);

      const orderData = {
        items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
        orderType,
        deliveryAddress:
          orderType === 'DELIVERY'
            ? {
                street: selectedAddress.street,
                city: selectedAddress.city,
                state: selectedAddress.state,
                pincode: selectedAddress.pincode,
              }
            : null,
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
          return;
        }
        const data = await createOrderMut.mutateAsync(orderData);
        toast.success('Order placed!');
        clearCart();
        navigate(`/grocery/orders/${data._id || data.id || data.orderId}`, {
          replace: true,
          state: { justPlaced: true },
        });
      } catch (err) {
        toast.error(err.response?.data?.message || err.message || 'Failed to place order');
        setIsPlacing(false);
        placingRef.current = false;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [items, orderType, selectedAddress, paymentMethod, walletAmount, total, totalPayable, instructions]
  );

  if (items.length === 0 && !isPlacing) return null;

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-[#f8f7f6] dark:bg-[#211811] shadow-xl overflow-x-hidden">
      <div className="sticky top-0 z-50 flex items-center bg-white dark:bg-[#2d221a] p-4 border-b-2 border-[#f4f2f0] dark:border-[#3d2e24] justify-between shadow-md">
        <BackButton
          className="text-[#181411] dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          variant="minimal"
          onClick={() => navigate('/grocery/cart')}
        />
        <h2 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
          Checkout
        </h2>
      </div>

      <main className="flex-1 pb-40">
        <div className="px-4 py-6">
          <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-white dark:bg-[#2d221a] p-1 shadow-md border-2 border-[#f4f2f0] dark:border-[#3d2e24]">
            {ORDER_TYPES.map((t) => (
              <label
                key={t.value}
                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-semibold transition-all ${
                  orderType === t.value ? 'bg-green-600 text-white' : 'text-[#887263] dark:text-gray-400'
                }`}
              >
                <span className="truncate">{t.label}</span>
                <input
                  type="radio"
                  name="order-type"
                  value={t.value}
                  checked={orderType === t.value}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="invisible w-0"
                />
              </label>
            ))}
          </div>
        </div>

        {orderType === 'DELIVERY' && (
          <>
            <div className="flex items-center justify-between px-4 pb-2">
              <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                Delivery Address
              </h3>
            </div>
            <div className="px-4 mb-6">
              {!selectedAddress ? (
                <div className="bg-white dark:bg-[#2d221a] p-4 rounded-xl shadow-md border-2 border-[#f4f2f0] dark:border-[#3d2e24]">
                  <p className="text-[#887263] text-sm mb-3">No saved addresses found</p>
                  <button
                    onClick={() => setAddressSheetOpen(true)}
                    className="flex min-w-[84px] items-center justify-center rounded-lg h-9 px-4 bg-green-600 text-white text-sm font-bold hover:bg-green-700"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#2d221a] p-4 rounded-xl shadow-md border-2 border-[#f4f2f0] dark:border-[#3d2e24]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-[2_2_0px] flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-700 text-xl">
                          {selectedAddress.label === 'Home'
                            ? 'home'
                            : selectedAddress.label === 'Office'
                            ? 'work'
                            : 'location_on'}
                        </span>
                        <p className="text-[#181411] dark:text-white text-base font-bold leading-tight">
                          {selectedAddress.label}
                        </p>
                      </div>
                      <p className="text-[#887263] dark:text-gray-400 text-sm leading-normal">
                        {selectedAddress.street}, Gaya - {selectedAddress.pincode || '824201'}
                      </p>
                      <button
                        onClick={() => setAddressSheetOpen(true)}
                        className="flex min-w-[84px] items-center justify-center rounded-lg h-9 px-4 bg-green-50 text-green-700 text-sm font-bold hover:bg-green-100 w-fit"
                      >
                        Change
                      </button>
                    </div>
                    <div
                      className="w-32 h-24 bg-center bg-no-repeat bg-cover rounded-lg shrink-0"
                      style={{
                        backgroundImage: `url("https://api.mapbox.com/styles/v1/mapbox/light-v10/static/85.1,24.8,12,0/128x96@2x?access_token=${import.meta.env.VITE_MAPBOX_TOKEN || ''}")`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="px-4 pb-2 pt-4">
          <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            Your Order ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h3>
        </div>
        <div className="px-4 space-y-3 mb-8">
          <div className="bg-white dark:bg-[#2d221a] rounded-xl border-2 border-[#f4f2f0] dark:border-[#3d2e24] overflow-hidden shadow-md">
            {items.map((item, index) => (
              <div
                key={`${item.productId}:${item.variantId}`}
                className={`flex items-center gap-3 p-3 ${index !== items.length - 1 ? 'border-b border-[#f4f2f0] dark:border-[#3d2e24]' : ''}`}
              >
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#181411] dark:text-white text-sm truncate">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[#887263] dark:text-gray-400">{item.variantLabel}</span>
                    <span className="text-xs text-[#887263] dark:text-gray-400">•</span>
                    <span className="text-xs text-[#887263] dark:text-gray-400">Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-[#181411] dark:text-white">₹{item.sellingPrice * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {walletBalance > 0 && (
          <div className="px-4 mb-6">
            <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-2">
              Use Wallet
            </h3>
            <div className="bg-white dark:bg-[#2d221a] p-4 rounded-xl shadow-md border-2 border-[#f4f2f0] dark:border-[#3d2e24]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#887263]">Balance: ₹{walletBalance}</span>
                <span className="text-sm font-bold text-green-700">Using ₹{walletAmount}</span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.min(walletBalance, total)}
                value={walletAmount}
                onChange={(e) => setWalletAmount(Number(e.target.value))}
                className="w-full accent-green-600"
              />
            </div>
          </div>
        )}

        <div className="px-4 pb-2">
          <h3 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            Payment Method
          </h3>
        </div>
        <div className="px-4 space-y-3 mb-8">
          {PAYMENT_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-[#2d221a] rounded-xl border-2 border-[#f4f2f0] dark:border-[#3d2e24] cursor-pointer shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${opt.iconBg} flex items-center justify-center ${opt.iconColor}`}>
                  <span className="material-symbols-outlined">{opt.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-[#181411] dark:text-white">{opt.title}</p>
                  <p className="text-xs text-[#887263] dark:text-gray-400">{opt.subtitle}</p>
                </div>
              </div>
              <input
                type="radio"
                name="payment"
                value={opt.id}
                checked={paymentMethod === opt.id}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-600"
              />
            </label>
          ))}
        </div>

        <div className="px-4">
          <div className="bg-white dark:bg-[#2d221a] p-4 rounded-xl border-2 border-[#f4f2f0] dark:border-[#3d2e24] space-y-3 shadow-md">
            <div className="flex justify-between text-sm">
              <span className="text-[#887263] dark:text-gray-400">Item Total</span>
              <span className="font-medium">₹{subtotal}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-700 font-bold">MRP savings</span>
                <span className="font-medium text-green-700">−₹{savings}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-[#887263] dark:text-gray-400">Tax</span>
              <span className="font-medium">₹{tax}</span>
            </div>
            {orderType === 'DELIVERY' && (
              <div className="flex justify-between text-sm">
                <span className="text-[#887263] dark:text-gray-400">Delivery Fee</span>
                <span className="font-medium">{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
              </div>
            )}
            {bundle && bundleDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-700">
                <span>Bundle ({bundle.name})</span>
                <span>−₹{Math.round(bundleDiscount)}</span>
              </div>
            )}
            {coupon && (
              <div className="flex justify-between text-sm text-green-700">
                <span>Coupon ({coupon.code})</span>
                <span>−₹{coupon.freeDelivery ? deliveryFlat : Math.round(couponDiscount)}</span>
              </div>
            )}
            {walletAmount > 0 && (
              <div className="flex justify-between text-sm text-green-700">
                <span>Wallet</span>
                <span>−₹{walletAmount}</span>
              </div>
            )}
            <div className="pt-3 border-t border-[#f4f2f0] dark:border-[#3d2e24] flex justify-between">
              <span className="font-bold">Total Payable</span>
              <span className="font-bold text-green-700">₹{totalPayable}</span>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#2d221a] border-t border-[#f4f2f0] dark:border-[#3d2e24] max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4 px-2">
          <div>
            <p className="text-xs text-[#887263] dark:text-gray-400 font-medium">TOTAL PRICE</p>
            <p className="text-xl font-bold text-[#181411] dark:text-white">₹{totalPayable}</p>
          </div>
        </div>
        <button
          onClick={handlePlace}
          disabled={isPlacing}
          className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${
            isPlacing ? 'bg-green-600 opacity-50 cursor-not-allowed text-white' : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isPlacing ? (
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

      <AddressSheet
        open={addressSheetOpen}
        onClose={() => setAddressSheetOpen(false)}
        selectedId={selectedAddress?.id || selectedAddress?._id}
        onSelect={setSelectedAddress}
      />
    </div>
  );
}
