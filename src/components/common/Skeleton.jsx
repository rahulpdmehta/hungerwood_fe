/**
 * Tiny shimmer primitives — one block, one row, one card. Anything more
 * specific (CategoryTileSkeleton, GroceryCardSkeleton) lives near its
 * page so its layout stays in sync.
 */

const base = 'bg-gray-200 dark:bg-gray-700 animate-pulse rounded';

export const SkeletonBlock = ({ className = '' }) => (
  <div className={`${base} ${className}`} aria-hidden />
);

export const SkeletonText = ({ className = '' }) => (
  <div className={`${base} h-3 ${className}`} aria-hidden />
);

export const SkeletonAvatar = ({ size = 40, className = '' }) => (
  <div
    className={`${base} ${className}`}
    style={{ width: size, height: size, borderRadius: '9999px' }}
    aria-hidden
  />
);

/**
 * Generic "card row" used by Orders / Wallet / Addresses lists. ~72px tall.
 */
export const SkeletonRow = ({ className = '' }) => (
  <div
    className={`flex items-center gap-3 p-3 bg-white dark:bg-[#2d221a] border border-gray-200 dark:border-gray-700 rounded-xl ${className}`}
    aria-hidden
  >
    <SkeletonBlock className="w-12 h-12 shrink-0" />
    <div className="flex-1 space-y-2">
      <SkeletonText className="w-2/3" />
      <SkeletonText className="w-1/3" />
    </div>
  </div>
);

export const SkeletonList = ({ rows = 4 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </div>
);

export default SkeletonBlock;
