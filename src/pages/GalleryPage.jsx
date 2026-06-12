import { Helmet } from 'react-helmet-async';
import Gallery from '../sections/Gallery';
import { getPageSeo } from '../utils/seo';

/**
 * Dedicated Gallery page view.
 */
export default function GalleryPage({
  isRTL,
  gallery,
  colors,
  settings
}) {
  const defaultTitle = isRTL 
    ? "معرض الصور الفنية | محمد العزب فوتوغرافي" 
    : "Art Photography Gallery | Mohamed Elazab Photography";
  
  const defaultDesc = isRTL
    ? "تصفح الصور الإبداعية وحكايات الحب التي قمنا بتوثيقها. معرض لصور حفلات الزفاف، الخطوبة، والبورتريهات في المنصورة."
    : "Explore Timeless wedding captures, outdoor shoots, and creative portraits by Mohamed Elazab. Real moments frozen in beautiful style.";

  const defaultKeywords = isRTL
    ? "معرض صور محمد العزب, صور زفاف المنصورة, تصوير فوتوغرافي المنصورة"
    : "Mohamed Elazab gallery, Mansoura wedding photos, wedding photo shoot portfolio";

  const seoData = getPageSeo(
    settings,
    'gallery',
    {
      title: defaultTitle,
      description: defaultDesc,
      keywords: defaultKeywords,
      ogImage: gallery?.[0]?.src || '',
      canonicalUrl: "https://elazab-photography-9812a.web.app/gallery"
    },
    isRTL
  );

  const canonicalUrl = "https://elazab-photography-9812a.web.app/gallery";

  // Structured Image Gallery Schema for SEO
  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": seoData.title,
    "description": seoData.description,
    "url": canonicalUrl,
    "creator": {
      "@type": "Person",
      "name": "Mohamed Elazab"
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
          {JSON.stringify(gallerySchema)}
        </script>
      </Helmet>

      <div className="pt-20">
        <Gallery
          isRTL={isRTL}
          gallery={gallery}
          colors={colors}
        />
      </div>
    </>
  );
}
