import { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { getPageSeo } from '../utils/seo';

import Hero from '../sections/Hero';

const About = lazy(() => import('../sections/About'));
const Gallery = lazy(() => import('../sections/Gallery'));
const Packages = lazy(() => import('../sections/Packages'));
const Reviews = lazy(() => import('../sections/Reviews'));
const Contact = lazy(() => import('../sections/Contact'));

const SectionFallback = () => <div className="min-h-[40vh]" aria-hidden="true" />;

/**
 * Home page rendering the full premium photography portfolio sections.
 */
export default function Home({
  t,
  colors,
  scrollY,
  isDark,
  isRTL,
  isAdmin,
  scrollTo,
  data
}) {
  const defaultTitle = isRTL 
    ? "مصور افراح بالمنصورة | محمد العزب فوتوغرافي" 
    : "Mansoura Wedding Photographer | Mohamed Elazab Photography";
  
  const defaultDesc = isRTL
    ? "استمتع بتجربة تصوير زفاف فاخرة مع محمد العزب. نوثق تفاصيل فرحتكم في المنصورة والدقهلية بصور تنبض بالحياة والمشاعر الصادقة."
    : "Capture your lifetime moments with premium wedding photography in Mansoura by Mohamed Elazab. Emotional, elegant, and timeless wedding memories.";

  const defaultKeywords = isRTL
    ? "محمد العزب, مصور زفاف, مصور المنصورة, تصوير فوتوغرافي, استوديو تصوير"
    : "Mohamed Elazab, Wedding Photography, Mansoura Photographer";

  const seoData = getPageSeo(
    data.settings,
    'home',
    {
      title: defaultTitle,
      description: defaultDesc,
      keywords: defaultKeywords,
      ogImage: data.gallery?.[0]?.src || '',
      canonicalUrl: "https://elazab-photography-9812a.web.app/"
    },
    isRTL
  );

  const canonicalUrl = "https://elazab-photography-9812a.web.app/";

  // Local Business JSON-LD Schema
  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mohamed Elazab Photography",
    "image": seoData.ogImage || data.gallery?.[0]?.src || "",
    "priceRange": "$$",
    "telephone": "+201016585901",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mit Ghorab, Senbellawein",
      "addressRegion": "Dakahlia",
      "addressCountry": "EG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "30.8872",
      "longitude": "31.4285"
    },
    "url": canonicalUrl,
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "16:00",
      "closes": "23:00"
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
          {JSON.stringify(schemaJson)}
        </script>
      </Helmet>

      {/* Hero */}
      <Hero
        t={t}
        colors={colors}
        scrollY={scrollY}
        isDark={isDark}
        isRTL={isRTL}
        isAdmin={isAdmin}
        scrollTo={scrollTo}
        heroBg={data.settings?.heroImageUrl || data.gallery?.[0]?.src || ''}
        heroRevision={data.settings?.heroImageUpdatedAt || ''}
      />

      <Suspense fallback={<SectionFallback />}>
        <About
          t={t}
          colors={colors}
          isDark={isDark}
          isRTL={isRTL}
          aboutImg={data.gallery?.[2]?.mediumUrl || data.gallery?.[2]?.src || ''}
        />
        <Gallery isRTL={isRTL} gallery={data.gallery || []} colors={colors} />
        <Packages
          isRTL={isRTL}
          packages={data.packages || []}
          extrasData={t.extrasData}
          termsData={t.termsData}
          colors={colors}
        />
        <Reviews t={t} colors={colors} isDark={isDark} testimonials={data.testimonials || []} isRTL={isRTL} />
        <Contact
          t={t}
          colors={colors}
          isDark={isDark}
          isRTL={isRTL}
          contactImg={data.gallery?.[4]?.mediumUrl || data.gallery?.[4]?.src || ''}
          settings={data.settings}
        />
      </Suspense>
    </>
  );
}
