const RestaurantInfoCard = () => {
  return (
    <div className="px-4 mt-6">
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-lg border-2 border-gray-200 dark:border-zinc-700">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-extrabold text-[#181411] dark:text-white">HungerWood</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Multi-cuisine • Premium Dining</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-lg text-sm font-bold">
              <span>4.5</span>
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                star
              </span>
            </div>
            <span className="text-[10px] text-gray-400 mt-1 font-medium">1.2k+ reviews</span>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50 dark:border-zinc-700">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-green-500 text-lg">schedule</span>
            <span className="text-xs font-bold text-green-600">Open Now</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[#7f4f13] text-lg">payments</span>
            <span className="text-xs font-semibold">₹400 for two</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-gray-400 text-lg">distance</span>
            <span className="text-xs font-semibold">2.4 km</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantInfoCard;
