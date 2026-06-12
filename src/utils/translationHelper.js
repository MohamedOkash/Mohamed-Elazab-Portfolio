/**
 * AI Translation Assistant Helper for Mohamed Elazab Photography Studio CMS.
 * Uses MyMemory public translation API with automatic language detection and brand name preservation.
 */

/**
 * Detects whether the input text is primarily Arabic or English.
 * 
 * @param {string} text - The input text.
 * @returns {'ar'|'en'} - Detected language code.
 */
export const detectLanguage = (text) => {
  if (!text) return 'en';
  // Check if the text contains Arabic characters (Unicode range \u0600-\u06FF)
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text) ? 'ar' : 'en';
};

// Brand preservation rule keys
const BRAND_PRESERVATION_RULES = [
  { term: 'Mohamed Elazab', placeholder: '[[BRAND_PRESERVED_0]]' },
  { term: 'محمد العزب', placeholder: '[[BRAND_PRESERVED_1]]' },
  { term: 'MA Photography', placeholder: '[[BRAND_PRESERVED_2]]' }
];

/**
 * Translates a single text string between Arabic and English.
 * Auto-detects source language if not specified.
 * 
 * @param {string} text - Text to translate.
 * @param {'ar'|'en'|null} targetLanguage - Target language code.
 * @returns {Promise<string>} - Translated text.
 */
export const translateText = async (text, targetLanguage = null) => {
  const cleanText = (text || '').trim();
  if (!cleanText) return '';

  const sourceLanguage = detectLanguage(cleanText);
  const target = targetLanguage || (sourceLanguage === 'ar' ? 'en' : 'ar');
  const source = sourceLanguage;

  // If source and target are the same, return as is
  if (source === target) return cleanText;

  // Apply brand preservation: replace brand terms with placeholders
  let processedText = cleanText;
  const activePlaceholders = [];

  BRAND_PRESERVATION_RULES.forEach((rule) => {
    // Escape special regex characters in the term
    const escapedTerm = rule.term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escapedTerm, 'gi');
    if (regex.test(processedText)) {
      processedText = processedText.replace(regex, rule.placeholder);
      activePlaceholders.push(rule);
    }
  });

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(processedText)}&langpair=${source}|${target}`
    );
    if (!response.ok) {
      throw new Error(`Translation API HTTP error: ${response.status}`);
    }
    const data = await response.json();
    
    if (data?.responseData?.translatedText) {
      // Decode HTML entities if returned by API (e.g. &#39; -> ')
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.responseData.translatedText, 'text/html');
      let translation = doc.body.textContent || data.responseData.translatedText;

      // Restore brand terms
      activePlaceholders.forEach((rule) => {
        // Replace placeholders back to the original term
        const regex = new RegExp(rule.placeholder.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
        translation = translation.replace(regex, rule.term);
      });

      return translation;
    } else {
      throw new Error('Invalid Translation API response structure');
    }
  } catch (err) {
    console.error('Translation failed:', err);
    throw new Error(
      source === 'ar' 
        ? 'فشلت عملية الترجمة التلقائية. الرجاء التحقق من اتصال الإنترنت.' 
        : 'Automated translation failed. Please check your network connection.',
      { cause: err }
    );
  }
};

/**
 * Translates an array of strings.
 * 
 * @param {string[]} list - List of strings to translate.
 * @param {'ar'|'en'|null} targetLanguage - Target language code.
 * @returns {Promise<string[]>} - Translated list.
 */
export const translateList = async (list, targetLanguage = null) => {
  if (!Array.isArray(list) || list.length === 0) return [];
  
  // Translate elements in parallel
  const promises = list.map(item => translateText(item, targetLanguage).catch(err => {
    console.warn('Skipping item translation due to error:', err);
    return item; // Fallback to original text on item failure
  }));
  return Promise.all(promises);
};
