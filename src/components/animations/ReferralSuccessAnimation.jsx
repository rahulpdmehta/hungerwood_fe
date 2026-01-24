/**
 * ReferralSuccessAnimation - Gift opening animation for referral rewards
 * Shows gift box opening with confetti burst
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfettiAnimation from './ConfettiAnimation';
import { useAnimation } from '../../contexts/AnimationContext';

const ReferralSuccessAnimation = () => {
  const { on } = useAnimation();
  const [show, setShow] = useState(false);
  const [reward, setReward] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [giftOpened, setGiftOpened] = useState(false);

  useEffect(() => {
    const unsubscribe = on('referral:success', (data) => {
      setReward(data.reward);
      setShow(true);
      setGiftOpened(false);

      // Open gift after 0.5s
      setTimeout(() => {
        setGiftOpened(true);
        setShowConfetti(true);
      }, 500);

      // Hide after 4 seconds
      setTimeout(() => {
        setShow(false);
        setShowConfetti(false);
        setGiftOpened(false);
      }, 4000);
    });

    return unsubscribe;
  }, [on]);

  return (
    <>
      <ConfettiAnimation trigger={showConfetti} type="micro" />
      
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed inset-0 z-[9995] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: -50 }}
              className="bg-white dark:bg-[#2d221a] rounded-2xl shadow-2xl p-8 max-w-sm mx-4 pointer-events-auto"
            >
              {/* Gift Box Animation */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                {/* Gift Box Lid */}
                <motion.div
                  animate={giftOpened ? {
                    y: -60,
                    rotateX: -45,
                    opacity: 0.5,
                  } : {}}
                  transition={{ duration: 0.6, type: 'spring' }}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-gradient-to-br from-[#cf6317] to-[#f8b84e] rounded-t-lg border-4 border-[#cf6317]"
                  style={{ transformOrigin: 'bottom center' }}
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-1 bg-[#f8b84e]" />
                </motion.div>

                {/* Gift Box Base */}
                <motion.div
                  animate={giftOpened ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-[#cf6317] to-[#f8b84e] rounded-lg border-4 border-[#cf6317] flex items-center justify-center"
                >
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#f8b84e]" />
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-1 bg-[#f8b84e]" />
                  
                  {/* Reward Amount (appears when gift opens) */}
                  <AnimatePresence>
                    {giftOpened && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: [0, 1.5, 1],
                          opacity: 1,
                          y: [-20, 0],
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ 
                          duration: 0.6,
                          type: 'spring',
                          stiffness: 300,
                        }}
                        className="text-2xl font-bold text-white"
                      >
                        ₹{reward?.amount || 0}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Success Message */}
              <AnimatePresence>
                {giftOpened && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <h2 className="text-2xl font-bold text-[#cf6317] mb-2">
                      Referral Reward! 🎉
                    </h2>
                    <p className="text-[#887263] dark:text-gray-400 mb-4">
                      {reward?.message || 'Your friend used your referral code!'}
                    </p>
                    <div className="bg-[#f8f7f6] dark:bg-[#211811] rounded-lg p-3">
                      <p className="text-sm text-[#887263] dark:text-gray-400 mb-1">
                        Credited to Wallet
                      </p>
                      <p className="text-xl font-bold text-[#cf6317]">
                        +₹{reward?.amount || 0}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReferralSuccessAnimation;
