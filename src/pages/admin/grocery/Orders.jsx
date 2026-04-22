import { useState } from 'react';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import DataTable from '@components/admin/DataTable';
import {
  useGroceryAdminOrders,
  useGroceryAdminOrder,
  useUpdateGroceryOrderStatus,
} from '@hooks/useGroceryQueries';

const STATUS_LABELS = {
  RECEIVED: 'Received',
  PACKED: 'Packed',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  READY_FOR_PICKUP: 'Ready for pickup',
  PICKED_UP: 'Picked up',
  CANCELLED: 'Cancelled',
};

export default function GroceryOrders() {
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const { data: result, isLoading } = useGroceryAdminOrders(statusFilter ? { status: statusFilter } : {});
  const orders = result?.data || [];

  const columns = [
    { key: 'orderId', label: 'Order ID', render: r => <span className="font-mono text-xs">{r.orderId}</span> },
    { key: 'customer', label: 'Customer', render: r => r.user?.name || r.user?.phone || '—' },
    { key: 'items', label: 'Items', render: r => `${r.items?.length || 0} item${(r.items?.length || 0) === 1 ? '' : 's'}` },
    { key: 'totalAmount', label: 'Total', render: r => `₹${r.totalAmount}` },
    { key: 'orderType', label: 'Type', render: r => r.orderType },
    {
      key: 'status',
      label: 'Status',
      render: r => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {STATUS_LABELS[r.status] || r.status}
        </span>
      ),
    },
    { key: 'createdAt', label: 'Placed', render: r => new Date(r.createdAt).toLocaleString() },
    {
      key: 'actions',
      label: '',
      render: r => (
        <button
          onClick={() => setSelectedId(r.id || r._id)}
          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
        >
          Details
        </button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grocery Orders</h1>
            <p className="text-gray-600 mt-1">All grocery orders, filterable by status.</p>
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All statuses</option>
            {Object.entries(STATUS_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <DataTable columns={columns} data={orders} emptyMessage="No orders match this filter." />
        )}
      </div>

      {selectedId && <OrderDetailDrawer id={selectedId} onClose={() => setSelectedId(null)} />}
    </AdminLayout>
  );
}

function OrderDetailDrawer({ id, onClose }) {
  const { data: order, isLoading } = useGroceryAdminOrder(id);
  const updateStatus = useUpdateGroceryOrderStatus();

  const advance = async (next) => {
    try {
      await updateStatus.mutateAsync({ id, status: next });
      toast.success(`Status → ${STATUS_LABELS[next]}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const cancel = () => advance('CANCELLED');

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div className="w-full max-w-md bg-white h-full overflow-y-auto p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        {isLoading || !order ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="font-bold text-lg font-mono">{order.orderId}</div>
                <div className="text-sm text-gray-500">{STATUS_LABELS[order.status] || order.status}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString()}</div>
              </div>
              <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600">&times;</button>
            </div>

            <section className="mb-4">
              <h3 className="font-semibold text-sm text-gray-700 mb-2 uppercase tracking-wide">Items</h3>
              <ul className="space-y-2 text-sm">
                {order.items?.map((it, i) => (
                  <li key={i} className="flex justify-between border-b pb-1 last:border-0">
                    <span>{it.name} · {it.variantLabel} × {it.quantity}</span>
                    <span className="font-medium">₹{(it.sellingPrice || 0) * (it.quantity || 0)}</span>
                  </li>
                ))}
              </ul>
            </section>

            {order.instructions && (
              <section className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                <div className="font-semibold mb-1 text-yellow-800">Pack notes</div>
                <div>{order.instructions}</div>
              </section>
            )}

            <section className="mb-4 text-sm space-y-1 bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₹{order.subtotal}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tax</span><span>₹{order.tax}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Delivery</span><span>₹{order.delivery}</span></div>
              {order.walletUsed > 0 && (
                <div className="flex justify-between text-green-700"><span>Wallet used</span><span>-₹{order.walletUsed}</span></div>
              )}
              <div className="flex justify-between font-bold pt-1 border-t"><span>Total</span><span>₹{order.totalAmount}</span></div>
            </section>

            <div className="flex flex-wrap gap-2">
              {order.status === 'RECEIVED' && order.orderType === 'DELIVERY' && (
                <button onClick={() => advance('PACKED')} className="px-3 py-1 bg-orange-600 text-white rounded text-sm font-medium">
                  Mark packed
                </button>
              )}
              {order.status === 'RECEIVED' && order.orderType === 'PICKUP' && (
                <button onClick={() => advance('READY_FOR_PICKUP')} className="px-3 py-1 bg-orange-600 text-white rounded text-sm font-medium">
                  Ready for pickup
                </button>
              )}
              {order.status === 'PACKED' && (
                <button onClick={() => advance('OUT_FOR_DELIVERY')} className="px-3 py-1 bg-orange-600 text-white rounded text-sm font-medium">
                  Out for delivery
                </button>
              )}
              {order.status === 'OUT_FOR_DELIVERY' && (
                <button onClick={() => advance('DELIVERED')} className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium">
                  Delivered
                </button>
              )}
              {order.status === 'READY_FOR_PICKUP' && (
                <button onClick={() => advance('PICKED_UP')} className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium">
                  Picked up
                </button>
              )}
              {!['DELIVERED', 'PICKED_UP', 'CANCELLED'].includes(order.status) && (
                <button onClick={cancel} className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium">
                  Cancel order
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
