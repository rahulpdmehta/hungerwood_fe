/**
 * Loading placeholder that mirrors GroceryProductCard's layout so the page
 * doesn't visually jump when real data arrives.
 */
export default function GroceryCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
      <div className="w-full aspect-square bg-gray-200 dark:bg-gray-800 animate-pulse" />
      <div className="p-2 flex flex-col flex-1 gap-1.5">
        <div className="h-2 w-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-14 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse mt-0.5" />
        <div className="flex items-center justify-between pt-1 mt-auto">
          <div className="h-3 w-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-6 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
