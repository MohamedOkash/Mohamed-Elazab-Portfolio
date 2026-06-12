import { defaultSiteData } from './siteData';
import { defaultGallery } from './galleryData';

/**
 * Data Access Layer (DAL).
 * Consolidates local and remote data streams.
 * Centralizing this logic prepares the application for a future Firestore CMS migration.
 */

/**
 * Retrieves the initial state of the application's data.
 * First checks local storage, then falls back to hardcoded defaults.
 * 
 * @returns {object} - The master site dataset.
 */
export const getInitialData = () => {
  const saved = localStorage.getItem('elazab_site_data_v6');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Backwards compatibility/ensure gallery is linked
      if (!parsed.gallery || parsed.gallery.length === 0) {
        parsed.gallery = defaultGallery;
      }
      return parsed;
    } catch (e) {
      console.warn('Failed to load saved local portfolio data. Loading defaults.', e);
    }
  }

  // Clone defaults to avoid reference mutation issues
  const baseData = { ...defaultSiteData };
  if (!baseData.gallery) {
    baseData.gallery = defaultGallery;
  }
  return baseData;
};

/**
 * Fetches localized texts based on selected language.
 * 
 * @param {object} masterData - The full data state.
 * @param {string} lang - Selected language (e.g. 'ar', 'en').
 * @returns {object} - Localized dictionary of text nodes.
 */
export const getLocalizedContent = (masterData, lang) => {
  return masterData[lang] || masterData['ar'];
};

/**
 * Fetches gallery items.
 * 
 * @param {object} masterData - The full data state.
 * @returns {Array} - List of gallery objects.
 */
export const getGalleryList = (masterData) => {
  return masterData.gallery || defaultGallery;
};

/**
 * Fetches testimonial items.
 * 
 * @param {object} masterData - The full data state.
 * @returns {Array} - List of testimonial objects.
 */
export const getTestimonialsList = (masterData) => {
  return masterData.testimonials || [];
};

/**
 * Fetches packages and options.
 * 
 * @param {object} masterData - The full data state.
 * @returns {Array} - List of package configurations.
 */
export const getPackagesList = (masterData) => {
  return masterData.packages || [];
};
