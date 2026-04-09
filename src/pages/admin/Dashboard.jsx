/**
 * Admin Dashboard Page
 * Comprehensive overview with KPIs, charts, and analytics
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  UtensilsCrossed,
  Users,
  TrendingUp,
  Wallet,
  TrendingDown,
  ArrowRight,
  Calendar,
  Power
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { dashboardService, restaurantService } from '../../services/admin.service';
import useRestaurantStore from '../../store/useRestaurantStore';
import { formatChartDate } from '../../utils/dateFormatter';

const COLORS = ['#7f4f13', '#f97316', '#fb923c', '#fdba74', '#fed7aa'];

const DATE_FILTERS = [
  { label: 'Last 7 Days', value: 7 },
  { label: 'Last 30 Days', value: 30 },
  { label: 'Last 90 Days', value: 90 },
  { label: 'This Month', value: 'thisMonth' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'All Time', value: 'all' }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { isOpen, closingMessage, fetchAdminStatus, updateStatus } = useRestaurantStore();
  const [stats, setStats] = useState(null);
  const [ordersAnalytics, setOrdersAnalytics] = useState(null);
  const [menuAnalytics, setMenuAnalytics] = useState(null);
  const [customerAnalytics, setCustomerAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(30);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closingMessageInput, setClosingMessageInput] = useState('');

  useEffect(() => {
    loadDashboardData();
    fetchAdminStatus();
  }, [dateFilter, fetchAdminStatus]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Calculate days based on filter
      let days = dateFilter;
      if (dateFilter === 'thisMonth') {
        const now = new Date();
        days = now.getDate(); // Days elapsed in current month
      } else if (dateFilter === 'lastMonth') {
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        days = Math.ceil((lastMonthEnd - lastMonth) / (1000 * 60 * 60 * 24));
      } else if (dateFilter === 'all') {
        days = 365; // Default to 1 year for "all time"
      }

      const [statsData, ordersData, menuData, customerData] = await Promise.all([
        dashboardService.getStats(dateFilter),
        dashboardService.getOrdersAnalytics(days),
        dashboardService.getMenuAnalytics(dateFilter),
        dashboardService.getCustomerAnalytics(days)
      ]);

      setStats(statsData);
      setOrdersAnalytics(ordersData);
      setMenuAnalytics(menuData);
      setCustomerAnalytics(customerData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const KPICard = ({ title, value, subtitle, change, icon: Icon, color, onClick }) => {
    const isPositive = parseFloat(change) >= 0;
    const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
    const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

    return (
      <div
        onClick={onClick}
        className={`bg-white rounded-lg shadow-sm p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {change && (
            <div className={`flex items-center gap-1 ${changeColor}`}>
              <ChangeIcon size={16} />
              <span className="text-sm font-semibold">{change}%</span>
            </div>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        {onClick && (
          <div className="flex items-center gap-1 text-orange-600 text-sm font-medium mt-3">
            <span>View Details</span>
            <ArrowRight size={14} />
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </AdminLayout>
    );
  }

  const getFilterLabel = () => {
    const filter = DATE_FILTERS.find(f => f.value === dateFilter);
    return filter ? filter.label : 'Select Period';
  };

  const handleToggleStatus = async () => {
    if (isOpen) {
      // Currently open - show modal to close
      setShowCloseModal(true);
    } else {
      // Currently closed - open restaurant
      const result = await updateStatus(true, '');
      if (result.success) {
        toast.success('Restaurant is now open');
        setShowCloseModal(false);
        setClosingMessageInput('');
        // Refresh status to ensure UI is in sync
        await fetchAdminStatus();
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    }
  };

  const handleCloseRestaurant = async () => {
    const result = await updateStatus(false, closingMessageInput);
    if (result.success) {
      toast.success('Restaurant is now closed');
      setShowCloseModal(false);
      setClosingMessageInput('');
      // Refresh status to ensure UI is in sync
      await fetchAdminStatus();
    } else {
      toast.error(result.error || 'Failed to update status');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Date Filter */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome to HungerWood Admin</p>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-gray-500" />
            <select
              value={dateFilter}
              onChange={(e) => {
                const value = e.target.value;
                setDateFilter(isNaN(value) ? value : parseInt(value));
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm font-medium bg-white"
            >
              {DATE_FILTERS.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Restaurant Status Card */}
        <div className={`bg-white rounded-lg shadow-sm p-6 border-2 ${isOpen ? 'border-green-200' : 'border-red-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${isOpen ? 'bg-green-100' : 'bg-red-100'}`}>
                <Power size={24} className={isOpen ? 'text-green-600' : 'text-red-600'} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Restaurant Status</h3>
                <p className={`text-sm font-medium ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
                  {isOpen ? 'Currently Open' : 'Currently Closed'}
                </p>
                {!isOpen && closingMessage && (
                  <p className="text-sm text-gray-600 mt-1">{closingMessage}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleToggleStatus}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                isOpen
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isOpen ? 'Close Restaurant' : 'Open Restaurant'}
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard
            title="Total Orders (Month)"
            value={stats?.orders?.thisMonth || 0}
            subtitle={`${stats?.orders?.today || 0} today`}
            change={stats?.orders?.change}
            icon={ShoppingBag}
            color="bg-blue-500"
            onClick={() => navigate('/admin/orders')}
          />
          <KPICard
            title="Revenue (Month)"
            value={formatCurrency(stats?.revenue?.thisMonth || 0)}
            subtitle={`${formatCurrency(stats?.revenue?.today || 0)} today`}
            change={stats?.revenue?.change}
            icon={TrendingUp}
            color="bg-green-500"
            onClick={() => navigate('/admin/orders')}
          />
          <KPICard
            title="Active Menu Items"
            value={stats?.menuItems?.active || 0}
            subtitle={`${stats?.menuItems?.total || 0} total items`}
            icon={UtensilsCrossed}
            color="bg-purple-500"
            onClick={() => navigate('/admin/menu')}
          />
          <KPICard
            title="Total Customers"
            value={stats?.customers?.total || 0}
            subtitle={`${stats?.customers?.newThisMonth || 0} new this month`}
            icon={Users}
            color="bg-orange-500"
            onClick={() => navigate('/admin/users')}
          />
          <KPICard
            title="Wallet Used (Month)"
            value={formatCurrency(stats?.wallet?.usedThisMonth || 0)}
            subtitle={`${formatCurrency(stats?.wallet?.totalUsed || 0)} all time`}
            icon={Wallet}
            color="bg-cyan-500"
          />
        </div>

        {/* Orders Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders Per Day */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Orders Per Day ({getFilterLabel()})</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ordersAnalytics?.ordersPerDay || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatChartDate}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={formatChartDate}
                  formatter={(value) => [value, 'Orders']}
                />
                <Line type="monotone" dataKey="count" stroke="#7f4f13" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Per Day */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Per Day ({getFilterLabel()})</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersAnalytics?.revenuePerDay || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatChartDate}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={formatChartDate}
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status & Top Selling Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersAnalytics?.statusDistribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => `${status} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                >
                  {(ordersAnalytics?.statusDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Selling Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Items</h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {(menuAnalytics?.topSellingItems || []).slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.sales} orders</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">{formatCurrency(item.revenue)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Sales & Customer Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category-wise Sales */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Category-wise Sales</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={menuAnalytics?.categoryWiseSales || []} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [value, 'Sales']} />
                <Bar dataKey="sales" fill="#7f4f13" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Veg vs Non-Veg */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Veg vs Non-Veg Sales</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={menuAnalytics?.vegVsNonVeg || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="sales"
                  nameKey="type"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* New Customers Over Time */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">New Customers ({getFilterLabel()})</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={customerAnalytics?.customersOverTime || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatChartDate}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={formatChartDate}
                  formatter={(value) => [value, 'New Customers']}
                />
                <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Repeat vs New Users */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Repeat vs New Users</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerAnalytics?.repeatVsNew || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="type"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#8b5cf6" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Close Restaurant Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Close Restaurant</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add an optional message to display to customers when the restaurant is closed.
            </p>
            <textarea
              value={closingMessageInput}
              onChange={(e) => setClosingMessageInput(e.target.value)}
              placeholder="e.g., Closed for maintenance. Will reopen at 9 AM tomorrow."
              maxLength={200}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
            />
            <p className="text-xs text-gray-500 mb-4">{closingMessageInput.length}/200 characters</p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowCloseModal(false);
                  setClosingMessageInput('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseRestaurant}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Close Restaurant
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
