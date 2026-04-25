import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Wallet, User as UserIcon, X } from 'lucide-react';
import AdminLayout from '@components/admin/AdminLayout';
import DataTable from '@components/admin/DataTable';
import StatusBadge from '@components/admin/StatusBadge';
import Pagination from '@components/admin/Pagination';
import { useDebounce } from '@hooks/useDebounce';
import { useGroceryCustomers } from '@hooks/useGroceryQueries';
import { formatDate } from '@utils/dateFormatter';

export default function GroceryCustomers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const debouncedSearch = useDebounce(searchQuery, 350);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pageSize]);

  const { data: result, isLoading } = useGroceryCustomers({
    page,
    limit: pageSize,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  });
  const customers = result?.data || [];
  const total = result?.pagination?.total ?? 0;

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      render: (r) => (
        <div>
          <p className="font-medium text-gray-900">{r.name || 'N/A'}</p>
          <p className="text-xs text-gray-500">{r.phone}</p>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (r) => <span className="text-sm text-gray-700">{r.email || 'N/A'}</span>,
    },
    {
      key: 'role',
      label: 'Role',
      render: (r) => <StatusBadge status={r.role} type="user" />,
    },
    {
      key: 'totalOrders',
      label: 'Orders',
      render: (r) => (
        <div className="flex items-center gap-1">
          <ShoppingBag size={14} className="text-gray-400" />
          <span className="font-medium text-gray-900">{r.stats?.totalOrders || 0}</span>
        </div>
      ),
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      render: (r) => (
        <span className="font-medium text-gray-900">₹{Math.round(r.stats?.totalSpent || 0)}</span>
      ),
    },
    {
      key: 'walletBalance',
      label: 'Wallet',
      render: (r) => (
        <div className="flex items-center gap-1">
          <Wallet size={14} className="text-green-500" />
          <span className="font-medium text-green-600">₹{r.walletBalance || 0}</span>
        </div>
      ),
    },
    {
      key: 'lastOrder',
      label: 'Last Order',
      render: (r) =>
        r.stats?.lastOrderDate ? (
          <span className="text-sm text-gray-700">{formatDate(r.stats.lastOrderDate, 'D MMM, YYYY')}</span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grocery Customers</h1>
            <p className="text-gray-600 mt-1">Customers who have placed grocery orders</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <UserIcon size={16} />
            <span>Total: {total}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, phone, or email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={customers}
              emptyMessage={
                searchQuery
                  ? 'No customers match this search.'
                  : 'No grocery customers yet — orders will populate this list.'
              }
            />
            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={(n) => { setPageSize(n); setPage(1); }}
            />
          </>
        )}
      </div>
    </AdminLayout>
  );
}
