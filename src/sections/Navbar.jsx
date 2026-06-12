import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Sun, Moon, X, Menu } from 'lucide-react';

export default function Navbar({
  lang,
  setLang,
  theme,
  setTheme,
  mobileMenuOpen,
  setMobileMenuOpen,
  isScrolled,
  isAdmin,
  colors,
  isRTL
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const [hidden, setHidden] = useState(false);
  const logoClicksRef = useRef(0);



  const handleThemeChange = useCallback(() => {
    setTheme((prev) => (prev === 'luxury-black-gold' ? 'luxury-ivory-gold' : 'luxury-black-gold'));
  }, [setTheme]);

  const handleLogoClick = useCallback((e) => {
    logoClicksRef.current += 1;
    const currentClicks = logoClicksRef.current;
    if (currentClicks === 1) {
      setTimeout(() => {
        logoClicksRef.current = 0;
      }, 2500);
    }
    if (currentClicks >= 3) {
      e.preventDefault();
      logoClicksRef.current = 0;
      navigate('/studio');
    }
  }, [navigate]);

  // Scroll hide/show listener optimized with requestAnimationFrame
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDir = () => {
      const currentScrollY = window.scrollY;

      // Check if scroll difference is significant to avoid noise
      if (Math.abs(currentScrollY - lastScrollY) > 8) {
        if (currentScrollY > lastScrollY && currentScrollY > 120 && !mobileMenuOpen) {
          setHidden(true);
        } else {
          setHidden(false);
        }
        lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  // Close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, setMobileMenuOpen]);

  const navItems = useMemo(() => [
    { path: '/', labelAr: 'الرئيسية', labelEn: 'Home' },
    { path: '/gallery', labelAr: 'المعرض', labelEn: 'Gallery' },
    { path: '/packages', labelAr: 'الباقات', labelEn: 'Packages' },
    { path: '/about', labelAr: 'عن المصور', labelEn: 'About' },
    { path: '/contact', labelAr: 'التواصل', labelEn: 'Contact' }
  ], []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, [setMobileMenuOpen]);

  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, [setLang]);

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled
            ? `${colors.navBg} py-4 border-b ${colors.border} shadow-sm`
            : 'bg-transparent py-8'
        } ${isAdmin ? 'top-10' : 'top-0'}`}
        style={{ willChange: 'transform' }}
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex justify-between items-center">
          
          {/* Logo Link with click interceptor */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex flex-col items-start cursor-pointer group"
            aria-label="M. Elazab Photography Logo"
          >
            <span
              className={`text-2xl font-light tracking-widest uppercase ${colors.textMain} transition-colors group-hover:text-theme-accent`}
              style={{ fontFamily: 'serif' }}
            >
              M. ELAZAB
            </span>
            <span className="text-[0.65rem] tracking-[0.3em] text-theme-accent mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
              PHOTOGRAPHY
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-xs uppercase tracking-[0.2em] relative py-1 transition-colors duration-300 ${
                    isActive ? 'text-theme-accent' : `${colors.textMuted} hover:text-theme-accent`
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{isRTL ? item.labelAr : item.labelEn}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activeDot"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-theme-accent rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-4 border-x border-zinc-500/30 px-6 font-sans">
              <button
                onClick={toggleLanguage}
                className={`${colors.textMuted} hover:text-theme-accent transition-transform hover:rotate-180 duration-500 cursor-pointer`}
                aria-label={isRTL ? 'Change language to English' : 'تغيير اللغة للعربية'}
              >
                <Globe size={18} />
              </button>

              <button
                onClick={handleThemeChange}
                className={`${colors.textMuted} hover:text-theme-accent transition-all duration-500 hover:scale-110 cursor-pointer flex items-center justify-center`}
                title={`Theme: ${theme === 'luxury-black-gold' ? (isRTL ? 'المظهر المظلم الذهبي' : 'Luxury Black Gold') : (isRTL ? 'المظهر العاجي الذهبي' : 'Luxury Ivory Gold')}`}
                aria-label="Change Theme"
              >
                {theme === 'luxury-black-gold' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-zinc-300 hover:text-theme-accent transition-colors focus:outline-none cursor-pointer"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer (with AnimatePresence) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed inset-0 ${colors.navBg} z-40 flex flex-col justify-center items-center`}
          >
            <div className="flex flex-col gap-8 items-center text-center">
              {navItems.map((item, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.path}
                >
                  <NavLink
                    to={item.path}
                    onClick={toggleMobileMenu}
                    className={({ isActive }) =>
                      `text-2xl font-light tracking-wider block ${
                        isActive ? 'text-theme-accent' : `${colors.textMain} hover:text-theme-accent`
                      }`
                    }
                  >
                    {isRTL ? item.labelAr : item.labelEn}
                  </NavLink>
                </motion.div>
              ))}

              {/* Mobile Actions */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
                className="flex items-center gap-6 mt-8 border-t border-zinc-500/20 pt-6 w-full justify-center"
              >
                <button
                  onClick={() => {
                    toggleLanguage();
                    setMobileMenuOpen(false);
                  }}
                  className={`${colors.textMain} hover:text-theme-accent flex items-center gap-2 text-sm cursor-pointer`}
                >
                  <Globe size={18} />
                  {lang === 'ar' ? 'English' : 'العربية'}
                </button>

                <button
                  onClick={() => {
                    handleThemeChange();
                    setMobileMenuOpen(false);
                  }}
                  className={`${colors.textMain} hover:text-theme-accent flex items-center gap-2 text-sm cursor-pointer`}
                >
                  {theme === 'luxury-black-gold' ? (
                    <>{isRTL ? '👑 المظهر المظلم الذهبي' : '👑 Luxury Black Gold'}</>
                  ) : (
                    <>{isRTL ? '🤍 المظهر العاجي الذهبي' : '🤍 Luxury Ivory Gold'}</>
                  )}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
