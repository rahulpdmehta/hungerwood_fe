import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, ChefHat, Truck, Home as HomeIcon, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@services/order.service';

const STATUS_STEPS_DELIVERY = [
  { key: 'RECEIVED', label: 'Received', icon: Check },
  { key: 'PREPARING', label: 'Preparing', icon: ChefHat },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for delivery', icon: Truck },
  { key: 'COMPLETED', label: 'Delivered', icon: HomeIcon },
];

const STATUS_STEPS_PICKUP = [
  { key: 'RECEIVED', label: 'Received', icon: Check },
  { key: 'PREPARING', label: 'Preparing', icon: ChefHat },
  { key: 'READY', label: 'Ready for pickup', icon: HomeIcon },
  { key: 'COMPLETED', label: 'Picked up', icon: Check },
];

const ACTIVE_STATUSES = new Set(['RECEIVED', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY']);

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [justPlaced, setJustPlaced] = useState(state?.justPlaced === true);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await orderService.getOrderById(id);
      return res?.data || null;
    },
    enabled: !!id,
    refetchInterval: (q) => (ACTIVE_STATUSES.has(q.state.data?.status) ? 3 * 60 * 1000 : false),
  });

  useEffect(() => {
    if (justPlaced) {
      const t = setTimeout(() => setJustPlaced(false), 5000);
      return () => clearTimeout(t);
    }
  }, [justPlaced]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found.</div>;

  const orderType = (order.orderType || 'DELIVERY').toUpperCase();
  const steps = orderType === 'DELIVERY' ? STATUS_STEPS_DELIVERY : STATUS_STEPS_PICKUP;
  const currentIdx = steps.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'CANCELLED';
  const canCancel = ['RECEIVED', 'CONFIRMED'].includes(order.status);

  if (justPlaced) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: 'linear-gradient(180deg, #FEF3C7 0%, #f8f7f6 60%)' }}
      >
        <nav className="p-4 flex justify-end">
          <button
            onClick={() => setJustPlaced(false)}
            aria-label="Close"
            className="flex size-9 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm shadow"
          >
            <X size={18} />
          </button>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="relative mb-4">
            <div
              className="w-24 h-24 rounded-full bg-amber-700 flex items-center justify-center text-white text-5xl shadow-[0_0_0_8px_rgba(180,83,9,0.18),0_0_0_16px_rgba(180,83,9,0.08)]"
              aria-hidden
            >
              ✓
            </div>
          </div>
          <h3 className="text-lg font-extrabold">Order placed!</h3>
          <p className="text-xs text-stone-500 mt-1">Thank you — your meal is on its way.</p>
          <div className="inline-block mt-3 px-3 py-1.5 bg-white border border-dashed border-amber-300 rounded text-[11px] font-extrabold font-mono">
            {order.orderId}
          </div>
        </div>
        <div className="bg-white border-t border-stone-200 p-4 max-w-md mx-auto w-full">
          <div className="text-xs text-stone-600 mb-3">
            <div className="flex justify-between"><span>Total paid</span><span className="font-extrabold">₹{order.totalAmount}</span></div>
            <div className="flex justify-between"><span>Items</span><span>{order.items?.length || 0}</span></div>
            <div className="flex justify-between"><span>Mode</span><span>{order.orderType}</span></div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setJustPlaced(false)} className="flex-1 bg-amber-700 text-white font-extrabold py-2.5 rounded-xl text-sm">Track order</button>
            <button onClick={() => navigate('/menu')} className="flex-1 bg-white border-[1.5px] border-amber-700 text-amber-700 font-extrabold py-2.5 rounded-xl text-sm">Browse menu</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] pb-20">
      <nav className="sticky top-0 z-50 bg-white dark:bg-[#211811] border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center p-4 max-w-md mx-auto">
          <Link to="/orders" className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft size={20} />
          </Link>
          <div className="ml-2">
            <h2 className="text-lg font-bold font-mono">{order.orderId}</h2>
            <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto p-4 space-y-5">
        {isCancelled ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
            <p className="font-bold text-red-700 dark:text-red-300">Order cancelled</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#2d221a] rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const active = idx <= currentIdx;
                return (
                  <div key={s.key} className="flex flex-col items-center flex-1">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${active ? 'bg-amber-700 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                      <Icon size={18} />
                    </div>
                    <p className={`text-[10px] mt-1 font-bold text-center ${active ? 'text-amber-800 dark:text-amber-300' : 'text-gray-400'}`}>{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <section className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold mb-2">Items</h3>
          <ul className="space-y-2 text-sm">
            {(order.items || []).map((it, i) => (
              <li key={i}>
                <div className="flex justify-between">
                  <span>{it.name} × {it.quantity}</span>
                  <span className="font-medium">₹{(it.price || 0) * (it.quantity || 0)}</span>
                </div>
                {it.addons?.length > 0 && (
                  <div className="text-[11px] text-stone-500 ml-2">
                    {it.addons.map((a, j) => (
                      <span key={j}>+ {a.name}{j < it.addons.length - 1 ? ', ' : ''}</span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-sm space-y-1">
          <h3 className="font-bold mb-2">Bill</h3>
          <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>₹{order.tax}</span></div>
          {order.packaging > 0 && <div className="flex justify-between"><span>Packaging</span><span>₹{order.packaging}</span></div>}
          {order.delivery > 0 && <div className="flex justify-between"><span>Delivery</span><span>₹{order.delivery}</span></div>}
          {order.walletUsed > 0 && <div className="flex justify-between text-green-700 dark:text-green-400"><span>Wallet used</span><span>-₹{order.walletUsed}</span></div>}
          <div className="flex justify-between font-bold pt-2 border-t border-gray-200 dark:border-gray-700"><span>Total</span><span>₹{order.totalAmount}</span></div>
          <div className="text-xs text-gray-500 pt-1">Payment: {order.paymentMethod} ({order.paymentStatus || 'pending'})</div>
        </section>

        {order.deliveryAddress && (
          <section className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-sm">
            <h3 className="font-bold mb-2">Delivery address</h3>
            <div>{order.deliveryAddress.street}</div>
            <div>{order.deliveryAddress.city} - {order.deliveryAddress.pincode}</div>
          </section>
        )}

        {order.specialInstructions && (
          <section className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-sm">
            <div className="font-bold mb-1 text-yellow-800 dark:text-yellow-200">Special instructions</div>
            <div>{order.specialInstructions}</div>
          </section>
        )}

        {canCancel && (
          <button
            onClick={() => navigate(`/orders/${id}/cancel`)}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 border border-rose-300 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-50"
          >
            <X size={16} /> Cancel order
          </button>
        )}
        {isCancelled && order.cancellationReason && (
          <section className="bg-stone-100 dark:bg-stone-800 rounded-xl p-3 text-xs text-stone-600 dark:text-stone-400">
            <strong>Reason:</strong> {order.cancellationReason}
          </section>
        )}
      </main>
    </div>
  );
}
