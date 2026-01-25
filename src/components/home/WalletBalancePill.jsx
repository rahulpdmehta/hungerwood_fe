import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useWalletBalance } from '@hooks/useWalletQueries';

const WalletBalancePill = () => {
  const navigate = useNavigate();
  const { data: walletBalance = 0, isLoading: walletLoading } = useWalletBalance();
  const [showWalletPill, setShowWalletPill] = useState(true);

  // Ensure walletBalance is a number
  const balance = typeof walletBalance === 'number' ? walletBalance : 0;

  // Auto-hide wallet pill after 10 seconds
  useEffect(() => {
    if (balance > 0 && showWalletPill) {
      const timer = setTimeout(() => {
        setShowWalletPill(false);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [balance, showWalletPill]);

  if (walletLoading || balance === 0 || !showWalletPill) {
    return null;
  }

  return (
    <div className="px-4 mt-2 animate-slideDown">
      <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-200 dark:border-green-700 rounded-xl p-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 flex-1">
          <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">
            account_balance_wallet
          </span>
          <p className="text-sm font-semibold text-green-700 dark:text-green-300">
            Wallet balance: ₹{balance}
          </p>
          <button
            onClick={() => navigate('/checkout')}
            className="ml-2 text-xs font-bold text-green-600 dark:text-green-400 underline"
          >
            Use now →
          </button>
        </div>
        <button
          onClick={() => setShowWalletPill(false)}
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-green-200 dark:hover:bg-green-700/30 transition-colors"
          aria-label="Dismiss"
        >
          <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm">
            close
          </span>
        </button>
      </div>
    </div>
  );
};

export default WalletBalancePill;
