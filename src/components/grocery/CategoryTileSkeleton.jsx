/**
 * Loading placeholder that mirrors CategoryTile's layout so the grid
 * doesn't jump when categories finish loading.
 */
export default function CategoryTileSkeleton() {
  return (
    <div className="rounded-2xl p-1 bg-gray-100 dark:bg-gray-800 shadow-sm border border-white/60">
      <div className="w-full aspect-square rounded-xl bg-gray-200 dark:bg-gray-700 mb-1 animate-pulse" />
      <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-1 animate-pulse" />
    </div>
  );
}
