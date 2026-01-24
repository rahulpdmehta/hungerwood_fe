/**
 * Wallet CreditAnimation - Coin animation flowing into wallet
 * Shows animated coins and balance increment
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '../../contexts/AnimationContext';

const WalletCreditAnimation = () => {
  const { on } = useAnimation();
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState(0);
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const unsubscribe = on('wallet:credit', (data) => {
      setAmount(data.amount || 0);
      setShow(true);

      // Create flying coins
      const numCoins = Math.min(Math.floor(data.amount / 10), 10); // Max 10 coins
      const newCoins = Array.from({ length: numCoins }, (_, i) => ({
        id: Date.now() + i,
        delay: i * 0.1,
      }));
      setCoins(newCoins);

      // Hide after animation completes
      setTimeout(() => {
        setShow(false);
        setCoins([]);
      }, 2500);
    });

    return unsubscribe;
  }, [on]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none"
        >
          {/* Flying Coins */}
          {coins.map((coin) => (
            <motion.div
              key={coin.id}
              initial={{
                x: 0,
                y: window.innerHeight / 2,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50, window.innerWidth - 100],
                y: [
                  window.innerHeight / 2,
                  window.innerHeight / 2 - 200,
                  50,
                ],
                scale: [0, 1.5, 1, 0.5],
                rotate: [0, 360, 720],
              }}
              transition={{
                duration: 1.5,
                delay: coin.delay,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
              className="absolute w-12 h-12"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#f8b84e] to-[#cf6317] shadow-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">₹</span>
              </div>
            </motion.div>
          ))}

          {/* Amount Display */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="bg-white dark:bg-[#2d221a] rounded-xl shadow-2xl p-6 pointer-events-auto"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <span className="material-symbols-outlined text-5xl text-[#cf6317] mb-2">
                account_balance_wallet
              </span>
              <p className="text-sm text-[#887263] dark:text-gray-400 mb-1">
                Wallet Credited
              </p>
              <motion.p
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 1,
                  type: 'spring',
                  stiffness: 300,
                  damping: 10 
                }}
                className="text-3xl font-bold text-[#cf6317]"
              >
                +₹{amount}
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WalletCreditAnimation;
