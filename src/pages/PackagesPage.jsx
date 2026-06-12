import { Helmet } from 'react-helmet-async';
import Packages from '../sections/Packages';
import { getPageSeo } from '../utils/seo';

/**
 * Dedicated Packages and Investment page view.
 */
export default function PackagesPage({
  isRTL,
  packages,
  extrasData,
  termsData,
  colors,
  settings
}) {
  const defaultTitle = isRTL 
    ? "أسعار الباقات وعروض التصوير | محمد العزب فوتوغرافي" 
    : "Photography Packages & Pricing | Mohamed Elazab Photography";
  
  const defaultDesc = isRTL
    ? "تعرف على أسعار باقات تصوير الزفاف والخطوبة المناسبة لميزانيتك. عروض مميزة تشمل الألبومات الفاخرة وتغطية القاعة كاملة."
    : "Compare professional wedding photography packages and price sheets. Flexible options matching your requirements in Mansoura.";

  const defaultKeywords = isRTL
    ? "أسعار باقات التصوير, عروض تصوير زفاف المنصورة, أسعار الألبومات"
    : "Mohamed Elazab packages, Mansoura wedding shoot price, wedding albums pricing list";

  const seoData = getPageSeo(
    settings,
    'packages',
    {
      title: defaultTitle,
      description: defaultDesc,
      keywords: defaultKeywords,
      ogImage: packages?.[0]?.coverImage || '',
      canonicalUrl: "https://elazab-photography-9812a.web.app/packages"
    },
    isRTL
  );

  const canonicalUrl = "https://elazab-photography-9812a.web.app/packages";

  // Structured Service Package Schema for Search Engines
  const packagesSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": seoData.title,
    "description": seoData.description,
    "image": seoData.ogImage,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "EGP",
      "lowPrice": "3000",
      "highPrice": "15000",
      "offerCount": String(packages?.length || "5")
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
        {seoData.ogImage && <meta property="og:image" content={seoData.ogImage} />}
        <meta property="og:locale" content={isRTL ? "ar_EG" : "en_US"} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        {seoData.ogImage && <meta name="twitter:image" content={seoData.ogImage} />}

        {/* Structured Schema */}
        <script type="application/ld+json">
          {JSON.stringify(packagesSchema)}
        </script>
      </Helmet>

      <div className="pt-20">
        <Packages
          isRTL={isRTL}
          packages={packages}
          extrasData={extrasData}
          termsData={termsData}
          colors={colors}
        />
      </div>
    </>
  );
}
