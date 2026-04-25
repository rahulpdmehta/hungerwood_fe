import { useState } from 'react';
import { optimizeImage } from '@utils/image';

/**
 * Drop-in replacement for `<img>` for product/banner/photo content.
 * - Forces lazy + async decoding so off-screen images don't compete for the
 *   main thread.
 * - Funnels through `optimizeImage` for known CDN URLs (Unsplash, etc.) so
 *   we ship the right pixel width to mobile.
 * - Falls back to a neutral placeholder block if the URL 404s, instead of
 *   leaving a broken-image icon.
 *
 * Use `alt=""` on purely decorative images (and the component will tag them
 * `aria-hidden`); pass a real `alt` for content images so screen readers and
 * SEO get something useful.
 */
export default function OptimizedImage({
  src,
  alt = '',
  width,
  className = '',
  fallbackClassName = 'bg-gray-100 dark:bg-gray-800',
  ...rest
}) {
  const [errored, setErrored] = useState(false);
  const finalSrc = src && width ? optimizeImage(src, width) : src;
  const isDecorative = alt === '';

  if (!finalSrc || errored) {
    return <div className={`${className} ${fallbackClassName}`} aria-hidden />;
  }

  return (
    <img
      src={finalSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
      aria-hidden={isDecorative ? true : undefined}
      className={className}
      {...rest}
    />
  );
}
