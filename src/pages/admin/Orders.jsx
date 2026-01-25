/**
 * Admin Orders Page
 * Order management with status tracking and validation
 */

import { useState, useEffect, useMemo } from 'react';
import { Eye, X, Clock, ShoppingBag, TrendingUp, Users, UserCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import { adminOrderService } from '../../services/admin.service';
import { formatDate, formatTime, formatDateTime } from '../../utils/dateFormatter';
import { API_BASE_URL } from '../../utils/constants';

const ORDER_STATUS_OPTIONS = [
  'RECEIVED',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'OUT_FOR_DELIVERY',
  'COMPLETED',
  'CANCELLED'
];

const STATUS_FLOW = {
  RECEIVED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['OUT_FOR_DELIVERY', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: []
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  // Set up SSE listeners for all orders to get real-time updates
  useEffect(() => {
    if (orders.length === 0) return;

    // Create SSE connections for each order
    const eventSources = new Map();
    
    orders.forEach(order => {
      const orderId = order.orderId || order.id || order._id;
      if (!orderId || orderId === 'undefined') return;

      try {
        const url = `${API_BASE_URL}/orders/${orderId}/stream`;
        
        const eventSource = new EventSource(url);
        eventSources.set(orderId, eventSource);

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'statusUpdate') {
              // Update the order in the list
              setOrders(prevOrders => 
                prevOrders.map(o => {
                  const oId = o.orderId || o.id || o._id;
                  if (oId === data.orderId || oId === orderId) {
                    return {
                      ...o,
                      status: data.status,
                      statusHistory: data.statusHistory,
                      updatedAt: data.updatedAt
                    };
                  }
                  return o;
                })
              );

              // Update selected order if it matches
              if (selectedOrder) {
                const selectedId = selectedOrder.orderId || selectedOrder.id || selectedOrder._id;
                if (selectedId === data.orderId || selectedId === orderId) {
                  setSelectedOrder(prev => ({
                    ...prev,
                    status: data.status,
                    statusHistory: data.statusHistory,
                    updatedAt: data.updatedAt
                  }));
                }
              }
            }
          } catch (error) {
            console.error('Error parsing SSE message:', error);
          }
        };

        eventSource.onerror = (error) => {
          console.error(`SSE error for order ${orderId}:`, error);
          // Don't close on error, let it reconnect automatically
        };
      } catch (error) {
        console.error(`Failed to create SSE connection for order ${orderId}:`, error);
      }
    });

    // Cleanup on unmount or when orders change
    return () => {
      eventSources.forEach((eventSource, orderId) => {
        eventSource.close();
        console.log(`Closed SSE connection for order ${orderId}`);
      });
      eventSources.clear();
    };
  }, [orders.map(o => o.orderId || o.id || o._id).join(','), selectedOrder]); // Re-run when order IDs change

  // Note: dateFilter is applied client-side, no need to reload from server

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await adminOrderService.getAll(params);
      console.log('🔄 Orders response:', response);
      
      // Handle response structure - could be array or object with orders property
      const ordersArray = Array.isArray(response) ? response : (response?.orders || response?.data || []);
      
      // Normalize legacy 'pending' status to 'RECEIVED' and extract customer info
      const normalizedOrders = ordersArray.map(order => {
        // Ensure orderId is preserved (backend uses orderId, not id)
        const orderId = order.orderId || order.id || order._id;
        return {
          ...order,
          orderId, // Ensure orderId is always present
          id: order.id || order._id || order.orderId, // Also set id for compatibility
          status: order.status === 'pending' ? 'RECEIVED' : order.status,
          // Extract customer info from populated user object
          customerName: order.customerName || order.user?.name || 'Unknown',
          customerPhone: order.customerPhone || order.user?.phone || 'N/A'
        };
      });

      setOrders(normalizedOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders');
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

  // Filter orders by date
  const filterByDate = (orders) => {
    if (dateFilter === 'all') return orders;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);
    const last30Days = new Date(today);
    last30Days.setDate(last30Days.getDate() - 30);

    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);

      switch (dateFilter) {
        case 'today':
          return orderDate >= today;
        case 'yesterday':
          return orderDate >= yesterday && orderDate < today;
        case 'last7days':
          return orderDate >= last7Days;
        case 'last30days':
          return orderDate >= last30Days;
        default:
          return true;
      }
    });
  };

  // Filter orders by search query (order ID, customer name, phone)
  const filterBySearch = (orders) => {
    if (!searchQuery.trim()) return orders;

    const query = searchQuery.toLowerCase().trim();

    return orders.filter(order => {
      const orderId = (order.orderId || order.orderNumber || order.id || '').toLowerCase();
      const customerName = (order.customerName || order.user?.name || '').toLowerCase();
      const customerPhone = (order.customerPhone || order.user?.phone || '').toLowerCase();

      return orderId.includes(query) ||
        customerName.includes(query) ||
        customerPhone.includes(query);
    });
  };

  const dateFilteredOrders = filterByDate(orders);
  const filteredOrders = filterBySearch(dateFilteredOrders);

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Calculate statistics for filtered orders
  const stats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Get unique customers
    const uniqueCustomers = new Set();
    const customerOrderCounts = {};

    filteredOrders.forEach(order => {
      const customerId = order.user || order.customerPhone;
      if (customerId) {
        uniqueCustomers.add(customerId);
        customerOrderCounts[customerId] = (customerOrderCounts[customerId] || 0) + 1;
      }
    });

    // Count repeat customers (customers with more than 1 order)
    const repeatCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;

    return {
      totalOrders,
      totalRevenue,
      uniqueCustomers: uniqueCustomers.size,
      repeatCustomers
    };
  }, [filteredOrders]);

  const handleViewDetails = async (order) => {
    try {
      // Just use the order data directly instead of fetching again
      setSelectedOrder(order);
      setDetailsModalOpen(true);
    } catch (error) {
      console.error('Failed to load order details:', error);
      toast.error('Failed to load order details');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Ensure we have a valid orderId
      if (!orderId) {
        console.error('Order ID is missing:', orderId);
        toast.error('Order ID is missing');
        return;
      }
      
      // Optimistically update the local state immediately
      setOrders(prevOrders => 
        prevOrders.map(order => {
          const currentOrderId = order.orderId || order.id || order._id;
          if (currentOrderId === orderId) {
            return {
              ...order,
              status: newStatus,
              // Update status history if it exists
              statusHistory: order.statusHistory ? [
                ...order.statusHistory,
                {
                  status: newStatus,
                  timestamp: new Date().toISOString(),
                  updatedBy: 'admin'
                }
              ] : order.statusHistory
            };
          }
          return order;
        })
      );

      // Update selected order if it's open in details modal
      const currentOrderId = selectedOrder?.orderId || selectedOrder?.id || selectedOrder?._id;
      if (selectedOrder && currentOrderId === orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          status: newStatus,
          statusHistory: prev.statusHistory ? [
            ...prev.statusHistory,
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              updatedBy: 'admin'
            }
          ] : prev.statusHistory
        }));
      }
      
      // Make the API call
      await adminOrderService.updateStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
      
      // Reload orders to ensure consistency with backend
      loadOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
      
      // Revert optimistic update on error
      loadOrders();
    }
  };

  const getAllowedNextStatuses = (currentStatus) => {
    return STATUS_FLOW[currentStatus] || [];
  };

  const columns = [
    {
      key: 'orderId',
      label: 'Order #',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">
            {row.orderId ? `#${row.orderId}` : row.orderNumber || (row.id ? `#${row.id.slice(-6)}` : '#N/A')}
          </p>
          <p className="text-xs text-gray-500">
            {formatDate(row.createdAt, 'D MMM, YYYY')}
          </p>
          <p className="text-xs text-gray-400">
            {formatTime(row.createdAt)}
          </p>
        </div>
      )
    },
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.customerName || row.user?.name || 'Unknown'}</p>
          <p className="text-xs text-gray-500">{row.customerPhone || row.user?.phone || 'N/A'}</p>
        </div>
      )
    },
    {
      key: 'orderType',
      label: 'Type',
      sortable: true,
      render: (row) => (
        <span className="text-sm text-gray-700 capitalize">{row.orderType || 'N/A'}</span>
      )
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">₹{row.totalAmount}</p>
          {row.walletUsed > 0 && (
            <p className="text-xs text-green-600">Wallet: -₹{row.walletUsed}</p>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} type="order" />
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          {getAllowedNextStatuses(row.status).length > 0 && (
            <select
              value={row.status}
              onChange={(e) => handleStatusChange(row.orderId || row.id || row._id, e.target.value)}
              className="text-sm px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value={row.status} disabled>Change Status</option>
              {getAllowedNextStatuses(row.status).map(status => (
                <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
              ))}
            </select>
          )}
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1">Manage customer orders and status</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock size={16} />
            <span>Real-time updates</span>
          </div>
        </div>

        {/* Search Bar */}


        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex gap-4 items-center">

            <div className="relative flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer Name, or Phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
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
            {/* Status Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                {ORDER_STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(statusFilter || dateFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setStatusFilter('');
                  setDateFilter('all');
                  setSearchQuery('');
                }}
                className="self-end px-4 py-2 text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Orders */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalOrders}
                  </p>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{stats.totalRevenue}
                  </p>
                </div>
                <div className="bg-green-50 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            {/* Unique Customers */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Unique Customers
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.uniqueCustomers}
                  </p>
                </div>
                <div className="bg-purple-50 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Repeat Customers */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Repeat Customers
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.repeatCustomers}
                  </p>
                </div>
                <div className="bg-orange-50 p-2 rounded-lg">
                  <UserCheck className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <div className="flex items-center justify-between text-sm text-gray-600 px-2">
            <span>
              Showing <span className="font-semibold text-gray-900">{filteredOrders.length}</span> of <span className="font-semibold text-gray-900">{orders.length}</span> orders
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
            data={sortedOrders}
            onSort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
            emptyMessage="No orders found. Try adjusting your filters."
          />
        )}
      </div>

      {/* Order Details Modal */}
      {detailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Order {selectedOrder.orderId ? `#${selectedOrder.orderId}` : selectedOrder.orderNumber || (selectedOrder.id ? `#${selectedOrder.id.slice(-6)}` : '#N/A')}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDateTime(selectedOrder.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Customer Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-1">
                  <p className="text-gray-900">
                    <span className="font-medium">Name:</span> {selectedOrder.customerName || selectedOrder.customerDetails?.name || 'N/A'}
                  </p>
                  <p className="text-gray-900">
                    <span className="font-medium">Phone:</span> {selectedOrder.customerPhone || selectedOrder.customerDetails?.phone || 'N/A'}
                  </p>
                  {selectedOrder.customerDetails?.email && (
                    <p className="text-gray-900">
                      <span className="font-medium">Email:</span> {selectedOrder.customerDetails.email}
                    </p>
                  )}
                  <p className="text-gray-900">
                    <span className="font-medium">Order Type:</span> {selectedOrder.orderType || 'N/A'}
                  </p>
                  {selectedOrder.deliveryAddress && (
                    <p className="text-gray-900">
                      <span className="font-medium">Address:</span> {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} - {selectedOrder.deliveryAddress.pincode}
                    </p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Order Items</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name || item.menuItemDetails?.name || 'Menu Item'}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                          {item.discount > 0 && (
                            <p className="text-xs text-green-600">Discount: {item.discount}% OFF</p>
                          )}
                        </div>
                        <p className="font-medium text-gray-900">₹{Math.round(item.price * (1 - (item.discount || 0) / 100)) * item.quantity}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No items available</p>
                  )}
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Item Total</span>
                    <span>₹{selectedOrder.itemTotal || selectedOrder.totalAmount}</span>
                  </div>
                  {selectedOrder.tax > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Tax</span>
                      <span>₹{selectedOrder.tax}</span>
                    </div>
                  )}
                  {selectedOrder.deliveryFee > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Delivery Fee</span>
                      <span>₹{selectedOrder.deliveryFee}</span>
                    </div>
                  )}
                  {selectedOrder.walletUsed > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Wallet Used</span>
                      <span>-₹{selectedOrder.walletUsed}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold text-gray-900">
                    <span>Total Amount</span>
                    <span>₹{selectedOrder.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Payment Method</span>
                    <span className="uppercase">{selectedOrder.paymentMethod || 'CASH'}</span>
                  </div>
                </div>
              </div>

              {/* Status History */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Status History</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      {selectedOrder.statusHistory.map((history, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 mt-2 bg-orange-600 rounded-full"></div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium text-gray-900">
                                {history.status.replace(/_/g, ' ')}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDateTime(history.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Update Status */}
              {getAllowedNextStatuses(selectedOrder.status).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Update Status</h4>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.orderId || selectedOrder.id || selectedOrder._id, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value={selectedOrder.status} disabled>
                      Current: {selectedOrder.status.replace(/_/g, ' ')}
                    </option>
                    {getAllowedNextStatuses(selectedOrder.status).map(status => (
                      <option key={status} value={status}>
                        {status.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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

export default AdminOrders;
