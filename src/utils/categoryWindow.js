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
  if (!isValidHHmm(availableFrom) || !isValidHHmm(availableTo)) return true;
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
