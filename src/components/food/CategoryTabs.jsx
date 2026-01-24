import useMenuStore from '@store/useMenuStore';
import { FOOD_CATEGORIES } from '@utils/constants';

const CategoryTabs = () => {
  const { selectedCategory, filterByCategory } = useMenuStore();

  return (
    <div className="bg-white shadow-sm sticky top-16 z-30">
      <div className="container-custom py-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {FOOD_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => filterByCategory(category)}
              className={`
                px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all
                ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
