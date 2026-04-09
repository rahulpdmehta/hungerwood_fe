const Loader = ({ size = 'md', fullScreen = false, text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`}
      ></div>
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {loaderContent}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{loaderContent}</div>;
};

export const SkeletonLoader = ({ count = 1, height = 'h-4', className = '' }) => {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`bg-gray-200 rounded ${height}`}></div>
      ))}
    </div>
  );
};

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
          <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
          <div className="space-y-3">
            <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            <div className="bg-gray-200 h-4 rounded w-1/2"></div>
            <div className="bg-gray-200 h-4 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton loader for menu item cards
 */
export const MenuSkeleton = ({ count = 6 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 overflow-hidden animate-pulse"
        >
          <div className="flex gap-4 p-4">
            {/* Image */}
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="flex items-center justify-between mt-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton loader for category tabs
 */
export const CategorySkeleton = () => {
  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide animate-pulse">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-24 flex-shrink-0"
        ></div>
      ))}
    </div>
  );
};

/**
 * Skeleton loader for item details page
 */
export const ItemDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] animate-pulse">
      {/* Image skeleton */}
      <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700"></div>

      {/* Content skeleton */}
      <div className="px-4 -mt-6 bg-[#f8f7f6] dark:bg-[#211811] rounded-t-xl relative z-20 pb-32">
        <div className="pt-6 space-y-4">
          {/* Title and price */}
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-4"></div>

          {/* Spice level */}
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton loader for banner carousel
 */
export const BannerSkeleton = () => {
  return (
    <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 gap-4 animate-pulse">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="snap-center shrink-0 w-[85%] aspect-[2/1] rounded-xl bg-gray-200 dark:bg-gray-700"
        ></div>
      ))}
    </div>
  );
};

/**
 * Skeleton loader for order cards
 */
export const OrderSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-1 mt-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="px-4 py-2">
          <div className="bg-white dark:bg-[#2d2118] rounded-xl border border-[#e5e0dc] dark:border-[#3d2e24] p-4 animate-pulse">
            <div className="flex justify-between items-center mb-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
            <div className="space-y-2 mb-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;
