import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavBar from '@components/layout/BottomNavBar';
import BackButton from '@components/common/BackButton';
import { useOrders } from '@hooks/useOrderQueries';
import { OrderSkeleton } from '@components/common/Loader';
import PriceDisplay from '@components/common/PriceDisplay';
import { formatDate, formatTime } from '@utils/dateFormatter';

const Orders = () => {
  const navigate = useNavigate();
  
  // React Query hook for fetching orders
  const { data: orders = [], isLoading: loading } = useOrders();

  // Filter and sort states
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'past' (cancelled/completed), 'active' (all others)
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [showFilters, setShowFilters] = useState(false);

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
    const orderId = order.orderId || order.id;
    navigate(`/orders/${orderId}`, {
      state: { order }
    });
  };

  const handleReorder = (order) => {
    // In real app: Add items to cart and navigate
    alert(`Reordering order #${order.orderId || order.orderNumber || order.id}`);
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
  const allOrders = useMemo(() => {
    return orders.length > 0 ? orders : fallbackOrders;
  }, [orders]);

  // Filter by status
  // 'all' = show all orders
  // 'past' = cancelled or completed/delivered orders
  // 'active' = all other orders (out_for_delivery, preparing, confirmed, pending, etc.)
  const filterByStatus = (orders) => {
    if (statusFilter === 'all') {
      return orders; // Show all orders
    }

    if (statusFilter === 'past') {
      // Show cancelled, completed, or delivered orders
      return orders.filter(order => {
        const status = (order.status || '').toLowerCase();
        return status === 'cancelled' || status === 'completed' || status === 'delivered';
      });
    }

    if (statusFilter === 'active') {
      // Show all orders that are NOT cancelled, completed, or delivered
      return orders.filter(order => {
        const status = (order.status || '').toLowerCase();
        return status !== 'cancelled' && status !== 'completed' && status !== 'delivered';
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

  // Count active filters (excluding status filter since it's now a tab)
  const activeFiltersCount =
    (dateFilter !== 'all' ? 1 : 0);

  // Show loading state
  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-[#f8f7f6] dark:bg-[#211811]">
        <nav className="sticky top-0 z-50 bg-[#f8f7f6]/80 dark:bg-[#211811]/80 backdrop-blur-md border-b border-[#e5e0dc] dark:border-[#3d2e24]">
          <div className="flex items-center p-4 justify-between max-w-md mx-auto">
            <BackButton to="/" />
            <h1 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
              Order History
            </h1>
          </div>
        </nav>
        <main className="max-w-md mx-auto pb-20 w-full">
          <OrderSkeleton count={5} />
        </main>
        <BottomNavBar />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f8f7f6] dark:bg-[#211811]">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#f8f7f6]/80 dark:bg-[#211811]/80 backdrop-blur-md border-b border-[#e5e0dc] dark:border-[#3d2e24]">
        <div className="max-w-md mx-auto">
          <div className="flex items-center p-4 justify-between">
            <BackButton to="/" />
            <h1 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
              Order History
            </h1>
          </div>
          
          {/* Tabs: All, Past Orders, and Active */}
          <div className="flex items-center gap-6 px-4 pb-3 border-b-2 border-[#e5e0dc] dark:border-[#3d2e24]">
            <button
              onClick={() => setStatusFilter('all')}
              className={`relative pb-2 text-sm font-semibold transition-colors ${
                statusFilter === 'all'
                  ? 'text-[#181411] dark:text-white'
                  : 'text-[#887263] dark:text-gray-400'
              }`}
            >
              All
              {statusFilter === 'all' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7f4f13]"></span>
              )}
            </button>
            <button
              onClick={() => setStatusFilter('past')}
              className={`relative pb-2 text-sm font-semibold transition-colors ${
                statusFilter === 'past'
                  ? 'text-[#181411] dark:text-white'
                  : 'text-[#887263] dark:text-gray-400'
              }`}
            >
              Past Orders
              {statusFilter === 'past' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7f4f13]"></span>
              )}
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`relative pb-2 text-sm font-semibold transition-colors ${
                statusFilter === 'active'
                  ? 'text-[#181411] dark:text-white'
                  : 'text-[#887263] dark:text-gray-400'
              }`}
            >
              Active
              {statusFilter === 'active' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7f4f13]"></span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto pb-20 w-full">
        {/* Filter and Sort Section */}
        
        {ordersToDisplay.length > 10 && (<div className="px-4 mt-4 mb-2">
          <div className="flex items-center gap-2 justify-between">
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#2d221a] border-2 border-[#e5e0dc] dark:border-[#3d2e24] rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <span className="material-symbols-outlined text-[#7f4f13] text-xl">
                tune
              </span>
              <span className="text-sm font-medium text-[#181411] dark:text-white">
                Filters
              </span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 bg-[#7f4f13] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Button */}
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#2d221a] border-2 border-[#e5e0dc] dark:border-[#3d2e24] rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <span className="material-symbols-outlined text-[#7f4f13] text-xl">
                {sortOrder === 'desc' ? 'arrow_downward' : 'arrow_upward'}
              </span>
              <span className="text-sm font-medium text-[#181411] dark:text-white">
                Date
              </span>
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-3 bg-white dark:bg-[#2d221a] border-2 border-[#e5e0dc] dark:border-[#3d2e24] rounded-xl p-4 space-y-4 shadow-lg">
              {/* Date Filter Only - Status is now handled by tabs */}

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
                        ? 'bg-[#7f4f13] text-white'
                        : 'bg-gray-200 dark:bg-gray-800 text-[#887263] dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
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
                    setDateFilter('all');
                  }}
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-800 text-[#7f4f13] font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>)}

        {/* Results Count */}
        {!showFilters && ordersToDisplay.length > 10 && (
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
                  setDateFilter('all');
                }}
                className="bg-[#7f4f13] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#7f4f13]/90 transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => navigate('/menu')}
                className="bg-[#7f4f13] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#7f4f13]/90 transition-colors"
              >
                Browse Menu
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2 mt-2 px-4">
            {ordersToDisplay.map((order) => (
              <div
                key={order.orderId || order.id}
                onClick={() => handleOrderClick(order)}
                className="flex items-center gap-2 overflow-hidden bg-white dark:bg-gray-900 rounded-lg shadow-md border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
              >
                {/* Order Image - Left Column */}
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover w-[110px] h-[110px] shrink-0"
                  style={{ backgroundImage: `url("${order.image || order.items?.[0]?.image || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80'}")` }}
                ></div>

                {/* Order Details - Right Column */}
                <div className="flex flex-col flex-1 justify-between min-h-[110px] p-2">
                  <div className="flex-1">
                    {/* Status and Order ID - Top Row */}
                    <div className="flex items-center justify-between gap-2 mb-1 relative">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${order.status?.toLowerCase() === 'completed' || order.status?.toLowerCase() === 'delivered'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : order.status?.toLowerCase() === 'cancelled'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                          }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-[#887263] dark:text-[#b09d90] text-[10px] font-medium ml-auto">
                        #{order.orderId || order.orderNumber || order.id}
                      </span>
                    </div>

                    {/* Menu Items - Truncated */}
                    <div className="flex-1">
                      {Array.isArray(order.items) && order.items.length > 0 ? (
                        <p className="text-[#887263] dark:text-gray-400 text-[11px] leading-snug line-clamp-2 mt-1">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <span key={idx}>
                              {item.quantity}x {item.name || 'Menu Item'}
                              {idx < Math.min(order.items.length - 1, 1) ? ', ' : ''}
                            </span>
                          ))}
                          {order.items.length > 2 && '...'}
                        </p>
                      ) : (
                        <p className="text-[#887263] dark:text-gray-400 text-[11px] leading-snug line-clamp-2 mt-1">
                          {typeof order.items === 'string' ? order.items : formatOrderItems(order.items)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Date and Price - Bottom Row */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className="text-[#887263] dark:text-gray-400 text-[10px] font-normal">
                        {order.createdAt ? formatDate(order.createdAt, 'D MMM, YYYY') : order.date || 'N/A'}
                      </p>
                      <p className="text-[#7f4f13] text-base font-bold leading-normal">
                        ₹{order.totalAmount || order.total}
                      </p>
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
              className="text-[#7f4f13] text-sm font-bold tracking-wide py-2 px-6 border-2 border-[#7f4f13]/30 rounded-full hover:bg-[#7f4f13]/5 hover:shadow-md transition-all"
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
