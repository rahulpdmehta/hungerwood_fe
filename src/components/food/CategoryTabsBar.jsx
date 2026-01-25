const CategoryTabsBar = ({ categories, activeCategory, onCategoryChange }) => {
    return (
        <div className="bg-white dark:bg-[#211811] border-b-2 border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto scrollbar-hide px-4 gap-6">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={`flex flex-col items-center justify-center border-b-2 ${activeCategory === category
                            ? 'border-[#7f4f13] text-[#7f4f13]'
                            : 'border-transparent text-gray-500 dark:text-gray-400'
                            } pb-3 pt-3 shrink-0 transition-colors`}
                    >
                        <p className="text-sm font-bold leading-normal whitespace-nowrap">{category}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryTabsBar;
