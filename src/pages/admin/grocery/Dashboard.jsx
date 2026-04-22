import AdminLayout from '@components/admin/AdminLayout';
import { useGroceryAdminOrders } from '@hooks/useGroceryQueries';

export default function GroceryDashboard() {
  const { data: received } = useGroceryAdminOrders({ status: 'RECEIVED' });
  const { data: packed } = useGroceryAdminOrders({ status: 'PACKED' });
  const { data: out } = useGroceryAdminOrders({ status: 'OUT_FOR_DELIVERY' });

  const card = (label, value, color = 'orange') => (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 shadow-sm`}>
      <div className="text-sm text-gray-500">{label}</div>
      <div className={`text-3xl font-bold mt-1 text-${color}-600`}>{value}</div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grocery Dashboard</h1>
          <p className="text-gray-600 mt-1">Quick view of open grocery orders.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {card('New orders (received)', received?.pagination?.total ?? '…')}
          {card('Packing', packed?.pagination?.total ?? '…')}
          {card('Out for delivery', out?.pagination?.total ?? '…')}
        </div>
      </div>
    </AdminLayout>
  );
}
