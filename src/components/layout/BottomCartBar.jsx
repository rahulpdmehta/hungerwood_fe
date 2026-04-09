import { Link } from 'react-router-dom';
import useCartStore from '@store/useCartStore';
import { formatCurrency } from '@utils/helpers';

const BottomCartBar = () => {
  const { totalItems, totalPrice } = useCartStore();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t-2 border-primary-600 z-50 md:hidden">
      <div className="container-custom py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(totalPrice)}</p>
          </div>
          <Link
            to="/cart"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition flex items-center gap-2"
          >
            View Cart
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BottomCartBar;
