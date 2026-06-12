import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';
import SmoothScroll from './SmoothScroll';

/**
 * Main application shell layout.
 * Provides global smooth scrolling, sticky navigation, footer, and active route rendering.
 * Adds a top-bar manager screen if authenticated.
 */
export const MainLayout = ({
  lang,
  theme,
  setLang,
  setTheme,
  mobileMenuOpen,
  setMobileMenuOpen,
  isScrolled,
  isAdmin,
  setIsAdmin,
  scrollTo,
  colors,
  isRTL,
  isDark,
  handleLogout,
  settings
}) => {
  const location = useLocation();

  return (
    <SmoothScroll>
      {/* Top Admin Control Bar */}
      {isAdmin && (
        <div 
          className="fixed top-0 left-0 w-full h-10 bg-zinc-950 border-b border-theme-accent/30 z-[60] flex items-center justify-between px-6 text-[11px] text-zinc-300 font-cairo select-none"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-theme-accent animate-pulse"></span>
            <span className="font-semibold text-theme-accent">
              {isRTL ? 'بوابة الإدارة نشطة' : 'Admin Session Active'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/studio/dashboard" 
              className="bg-zinc-900 border border-zinc-800 hover:border-theme-accent hover:text-white transition-all px-3 py-1 rounded text-[10px]"
            >
              {isRTL ? 'لوحة التحكم' : 'CMS Dashboard'}
            </Link>
            
            <button 
              onClick={handleLogout}
              className="text-zinc-400 hover:text-red-400 transition-colors font-medium uppercase tracking-wider text-[10px] cursor-pointer"
            >
              {isRTL ? 'خروج' : 'Log Out'}
            </button>
          </div>
        </div>
      )}

      <div
        className={`min-h-screen ${colors.bg} ${colors.textMain} font-cairo selection:bg-theme-accent selection:text-black transition-colors duration-500 overflow-x-hidden ${
          isAdmin ? 'pt-10' : ''
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Navigation Bar */}
        <Navbar
          lang={lang}
          theme={theme}
          setLang={setLang}
          setTheme={setTheme}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          isScrolled={isScrolled}
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          scrollTo={scrollTo}
          colors={colors}
          isRTL={isRTL}
          isDark={isDark}
          handleLogout={handleLogout}
        />

        {/* Route Outlet with Premium Transition */}
        <main className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Global Footer */}
        <Footer
          colors={colors}
          isDark={isDark}
          isRTL={isRTL}
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          settings={settings}
        />
      </div>
    </SmoothScroll>
  );
};

export default MainLayout;
