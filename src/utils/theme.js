/**
 * HungerWood Design Tokens
 * Centralized theme configuration for consistent styling across the app
 */

export const theme = {
    // ============================================
    // COLORS
    // ============================================
    colors: {
        // Primary (Wood Brown)
        primary: {
            DEFAULT: '#6B3F2A',
            50: '#F5F0ED',
            100: '#E8DDD6',
            200: '#D1BAAD',
            300: '#BA9784',
            400: '#A3745B',
            500: '#6B3F2A',
            600: '#4A2A1C',
            700: '#3E2318',
            800: '#321C13',
            900: '#26150F',
            dark: '#4A2A1C',
        },

        // Background
        background: {
            DEFAULT: '#FFF8F1', // Cream
            light: '#FFFCF9',
            dark: '#FFF3E8',
        },

        // Surface
        surface: {
            DEFAULT: '#FFFFFF',
            elevated: '#FFFFFF',
            muted: '#F5F5F5',
        },

        // Text
        text: {
            primary: '#2E1B12',
            secondary: '#6B6B6B',
            tertiary: '#999999',
            inverse: '#FFFFFF',
        },

        // Border
        border: {
            DEFAULT: '#E6D5C3',
            light: '#F0E5D8',
            dark: '#D4C0AC',
        },

        // Status Colors
        status: {
            success: '#2E7D32', // Veg
            danger: '#C62828', // Non-veg
            warning: '#F9A825',
            info: '#0288D1',
        },

        // CTA (Call to Action)
        cta: {
            DEFAULT: '#3E2723',
            hover: '#2B1B17',
            active: '#1E1210',
        },
    },

    // ============================================
    // SPACING
    // ============================================
    spacing: {
        xs: '0.25rem', // 4px
        sm: '0.5rem', // 8px
        md: '1rem', // 16px
        lg: '1.5rem', // 24px
        xl: '2rem', // 32px
        '2xl': '2.5rem', // 40px
        '3xl': '3rem', // 48px
        '4xl': '4rem', // 64px
        '5xl': '5rem', // 80px
        '6xl': '6rem', // 96px

        // Semantic spacing
        sectionPadding: {
            mobile: '3rem', // 48px
            tablet: '4rem', // 64px
            desktop: '5rem', // 80px
        },

        containerPadding: {
            mobile: '1rem', // 16px
            tablet: '1.5rem', // 24px
            desktop: '2rem', // 32px
        },
    },

    // ============================================
    // BORDER RADIUS
    // ============================================
    borderRadius: {
        none: '0',
        sm: '0.25rem', // 4px
        md: '0.5rem', // 8px
        lg: '0.75rem', // 12px
        xl: '1rem', // 16px
        '2xl': '1.25rem', // 20px
        '3xl': '1.5rem', // 24px
        full: '9999px',

        // Semantic radius
        button: '0.75rem', // 12px
        card: '1rem', // 16px
        input: '0.75rem', // 12px
        modal: '1.25rem', // 20px
    },

    // ============================================
    // SHADOWS
    // ============================================
    shadows: {
        sm: '0 1px 2px 0 rgba(107, 63, 42, 0.05)',
        md: '0 4px 6px -1px rgba(107, 63, 42, 0.1), 0 2px 4px -1px rgba(107, 63, 42, 0.06)',
        lg: '0 10px 15px -3px rgba(107, 63, 42, 0.1), 0 4px 6px -2px rgba(107, 63, 42, 0.05)',
        xl: '0 20px 25px -5px rgba(107, 63, 42, 0.1), 0 10px 10px -5px rgba(107, 63, 42, 0.04)',
        '2xl': '0 25px 50px -12px rgba(107, 63, 42, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(107, 63, 42, 0.06)',
        none: 'none',

        // Semantic shadows
        card: '0 2px 8px rgba(107, 63, 42, 0.08)',
        elevated: '0 4px 12px rgba(107, 63, 42, 0.12)',
        button: '0 1px 3px rgba(107, 63, 42, 0.1)',
        input: 'inset 0 1px 2px rgba(107, 63, 42, 0.05)',
    },

    // ============================================
    // TYPOGRAPHY
    // ============================================
    typography: {
        fontFamily: {
            primary: "'Poppins', system-ui, sans-serif",
            fallback: 'system-ui, -apple-system, sans-serif',
        },

        fontSize: {
            xs: '0.75rem', // 12px
            sm: '0.875rem', // 14px
            base: '1rem', // 16px
            lg: '1.125rem', // 18px
            xl: '1.25rem', // 20px
            '2xl': '1.5rem', // 24px
            '3xl': '1.875rem', // 30px
            '4xl': '2.25rem', // 36px
            '5xl': '3rem', // 48px
            '6xl': '3.75rem', // 60px
        },

        fontWeight: {
            light: 300,
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
        },

        lineHeight: {
            tight: 1.25,
            normal: 1.5,
            relaxed: 1.75,
            loose: 2,
        },
    },

    // ============================================
    // TRANSITIONS
    // ============================================
    transitions: {
        duration: {
            fast: '150ms',
            normal: '200ms',
            slow: '300ms',
            slower: '400ms',
        },

        timing: {
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
        },
    },

    // ============================================
    // BREAKPOINTS
    // ============================================
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },

    // ============================================
    // Z-INDEX SCALE
    // ============================================
    zIndex: {
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modal: 1040,
        popover: 1050,
        tooltip: 1060,
    },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get color with opacity
 * @param {string} color - Hex color code
 * @param {number} opacity - Opacity value (0-1)
 * @returns {string} RGBA color string
 */
export const withOpacity = (color, opacity) => {
    // Remove # if present
    const hex = color.replace('#', '');

    // Parse hex to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Get responsive spacing
 * @param {string} size - Size key from theme.spacing
 * @param {string} breakpoint - Breakpoint (mobile, tablet, desktop)
 * @returns {string} Spacing value
 */
export const getSpacing = (size, breakpoint = 'mobile') => {
    return theme.spacing[size]?.[breakpoint] || theme.spacing[size] || size;
};

/**
 * Generate gradient
 * @param {string} from - Start color
 * @param {string} to - End color
 * @param {string} direction - Gradient direction
 * @returns {string} CSS gradient
 */
export const gradient = (from, to, direction = 'to right') => {
    return `linear-gradient(${direction}, ${from}, ${to})`;
};

// ============================================
// EXPORT DEFAULT
// ============================================
export default theme;
