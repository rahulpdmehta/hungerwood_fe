/**
 * RestaurantStatusBanner Component
 * Displays a banner when the restaurant is closed
 */

const RestaurantStatusBanner = ({ closingMessage }) => {
  const defaultMessage = 'Restaurant is currently closed. Please try again later.';
  const message = closingMessage || defaultMessage;

  return (
    <div className="w-full bg-red-600 dark:bg-red-700 text-white px-4 py-3 shadow-md">
      <div className="flex items-center justify-center gap-2 max-w-7xl mx-auto">
        <span className="material-symbols-outlined text-xl">info</span>
        <p className="text-sm font-medium text-center">{message}</p>
      </div>
    </div>
  );
};

export default RestaurantStatusBanner;
