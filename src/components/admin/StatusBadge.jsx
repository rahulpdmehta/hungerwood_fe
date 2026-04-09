/**
 * Status Badge Component
 * Displays color-coded status indicators
 */

const StatusBadge = ({ status, type = 'order' }) => {
  const getOrderStatusStyle = (status) => {
    const styles = {
      RECEIVED: 'bg-blue-100 text-blue-700',
      CONFIRMED: 'bg-purple-100 text-purple-700',
      PREPARING: 'bg-yellow-100 text-yellow-700',
      READY: 'bg-cyan-100 text-cyan-700',
      OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-700',
      COMPLETED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
      // Legacy statuses (lowercase)
      pending: 'bg-blue-100 text-blue-700',
      confirmed: 'bg-purple-100 text-purple-700',
      preparing: 'bg-yellow-100 text-yellow-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return styles[status] || 'bg-gray-200 text-gray-700';
  };

  const getCategoryStatusStyle = (status) => {
    return status ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700';
  };

  const getAvailabilityStyle = (status) => {
    return status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  };

  const getUserRoleStyle = (role) => {
    const styles = {
      ADMIN: 'bg-orange-100 text-orange-700',
      USER: 'bg-blue-100 text-blue-700',
      CUSTOMER: 'bg-blue-100 text-blue-700'
    };
    return styles[role?.toUpperCase()] || 'bg-gray-200 text-gray-700';
  };

  const formatStatus = (status) => {
    if (typeof status === 'boolean') {
      return status ? 'Active' : 'Inactive';
    }
    // Normalize legacy lowercase statuses
    const normalizedStatus = status.toLowerCase() === 'pending' ? 'RECEIVED' : status;
    // Special formatting for user roles
    if (type === 'user') {
      return status === 'ADMIN' ? 'Admin' : 'Customer';
    }
    return normalizedStatus.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getStyle = () => {
    switch (type) {
      case 'order':
        return getOrderStatusStyle(status);
      case 'category':
        return getCategoryStatusStyle(status);
      case 'availability':
        return getAvailabilityStyle(status);
      case 'user':
        return getUserRoleStyle(status);
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStyle()}`}>
      {formatStatus(status)}
    </span>
  );
};

export default StatusBadge;
