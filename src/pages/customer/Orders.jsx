import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavBar from '@components/layout/BottomNavBar';
import BackButton from '@components/common/BackButton';
import { orderService } from '@services/order.service';
import PriceDisplay from '@components/common/PriceDisplay';
import { formatDate, formatTime } from '@utils/dateFormatter';

const Orders = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  // Filter and sort states
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'completed', 'cancelled'
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [showFilters, setShowFilters] = useState(false);

  // Load orders from API
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      // Set fallback data
      setOrders(fallbackOrders);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format order items for display
  const formatOrderItems = (items) => {
    if (typeof items === 'string') return items; // Already formatted (fallback data)
    if (!Array.isArray(items)) return 'No items';

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    return `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
  };

  // Helper to get item names from order
  const getItemNames = (items) => {
    if (typeof items === 'string') return items; // Already formatted (fallback data)
    if (!Array.isArray(items) || items.length === 0) return 'No items';

    // For now, just show quantity summary since we don't have item names in order
    return items.map(item => `${item.quantity}x Item`).join(', ');
  };

  // Handle order card click
  const handleOrderClick = (order) => {
    navigate(`/orders/${order.id}`, {
      state: { order }
    });
  };

  const handleReorder = (order) => {
    // In real app: Add items to cart and navigate
    alert(`Reordering order #${order.orderNumber || order.id}`);
    navigate('/menu');
  };

  const handleShowOlder = () => {
    alert('Loading older orders...');
  };

  // Fallback orders data (in case API fails)
  const fallbackOrders = [
    {
      id: 'HW-9021',
      restaurant: 'HungerWood Gaya',
      items: '2x Paneer Butter Masala, 4x Butter Naan',
      total: 450,
      status: 'Delivered',
      date: 'Oct 24, 2023',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
    },
    {
      id: 'HW-8842',
      restaurant: 'HungerWood Gaya',
      items: '1x Chicken Biryani, 1x Raita',
      total: 320,
      status: 'Cancelled',
      date: 'Oct 20, 2023',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
    },
    {
      id: 'HW-8711',
      restaurant: 'HungerWood Gaya',
      items: '1x Veg Manchurian, 1x Fried Rice',
      total: 280,
      status: 'Delivered',
      date: 'Oct 15, 2023',
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80',
    },
  ];

  // Use API data if available, otherwise use fallback
  const allOrders = orders.length > 0 ? orders : fallbackOrders;

  // Filter by status
  const filterByStatus = (orders) => {
    if (statusFilter === 'all') return orders;

    if (statusFilter === 'active') {
      return orders.filter(order => {
        const status = (order.status || '').toLowerCase();
        return status !== 'completed' && status !== 'delivered' && status !== 'cancelled';
      });
    }

    if (statusFilter === 'completed') {
      return orders.filter(order => {
        const status = (order.status || '').toLowerCase();
        return status === 'completed' || status === 'delivered';
      });
    }

    if (statusFilter === 'cancelled') {
      return orders.filter(order => {
        const status = (order.status || '').toLowerCase();
        return status === 'cancelled';
      });
    }

    return orders;
  };

  // Filter by date
  const filterByDate = (orders) => {
    if (dateFilter === 'all') return orders;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return orders.filter(order => {
      const orderDate = new Date(order.createdAt || order.date);

      if (dateFilter === 'today') {
        return orderDate >= today;
      }
      if (dateFilter === 'week') {
        return orderDate >= weekAgo;
      }
      if (dateFilter === 'month') {
        return orderDate >= monthAgo;
      }

      return true;
    });
  };

  // Sort by date
  const sortByDate = (orders) => {
    return [...orders].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);

      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  };

  // Apply all filters and sorting
  let ordersToDisplay = filterByStatus(allOrders);
  ordersToDisplay = filterByDate(ordersToDisplay);
  ordersToDisplay = sortByDate(ordersToDisplay);

  // Count active filters
  const activeFiltersCount =
    (statusFilter !== 'all' ? 1 : 0) +
    (dateFilter !== 'all' ? 1 : 0);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-[#887263] dark:text-gray-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f8f7f6] dark:bg-[#211811]">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#f8f7f6]/80 dark:bg-[#211811]/80 backdrop-blur-md border-b border-[#e5e0dc] dark:border-[#3d2e24]">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <BackButton to="/" />
          <h1 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
            Order History
          </h1>
        </div>
      </nav>

      <main className="max-w-md mx-auto pb-20 w-full">
        {/* Filter and Sort Section */}
        <div className="px-4 mt-4 mb-2">
          <div className="flex items-center gap-2 justify-between">
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#2d221a] border border-[#e5e0dc] dark:border-[#3d2e24] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined text-[#cf6317] text-xl">
                tune
              </span>
              <span className="text-sm font-medium text-[#181411] dark:text-white">
                Filters
              </span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 bg-[#cf6317] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Button */}
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#2d221a] border border-[#e5e0dc] dark:border-[#3d2e24] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined text-[#cf6317] text-xl">
                {sortOrder === 'desc' ? 'arrow_downward' : 'arrow_upward'}
              </span>
              <span className="text-sm font-medium text-[#181411] dark:text-white">
                Date
              </span>
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-3 bg-white dark:bg-[#2d221a] border border-[#e5e0dc] dark:border-[#3d2e24] rounded-xl p-4 space-y-4">
              {/* Status Filter */}
              <div>
                <label className="text-sm font-bold text-[#181411] dark:text-white mb-2 block">
                  Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['all', 'active', 'completed', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
                        ? 'bg-[#cf6317] text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-[#887263] dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Filter */}
              <div>
                <label className="text-sm font-bold text-[#181411] dark:text-white mb-2 block">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'all', label: 'All Time' },
                    { value: 'today', label: 'Today' },
                    { value: 'week', label: 'Last 7 Days' },
                    { value: 'month', label: 'Last 30 Days' },
                  ].map((date) => (
                    <button
                      key={date.value}
                      onClick={() => setDateFilter(date.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${dateFilter === date.value
                        ? 'bg-[#cf6317] text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-[#887263] dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                      {date.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setDateFilter('all');
                  }}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-[#cf6317] font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        {!showFilters && ordersToDisplay.length > 0 && (
          <div className="px-4 mb-3">
            <p className="text-sm text-[#887263] dark:text-gray-400">
              {ordersToDisplay.length} {ordersToDisplay.length === 1 ? 'order' : 'orders'} found
            </p>
          </div>
        )}

        {/* Orders List */}
        {ordersToDisplay.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <span
              className="material-symbols-outlined text-gray-300 dark:text-gray-700 mb-4"
              style={{ fontSize: '120px' }}
            >
              receipt_long
            </span>
            <h2 className="text-2xl font-bold text-[#181411] dark:text-white mb-2">
              {activeFiltersCount > 0 ? 'No orders found' : 'No orders yet'}
            </h2>
            <p className="text-[#887263] dark:text-gray-400 mb-6">
              {activeFiltersCount > 0
                ? 'Try adjusting your filters to see more orders'
                : 'Start ordering delicious food from our menu'}
            </p>
            {activeFiltersCount > 0 ? (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setDateFilter('all');
                }}
                className="bg-[#cf6317] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#cf6317]/90 transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => navigate('/menu')}
                className="bg-[#cf6317] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#cf6317]/90 transition-colors"
              >
                Browse Menu
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-1 mt-2">
            {ordersToDisplay.map((order) => (
              <div key={order.id} className="px-4 py-2">
                <div
                  onClick={() => handleOrderClick(order)}
                  className="flex flex-col items-stretch justify-start rounded-xl shadow-sm border border-[#e5e0dc] dark:border-[#3d2e24] bg-white dark:bg-[#2d2118] overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                >
                  {/* Order Image */}
                  {/* <div
                    className="w-full bg-center bg-no-repeat aspect-[16/6] bg-cover"
                    style={{ backgroundImage: `url("${order.image || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80'}")` }}
                  ></div> */}

                  {/* Order Details */}
                  <div className="flex w-full flex-col gap-1 py-4 px-4">
                    {/* Status and ID */}
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status?.toLowerCase() === 'completed' || order.status?.toLowerCase() === 'delivered'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : order.status?.toLowerCase() === 'cancelled'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                          }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-[#887263] dark:text-[#b09d90] text-xs font-medium">
                        {order.createdAt && formatDate(order.createdAt, 'D MMM, YYYY')}
                        {order.createdAt && ' • '}
                        {order.createdAt && formatTime(order.createdAt)}
                      </span>
                      <span className="text-[#887263] dark:text-[#b09d90] text-xs font-medium">
                        #{order.orderNumber || order.id}
                      </span>
                    </div>

                    {/* Restaurant Name */}
                    {/* <p className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-tight">
                      {order.restaurant || 'HungerWood'}
                    </p> */}

                    {/* Menu Items List */}
                    <div className="flex flex-col gap-2 mt-2 mb-3">
                      {Array.isArray(order.items) ? (
                        order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <span className="text-[#887263] dark:text-[#b09d90] font-medium">
                              {item.quantity}x
                            </span>
                            <span className="text-[#181411] dark:text-white flex-1">
                              {item.name || 'Menu Item'}
                            </span>
                            <PriceDisplay
                              price={item.price || 0}
                              discount={item.discount || 0}
                              size="sm"
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-[#887263] dark:text-[#b09d90] text-sm font-normal">
                          {order.items}
                        </p>
                      )}
                    </div>

                    {/* Total and View Details Button */}
                    <div className="flex items-center gap-3 justify-between mt-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[#887263] dark:text-[#b09d90] text-xs font-normal">
                          {formatOrderItems(order.items)}
                        </p>
                        <p className="text-[#cf6317] text-lg font-bold leading-normal">
                          ₹{order.totalAmount || order.total}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderClick(order);
                        }}
                        className="flex min-w-[110px] cursor-pointer items-center justify-center gap-1 rounded-lg h-9 px-4 text-sm font-semibold transition-colors bg-[#cf6317] hover:bg-[#cf6317]/90 text-white"
                      >
                        <span className="truncate">View Details</span>
                        <span className="material-symbols-outlined text-lg">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show Older Orders Button */}
        {/* {ordersToDisplay.length > 0 && (
          <div className="px-4 py-6 text-center">
            <button
              onClick={handleShowOlder}
              className="text-[#cf6317] text-sm font-bold tracking-wide py-2 px-6 border border-[#cf6317]/30 rounded-full hover:bg-[#cf6317]/5 transition-colors"
            >
              Show Older Orders
            </button>
          </div>
        )} */}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </div>
  );
};

export default Orders;
