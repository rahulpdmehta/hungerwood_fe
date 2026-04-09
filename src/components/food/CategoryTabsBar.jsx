// Category icon mapping
const getCategoryIcon = (categoryName) => {
    const iconMap = {
        'All': 'restaurant_menu',
        'Tandoor': 'local_fire_department',
        'Chinese': 'ramen_dining',
        'Main Course': 'dinner_dining',
        'Beverages': 'local_drink',
        'Desserts': 'cake',
        'Appetizers': 'tapas',
        'Biryani': 'rice_bowl',
        'Breads': 'bakery_dining',
        'Salads': 'eco',
        'Soups': 'soup_kitchen',
        'Snacks': 'fastfood',
        'Combo': 'lunch_dining',
    };
    
    // Normalize category name for lookup
    const normalizedName = categoryName?.trim() || '';
    return iconMap[normalizedName] || iconMap[normalizedName.toLowerCase()] || 'restaurant';
};

const CategoryTabsBar = ({ categories, activeCategory, onCategoryChange }) => {
    return (
        <div className="bg-white dark:bg-[#211811] border-b-2 border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto scrollbar-hide px-4 gap-6">
                {categories.map((category) => {
                    // Handle both string and object categories
                    const categoryName = typeof category === 'string' ? category : (category.name || category.title || String(category));
                    const categoryIcon = typeof category === 'object' && category.icon 
                        ? category.icon 
                        : getCategoryIcon(categoryName);
                    const isActive = activeCategory === categoryName || 
                        (typeof category === 'string' && activeCategory === category);
                    
                    return (
                    <button
                            key={categoryName}
                            onClick={() => onCategoryChange(categoryName)}
                            className={`flex flex-col items-center justify-center gap-1 border-b-2 ${isActive
                            ? 'border-[#7f4f13] text-[#7f4f13]'
                            : 'border-transparent text-gray-500 dark:text-gray-400'
                            } pb-3 pt-3 shrink-0 transition-colors`}
                    >
                            <span 
                                className={`material-symbols-outlined text-2xl ${isActive ? 'text-[#7f4f13]' : 'text-gray-500 dark:text-gray-400'}`}
                                style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}
                            >
                                {categoryIcon}
                            </span>
                            <p className="text-xs font-bold leading-normal whitespace-nowrap">{categoryName}</p>
                    </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryTabsBar;
