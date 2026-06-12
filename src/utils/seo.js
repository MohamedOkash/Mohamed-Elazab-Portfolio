export const getPageSeo = (settings, page, fallback, isRTL) => {
  const pageSettings = settings?.seo?.pages?.[page] || {};
  
  const title = isRTL
    ? (pageSettings.titleAr || fallback.title)
    : (pageSettings.titleEn || fallback.title);
    
  const description = isRTL
    ? (pageSettings.descriptionAr || fallback.description)
    : (pageSettings.descriptionEn || fallback.description);
    
  const keywords = isRTL
    ? (pageSettings.keywordsAr || fallback.keywords)
    : (pageSettings.keywordsEn || fallback.keywords);

  return {
    title,
    description,
    keywords,
    ogImage: pageSettings.ogImage || fallback.ogImage || '',
    canonicalUrl: fallback.canonicalUrl
  };
};
