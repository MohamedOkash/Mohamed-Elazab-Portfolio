import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import Reveal from '../components/animations/Reveal';

// Lazy load the actual heavy image grid and react-photo-view lightbox
const GalleryContent = lazy(() => import('./GalleryContent'));

export default function Gallery({
  isRTL,
  gallery,
  colors
}) {
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const sectionRef = useRef(null);

  const filteredGallery = gallery.filter(item => {
    if (activeCategory === 'all') return true;
    const cat = item.category || item.cat || '';
    return cat === activeCategory;
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // start loading before the user scrolls completely down to it
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} id="gallery" className="py-32 bg-transparent relative z-10">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 px-4 gap-8">
          <div>
            <Reveal type="fade-up">
              <h2 className="text-theme-accent text-xs tracking-[0.3em] uppercase mb-4">
                {isRTL ? 'الأعمال المختارة' : 'Selected Works'}
              </h2>
            </Reveal>
            <Reveal type="mask-up">
              <h3
                className={`text-4xl md:text-6xl font-light ${colors.textMain}`}
                style={{ fontFamily: 'serif' }}
              >
                {isRTL ? 'المعرض الفني' : 'Art Gallery'}
              </h3>
            </Reveal>
          </div>

          {/* Filters */}
          <Reveal type="fade-up" delay={100} className="w-full md:w-auto">
            <div className="flex flex-wrap gap-2 md:justify-end">
              {[
                { id: 'all', ar: 'الكل', en: 'All' },
                { id: 'wedding_halls', ar: 'قاعات الزفاف', en: 'Wedding Halls' },
                { id: 'beach_sessions', ar: 'جلسات البحر', en: 'Beach Sessions' },
                { id: 'outdoor_sessions', ar: 'جلسات خارجية', en: 'Outdoor Sessions' },
                { id: 'studio_sessions', ar: 'جلسات الاستوديو', en: 'Studio Sessions' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider rounded-full transition-all duration-300 border focus:outline-none ${
                    activeCategory === cat.id 
                      ? 'bg-theme-accent text-black border-theme-accent' 
                      : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-theme-accent hover:text-white'
                  }`}
                >
                  {isRTL ? cat.ar : cat.en}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Dynamic content rendering based on visibility */}
        {hasBeenVisible ? (
          <Suspense fallback={
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredGallery.slice(0, 6).map((item, idx) => (
                <div key={idx} className={`animate-pulse ${colors.cardBg} w-full h-80 rounded-lg`} />
              ))}
            </div>
          }>
            <GalleryContent gallery={filteredGallery} colors={colors} isRTL={isRTL} />
          </Suspense>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredGallery.slice(0, 6).map((item, idx) => (
              <div key={idx} className={`${colors.cardBg} w-full h-80 rounded-lg opacity-10`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
