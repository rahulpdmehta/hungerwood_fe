/**
 * OrderPlacedAnimation - Success animation when order is placed
 * Combines Lottie animation, confetti, and sound
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfettiAnimation from './ConfettiAnimation';
import { useAnimation } from '../../contexts/AnimationContext';

const OrderPlacedAnimation = () => {
  const { on } = useAnimation();
  const [show, setShow] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const unsubscribe = on('order:placed', (data) => {
      setOrderData(data);
      setShow(true);
      setShowConfetti(true);

      // Hide after 5 seconds (increased from 3 seconds for better user experience)
      setTimeout(() => {
        setShow(false);
        setShowConfetti(false);
      }, 5000);
    });

    return unsubscribe;
  }, [on]);

  return (
    <>
      <ConfettiAnimation trigger={showConfetti} type="full" />

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ zIndex: 9999 }}
          >
            {/* Overlay Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20
              }}
              className="relative bg-white dark:bg-[#2d221a] rounded-2xl shadow-2xl p-8 max-w-sm mx-4 z-10"
            >
              {/* Success Icon */}
              <motion.div
                className="w-14 h-14 mx-auto mb-4 flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1
                }}
              >
                <div className="relative">
                  {/* Outer Circle */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00860c] to-[#259a30] flex items-center justify-center shadow-2xl"
                  >
                    {/* Checkmark Icon */}
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                      className="material-symbols-outlined text-white"
                      style={{ fontSize: '2rem', fontWeight: 'bold' }}
                    >
                      check_circle
                    </motion.span>
                  </motion.div>

                  {/* Animated Ring */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 0 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 0.5
                    }}
                    className="absolute inset-0 rounded-full border-4 border-[#7f4f13]"
                  />
                </div>
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <h2 className="text-xl font-bold text-[#7f4f13] mb-2">
                  Order Placed Successfully!
                </h2>
                <p className="text-sm text-[#887263] dark:text-gray-400 mb-4">
                  Your delicious meal is on its way
                </p>
                {orderData?.orderNumber && (
                  <div className="bg-[#f8f7f6] dark:bg-[#211811] rounded-lg p-3">
                    <p className="text-sm text-[#887263] dark:text-gray-400 mb-1">
                      Order Number
                    </p>
                    <p className="text-lg font-bold text-[#181411] dark:text-white">
                      #{orderData.orderNumber}
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OrderPlacedAnimation;
