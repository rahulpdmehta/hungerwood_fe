import useCartStore from '@store/useCartStore';

const QuantityCounter = ({ itemId, size = 'md' }) => {
  const { getItemQuantity, incrementQuantity, decrementQuantity } = useCartStore();
  const quantity = getItemQuantity(itemId);

  const sizes = {
    sm: 'text-sm h-8 w-8',
    md: 'text-base h-10 w-10',
    lg: 'text-lg h-12 w-12',
  };

  if (quantity === 0) return null;

  return (
    <div className="flex items-center gap-3 bg-primary-50 rounded-lg p-1">
      <button
        onClick={() => decrementQuantity(itemId)}
        className={`${sizes[size]} flex items-center justify-center bg-white rounded-lg text-primary-600 hover:bg-primary-100 transition font-bold shadow-sm`}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="font-semibold text-gray-900 min-w-[2rem] text-center">{quantity}</span>
      <button
        onClick={() => incrementQuantity(itemId)}
        className={`${sizes[size]} flex items-center justify-center bg-white rounded-lg text-primary-600 hover:bg-primary-100 transition font-bold shadow-sm`}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantityCounter;
