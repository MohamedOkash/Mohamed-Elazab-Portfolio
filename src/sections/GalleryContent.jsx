import { useState, useEffect } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { sanitizeUrl } from '../utils/security';
import { getImageTiers } from '../utils/imageHelper';
import { MapPin, ExternalLink as Instagram } from 'lucide-react';

// Import react-photo-view styles
import 'react-photo-view/dist/react-photo-view.css';

export default function GalleryContent({ gallery, isRTL }) {
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    // Render only first 12 images initially, then load remaining progressively
    if (gallery.length > 12) {
      if ('requestIdleCallback' in window) {
        const handle = requestIdleCallback(() => {
          setVisibleCount(gallery.length);
        }, { timeout: 2000 });
        return () => cancelIdleCallback(handle);
      } else {
        const timer = setTimeout(() => {
          setVisibleCount(gallery.length);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [gallery.length]);

  const visibleGallery = gallery.slice(0, visibleCount);

  // Group by location
  const groupedGallery = visibleGallery.reduce((acc, item) => {
    const loc = isRTL ? (item.locationAr || 'عام') : (item.locationEn || 'General');
    if (!acc[loc]) acc[loc] = [];
    acc[loc].push(item);
    return acc;
  }, {});

  return (
    <PhotoProvider
      speed={() => 400}
      easing={(type) => (type === 2 ? 'cubic-bezier(0.16, 1, 0.3, 1)' : 'cubic-bezier(0.16, 1, 0.3, 1)')}
      maskOpacity={0.95}
    >
      <div className="space-y-16">
        {Object.entries(groupedGallery).map(([location, items]) => (
          <div key={location}>
            {/* Group Header */}
            <div className="mb-8 border-b border-zinc-800 pb-4 flex justify-between items-end">
              <div className="flex items-center gap-2 text-theme-accent">
                <MapPin size={24} />
                <h4 className="text-2xl font-light tracking-wide">{location}</h4>
              </div>
              <span className="text-zinc-500 text-sm">
                ({items.length} {isRTL ? 'صور' : 'Photos'})
              </span>
            </div>

            {/* Masonry Columns Layout */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {items.map((item, idx) => {
                const imageTiers = getImageTiers(item);
                const title = isRTL ? item.titleAr : item.titleEn;
                console.log('Gallery Item Render:', { item, imageTiers });

                const content = (
                  <div className="w-full h-full relative cursor-pointer group">
                    <ImageWithSkeleton
                      src={imageTiers.medium}
                      placeholderSrc={imageTiers.placeholder}
                      alt={title || (isRTL ? "صورة المعرض" : "Gallery photo")}
                      className="w-full h-auto object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-6 z-20 pointer-events-none">
                      {title && (
                        <span className="text-white text-lg font-medium tracking-wide mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-[0.6s] ease-[cubic-bezier(0.16,1,0.3,1)]">
                          {title}
                        </span>
                      )}
                      {item.instagramLink && (
                        <span className="inline-flex items-center gap-2 text-theme-accent text-xs uppercase tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-[0.8s] ease-[cubic-bezier(0.16,1,0.3,1)] delay-75">
                          <Instagram size={14} />
                          {isRTL ? 'عرض على انستجرام' : 'View on Instagram'}
                        </span>
                      )}
                    </div>
                  </div>
                );

                return (
                  <div key={item.id || idx} className="break-inside-avoid relative overflow-hidden rounded-lg bg-zinc-950/20">
                      {item.instagramLink ? (
                        <a href={sanitizeUrl(item.instagramLink)} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                          {content}
                        </a>
                      ) : (
                        <PhotoView src={imageTiers.large}>
                          {content}
                        </PhotoView>
                      )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </PhotoProvider>
  );
}
