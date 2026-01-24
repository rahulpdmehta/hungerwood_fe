import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} format - Format string (default: 'D MMM, YYYY')
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'D MMM, YYYY') => {
  if (!date) return '';
  return dayjs(date).format(format);
};

/**
 * Format time to readable string
 * @param {string|Date} date - Date to format
 * @param {string} format - Format string (default: 'h:mm A')
 * @returns {string} Formatted time
 */
export const formatTime = (date, format = 'h:mm A') => {
  if (!date) return '';
  return dayjs(date).format(format);
};

/**
 * Format date and time together
 * @param {string|Date} date - Date to format
 * @param {string} format - Format string (default: 'D MMM, YYYY • h:mm A')
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date, format = 'D MMM, YYYY • h:mm A') => {
  if (!date) return '';
  return dayjs(date).format(format);
};

/**
 * Format date in short format (e.g., "Jan 24")
 * @param {string|Date} date - Date to format
 * @returns {string} Short formatted date
 */
export const formatDateShort = (date) => {
  if (!date) return '';
  return dayjs(date).format('MMM D');
};

/**
 * Format date in long format (e.g., "January 24, 2026")
 * @param {string|Date} date - Date to format
 * @returns {string} Long formatted date
 */
export const formatDateLong = (date) => {
  if (!date) return '';
  return dayjs(date).format('MMMM D, YYYY');
};

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  return dayjs(date).fromNow();
};

/**
 * Check if date is today
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * Check if date is yesterday
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is yesterday
 */
export const isYesterday = (date) => {
  if (!date) return false;
  return dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day');
};

/**
 * Format date with smart relative display
 * Today: "Today, h:mm A"
 * Yesterday: "Yesterday, h:mm A"
 * This week: "Day, h:mm A" (e.g., "Monday, 2:30 PM")
 * Older: "D MMM, YYYY"
 * @param {string|Date} date - Date to format
 * @returns {string} Smart formatted date
 */
export const formatSmartDate = (date) => {
  if (!date) return '';
  
  const d = dayjs(date);
  const now = dayjs();
  
  if (d.isSame(now, 'day')) {
    return `Today, ${d.format('h:mm A')}`;
  }
  
  if (d.isSame(now.subtract(1, 'day'), 'day')) {
    return `Yesterday, ${d.format('h:mm A')}`;
  }
  
  if (d.isSame(now, 'week')) {
    return d.format('dddd, h:mm A');
  }
  
  if (d.isSame(now, 'year')) {
    return d.format('D MMM, h:mm A');
  }
  
  return d.format('D MMM, YYYY');
};

/**
 * Format date for charts (e.g., "Jan 24")
 * @param {string|Date} date - Date to format
 * @returns {string} Chart formatted date
 */
export const formatChartDate = (date) => {
  if (!date) return '';
  return dayjs(date).format('MMM D');
};

/**
 * Format full datetime with seconds
 * @param {string|Date} date - Date to format
 * @returns {string} Full datetime string
 */
export const formatFullDateTime = (date) => {
  if (!date) return '';
  return dayjs(date).format('D MMM, YYYY h:mm:ss A');
};

/**
 * Get current ISO timestamp
 * @returns {string} Current ISO timestamp
 */
export const getCurrentISO = () => {
  return dayjs().toISOString();
};

/**
 * Add time to a date
 * @param {string|Date} date - Base date
 * @param {number} amount - Amount to add
 * @param {string} unit - Unit ('minute', 'hour', 'day', etc.)
 * @returns {string} ISO timestamp
 */
export const addTime = (date, amount, unit) => {
  return dayjs(date).add(amount, unit).toISOString();
};

/**
 * Subtract time from a date
 * @param {string|Date} date - Base date
 * @param {number} amount - Amount to subtract
 * @param {string} unit - Unit ('minute', 'hour', 'day', etc.)
 * @returns {string} ISO timestamp
 */
export const subtractTime = (date, amount, unit) => {
  return dayjs(date).subtract(amount, unit).toISOString();
};

export default dayjs;
