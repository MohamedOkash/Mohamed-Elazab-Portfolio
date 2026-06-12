import { Camera } from 'lucide-react';
import Reveal from '../components/animations/Reveal';
import EditableText from '../components/EditableText';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { getOptimizedImageUrl, getPlaceholderImageUrl } from '../utils/imageHelper';

export default function About({
  t,
  colors,
  isDark,
  isRTL,
  aboutImg
}) {
  const placeholderAboutImg = getPlaceholderImageUrl(aboutImg);

  return (
    <section
      id="about"
      className="py-32 px-6 md:px-12 max-w-screen-xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-center relative z-10"
    >
      {/* Bio Image */}
      <div className="md:w-1/2 relative group w-full">
        <Reveal type="image-reveal" delay={200}>
          <div
            className={`absolute -inset-4 border ${colors.border} ${
              isRTL ? '-translate-x-4' : 'translate-x-4'
            } -translate-y-4 transition-colors duration-500`}
          ></div>
          <div className="overflow-hidden relative h-[600px] w-full">
            <ImageWithSkeleton
              src={getOptimizedImageUrl(aboutImg, 1200, 85)}
              placeholderSrc={placeholderAboutImg}
              alt={isRTL ? "معلومات عن المصور محمد العزب" : "About Mohamed Elazab"}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
          </div>
        </Reveal>
      </div>

      {/* Bio Content */}
      <div className="md:w-1/2">
        <Reveal type="fade-up" delay={100}>
          <EditableText
            text={t.about.subtitle}
            tagName="h2"
            className="text-theme-accent text-xs tracking-[0.3em] uppercase mb-6 block"
          />
        </Reveal>

        <Reveal type="mask-up" delay={200}>
          <h3
            className={`text-4xl md:text-5xl font-light mb-2 leading-tight ${colors.textMain}`}
            style={{ fontFamily: 'serif' }}
          >
            <EditableText
              text={t.about.title}
              tagName="span"
            />
          </h3>
        </Reveal>

        <Reveal type="mask-up" delay={300}>
          <h3
            className={`text-4xl md:text-5xl font-light mb-8 leading-tight ${colors.textMain}`}
            style={{ fontFamily: 'serif' }}
          >
            <EditableText
              text={t.about.titleBr}
              tagName="span"
            />
          </h3>
        </Reveal>

        <Reveal type="fade-up" delay={400}>
          <div className={`w-12 h-[1px] ${isDark ? 'bg-zinc-700' : 'bg-zinc-300'} mb-8`}></div>
          
          <div className="mb-10">
            <EditableText
              text={t.about.desc}
              tagName="p"
              className={`${colors.textMuted} text-lg leading-relaxed font-light`}
            />
          </div>

          {/* Camera Gear specs */}
          <div className="mb-10">
            <h4 className="text-theme-accent text-xs tracking-[0.2em] uppercase mb-4">
              {isRTL ? 'معدات التصوير الاحترافية' : 'Professional Gear'}
            </h4>
            <div className="flex flex-wrap gap-3">
              <span
                className={`px-4 py-2 border ${colors.border} ${colors.textMuted} text-xs tracking-widest ${colors.cardBg} flex items-center gap-2`}
              >
                <Camera size={14} className="text-theme-accent" /> Nikon System
              </span>
              <span
                className={`px-4 py-2 border ${colors.border} ${colors.textMuted} text-xs tracking-widest ${colors.cardBg}`}
              >
                Lens 50mm f/1.4 Z
              </span>
              <span
                className={`px-4 py-2 border ${colors.border} ${colors.textMuted} text-xs tracking-widest ${colors.cardBg}`}
              >
                Lens 24-70mm
              </span>
            </div>
          </div>

          <h4 className={`text-2xl ${colors.textMain} mb-2`}>
            Mohamed Elazab
          </h4>
          <span className={`${colors.textMuted} text-sm tracking-widest uppercase`}>
            {isRTL ? 'المؤسس والمصور الرئيسي' : 'Lead Photographer'}
          </span>
        </Reveal>
      </div>
    </section>
  );
}
