/**
 * Wallet UI Showcase
 * Demonstrates all states and variations of the WalletSection component
 */

import { useState } from 'react';
import WalletSection from '../components/checkout/WalletSection';

const WalletUIShowcase = () => {
  const [state, setState] = useState('normal');

  const states = [
    { id: 'normal', label: 'Normal State (₹120 balance)' },
    { id: 'loading', label: 'Loading State' },
    { id: 'zero', label: 'Zero Balance' },
    { id: 'high', label: 'High Balance (₹500)' },
    { id: 'low', label: 'Low Balance (₹20)' }
  ];

  const getPropsForState = () => {
    switch (state) {
      case 'loading':
        return { isLoading: true };
      case 'zero':
        return { walletBalance: 0, orderTotal: 346 };
      case 'high':
        return { walletBalance: 500, orderTotal: 346 };
      case 'low':
        return { walletBalance: 20, orderTotal: 346 };
      default:
        return { walletBalance: 120, orderTotal: 346 };
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-[#2d221a] border-b border-[#f4f2f0] dark:border-[#3d2e24] sticky top-0 z-50 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#7f4f13] rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white">palette</span>
            </div>
            <div>
              <h1 className="text-[#181411] dark:text-white font-bold text-lg">
                Wallet UI Showcase
              </h1>
              <p className="text-xs text-[#887263] dark:text-gray-400">
                Design System Preview
              </p>
            </div>
          </div>

          {/* State Selector */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {states.map((s) => (
              <button
                key={s.id}
                onClick={() => setState(s.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  state === s.id
                    ? 'bg-[#7f4f13] text-white shadow-lg'
                    : 'bg-white dark:bg-[#3d2e24] text-[#887263] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#4d3e34]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Design Info Card */}
        <div className="bg-white dark:bg-[#2d221a] rounded-2xl p-5 shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24] mb-6">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#7f4f13] text-2xl">
              design_services
            </span>
            <div>
              <h3 className="text-[#181411] dark:text-white font-bold mb-2">
                Design Principles
              </h3>
              <ul className="space-y-1 text-sm text-[#887263] dark:text-gray-400">
                <li>• Warm wood-brown palette (#7f4f13)</li>
                <li>• Smooth transitions & animations</li>
                <li>• Touch-friendly 44px+ tap targets</li>
                <li>• Clear visual hierarchy</li>
                <li>• Accessible color contrast</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Current State Label */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
              Current State: {states.find(s => s.id === state)?.label}
            </p>
          </div>
        </div>

        {/* Wallet Component */}
        <WalletSection 
          {...getPropsForState()} 
          onWalletChange={(amount) => console.log('Wallet amount:', amount)}
        />

        {/* Feature Highlights */}
        <div className="mt-6 space-y-3">
          <h3 className="text-[#181411] dark:text-white font-bold text-sm uppercase tracking-wide">
            Interactive Features
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24]">
              <span className="material-symbols-outlined text-green-500 text-2xl mb-2">
                toggle_on
              </span>
              <p className="text-xs font-semibold text-[#181411] dark:text-white mb-1">
                Smart Toggle
              </p>
              <p className="text-xs text-[#887263] dark:text-gray-400">
                Auto-enables when balance available
              </p>
            </div>

            <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24]">
              <span className="material-symbols-outlined text-[#7f4f13] text-2xl mb-2">
                payments
              </span>
              <p className="text-xs font-semibold text-[#181411] dark:text-white mb-1">
                Amount Control
              </p>
              <p className="text-xs text-[#887263] dark:text-gray-400">
                Precise +/- buttons (₹10 steps)
              </p>
            </div>

            <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24]">
              <span className="material-symbols-outlined text-blue-500 text-2xl mb-2">
                animation
              </span>
              <p className="text-xs font-semibold text-[#181411] dark:text-white mb-1">
                Smooth Animations
              </p>
              <p className="text-xs text-[#887263] dark:text-gray-400">
                300ms transitions
              </p>
            </div>

            <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24]">
              <span className="material-symbols-outlined text-purple-500 text-2xl mb-2">
                verified_user
              </span>
              <p className="text-xs font-semibold text-[#181411] dark:text-white mb-1">
                Trust Signals
              </p>
              <p className="text-xs text-[#887263] dark:text-gray-400">
                Security messaging
              </p>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="mt-6 bg-white dark:bg-[#2d221a] rounded-2xl p-5 shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24]">
          <h3 className="text-[#181411] dark:text-white font-bold text-sm mb-4 uppercase tracking-wide">
            Color Palette
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="w-full h-12 bg-[#7f4f13] rounded-lg mb-2 shadow-inner"></div>
              <p className="text-xs font-mono text-[#887263] dark:text-gray-400">#7f4f13</p>
              <p className="text-xs text-[#887263] dark:text-gray-400">Wood Brown</p>
            </div>
            <div>
              <div className="w-full h-12 bg-green-500 rounded-lg mb-2 shadow-inner"></div>
              <p className="text-xs font-mono text-[#887263] dark:text-gray-400">#10b981</p>
              <p className="text-xs text-[#887263] dark:text-gray-400">Wallet Green</p>
            </div>
            <div>
              <div className="w-full h-12 bg-[#f8f7f6] border border-gray-200 rounded-lg mb-2"></div>
              <p className="text-xs font-mono text-[#887263] dark:text-gray-400">#f8f7f6</p>
              <p className="text-xs text-[#887263] dark:text-gray-400">Cream BG</p>
            </div>
          </div>
        </div>

        {/* Accessibility Notes */}
        <div className="mt-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-5 border border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-2xl">
              accessibility
            </span>
            <div>
              <h3 className="text-purple-900 dark:text-purple-200 font-bold mb-2">
                Accessibility Features
              </h3>
              <ul className="space-y-1 text-sm text-purple-700 dark:text-purple-300">
                <li>✓ 16px minimum text size</li>
                <li>✓ WCAG AA contrast ratios</li>
                <li>✓ 44px touch targets</li>
                <li>✓ Screen reader labels</li>
                <li>✓ Keyboard navigation ready</li>
                <li>✓ Color + icon indicators</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletUIShowcase;
