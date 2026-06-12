/**
 * Validates and sanitizes a URL to prevent XSS attacks.
 * Only allows http://, https://, mailto:, and tel: schemes.
 * Rejects javascript:, data:, vbscript: etc.
 * 
 * @param {string} url - The URL to validate
 * @param {string} fallbackUrl - Optional fallback URL if the primary one is invalid
 * @returns {string} The safe URL or an empty string/fallback if unsafe
 */
export const sanitizeUrl = (url, fallbackUrl = '#') => {
  if (!url || typeof url !== 'string') return fallbackUrl;
  
  // Trim whitespace
  const trimmedUrl = url.trim();
  
  // If it's a relative path (starts with /), it's safe
  if (trimmedUrl.startsWith('/')) return trimmedUrl;
  
  try {
    const parsed = new URL(trimmedUrl, window.location.origin);
    const protocol = parsed.protocol.toLowerCase();
    
    // Allow explicitly safe protocols
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(protocol)) {
      return trimmedUrl;
    }
    
    console.warn(`[Security] Blocked unsafe URL scheme: ${protocol}`);
    return fallbackUrl;
  } catch {
    // If URL parsing fails, check if it's a valid mailto or tel that new URL() might choke on without a base,
    // though new URL() usually handles them if base is provided.
    // For safety, fallback.
    return fallbackUrl;
  }
};
