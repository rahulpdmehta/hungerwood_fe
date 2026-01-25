import { useNavigate } from 'react-router-dom';

const ReferEarnBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 mt-4">
      <button
        onClick={() => navigate('/referral')}
        className="w-full bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-700 rounded-xl p-3 flex items-center justify-between shadow-md hover:shadow-lg transition-shadow group"
      >
        {/* Left: Icon & Text */}
        <div className="flex items-center gap-3 flex-1">
          {/* Gift Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <span className="text-2xl">🎁</span>
          </div>

          {/* Text */}
          <div className="text-left">
            <h3 className="text-base font-bold text-green-800 dark:text-green-300 leading-tight">
              Refer & Earn ₹50
            </h3>
            <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
              Invite friends & earn wallet cash
            </p>
          </div>
        </div>

        {/* Right: CTA Button */}
        <div className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm transition-colors group-hover:shadow-md">
          <span className="text-sm font-bold">Invite</span>
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </div>
      </button>
    </div>
  );
};

export default ReferEarnBanner;
