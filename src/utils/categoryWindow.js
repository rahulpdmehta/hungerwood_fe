const HHMM_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function getCurrentIstHHmm(now = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
  return fmt.format(now);
}

export function isValidHHmm(s) {
  return typeof s === 'string' && HHMM_RE.test(s);
}

export function isCategoryOrderable(category, now = new Date()) {
  if (!category || !category.isTimeRestricted) return true;
  const { availableFrom, availableTo } = category;
  if (!isValidHHmm(availableFrom) || !isValidHHmm(availableTo)) return false;
  const nowHHmm = getCurrentIstHHmm(now);
  return nowHHmm >= availableFrom && nowHHmm < availableTo;
}

/**
 * "10:00" -> "10:00 AM"; "13:30" -> "1:30 PM".
 */
function to12h(hhmm) {
  if (!isValidHHmm(hhmm)) return hhmm;
  const [hStr, m] = hhmm.split(':');
  const h = parseInt(hStr, 10);
  const suffix = h < 12 ? 'AM' : 'PM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m} ${suffix}`;
}

export function formatWindowLabel(category) {
  if (!category || !category.isTimeRestricted) return '';
  return `${to12h(category.availableFrom)} – ${to12h(category.availableTo)}`;
}

/**
 * Build lookup maps from a categories array so callers can resolve a cart
 * item's category by id (preferred, stable) or by name (legacy fallback).
 */
export function buildCategoryLookups(categoriesData) {
  const byId = {};
  const byName = {};
  (categoriesData || []).forEach((c) => {
    if (!c || typeof c !== 'object') return;
    const id = c.id || c._id;
    if (id) byId[String(id)] = c;
    if (c.name) byName[c.name.toLowerCase()] = c;
  });
  return { byId, byName };
}

/**
 * Resolve the Category object for a cart item. Prefer id (stable across
 * renames); fall back to lowercased name. Returns null if unresolved.
 */
export function resolveCartItemCategory(cartItem, lookups) {
  if (!cartItem || !lookups) return null;
  const id = cartItem.categoryId ? String(cartItem.categoryId) : null;
  if (id && lookups.byId[id]) return lookups.byId[id];
  const rawName = cartItem.category;
  const name =
    typeof rawName === 'string'
      ? rawName
      : rawName && typeof rawName === 'object'
        ? rawName.name || ''
        : '';
  if (name) return lookups.byName[name.toLowerCase()] || null;
  return null;
}
