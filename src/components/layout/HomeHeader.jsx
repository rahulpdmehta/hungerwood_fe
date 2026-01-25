import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logo from '@assets/images/logo_1.jpeg';
import { useWalletBalance } from '@hooks/useWalletQueries';

const HomeHeader = () => {
  const navigate = useNavigate();
  const { data: walletBalance = 0, isLoading: walletLoading } = useWalletBalance();
  const [showWalletTooltip, setShowWalletTooltip] = useState(false);

  // Ensure walletBalance is a number
  const balance = typeof walletBalance === 'number' ? walletBalance : 0;

  return (
    <header className="bg-[#f8f7f6]/80 dark:bg-[#211811]/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo & Restaurant Name */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="HungerWood Logo"
            className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-[#7f4f13]/30 dark:border-[#7f4f13]/40"
          />
          <div className="text-left">
            <h1 className="text-md font-bold text-[#181411] dark:text-white tracking-tight">
              HungerWood
            </h1>
            <p className="text-[10px] text-[#7f4f13] font-bold uppercase tracking-widest">
              Gaya, Bihar
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Wallet Icon */}
          <button
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-md border border-gray-200 dark:border-zinc-700 hover:shadow-lg transition-shadow"
            aria-label="Wallet"
            onClick={() => navigate('/wallet')}
            onMouseEnter={() => setShowWalletTooltip(true)}
            onMouseLeave={() => setShowWalletTooltip(false)}
          >
            <span className={`material-symbols-outlined ${balance > 0 ? 'text-green-600' : 'text-gray-400'}`}>
              account_balance_wallet
            </span>

            {/* Balance Badge */}
            {!walletLoading && balance > 0 && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                ₹{balance}
              </div>
            )}

            {/* Tooltip */}
            {showWalletTooltip && (
              <div className="absolute top-12 right-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10">
                Use wallet balance & save more
                <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 transform rotate-45"></div>
              </div>
            )}
          </button>

          {/* Search Icon */}
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-md border border-gray-200 dark:border-zinc-700 hover:shadow-lg transition-shadow"
            aria-label="Search"
            onClick={() => navigate('/menu?search=true')}
          >
            <span className="material-symbols-outlined text-gray-700 dark:text-white">search</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
