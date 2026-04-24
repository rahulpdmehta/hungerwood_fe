/**
 * Rewrite Unsplash image URLs to match the rendered size + modern format.
 *
 * - Strips any existing `w=`/`q=`/`auto=`/`fm=`/`fit=` params so we control sizing.
 * - Adds `w` ~ 2x the CSS width (for retina), `q=60`, `auto=format` (WebP/AVIF),
 *   `fit=crop` so images remain the aspect ratio the layout expects.
 * - Leaves non-Unsplash URLs untouched.
 */
export function optimizeImage(url, cssWidth = 200) {
  if (!url) return url;
  if (!/images\.unsplash\.com/.test(url)) return url;
  try {
    const u = new URL(url);
    ['w', 'q', 'auto', 'fm', 'fit', 'dpr'].forEach(k => u.searchParams.delete(k));
    u.searchParams.set('w', String(Math.min(Math.round(cssWidth * 2), 800)));
    u.searchParams.set('q', '60');
    u.searchParams.set('auto', 'format');
    u.searchParams.set('fit', 'crop');
    return u.toString();
  } catch {
    return url;
  }
}
