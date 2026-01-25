/**
 * Wallet Page
 * Premium wallet UI for HungerWood
 * Design: Warm, wooden, friendly with transaction history
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '@components/common/BackButton';
import { useWalletBalance, useWalletTransactions } from '@hooks/useWalletQueries';
import { formatDateTime } from '@utils/dateFormatter';

const Wallet = () => {
  const navigate = useNavigate();

  // React Query hooks for wallet data
  const { data: balance = 0, isLoading: balanceLoading } = useWalletBalance();
  const { data: transactions = [], isLoading: transactionsLoading } = useWalletTransactions();

  const [activeFilter, setActiveFilter] = useState('all');

  const isLoading = balanceLoading || transactionsLoading;

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'credits') return txn.type?.toLowerCase() === 'credit';
      if (activeFilter === 'debits') return txn.type?.toLowerCase() === 'debit';
      return true;
    });
  }, [transactions, activeFilter]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center bg-white dark:bg-[#2d221a] p-4 border-b-2 border-[#f4f2f0] dark:border-[#3d2e24] justify-between shadow-md">
        <BackButton
          className="text-[#181411] dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          variant="minimal"
        />
        <h2 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
          Wallet
        </h2>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-green-400 to-green-600 dark:from-green-600 dark:to-green-800 rounded-3xl p-6 shadow-2xl border-2 border-green-300 dark:border-green-700 mb-6">
          <div className="flex flex-col items-center text-center">
            {/* Wallet Icon */}
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <span className="material-symbols-outlined text-white text-4xl">
                account_balance_wallet
              </span>
            </div>

            {/* Label */}
            <p className="text-white/90 text-sm font-medium mb-2">
              Available Balance
            </p>

            {/* Balance Amount */}
            <h1 className="text-white text-5xl font-bold tracking-tight mb-2">
              {isLoading ? '...' : `₹${balance}`}
            </h1>

            {/* Subtext */}
            <p className="text-white/80 text-xs">
              Usable on food orders
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {/* Refer & Earn Button */}
          <button
            onClick={() => navigate('/referral')}
            className="bg-gradient-to-br from-[#543918] to-[#b85515] text-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95 flex flex-col items-center gap-2"
          >
            <span className="material-symbols-outlined text-2xl">
              card_giftcard
            </span>
            <span className="text-sm font-bold">Refer & Earn</span>
          </button>

          {/* Wallet Info Button */}
          <button
            onClick={() => navigate('/wallet/info')}
            className="bg-white dark:bg-[#2d221a] border-2 border-[#f4f2f0] dark:border-[#3d2e24] text-[#181411] dark:text-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95 flex flex-col items-center gap-2"
          >
            <span className="material-symbols-outlined text-2xl text-[#543918]">
              info
            </span>
            <span className="text-sm font-bold">Wallet Info</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeFilter === 'all'
              ? 'bg-[#543918] text-white shadow-md'
              : 'bg-white dark:bg-[#2d221a] text-[#887263] dark:text-gray-400 border border-[#f4f2f0] dark:border-[#3d2e24]'
              }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('credits')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeFilter === 'credits'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-white dark:bg-[#2d221a] text-[#887263] dark:text-gray-400 border border-[#f4f2f0] dark:border-[#3d2e24]'
              }`}
          >
            Credits
          </button>
          <button
            onClick={() => setActiveFilter('debits')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeFilter === 'debits'
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white dark:bg-[#2d221a] text-[#887263] dark:text-gray-400 border border-[#f4f2f0] dark:border-[#3d2e24]'
              }`}
          >
            Debits
          </button>
        </div>

        {/* Transaction History Section */}
        <div className="mb-6">
          <h3 className="text-[#181411] dark:text-white text-base font-bold mb-4">
            Transaction History
          </h3>

          {/* Transaction List */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#2d221a] rounded-xl p-4 shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24] animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="space-y-3">
              {filteredTransactions.map((txn) => (
                <div
                  key={txn.id}
                  className="bg-white dark:bg-[#2d221a] rounded-xl p-4 shadow-md border-2 border-[#f4f2f0] dark:border-[#3d2e24] flex items-center gap-4 hover:shadow-lg transition-shadow"
                >
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${txn.type.toLowerCase() === 'credit'
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : 'bg-red-50 dark:bg-red-900/20'
                      }`}
                  >
                    <span
                      className={`material-symbols-outlined text-2xl ${txn.type.toLowerCase() === 'credit'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                        }`}
                    >
                      {txn.type.toLowerCase() === 'credit' ? 'add_circle' : 'remove_circle'}
                    </span>
                  </div>

                  {/* Center: Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#181411] dark:text-white font-bold text-sm truncate">
                      {txn.title}
                    </h4>
                    <p className="text-[#887263] dark:text-gray-400 text-xs mt-0.5 truncate">
                      {txn.description}
                    </p>
                    <p className="text-[#887263] dark:text-gray-400 text-xs mt-1">
                      {formatDateTime(txn.createdAt)}
                    </p>
                  </div>

                  {/* Right: Amount */}
                  <div className="text-right flex-shrink-0">
                    <p
                      className={`text-lg font-bold ${txn.type.toLowerCase() === 'credit'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                        }`}
                    >
                      {txn.type.toLowerCase() === 'credit' ? '+' : '-'}₹{txn.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white dark:bg-[#2d221a] rounded-2xl p-12 text-center shadow-md border-2 border-[#f4f2f0] dark:border-[#3d2e24]">
              {/* Illustration Placeholder */}
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-400 text-5xl">
                  receipt_long
                </span>
              </div>

              <h4 className="text-[#181411] dark:text-white font-bold text-lg mb-2">
                No wallet activity yet
              </h4>
              <p className="text-[#887263] dark:text-gray-400 text-sm mb-6">
                Your transactions will appear here
              </p>

              <button
                onClick={() => navigate('/menu')}
                className="bg-[#543918] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-[#543918]/90 transition-colors"
              >
                Place your first order
              </button>
            </div>
          )}
        </div>

        {/* Trust Message */}
        <div className="mt-8 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl p-4 flex items-start gap-3 shadow-md">
          <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg mt-0.5">
            verified_user
          </span>
          <div>
            <p className="text-green-800 dark:text-green-300 text-sm font-semibold mb-1">
              Your wallet is secure
            </p>
            <p className="text-green-600 dark:text-green-400 text-xs">
              Wallet balance is safe & usable anytime on food orders
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
