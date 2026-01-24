/**
 * Admin Users Page
 * View and manage all users/customers
 */

import { useState, useEffect } from 'react';
import { Eye, X, Search, User as UserIcon, Mail, Phone, Wallet, Gift, ShoppingBag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import { adminUserService } from '../../services/admin.service';
import { formatDate } from '../../utils/dateFormatter';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminUserService.getAll();
      console.log('🔄 Users response:', response);
      setUsers(response?.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Filter by search query (name, phone, email)
  const filterBySearch = (usersToFilter) => {
    if (!searchQuery.trim()) return usersToFilter;

    const query = searchQuery.toLowerCase().trim();

    return usersToFilter.filter(user => {
      const name = (user.name || '').toLowerCase();
      const phone = (user.phone || '').toLowerCase();
      const email = (user.email || '').toLowerCase();

      return name.includes(query) ||
        phone.includes(query) ||
        email.includes(query);
    });
  };

  // Filter by role
  const filterByRole = (usersToFilter) => {
    if (roleFilter === 'all') return usersToFilter;
    return usersToFilter.filter(user => {
      const userRole = (user.role || 'USER').toUpperCase();
      return userRole === roleFilter.toUpperCase();
    });
  };

  const searchFiltered = filterBySearch(users);
  const roleFiltered = filterByRole(searchFiltered);

  const sortedUsers = [...roleFiltered].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];

    // Handle nested stats
    if (sortKey === 'totalOrders') {
      aVal = a.stats?.totalOrders || 0;
      bVal = b.stats?.totalOrders || 0;
    } else if (sortKey === 'totalSpent') {
      aVal = a.stats?.totalSpent || 0;
      bVal = b.stats?.totalSpent || 0;
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setDetailsModalOpen(true);
  };

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.name || 'N/A'}</p>
          <p className="text-xs text-gray-500">{row.phone}</p>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm text-gray-700">{row.email || 'N/A'}</p>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (row) => (
        <StatusBadge
          status={row.role === 'ADMIN' ? 'ADMIN' : 'USER'}
          type="user"
        />
      )
    },
    {
      key: 'totalOrders',
      label: 'Orders',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1">
          <ShoppingBag size={14} className="text-gray-400" />
          <span className="font-medium text-gray-900">{row.stats?.totalOrders || 0}</span>
        </div>
      )
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">₹{row.stats?.totalSpent || 0}</p>
        </div>
      )
    },
    {
      key: 'walletBalance',
      label: 'Wallet',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1">
          <Wallet size={14} className="text-green-500" />
          <span className="font-medium text-green-600">₹{row.walletBalance || 0}</span>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Joined',
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm text-gray-700">
            {row.createdAt ? formatDate(row.createdAt, 'D MMM, YYYY') : 'N/A'}
          </p>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <button
          onClick={() => handleViewDetails(row)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye size={16} />
        </button>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users & Customers</h1>
            <p className="text-gray-600 mt-1">Manage and view customer information</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <UserIcon size={16} />
            <span>Total: {users.length}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Name, Phone, or Email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Role Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="USER">Customer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchQuery || roleFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('all');
                }}
                className="self-end px-4 py-2 text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="flex items-center justify-between text-sm text-gray-600 px-2">
            <span>
              Showing <span className="font-semibold text-gray-900">{sortedUsers.length}</span> of <span className="font-semibold text-gray-900">{users.length}</span> users
            </span>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={sortedUsers}
            onSort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
            emptyMessage="No users found. Try adjusting your filters."
          />
        )}
      </div>

      {/* User Details Modal */}
      {detailsModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Basic Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <UserIcon size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-gray-900 font-medium">{selectedUser.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-gray-900 font-medium">{selectedUser.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-gray-900 font-medium">{selectedUser.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-[18px]"></div>
                    <div>
                      <p className="text-xs text-gray-500">Role</p>
                      <StatusBadge
                        status={selectedUser.role === 'ADMIN' ? 'ADMIN' : 'USER'}
                        type="user"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet & Referral */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Wallet & Referrals</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet size={18} className="text-green-500" />
                      <span className="text-gray-700">Wallet Balance</span>
                    </div>
                    <span className="font-bold text-green-600 text-lg">₹{selectedUser.walletBalance || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift size={18} className="text-orange-500" />
                      <span className="text-gray-700">Referral Code</span>
                    </div>
                    <span className="font-mono font-medium text-gray-900">{selectedUser.referralCode || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserIcon size={18} className="text-blue-500" />
                      <span className="text-gray-700">Total Referrals</span>
                    </div>
                    <span className="font-medium text-gray-900">{selectedUser.totalReferrals || 0}</span>
                  </div>
                </div>
              </div>

              {/* Order Stats */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Order Statistics</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Total Orders</span>
                    <span className="font-medium text-gray-900">{selectedUser.stats?.totalOrders || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Total Spent</span>
                    <span className="font-bold text-orange-600">₹{selectedUser.stats?.totalSpent || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Last Order</span>
                    <span className="text-sm text-gray-600">
                      {selectedUser.stats?.lastOrderDate
                        ? formatDate(selectedUser.stats.lastOrderDate, 'D MMM, YYYY')
                        : 'Never'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Member Since</span>
                    <span className="text-sm text-gray-600">
                      {selectedUser.createdAt
                        ? formatDate(selectedUser.createdAt, 'D MMM, YYYY')
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
