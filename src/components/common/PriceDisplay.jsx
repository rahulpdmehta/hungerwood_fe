/**
 * PriceDisplay - Reusable component for displaying prices with discounts
 * Shows original price (struck through) and discounted price
 */

const PriceDisplay = ({
    price,
    discount = 0,
    size = 'base',
    className = ''
}) => {
    const hasDiscount = discount > 0;
    const discountedPrice = hasDiscount ? Math.round(price * (1 - discount / 100)) : price;

    const sizeClasses = {
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
    };

    const strikeSize = {
        sm: 'text-xs',
        base: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg',
        '2xl': 'text-xl',
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Discounted Price */}
            <span className={`text-[#cf6317] ${sizeClasses[size]} font-bold`}>
                ₹{discountedPrice}
            </span>

            {/* Original Price (if discount exists) */}
            {hasDiscount && (
                <>
                    <span className={`text-[#887263] dark:text-gray-400 ${strikeSize[size]} line-through`}>
                        ₹{price}
                    </span>
                    {/* Discount Badge */}
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {discount}% OFF
                    </span>
                </>
            )}
        </div>
    );
};

export default PriceDisplay;
