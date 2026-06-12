/**
 * Analytics wrapper module.
 * Provides placeholders for future tracking integrations (Google Analytics, Mixpanel, Fathom, etc.)
 * without adding initial bundle overhead.
 */

/**
 * Tracks a page view event.
 * @param {string} path - The path of the page viewed.
 */
export const trackPageView = (path) => {
  if (import.meta.env.DEV) {
    console.log(`[Analytics] Page View Tracked: ${path}`);
  }
  // Future implementation: window.gtag('config', 'MEASUREMENT_ID', { page_path: path });
};

/**
 * Tracks a custom event.
 * @param {string} category - Event category (e.g. 'Engagement', 'Contact')
 * @param {string} action - Event action (e.g. 'Click Package', 'Submit Form')
 * @param {string} [label] - Optional event label
 * @param {number} [value] - Optional event value
 */
export const trackEvent = (category, action, label = '', value = 0) => {
  if (import.meta.env.DEV) {
    console.log(`[Analytics] Event Tracked - Category: ${category}, Action: ${action}, Label: ${label}, Value: ${value}`);
  }
  // Future implementation: window.gtag('event', action, { event_category: category, event_label: label, value: value });
};
