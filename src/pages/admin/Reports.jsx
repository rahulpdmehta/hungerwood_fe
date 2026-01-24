import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import { formatCurrency } from '@utils/helpers';

const Reports = () => {
  const salesData = {
    today: 12450,
    yesterday: 10200,
    thisWeek: 78900,
    thisMonth: 345600,
  };

  const topItems = [
    { name: 'Margherita Pizza', orders: 145, revenue: 43355 },
    { name: 'Chicken Burger', orders: 132, revenue: 26268 },
    { name: 'Chicken Biryani', orders: 98, revenue: 24402 },
    { name: 'Pasta Alfredo', orders: 87, revenue: 26100 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports & Analytics</h1>

          {/* Revenue Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Today</h3>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(salesData.today)}</p>
              <p className="text-sm text-green-600 mt-2">+22% from yesterday</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Yesterday</h3>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(salesData.yesterday)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-600 text-sm font-medium mb-2">This Week</h3>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(salesData.thisWeek)}</p>
              <p className="text-sm text-green-600 mt-2">+15% from last week</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-600 text-sm font-medium mb-2">This Month</h3>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(salesData.thisMonth)}</p>
              <p className="text-sm text-green-600 mt-2">+18% from last month</p>
            </div>
          </div>

          {/* Top Selling Items */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Top Selling Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full font-bold">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.orders} orders
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(item.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reports;
