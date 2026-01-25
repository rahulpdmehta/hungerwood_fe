/**
 * Referral Page
 * Premium referral program UI for HungerWood
 * Design: Warm, wooden, friendly with referral tracking
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '@components/common/BackButton';
import useWalletStore from '@store/useWalletStore';
import { formatDateTime } from '@utils/dateFormatter';

const Referral = () => {
  const navigate = useNavigate();
  const {
    referralCode: storeReferralCode,
    referralStats,
    loading,
    fetchSummary
  } = useWalletStore();

  const [referralCode, setReferralCode] = useState('');
  const [referralBonus] = useState(50); // Default bonus amount
  const [copied, setCopied] = useState(false);

  // Load referral data on mount
  useEffect(() => {
    loadReferralData();
  }, []);

  // Update local state when store changes
  useEffect(() => {
    console.log('🔄 Store referral code changed:', storeReferralCode);
    if (storeReferralCode) {
      setReferralCode(storeReferralCode);
    }
  }, [storeReferralCode]);

  const loadReferralData = async () => {
    try {
      console.log('🔄 Loading referral data...');
      const result = await fetchSummary();
      console.log('✅ Referral data loaded:', result);
    } catch (error) {
      console.error('❌ Failed to load referral data:', error);
      // Don't crash the app, just show default values
    }
  };

  const { totalReferrals, totalEarnings, referredFriends } = referralStats;

  // Use store value directly if local state is empty
  const displayReferralCode = referralCode || storeReferralCode || '';

  console.log('🎯 Referral Page State:', {
    storeReferralCode,
    localReferralCode: referralCode,
    displayReferralCode,
    loading,
    totalReferrals,
    totalEarnings
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(displayReferralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform) => {
    const message = `Join HungerWood using my referral code ${displayReferralCode} and get ₹${referralBonus} in your wallet! 🎁`;
    const url = `https://hungerwood.com/signup?ref=${displayReferralCode}`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(message + ' ' + url)}`, '_self');
        break;
      default:
        handleCopyCode();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center bg-white dark:bg-[#2d221a] p-4 border-b border-[#f4f2f0] dark:border-[#3d2e24] justify-between shadow-sm">
        <BackButton
          className="text-[#181411] dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          variant="minimal"
        />
        <h2 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
          Refer & Earn
        </h2>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-green-400 to-green-600 dark:from-green-600 dark:to-green-800 rounded-3xl p-6 shadow-xl mb-6 text-center">
          {/* Gift Icon */}
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-5xl">🎁</span>
          </div>

          <h1 className="text-white text-2xl font-bold mb-2">
            Earn ₹{referralBonus} per Referral!
          </h1>
          <p className="text-white/90 text-sm">
            Invite your friends and earn wallet cash for every successful signup
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* Total Earnings */}
          <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24] text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              ₹{totalEarnings}
            </p>
            <p className="text-xs text-[#887263] dark:text-gray-400">
              Total Earned
            </p>
          </div>

          {/* Total Referrals */}
          <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24] text-center">
            <p className="text-2xl font-bold text-[#543918] mb-1">
              {totalReferrals}
            </p>
            <p className="text-xs text-[#887263] dark:text-gray-400">
              Referrals
            </p>
          </div>

          {/* Bonus Amount */}
          <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24] text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              ₹{referralBonus}
            </p>
            <p className="text-xs text-[#887263] dark:text-gray-400">
              Per Friend
            </p>
          </div>
        </div>

        {/* Referral Code Card */}
        <div className="bg-white dark:bg-[#2d221a] rounded-2xl p-5 shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24] mb-6">
          <h3 className="text-[#181411] dark:text-white font-bold text-base mb-3">
            Your Referral Code
          </h3>

          <div className="bg-gradient-to-r from-[#fef9f5] to-white dark:from-[#211811] dark:to-[#2d221a] rounded-xl p-4 border-2 border-dashed border-[#543918]/30 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#887263] dark:text-gray-400 mb-1">
                  Share this code
                </p>
                <p className="text-2xl font-bold text-[#543918] tracking-wider font-mono">
                  {displayReferralCode || 'Loading...'}
                </p>
              </div>
              <button
                onClick={handleCopyCode}
                className="w-12 h-12 bg-[#543918] text-white rounded-xl flex items-center justify-center shadow-md hover:bg-[#543918]/90 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined">
                  {copied ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>
          </div>

          {copied && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm">
                check_circle
              </span>
              <p className="text-sm text-green-700 dark:text-green-300 font-semibold">
                Code copied to clipboard!
              </p>
            </div>
          )}

          {/* Share Buttons */}
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={() => handleShare('whatsapp')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg">
                  chat
                </span>
              </div>
              <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                WhatsApp
              </span>
            </button>

            <button
              onClick={() => handleShare('telegram')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg">
                  send
                </span>
              </div>
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                Telegram
              </span>
            </button>

            <button
              onClick={() => handleShare('sms')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg">
                  sms
                </span>
              </div>
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                SMS
              </span>
            </button>

            <button
              onClick={() => handleShare('more')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg">
                  share
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-400">
                More
              </span>
            </button>
          </div>
        </div>

        {/* Referred Friends List */}
        <div className="bg-white dark:bg-[#2d221a] rounded-2xl p-5 shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24] mb-6">
          <h3 className="text-[#181411] dark:text-white font-bold text-base mb-4">
            Your Referrals ({totalReferrals})
          </h3>

          <div className="space-y-3">
            {referredFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#fef9f5] dark:bg-[#211811] border border-[#f4f2f0] dark:border-[#3d2e24]"
              >
                {/* Left: Avatar + Info */}
                <div className="flex items-center gap-3">
                  {/* <div className="w-10 h-10 bg-gradient-to-br from-[#543918] to-[#b85515] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {friend.name.charAt(0)}
                    </span>
                  </div> */}
                  <div>
                    <h4 className="font-bold text-[#181411] dark:text-white text-sm">
                      {friend.name} <span className="text-xs text-[#887263] dark:text-gray-400">(+91-{friend.phone})</span>
                    </h4>
                    <p className="text-xs text-[#887263] dark:text-gray-400">
                      {formatDateTime(friend.referralRewardedAt)}
                    </p>
                  </div>
                </div>

                {/* Right: Status/Amount */}
                <div className="text-right">
                  {friend.status === 'completed' || friend.referralRewarded ? (
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">
                      +₹{friend.earned || referralBonus}
                    </p>
                  ) : (
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full font-semibold">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white dark:bg-[#2d221a] rounded-2xl p-5 shadow-sm border border-[#f4f2f0] dark:border-[#3d2e24] mb-6">
          <h3 className="text-[#181411] dark:text-white font-bold text-base mb-4">
            How It Works
          </h3>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 dark:text-green-400 font-bold text-lg">1</span>
              </div>
              <div>
                <h4 className="font-bold text-[#181411] dark:text-white text-sm mb-1">
                  Share Your Code
                </h4>
                <p className="text-xs text-[#887263] dark:text-gray-400">
                  Share your unique referral code with friends via WhatsApp, SMS, or any app
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 dark:text-green-400 font-bold text-lg">2</span>
              </div>
              <div>
                <h4 className="font-bold text-[#181411] dark:text-white text-sm mb-1">
                  Friend Signs Up
                </h4>
                <p className="text-xs text-[#887263] dark:text-gray-400">
                  Your friend downloads HungerWood and uses your code during signup
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 dark:text-green-400 font-bold text-lg">3</span>
              </div>
              <div>
                <h4 className="font-bold text-[#181411] dark:text-white text-sm mb-1">
                  Friend Orders
                </h4>
                <p className="text-xs text-[#887263] dark:text-gray-400">
                  When your friend places their first order, you both get rewarded!
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 dark:text-green-400 font-bold text-lg">4</span>
              </div>
              <div>
                <h4 className="font-bold text-[#181411] dark:text-white text-sm mb-1">
                  Earn Rewards
                </h4>
                <p className="text-xs text-[#887263] dark:text-gray-400">
                  Get ₹{referralBonus} instantly in your wallet. Your friend gets ₹{referralBonus} too!
                </p>
              </div>
            </div>
          </div>
        </div>



        {/* Terms & Conditions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg mt-0.5">
              info
            </span>
            <div>
              <p className="text-blue-800 dark:text-blue-300 text-xs font-semibold mb-2">
                Terms & Conditions
              </p>
              <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                <li>• Both you and your friend get ₹{referralBonus} after their first order</li>
                <li>• Minimum order value must be ₹200 or more</li>
                <li>• Referral code must be applied during signup</li>
                <li>• Rewards credited within 24 hours of order completion</li>
                <li>• Unlimited referrals allowed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referral;
