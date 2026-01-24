import { formatDate as formatDateUtil, formatTime as formatTimeUtil } from './dateFormatter';

export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Use dateFormatter utilities
export const formatDate = (date, format = 'short') => {
  if (format === 'short') {
    return formatDateUtil(date, 'MMM D, YYYY');
  }
  return formatDateUtil(date, 'dddd, MMMM D, YYYY');
};

export const formatTime = (date) => {
  return formatTimeUtil(date, 'h:mm A');
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const calculateCartTotal = items => {
  return items.reduce((total, item) => {
    // Calculate discounted price if discount exists
    const discount = item.discount || 0;
    const discountedPrice = discount > 0
      ? Math.round(item.price * (1 - discount / 100))
      : item.price;

    return total + (discountedPrice * item.quantity);
  }, 0);
};

export const calculateCartTotalWithOutDiscount = items => {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

export const groupByCategory = items => {
  return items.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
};

export const getInitials = name => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const validateEmail = email => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = phone => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

export const generateOrderId = () => {
  return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export const isWithinBusinessHours = () => {
  const now = new Date();
  const hour = now.getHours();
  // Business hours: 9 AM to 11 PM
  return hour >= 9 && hour < 23;
};
