import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

/**
 * Premium 404 fallback page matching the luxury theme.
 */
export default function NotFoundPage({ colors, isRTL, isDark }) {
  const pageTitle = isRTL ? "الصفحة غير موجودة | 404" : "Page Not Found | 404";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 font-cairo">
        <span className="text-8xl md:text-[9.5rem] font-serif font-light text-theme-accent/35 tracking-widest leading-none mb-4">
          404
        </span>
        
        <h1 className="text-2xl md:text-3xl font-light mb-4 text-theme-accent" style={{ fontFamily: 'serif' }}>
          {isRTL ? "عذراً، لم نجد هذه الصفحة" : "Page Not Found"}
        </h1>
        
        <p className={`${colors.textMuted} text-sm md:text-base max-w-md mb-12 font-light leading-relaxed`}>
          {isRTL 
            ? "ربما تم نقل الصفحة أو لم تعد متوفرة. يرجى التحقق من الرابط أو الانتقال للرئيسية." 
            : "The page you are looking for might have been removed or is temporarily unavailable."}
        </p>

        <Link
          to="/"
          className={`px-10 py-5 transition-colors duration-500 text-xs font-bold uppercase tracking-widest ${
            isDark ? 'bg-white text-black hover:bg-theme-accent hover:text-black' : 'bg-black text-white hover:bg-theme-accent hover:text-black'
          }`}
        >
          {isRTL ? "العودة للرئيسية" : "Back to Home"}
        </Link>
      </div>
    </>
  );
}
