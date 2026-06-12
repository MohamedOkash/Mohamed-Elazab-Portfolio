import Reveal from '../components/animations/Reveal';

export default function Packages({
  isRTL,
  packages = [],
  extrasData = [],
  termsData = [],
  colors
}) {
  // Filter visible packages and sort by display order ascending
  const displayPackages = [...packages]
    .filter((pkg) => pkg.isVisible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="packages" className="py-32 px-6 md:px-12 max-w-screen-xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="text-center mb-24">
        <Reveal type="fade-up">
          <h2 className="text-theme-accent text-xs tracking-[0.3em] uppercase mb-4">
            {isRTL ? 'الباقات الاستثمارية' : 'Pricing & Investment'}
          </h2>
        </Reveal>
        <Reveal type="mask-up">
          <h3
            className={`text-4xl md:text-5xl font-light mb-6 ${colors.textMain}`}
            style={{ fontFamily: 'serif' }}
          >
            {isRTL ? 'الاستثمار في ذكرياتك' : 'Invest in Memories'}
          </h3>
        </Reveal>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-24">
        {displayPackages.map((inv, idx) => {
          const title = isRTL ? (inv.titleAr || inv.title) : (inv.titleEn || inv.title);
          const desc = isRTL ? inv.descAr : inv.descEn;
          const features = isRTL ? (inv.featuresAr || inv.features || []) : (inv.featuresEn || inv.features || []);
          const promoLabel = isRTL ? (inv.promotion?.labelAr || 'عرض مميز') : (inv.promotion?.labelEn || 'Featured Package');
          const isFeatured = inv.isFeatured === true;

          return (
            <Reveal key={inv.id || idx} type="fade-up" delay={idx * 100}>
              <div
                className={`group relative border-sweep border ${
                  isFeatured 
                    ? 'border-theme-accent shadow-[0_0_30px_rgba(var(--accent-rgb,216,163,157),0.15)] scale-[1.02]' 
                    : colors.border
                } hover:border-theme-accent/60 transition-all duration-700 ${colors.cardBg} flex flex-col h-full overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)] rounded-lg`}
              >
                {/* Banner Promotion */}
                {inv.promotion?.enabled && (
                  <div className="absolute z-20 inset-x-0 top-0 bg-theme-accent px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-black">
                    {promoLabel}
                  </div>
                )}

                {/* Cover Image */}
                {inv.coverImage ? (
                  <div className="h-52 w-full overflow-hidden relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10"></div>
                    <img 
                      src={inv.coverImage} 
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
                      alt={title} 
                      loading="lazy"
                    />
                  </div>
                ) : (
                  // Spacer when no cover image but promotion is enabled
                  inv.promotion?.enabled && <div className="h-10 w-full flex-shrink-0"></div>
                )}

                {/* Gold corner accent on hover */}
                <div
                  className={`absolute top-0 ${
                    isRTL ? 'left-0 border-l' : 'right-0 border-r'
                  } w-12 h-12 border-t border-theme-accent opacity-0 group-hover:opacity-100 transition-all duration-700 z-20`}
                ></div>

                {/* Content Padding */}
                <div className="p-8 md:p-10 flex flex-col flex-grow">
                  <h4 className="text-xl md:text-2xl font-light mb-3 uppercase tracking-widest text-theme-accent">
                    {title}
                  </h4>

                  {desc && (
                    <p className={`text-xs ${colors.textMuted} font-light leading-relaxed mb-6`}>
                      {desc}
                    </p>
                  )}

                  {/* Price & Currency */}
                  <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-8 border-b ${colors.border} pb-8 mt-auto`}>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-4xl md:text-5xl font-light ${colors.textMain}`} dir="ltr">
                        {inv.price}
                      </span>
                      <span className={`${colors.textMuted} text-xs uppercase tracking-widest`}>
                        {isRTL ? 'ج.م' : 'EGP'}
                      </span>
                    </div>

                    {inv.oldPrice && (
                      <div className="flex items-baseline gap-1 line-through text-zinc-500 text-sm md:text-base">
                        <span>{inv.oldPrice}</span>
                        <span className="text-[10px] uppercase">{isRTL ? 'ج.م' : 'EGP'}</span>
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-4">
                    {features.map((feat, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-3.5 ${colors.textMuted} font-light text-xs leading-relaxed`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-theme-accent mt-1.5 opacity-70 flex-shrink-0"></span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Extras & Terms */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 pt-16 border-t ${colors.border}`}>
        {/* Extras Column */}
        <Reveal type="fade-up">
          <div>
            <h4
              className="text-2xl font-light mb-8 text-theme-accent"
            >
              {isRTL ? 'خدمات إضافية' : 'Extra Services'}
            </h4>
            <div className="space-y-4">
              {extrasData.map((extra, idx) => (
                <div key={idx} className={`flex justify-between items-center border-b ${colors.border} pb-4`}>
                  <span className={`${colors.textMuted} font-light text-sm`}>{extra.title}</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-xl font-light ${colors.textMain}`} dir="ltr">
                      {extra.price}
                    </span>
                    <span className={`${colors.textMuted} text-xs`}>
                      {isRTL ? 'ج.م' : 'EGP'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Terms Column */}
        <Reveal type="fade-up" delay={150}>
          <div className={`${colors.cardBg} p-8 border ${colors.border} rounded-lg`}>
            <h4
              className={`text-2xl font-light mb-8 ${colors.textMain}`}
            >
              {isRTL ? 'شروط التعاقد' : 'Terms & Conditions'}
            </h4>
            <ul className="space-y-4">
              {termsData.map((term, idx) => (
                <li
                  key={idx}
                  className={`flex items-start gap-3.5 ${colors.textMuted} font-light text-xs leading-relaxed`}
                >
                  <span className="text-theme-accent mt-0.5 text-[10px]">◆</span>
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
