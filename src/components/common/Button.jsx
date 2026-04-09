const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark active:scale-95 focus:ring-primary shadow-sm hover:shadow-md',
    secondary: 'bg-surface text-primary border-2 border-primary hover:bg-primary hover:text-white focus:ring-primary',
    outline: 'bg-transparent text-primary border-2 border-border hover:border-primary hover:bg-primary/5 focus:ring-primary',
    cta: 'bg-cta text-white hover:bg-cta-hover active:scale-95 focus:ring-cta shadow-md hover:shadow-lg',
    danger: 'bg-danger text-white hover:bg-danger-600 active:scale-95 focus:ring-danger shadow-sm hover:shadow-md',
    success: 'bg-success text-white hover:bg-success-600 active:scale-95 focus:ring-success shadow-sm hover:shadow-md',
    ghost: 'bg-transparent text-text-primary hover:bg-surface-muted focus:ring-primary',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const classes = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
