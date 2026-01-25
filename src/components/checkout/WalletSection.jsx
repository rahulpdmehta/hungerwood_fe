/**
 * WalletSection Component
 * Premium wallet UI for HungerWood Checkout
 * Design: Warm, wooden, friendly with smooth interactions
 */

import { useState } from 'react';
import { BILLING } from '@utils/constants';

const WalletSection = ({
    walletBalance = 120,
    orderTotal = 346,
    maxWalletUsage = BILLING.MAX_WALLET_USAGE_PERCENT, // percentage
    onWalletChange = () => { },
    isLoading = false
}) => {
    const [isWalletEnabled, setIsWalletEnabled] = useState(false);
    const [walletAmount, setWalletAmount] = useState(0);

    // Calculate maximum usable wallet amount
    const maxUsableAmount = Math.min(
        walletBalance,
        Math.floor((orderTotal * maxWalletUsage) / 100)
    );

    // Handle toggle
    const handleToggle = () => {
        const newState = !isWalletEnabled;
        setIsWalletEnabled(newState);

        if (newState && walletAmount === 0) {
            const defaultAmount = Math.min(maxUsableAmount, 50);
            setWalletAmount(defaultAmount);
            onWalletChange(defaultAmount);
        } else if (!newState) {
            onWalletChange(0);
        }
    };

    // Handle amount increment
    const handleIncrement = () => {
        if (walletAmount < maxUsableAmount) {
            const newAmount = Math.min(walletAmount + 10, maxUsableAmount);
            setWalletAmount(newAmount);
            onWalletChange(newAmount);
        }
    };

    // Handle amount decrement
    const handleDecrement = () => {
        if (walletAmount > 0) {
            const newAmount = Math.max(walletAmount - 10, 0);
            setWalletAmount(newAmount);
            onWalletChange(newAmount);
        }
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#2d221a] rounded-2xl p-5 shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24] mb-6 animate-pulse">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        <div className="space-y-2">
                            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                    <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
            </div>
        );
    }

    // Zero Balance State
    if (walletBalance === 0) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#2d221a] dark:to-[#3d2e24] rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-[#3d2e24] mb-6 opacity-60">
                <div className="flex items-center gap-4">
                    {/* Wallet Icon - Disabled */}
                    <div className="w-14 h-14 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-gray-400 text-2xl">account_balance_wallet</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <h3 className="text-[#887263] dark:text-gray-400 font-bold text-base mb-1">
                            HungerWood Wallet
                        </h3>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            Your wallet is empty
                        </p>
                    </div>

                    {/* Add Money Button */}
                    <button className="px-4 py-2 bg-[#543918]/20 text-[#543918] rounded-lg text-sm font-semibold hover:bg-[#543918]/30 transition-colors">
                        Add Money
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6">
            {/* Main Wallet Card */}
            <div
                className={`bg-gradient-to-br from-white to-[#fef9f5] dark:from-[#2d221a] dark:to-[#3d2e24] rounded-2xl p-5 shadow-md border-2 transition-all duration-300 ${isWalletEnabled
                    ? 'border-green-400 dark:border-green-600 shadow-green-100 dark:shadow-green-900/20'
                    : 'border-[#f4f2f0] dark:border-[#3d2e24]'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {/* Wallet Icon */}
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${isWalletEnabled
                            ? 'bg-gradient-to-br from-green-400 to-green-500 shadow-lg shadow-green-200 dark:shadow-green-900/40'
                            : 'bg-gray-200 dark:bg-gray-700'
                            }`}>
                            <span className={`material-symbols-outlined text-2xl transition-colors ${isWalletEnabled ? 'text-white' : 'text-gray-400'
                                }`}>
                                account_balance_wallet
                            </span>
                        </div>

                        {/* Title & Balance */}
                        <div>
                            <h3 className="text-[#181411] dark:text-white font-bold text-base leading-tight mb-1">
                                Use HungerWood Wallet
                            </h3>
                            <p className={`text-sm font-semibold transition-colors ${isWalletEnabled
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-[#887263] dark:text-gray-400'
                                }`}>
                                Available: ₹{walletBalance}
                            </p>
                        </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                        onClick={handleToggle}
                        className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 ${isWalletEnabled
                            ? 'bg-green-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        aria-label="Toggle wallet"
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isWalletEnabled ? 'translate-x-7' : 'translate-x-0'
                                }`}
                        />
                    </button>
                </div>

                {/* Expandable Amount Selector */}
                <div
                    className={`overflow-hidden transition-all duration-300 ${isWalletEnabled ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    {isWalletEnabled && (
                        <div className="pt-4 border-t border-[#f4f2f0] dark:border-[#3d2e24]">
                            {/* Amount Selector */}
                            <div className="flex items-center justify-center gap-4 mb-4">
                                {/* Decrement Button */}
                                <button
                                    onClick={handleDecrement}
                                    disabled={walletAmount <= 0}
                                    className="w-12 h-12 rounded-xl bg-[#543918]/10 text-[#543918] font-bold text-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#543918]/20 active:scale-95 transition-all shadow-sm"
                                    aria-label="Decrease amount"
                                >
                                    <span className="material-symbols-outlined">remove</span>
                                </button>

                                {/* Amount Display */}
                                <div className="flex-1 max-w-[140px]">
                                    <div className="bg-white dark:bg-[#211811] rounded-xl p-2 text-center border-2 border-green-400 dark:border-green-600 shadow-inner">
                                        <div className="text-md font-bold text-[#543918] tracking-tight">
                                            ₹{walletAmount}
                                        </div>
                                    </div>
                                </div>

                                {/* Increment Button */}
                                <button
                                    onClick={handleIncrement}
                                    disabled={walletAmount >= maxUsableAmount}
                                    className="w-12 h-12 rounded-xl bg-[#543918]/10 text-[#543918] font-bold text-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#543918]/20 active:scale-95 transition-all shadow-sm"
                                    aria-label="Increase amount"
                                >
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                            </div>

                            {/* Helper Text */}
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 flex items-start gap-2">
                                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm mt-0.5">
                                    info
                                </span>
                                <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed flex-1">
                                    You can use up to <span className="font-bold">₹{maxUsableAmount}</span> from your wallet for this order
                                    ({maxWalletUsage}% of order total)
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Trust Indicator */}
                {isWalletEnabled && (
                    <div className="mt-4 pt-4 border-t border-[#f4f2f0] dark:border-[#3d2e24]">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm">
                                verified_user
                            </span>
                            <p className="text-xs text-[#887263] dark:text-gray-400">
                                Wallet amount is securely applied • Unused balance remains safe
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Price Breakdown - Only show when wallet is enabled */}
            {isWalletEnabled && walletAmount > 0 && (
                <div className="mt-4 bg-gradient-to-br from-[#fef9f5] to-white dark:from-[#211811] dark:to-[#2d221a] rounded-2xl p-5 shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24]">
                    <h4 className="text-[#181411] dark:text-white font-bold text-sm mb-4 uppercase tracking-wide">
                        Payment Summary
                    </h4>

                    <div className="space-y-2.5 mb-4">
                        {/* Items Total */}
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-[#887263] dark:text-gray-400">Items Total</span>
                            <span className="text-[#181411] dark:text-white font-medium">₹320</span>
                        </div>

                        {/* Tax */}
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-[#887263] dark:text-gray-400">Tax & Charges</span>
                            <span className="text-[#181411] dark:text-white font-medium">₹26</span>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-dashed border-[#f4f2f0] dark:border-[#3d2e24] pt-2.5">
                            <div className="flex items-center justify-between text-sm font-semibold">
                                <span className="text-[#181411] dark:text-white">Subtotal</span>
                                <span className="text-[#181411] dark:text-white">₹{orderTotal}</span>
                            </div>
                        </div>

                        {/* Wallet Deduction - Highlighted */}
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 -mx-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">
                                        account_balance_wallet
                                    </span>
                                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                                        Wallet Used
                                    </span>
                                </div>
                                <span className="text-base font-bold text-green-600 dark:text-green-400">
                                    -₹{walletAmount}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Final Payable Amount */}
                    <div className="border-t-2 border-[#543918]/20 pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-[#887263] dark:text-gray-400 uppercase tracking-wider mb-1">
                                    Amount Payable
                                </p>
                                <p className="text-2xl font-bold text-[#543918] tracking-tight">
                                    ₹{orderTotal - walletAmount}
                                </p>
                            </div>

                            {/* Savings Badge */}
                            <div className="bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-lg">
                                <p className="text-xs text-green-700 dark:text-green-300 font-semibold">
                                    You saved
                                </p>
                                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                    ₹{walletAmount}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Full Wallet Coverage Badge */}
            {isWalletEnabled && walletAmount >= orderTotal && (
                <div className="mt-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-5 shadow-lg shadow-green-200 dark:shadow-green-900/40">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-2xl">
                                check_circle
                            </span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-bold text-base mb-1">
                                Order Fully Paid!
                            </h4>
                            <p className="text-white/90 text-sm">
                                Your order is covered entirely by your wallet balance
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletSection;
