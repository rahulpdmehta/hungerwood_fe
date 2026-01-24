import { useNavigate } from 'react-router-dom';

/**
 * BackButton Component
 * 
 * A reusable back button that navigates to the previous page or a specified path.
 * Styled consistently across the app with Material Symbols icon.
 * 
 * @param {string} to - Optional: Specific path to navigate to (default: navigates back)
 * @param {function} onClick - Optional: Custom click handler (overrides navigation)
 * @param {string} className - Optional: Additional CSS classes
 * @param {string} variant - Optional: 'default' (with background) or 'minimal' (no background)
 */
const BackButton = ({
    to,
    onClick,
    className = '',
    variant = 'default',
    ariaLabel = 'Go back'
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    const baseStyles = "flex items-center justify-center transition-colors";

    const variantStyles = {
        default: "size-10 rounded-full hover:bg-[#eeeae6] dark:hover:bg-[#3d2e24]",
        minimal: "w-10 h-10 shrink-0"
    };

    return (
        <button
            onClick={handleClick}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            aria-label={ariaLabel}
        >
            <span className="material-symbols-outlined text-[#181411] dark:text-white">
                arrow_back_ios_new
            </span>
        </button>
    );
};

export default BackButton;
