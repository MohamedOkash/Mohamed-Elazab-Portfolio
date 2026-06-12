import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useScroll, useTransform, motion } from 'framer-motion';
import Reveal from '../components/animations/Reveal';
import EditableText from '../components/EditableText';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { getPlaceholderImageUrl } from '../utils/imageHelper';
import {
  getCachedHeroUrl,
  getResponsiveHeroUrls,
  refreshHeroCache,
} from '../utils/heroImageHelper';

export default function Hero({
  t,
  colors,
  isDark,
  isRTL,
  isAdmin,
  scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  },
  heroBg,
  heroRevision,
}) {
  const heroUrl = useMemo(() => {
    if (typeof heroBg === 'string' && heroBg.trim() !== '') {
      return heroBg;
    }
    return getCachedHeroUrl();
  }, [heroBg]);

  const responsiveUrls = useMemo(() => {
    return getResponsiveHeroUrls(heroUrl);
  }, [heroUrl]);

  const placeholderSrc = useMemo(() => {
    return getPlaceholderImageUrl(heroUrl);
  }, [heroUrl]);

  useEffect(() => {
    if (heroUrl) {
      refreshHeroCache(heroUrl, heroRevision);
    }
  }, [heroUrl, heroRevision]);

  // High-performance compositor scroll parallax using Framer Motion
  const { scrollY: pageScrollY } = useScroll();
  const yParallax = useTransform(pageScrollY, [0, 1000], [0, 350]);

  return (
    <section
      id="home"
      className={`relative min-h-screen lg:h-screen w-full flex flex-col justify-center items-center pb-16 overflow-hidden ${isAdmin ? 'pt-[180px] lg:pt-[220px]' : 'pt-[140px] lg:pt-[180px]'}`}
    >
      <Helmet>
        {responsiveUrls?.desktop && (
          <link
            rel="preload"
            as="image"
            href={responsiveUrls.desktop}
            imageSrcSet={responsiveUrls.isUnsplash ? `${responsiveUrls.mobile} 400w, ${responsiveUrls.tablet} 1200w, ${responsiveUrls.desktop} 2000w` : undefined}
            imageSizes={responsiveUrls.isUnsplash ? "100vw" : undefined}
          />
        )}
      </Helmet>

      {/* Parallax Background using motion.div */}
      <motion.div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          y: yParallax,
          willChange: 'transform'
        }}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-b ${
            isDark
              ? 'from-black/80 via-black/40 to-theme-bg'
              : 'from-black/60 to-theme-bg'
          } z-10 transition-colors duration-700`}
        />

        {responsiveUrls?.desktop ? (
          responsiveUrls.isUnsplash ? (
            <ImageWithSkeleton
              src={responsiveUrls.desktop}
              srcSet={`${responsiveUrls.mobile} 400w, ${responsiveUrls.tablet} 1200w, ${responsiveUrls.desktop} 2000w`}
              sizes="100vw"
              placeholderSrc={placeholderSrc || undefined}
              alt="Hero background"
              loading="eager"
              className="w-full h-full opacity-90 scale-110 animate-[heroZoom_30s_ease-out_forwards]"
            />
          ) : (
            <img
              src={responsiveUrls.desktop}
              alt="Hero background"
              className="w-full h-full object-cover opacity-90 scale-110 animate-[heroZoom_30s_ease-out_forwards]"
              loading="eager"
            />
          )
        ) : null}
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-20 text-center flex flex-col items-center px-4 max-w-4xl mx-auto mt-0">
        <Reveal type="fade-up" delay={100}>
          <EditableText
            text={t.hero.subtitle}
            tagName="span"
            className="text-theme-accent text-sm md:text-base tracking-[0.3em] uppercase mb-6 drop-shadow-lg font-medium block"
          />
        </Reveal>

        <Reveal type="mask-up" delay={300}>
          <h1
            className={`text-5xl md:text-7xl lg:text-[7.5rem] font-light ${colors.textMain} mb-2 leading-tight drop-shadow-2xl font-serif`}
          >
            <EditableText
              text={t.hero.title}
              tagName="span"
            />
          </h1>
        </Reveal>

        <Reveal type="mask-up" delay={500}>
          <div className="mb-8 leading-tight drop-shadow-2xl">
            <EditableText
              text={t.hero.titleItalic}
              tagName="span"
              className="italic text-zinc-300 text-4xl md:text-6xl lg:text-[5.5rem] font-serif"
            />
          </div>
        </Reveal>

        <Reveal type="fade-up" delay={700}>
          <div className="max-w-2xl mx-auto mb-12">
            <EditableText
              text={t.hero.desc}
              tagName="p"
              className="text-zinc-200 text-base md:text-lg leading-relaxed font-light drop-shadow-md"
            />
          </div>

          <button
            onClick={() => scrollTo('gallery')}
            className="flex flex-col items-center gap-4 text-zinc-300 hover:text-theme-accent transition-all duration-300 group mx-auto cursor-pointer"
            aria-label="Scroll to gallery"
          >
            <span className="text-xs tracking-[0.2em] uppercase">
              {isRTL ? 'اكتشف أعمالنا' : 'Explore'}
            </span>

            <div className="w-8 h-12 border border-zinc-500/50 rounded-full flex justify-center p-2 group-hover:border-theme-accent transition-colors">
              <div className="w-1 h-2 bg-theme-accent rounded-full animate-scroll-down" />
            </div>
          </button>
        </Reveal>
      </div>
    </section>
  );
}