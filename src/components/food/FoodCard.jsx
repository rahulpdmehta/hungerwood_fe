import { Link } from 'react-router-dom';
import useCartStore from '@store/useCartStore';
import { formatCurrency } from '@utils/helpers';
import Button from '@components/common/Button';

const FoodCard = ({ item }) => {
  const { addItem, getItemQuantity } = useCartStore();
  const quantity = getItemQuantity(item.id);

  const handleAddToCart = e => {
    e.preventDefault();
    e.stopPropagation();
    addItem(item);
  };

  return (
    <Link to={`/menu/${item.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-200">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-16 h-16"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          )}
          {!item.available && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Not Available</span>
            </div>
          )}
          {item.badge && (
            <span className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
              {item.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition">
            {item.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">{item.description}</p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto">
            <div>
              <p className="text-xl font-bold text-primary-600">{formatCurrency(item.price)}</p>
              {item.category && (
                <p className="text-xs text-gray-500 mt-1">{item.category}</p>
              )}
            </div>
            <Button
              onClick={handleAddToCart}
              variant="primary"
              size="sm"
              disabled={!item.available}
            >
              {quantity > 0 ? `In Cart (${quantity})` : 'Add'}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FoodCard;
