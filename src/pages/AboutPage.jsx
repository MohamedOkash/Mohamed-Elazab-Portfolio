import { Helmet } from 'react-helmet-async';
import About from '../sections/About';
import { getPageSeo } from '../utils/seo';

/**
 * Dedicated About page view.
 */
export default function AboutPage({
  t,
  colors,
  isDark,
  isRTL,
  aboutImg,
  settings
}) {
  const defaultTitle = isRTL 
    ? "من هو المصور محمد العزب؟ | السيرة الذاتية" 
    : "About Lead Photographer Mohamed Elazab";
  
  const defaultDesc = isRTL
    ? "قصة شغف بالصورة والضوء. تعرف على المصور محمد العزب وفريقه المتخصص في توثيق أروع لحظات زفافكم بالمنصورة والدقهلية."
    : "The story of wedding photography lead Mohamed Elazab. Professional Nikon gear specifications and biography details.";

  const defaultKeywords = isRTL
    ? "من هو محمد العزب, سيرة ذاتية محمد العزب, مصور افراح المنصورة"
    : "Mohamed Elazab biography, Mansoura camera gear, wedding photographer biography";

  const seoData = getPageSeo(
    settings,
    'about',
    {
      title: defaultTitle,
      description: defaultDesc,
      keywords: defaultKeywords,
      ogImage: aboutImg,
      canonicalUrl: "https://elazab-photography-9812a.web.app/about"
    },
    isRTL
  );

  const canonicalUrl = "https://elazab-photography-9812a.web.app/about";

  // Structured Biography Schema for Search Engines
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": seoData.title,
    "description": seoData.description,
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "Person",
      "name": "Mohamed Elazab",
      "jobTitle": "Professional Photographer",
      "worksFor": {
        "@type": "LocalBusiness",
        "name": "Mohamed Elazab Photography"
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={seoData.ogImage} />
        <meta property="og:locale" content={isRTL ? "ar_EG" : "en_US"} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.ogImage} />

        {/* Structured Schema */}
        <script type="application/ld+json">
          {JSON.stringify(aboutSchema)}
        </script>
      </Helmet>

      <div className="pt-20">
        <About
          t={t}
          colors={colors}
          isDark={isDark}
          isRTL={isRTL}
          aboutImg={aboutImg}
        />
      </div>
    </>
  );
}
