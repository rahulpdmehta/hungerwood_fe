/**
 * OrderStatusAnimation - Subtle animation for order status updates
 * Non-blocking, shows a toast-style notification
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '../../contexts/AnimationContext';

const statusConfig = {
  RECEIVED: {
    icon: 'check_circle',
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    message: 'Order Confirmed',
  },
  PREPARING: {
    icon: 'restaurant',
    color: 'text-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800',
    message: 'Preparing Your Meal',
  },
  READY: {
    icon: 'dinner_dining',
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    message: 'Ready for Pickup',
  },
  OUT_FOR_DELIVERY: {
    icon: 'local_shipping',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    border: 'border-indigo-200 dark:border-indigo-800',
    message: 'Out for Delivery',
  },
  COMPLETED: {
    icon: 'task_alt',
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    message: 'Order Delivered',
  },
  CANCELLED: {
    icon: 'cancel',
    color: 'text-red-600',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    message: 'Order Cancelled',
  },
};

const OrderStatusAnimation = () => {
  const { on } = useAnimation();
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const unsubscribe = on('order:status', (data) => {
      setStatus(data.status);
      setShow(true);

      // Auto-hide after 3 seconds
      setTimeout(() => {
        setShow(false);
      }, 3000);
    });

    return unsubscribe;
  }, [on]);

  const config = statusConfig[status] || statusConfig.RECEIVED;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="fixed top-20 right-4 z-[9996] max-w-sm"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`${config.bg} ${config.border} border rounded-xl shadow-lg p-4 flex items-center gap-3`}
          >
            <motion.span
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`material-symbols-outlined ${config.color} text-3xl`}
            >
              {config.icon}
            </motion.span>
            
            <div className="flex-1">
              <p className={`${config.color} font-semibold text-sm`}>
                {config.message}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                Your order status has been updated
              </p>
            </div>

            <button
              onClick={() => setShow(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderStatusAnimation;
