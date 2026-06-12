/**
 * Generates an optimized image URL for Unsplash or other assets.
 * Handles resizing, formatting, and quality control.
 * 
 * @param {string} src - The original image URL.
 * @param {number} width - The desired image width in pixels.
 * @param {number} [quality=80] - The desired quality percentage (1-100).
 * @returns {string} - The optimized image URL.
 */
export const getOptimizedImageUrl = (src, width, quality = 80) => {
  if (!src) return '';

  // Handle Unsplash images by modifying query parameters
  if (src.includes('images.unsplash.com')) {
    try {
      const url = new URL(src);
      
      // Remove default query parameters to avoid conflicts
      url.searchParams.delete('w');
      url.searchParams.delete('q');
      url.searchParams.delete('auto');
      url.searchParams.delete('fm');

      // Add modern format optimization (WebP/AVIF auto-negotiation)
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'crop');
      
      if (width) {
        url.searchParams.set('w', width.toString());
      }
      url.searchParams.set('q', quality.toString());

      return url.toString();
    } catch (e) {
      console.warn('Failed to parse Unsplash URL in imageHelper:', e);
      return src;
    }
  }

  // Fallback for local assets or Firebase Storage URLs (which already handle formats)
  return src;
};

/**
 * Generates a low-quality placeholder URL (20px width, 10% quality) for progressive image loading.
 * 
 * @param {string} src - The original image URL.
 * @returns {string} - The low-res placeholder image URL.
 */
export const getPlaceholderImageUrl = (src) => {
  return getOptimizedImageUrl(src, 20, 10);
};

/**
 * Resolves the standard gallery image tiers while preserving explicit CMS URLs.
 * Small images are used for compact cards, medium images for the visible grid,
 * and large images for full-screen viewing.
 */
export const getImageTiers = (image) => {
  const source = typeof image === 'string' ? image : image?.src;
  const thumbnailSource = typeof image === 'string'
    ? source
    : image?.thumbnailUrl || source;
  const mediumSource = typeof image === 'string'
    ? source
    : image?.mediumUrl || source;

  return {
    small: getOptimizedImageUrl(thumbnailSource, 400, 76),
    medium: getOptimizedImageUrl(mediumSource, 1200, 82),
    large: getOptimizedImageUrl(source, 2000, 90),
    placeholder: getPlaceholderImageUrl(thumbnailSource)
  };
};
