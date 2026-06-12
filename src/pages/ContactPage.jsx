import { Helmet } from 'react-helmet-async';
import Contact from '../sections/Contact';
import { getPageSeo } from '../utils/seo';

/**
 * Dedicated Contact and Booking page view.
 */
export default function ContactPage({
  t,
  colors,
  isDark,
  isRTL,
  contactImg,
  settings
}) {
  const defaultTitle = isRTL 
    ? "احجز جلستك وتواصل معنا | محمد العزب فوتوغرافي" 
    : "Book Your Wedding Shoot | Contact Mohamed Elazab";
  
  const defaultDesc = isRTL
    ? "ابدأ التخطيط لتوثيق ليلة عمرك معنا. املأ نموذج الحجز أو تواصل مباشرة عبر واتساب لتأكيد موعد جلسة التصوير الخاصة بك."
    : "Reserve your date and verify slot availability. Contact Mohamed Elazab Studio in Dakahlia for bookings and schedules.";

  const defaultKeywords = isRTL
    ? "حجز جلسة تصوير, رقم تليفون محمد العزب فوتوغرافي, عنوان استوديو محمد العزب"
    : "Book wedding shoot Mansoura, Mohamed Elazab phone number, Elazab photography address";

  const seoData = getPageSeo(
    settings,
    'contact',
    {
      title: defaultTitle,
      description: defaultDesc,
      keywords: defaultKeywords,
      ogImage: contactImg,
      canonicalUrl: "https://elazab-photography-9812a.web.app/contact"
    },
    isRTL
  );

  const canonicalUrl = "https://elazab-photography-9812a.web.app/contact";

  // Structured Contact Page Schema for Search Engines
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": seoData.title,
    "description": seoData.description,
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "Mohamed Elazab Photography",
      "telephone": "+201016585901",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Mit Ghorab, Senbellawein",
        "addressRegion": "Dakahlia",
        "addressCountry": "EG"
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
          {JSON.stringify(contactSchema)}
        </script>
      </Helmet>

      <div className="pt-20">
        <Contact
          t={t}
          colors={colors}
          isDark={isDark}
          isRTL={isRTL}
          contactImg={contactImg}
          settings={settings}
        />
      </div>
    </>
  );
}
