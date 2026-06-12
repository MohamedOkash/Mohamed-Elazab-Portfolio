import { getOptimizedImageUrl } from './imageHelper';

const HERO_CACHE_KEY = 'elazab_hero_bg';
const HERO_CACHE_META_KEY = 'elazab_hero_bg_meta';
const DEFAULT_HERO_URL = 'https://images.unsplash.com/photo-1519741497674-611481863552';

/**
 * Gets the cached hero image URL from localStorage.
 * Fallback to a high-quality default wedding image if cache is empty.
 */
export const getCachedHeroUrl = () => {
  try {
    const cached = localStorage.getItem(HERO_CACHE_KEY);
    if (cached) return cached;
  } catch {
    return DEFAULT_HERO_URL;
  }
  return DEFAULT_HERO_URL;
};

/**
 * Saves the hero image URL to the localStorage cache.
 */
export const setCachedHeroUrl = (url, version = '') => {
  if (!url) return;
  try {
    localStorage.setItem(HERO_CACHE_KEY, url);
    localStorage.setItem(HERO_CACHE_META_KEY, JSON.stringify({
      url,
      version: String(version || ''),
      refreshedAt: Date.now()
    }));
  } catch {
    return;
  }
};

/**
 * Refreshes the browser cache only when the source or CMS revision changes.
 */
export const refreshHeroCache = (url, version = '') => {
  if (!url) return getCachedHeroUrl();

  try {
    const cachedMeta = JSON.parse(localStorage.getItem(HERO_CACHE_META_KEY) || '{}');
    if (cachedMeta.url !== url || cachedMeta.version !== String(version || '')) {
      setCachedHeroUrl(url, version);
    }
  } catch {
    setCachedHeroUrl(url, version);
  }

  return url;
};

/**
 * Returns optimized URLs for mobile, tablet, and desktop breakpoints.
 */
export const getResponsiveHeroUrls = (src) => {
  const url = src || getCachedHeroUrl();
  const isUnsplash = typeof url === 'string' && url.includes('images.unsplash.com');
  return {
    mobile: isUnsplash ? getOptimizedImageUrl(url, 400, 76) : url,
    tablet: isUnsplash ? getOptimizedImageUrl(url, 1200, 80) : url,
    desktop: isUnsplash ? getOptimizedImageUrl(url, 2000, 85) : url,
    isUnsplash
  };
};
