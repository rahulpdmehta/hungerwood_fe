import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useCartStore from '@store/useCartStore';
import useMenuStore from '@store/useMenuStore';
import useSmartMenuSync from '@hooks/useSmartMenuSync';
import BottomNavBar from '@components/layout/BottomNavBar';
import FloatingCartButton from '@components/layout/FloatingCartButton';
import MenuItemCard from '@components/food/MenuItemCard';
import SpecialItemCard from '@components/food/SpecialItemCard';
import CategoryTabsBar from '@components/food/CategoryTabsBar';
import DietToggle from '@components/food/DietToggle';
import SearchBar from '@components/common/SearchBar';
import BackButton from '@components/common/BackButton';

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCartStore();
  const {
    categories: storeCategories,
    items: storeItems,
    fetchCategories,
    fetchItems,
    loading: storeLoading
  } = useMenuStore();

  const [activeCategory, setActiveCategory] = useState('All');
  const [dietFilter, setDietFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [categories, setCategories] = useState(['All']);
  const [allMenuItems, setAllMenuItems] = useState([]);

  // Enable smart menu sync
  useSmartMenuSync();

  // Load menu data from store (with caching)
  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    try {
      // Use smart fetch (checks version first)
      const [categoriesData, itemsData] = await Promise.all([
        fetchCategories(),
        useMenuStore.getState().fetchItemsSmart() // Use smart fetch
      ]);

      if (categoriesData && categoriesData.length > 0) {
        setCategories(['All', ...categoriesData.map(c => c.name)]);
      }
      if (itemsData && itemsData.length > 0) {
        setAllMenuItems(itemsData);
      }
    } catch (error) {
      console.error('Failed to load menu:', error);
    }
  };

  // Check for search query param and open search if search=true
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');

    if (searchParam === 'true') {
      setShowSearch(true);
    }

    if (categoryParam) {
      setDietFilter('All');
      setActiveCategory(categoryParam);
    }
  }, [location.search]);

  // Today's Specials - filter from menu items
  const specials = allMenuItems
    .filter(item => item.isSpecial || item.isBestSeller)
    .slice(0, 4);

  // Fallback menu items (in case API fails)
  const fallbackMenuItems = [
    // Tandoor
    {
      id: 1,
      name: 'Tandoori Butter Chicken',
      description: 'Slow-cooked in clay oven, tossed in a rich velvet tomato gravy.',
      price: 350,
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&q=80',
      veg: false,
      bestseller: true,
      category: 'Tandoor',
    },
    {
      id: 5,
      name: 'Tandoori Paneer Tikka',
      description: 'Cottage cheese marinated with spices and grilled to perfection.',
      price: 320,
      image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&q=80',
      veg: true,
      bestseller: true,
      category: 'Tandoor',
    },
    {
      id: 6,
      name: 'Seekh Kebab',
      description: 'Minced lamb kebabs with aromatic spices cooked in tandoor.',
      price: 380,
      image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&q=80',
      veg: false,
      bestseller: false,
      category: 'Tandoor',
    },
    // Chinese
    {
      id: 7,
      name: 'Hakka Noodles',
      description: 'Stir-fried noodles with fresh vegetables and soy sauce.',
      price: 180,
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&q=80',
      veg: true,
      bestseller: true,
      category: 'Chinese',
    },
    {
      id: 8,
      name: 'Chilli Chicken',
      description: 'Crispy chicken tossed in spicy Indo-Chinese sauce.',
      price: 280,
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=300&q=80',
      veg: false,
      bestseller: false,
      category: 'Chinese',
    },
    {
      id: 9,
      name: 'Veg Manchurian',
      description: 'Vegetable dumplings in tangy Manchurian sauce.',
      price: 220,
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=300&q=80',
      veg: true,
      bestseller: false,
      category: 'Chinese',
    },
    // Main Course
    {
      id: 2,
      name: 'Dal Makhani HungerWood',
      description: 'Our signature 24-hour slow cooked black lentils with churned butter.',
      price: 280,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&q=80',
      veg: true,
      bestseller: true,
      category: 'Main Course',
    },
    {
      id: 4,
      name: 'Lucknowi Mutton Biryani',
      description: 'Aromatic long grain basmati rice layered with tender mutton and saffron.',
      price: 420,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80',
      veg: false,
      bestseller: false,
      category: 'Main Course',
    },
    {
      id: 3,
      name: 'Garlic Butter Naan',
      description: 'Leavened bread topped with fresh chopped garlic and coriander.',
      price: 65,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&q=80',
      veg: true,
      bestseller: false,
      category: 'Main Course',
    },
    {
      id: 10,
      name: 'Butter Chicken Masala',
      description: 'Creamy tomato curry with tender chicken pieces.',
      price: 340,
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&q=80',
      veg: false,
      bestseller: true,
      category: 'Main Course',
    },
    // Beverages
    {
      id: 11,
      name: 'Mango Lassi',
      description: 'Traditional yogurt drink blended with fresh mango pulp.',
      price: 80,
      image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=300&q=80',
      veg: true,
      bestseller: true,
      category: 'Beverages',
    },
    {
      id: 12,
      name: 'Masala Chai',
      description: 'Indian spiced tea brewed with aromatic spices.',
      price: 40,
      image: 'https://images.unsplash.com/photo-1597318181218-c6e6337b8771?w=300&q=80',
      veg: true,
      bestseller: false,
      category: 'Beverages',
    },
    {
      id: 13,
      name: 'Fresh Lime Soda',
      description: 'Refreshing lime juice with soda and mint.',
      price: 60,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&q=80',
      veg: true,
      bestseller: false,
      category: 'Beverages',
    },
    // Desserts
    {
      id: 14,
      name: 'Gulab Jamun',
      description: 'Soft milk solid dumplings soaked in sugar syrup.',
      price: 120,
      image: 'https://images.unsplash.com/photo-1589119908995-c6c4c9e48f1f?w=300&q=80',
      veg: true,
      bestseller: true,
      category: 'Desserts',
    },
    {
      id: 15,
      name: 'Kulfi Falooda',
      description: 'Traditional Indian ice cream with vermicelli and rose syrup.',
      price: 150,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&q=80',
      veg: true,
      bestseller: false,
      category: 'Desserts',
    },
    {
      id: 16,
      name: 'Ras Malai',
      description: 'Soft cottage cheese patties in sweetened milk.',
      price: 140,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&q=80',
      veg: true,
      bestseller: false,
      category: 'Desserts',
    },
  ];

  // Use API data if available, otherwise use fallback
  const menuItems = allMenuItems.length > 0 ? allMenuItems : fallbackMenuItems;

  const handleAddToCart = (item) => {
    addItem({
      id: item.id || item._id,
      _id: item._id || item.id, // Preserve both for compatibility
      name: item.name,
      price: item.price,
      discount: item.discount || 0,
      quantity: 1,
      image: item.image,
    });
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  // Filter items based on category, diet preference, and search
  const filteredItems = menuItems.filter((item) => {
    // Category filter - handle both string and object category
    const categoryName = typeof item.category === 'string' ? item.category : item.category?.name;
    const matchesCategory = categoryName === activeCategory || activeCategory === 'All';

    // Diet filter - handle both 'veg' and 'isVeg' properties
    const isVeg = item.isVeg !== undefined ? item.isVeg : item.veg;
    const matchesDiet = dietFilter === 'All' ? true : dietFilter === 'Veg' ? isVeg : !isVeg;

    // Search filter
    const matchesSearch = searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDiet && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#211811] pb-20">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#211811]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center p-4 pb-2 justify-between">
          <BackButton to="/" variant="minimal" />
          <div className="flex-1 text-center">
            <h2 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-tight">
              HungerWood
            </h2>
            <p className="text-[10px] text-[#cf6317] font-bold uppercase tracking-widest">Gaya, Bihar</p>
          </div>
          <div className="flex w-10 items-center justify-end">
            <button
              onClick={toggleSearch}
              className="flex cursor-pointer items-center justify-center rounded-full h-10 w-10 bg-transparent text-[#181411] dark:text-white"
            >
              <span className="material-symbols-outlined">{showSearch ? 'close' : 'search'}</span>
            </button>
          </div>
        </div>

        {/* Search Bar Component */}
        <SearchBar isOpen={showSearch} value={searchQuery} onChange={setSearchQuery} />

        {/* Category Tabs Component */}
        <CategoryTabsBar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={(category) => {
            setDietFilter('All');
            setActiveCategory(category);
          }}
        />
      </nav>

      {/* Main Content */}
      <main className="pb-2">
        {/* Today's Specials */}
        <div className="px-4 pt-4">
          <h3 className="text-gray-900 dark:text-white text-base font-bold mb-3">Today's Specials</h3>
          <div className="flex w-full overflow-x-auto scrollbar-hide py-1">
            <div className="flex flex-row items-start justify-start gap-4">
              {specials.map((special) => (
                <SpecialItemCard key={special.id} item={special} />
              ))}
            </div>
          </div>
        </div>

        {/* Diet Toggle Component */}
        <DietToggle value={dietFilter} onChange={setDietFilter} />

        {/* Menu Items List */}
        <div className="space-y-4 px-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-gray-300 dark:text-gray-700 text-6xl mb-4">
                search_off
              </span>
              <h3 className="text-xl font-bold text-[#181411] dark:text-white mb-2">No items found</h3>
              <p className="text-[#887263] dark:text-gray-400">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : `No ${dietFilter.toLowerCase()} items in ${activeCategory}`}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} onAddToCart={handleAddToCart} />
            ))
          )}
        </div>
      </main>

      {/* Floating Cart Button Component */}
      <FloatingCartButton />

      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </div>
  );
};

export default Menu;
