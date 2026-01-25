/**
 * Banner Configuration for HungerWood
 * Centralized management for promotional banners, offers, and announcements
 */

export const BANNER_TYPES = {
  OFFER: 'OFFER',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  PROMOTION: 'PROMOTION',
  EVENT: 'EVENT',
};

export const BANNER_POSITIONS = {
  TOP: 'TOP',
  MIDDLE: 'MIDDLE',
  BOTTOM: 'BOTTOM',
};

/**
 * Top Carousel Banners Configuration
 * These appear in the main carousel at the top of the home page
 */
export const TOP_CAROUSEL_BANNERS = [
  {
    id: 'banner_1',
    type: BANNER_TYPES.OFFER,
    enabled: true,
    priority: 1,
    title: 'Flat 30% Off',
    subtitle: 'on Starters',
    description: 'Valid on orders above ₹499',
    badge: 'LIMITED OFFER',
    badgeColor: '#7f4f13', // HungerWood orange
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80',
    backgroundColor: 'linear-gradient(135deg, #181411 0%, #2d221a 100%)',
    textColor: '#ffffff',
    ctaText: 'Order Now',
    ctaLink: '/menu',
    validFrom: '2026-01-01',
    validUntil: '2026-01-31',
    minOrderAmount: 499,
    discountPercent: 30,
    applicableCategories: ['Starters', 'Tandoor'],
  },
  {
    id: 'banner_2',
    type: BANNER_TYPES.PROMOTION,
    enabled: true,
    priority: 2,
    title: 'Family Feast',
    subtitle: 'Starter Combo',
    description: 'Free dessert on orders above ₹799',
    badge: 'WEEKEND SPECIAL',
    badgeColor: '#16a34a', // Green
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80',
    backgroundColor: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    textColor: '#ffffff',
    ctaText: 'Explore',
    ctaLink: '/menu?category=Combos',
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    minOrderAmount: 799,
    applicableOn: ['SATURDAY', 'SUNDAY'],
  },
  {
    id: 'banner_3',
    type: BANNER_TYPES.ANNOUNCEMENT,
    enabled: true,
    priority: 3,
    title: 'New Menu Alert',
    subtitle: 'Biryani Special',
    description: 'Authentic Gaya-style Biryani now available',
    badge: 'NEW LAUNCH',
    badgeColor: '#dc2626', // Red
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
    backgroundColor: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)',
    textColor: '#ffffff',
    ctaText: 'Try Now',
    ctaLink: '/menu?category=Biryani',
    validFrom: '2026-01-15',
    validUntil: '2026-02-15',
  },
];

/**
 * Referral Banner Configuration
 * Appears below the carousel on the home page
 */
export const REFERRAL_BANNER = {
  enabled: true,
  icon: '🎁', // Gift emoji
  title: 'Refer & Earn ₹50',
  subtitle: 'Invite friends & earn wallet cash',
  ctaText: 'Invite',
  ctaLink: '/referral',
  backgroundColor: '#f0fdf4', // Light green
  darkBackgroundColor: '#14532d', // Dark green
  borderColor: '#86efac',
  darkBorderColor: '#166534',
  iconBackgroundColor: '#4ade80',
  textColor: '#166534',
  darkTextColor: '#86efac',
  ctaButtonColor: '#16a34a',
  ctaButtonHoverColor: '#15803d',
  reward: {
    referrer: 50, // Amount referrer gets
    referee: 50, // Amount new user gets
    minOrderAmount: 299, // Minimum order to unlock reward
  },
};

/**
 * Info Banner Configuration
 * Optional dismissible info banner that appears at the top
 */
export const INFO_BANNER = {
  enabled: false,
  dismissible: true,
  type: 'INFO', // 'INFO', 'WARNING', 'SUCCESS', 'ERROR'
  message: 'Free delivery on orders above ₹499 this weekend!',
  icon: '🚚',
  backgroundColor: '#dbeafe',
  darkBackgroundColor: '#1e3a8a',
  textColor: '#1e40af',
  darkTextColor: '#93c5fd',
  ctaText: 'Order Now',
  ctaLink: '/menu',
  validFrom: '2026-01-24',
  validUntil: '2026-01-26',
};

/**
 * Wallet Promo Banner
 * Shows when user has wallet balance > 0
 */
export const WALLET_PROMO_BANNER = {
  enabled: true,
  showWhenBalanceAbove: 0,
  dismissible: true,
  message: 'You have ₹{balance} in your wallet',
  subMessage: 'Use it on your next order',
  icon: '💰',
  backgroundColor: '#fef3c7',
  darkBackgroundColor: '#78350f',
  textColor: '#92400e',
  darkTextColor: '#fcd34d',
  ctaText: 'Use Now',
  ctaLink: '/cart',
};

/**
 * Banner Display Rules
 */
export const BANNER_RULES = {
  // Maximum number of banners to show in carousel
  maxCarouselBanners: 5,

  // Auto-play carousel settings
  autoPlay: true,
  autoPlayInterval: 5000, // 5 seconds

  // Show banners based on time
  showOnlyDuringValidPeriod: true,

  // Show banners based on user authentication
  showToAuthenticatedOnly: false,
  showToGuestOnly: false,

  // Show banners based on day of week
  respectDayRestrictions: true,

  // Transition effects
  transitionDuration: 500, // milliseconds
  transitionEffect: 'slide', // 'slide', 'fade', 'zoom'
};

/**
 * Helper function to check if banner is valid
 */
export const isBannerValid = (banner) => {
  if (!banner.enabled) return false;

  const now = new Date();
  const validFrom = banner.validFrom ? new Date(banner.validFrom) : null;
  const validUntil = banner.validUntil ? new Date(banner.validUntil) : null;

  if (BANNER_RULES.showOnlyDuringValidPeriod) {
    if (validFrom && now < validFrom) return false;
    if (validUntil && now > validUntil) return false;
  }

  if (BANNER_RULES.respectDayRestrictions && banner.applicableOn) {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const currentDay = days[now.getDay()];
    if (!banner.applicableOn.includes(currentDay)) return false;
  }

  return true;
};

/**
 * Get active banners sorted by priority
 */
export const getActiveBanners = () => {
  return TOP_CAROUSEL_BANNERS
    .filter(isBannerValid)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, BANNER_RULES.maxCarouselBanners);
};

/**
 * Get banner by ID
 */
export const getBannerById = (id) => {
  return TOP_CAROUSEL_BANNERS.find(banner => banner.id === id);
};

export default {
  BANNER_TYPES,
  BANNER_POSITIONS,
  TOP_CAROUSEL_BANNERS,
  REFERRAL_BANNER,
  INFO_BANNER,
  WALLET_PROMO_BANNER,
  BANNER_RULES,
  isBannerValid,
  getActiveBanners,
  getBannerById,
};
