import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { isFirebaseConfigured } from './firebase/firebaseEnv';
import { getInitialData, getLocalizedContent } from './data/content';
import ErrorBoundary from './components/ErrorBoundary';
import MainLayout from './layouts/MainLayout';
import { trackPageView } from './utils/analytics';

const Home = lazy(() => import('./pages/Home'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const PackagesPage = lazy(() => import('./pages/PackagesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const StudioDashboard = lazy(() => import('./pages/StudioDashboard'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

/**
 * Route guard to prevent unauthorized access to dashboard.
 */
function ProtectedRoute({ children, isAdmin, loading }) {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-8 h-8 border-2 border-zinc-800 border-[#d4af37] rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}

/**
 * Lazy loading placeholder indicator.
 */
function PageLoader({ isDark }) {
  return (
    <div className={`min-h-[70vh] flex items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-[#f8f9fa]'}`}>
      <div className="w-8 h-8 border-2 border-zinc-800 border-t-[#d4af37] rounded-full animate-spin"></div>
    </div>
  );
}

/**
 * Helper component to scroll window to top on route navigation.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(pathname);
  }, [pathname]);
  return null;
}

export default function App() {
  const [data, setData] = useState(() => getInitialData());
  const [dbLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState('ar');
  const mapTheme = (t) => {
    if (t === 'gold' || t === 'dark' || t === 'dark-luxury' || t === 'rose-gold-luxury' || t === 'gold-luxury' || t === 'luxury-black-gold') {
      return 'luxury-black-gold';
    }
    if (t === 'light' || t === 'light-luxury' || t === 'ivory-luxury' || t === 'luxury-ivory-gold') {
      return 'luxury-ivory-gold';
    }
    return 'luxury-black-gold';
  };

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('elazab_site_data_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.settings?.theme) return mapTheme(parsed.settings.theme);
      }
    } catch {
      return 'luxury-black-gold';
    }
    return 'luxury-black-gold';
  });

  // Keep HTML class in sync with theme
  useEffect(() => {
    const root = document.documentElement;
    const mappedTheme = mapTheme(theme);
    
    root.classList.remove(
      'dark', 'light', 'gold',
      'gold-luxury', 'dark-luxury', 'light-luxury',
      'rose-gold-luxury', 'ivory-luxury',
      'luxury-black-gold', 'luxury-ivory-gold'
    );
    root.classList.add(mappedTheme);
    root.setAttribute('data-theme', mappedTheme);

    // Set colors dynamically based on theme/accent defaults
    let defaultAccent = '#d4af37';
    if (mappedTheme === 'luxury-ivory-gold') {
      defaultAccent = '#c5a880';
    }

    const customAccent = data.settings?.accentColor;
    if (customAccent) {
      root.style.setProperty('--accent', customAccent);
      root.style.setProperty('--accent-hover', customAccent);
    } else {
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-hover');
    }

    root.style.setProperty('--color-luxury-gold', customAccent || defaultAccent);
  }, [theme, data.settings?.accentColor]);

  const t = getLocalizedContent(data, lang);
  
  const mappedTheme = mapTheme(theme);
  const isDark = mappedTheme !== 'light-luxury' && mappedTheme !== 'ivory-luxury';
  const isRTL = lang === 'ar';

  // Sync document dir and lang attributes
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  // Fetch site data from collections on mount in background
  useEffect(() => {
    import('./firebase/dbHelper')
      .then(({ fetchSiteData }) => fetchSiteData())
      .then((mergedData) => {
        setData(mergedData);
        if (mergedData.settings?.theme) {
          setTheme(mapTheme(mergedData.settings.theme));
        }
      })
      .catch((err) => {
        console.error("Failed to load initial site data:", err);
      });
  }, []);

  // Listen to Firebase Auth state changes conditionally to optimize initial bundle
  useEffect(() => {
    const isDashboard = window.location.pathname.startsWith('/studio');
    const hasAdminSession = localStorage.getItem('elazab_admin_logged_in') === 'true';

    if (isFirebaseConfigured && (isDashboard || hasAdminSession)) {
      let unsubscribe = () => {};
      Promise.all([
        import('./firebase/authClient'),
        import('firebase/auth')
      ]).then(([{ getAuthClient }, { onAuthStateChanged }]) => {
        getAuthClient().then((auth) => {
          if (auth) {
            unsubscribe = onAuthStateChanged(auth, (user) => {
              const loggedIn = Boolean(user);
              setIsAdmin(loggedIn);
              if (loggedIn) {
                localStorage.setItem('elazab_admin_logged_in', 'true');
              } else {
                localStorage.removeItem('elazab_admin_logged_in');
              }
            });
          }
        });
      });
      return () => unsubscribe();
    } else {
      // Local/offline fallback using session storage
      const checkDemoAuth = () => {
        const demoAuth = sessionStorage.getItem('elazab_demo_auth') === 'true';
        setIsAdmin(demoAuth);
      };
      checkDemoAuth();
      const interval = setInterval(checkDemoAuth, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  // Monitor scroll height for header transparency changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    if (isFirebaseConfigured) {
      const [{ getAuthClient }, { signOut }] = await Promise.all([
        import('./firebase/authClient'),
        import('firebase/auth')
      ]);
      const auth = await getAuthClient();
      if (auth) {
        await signOut(auth);
        localStorage.removeItem('elazab_admin_logged_in');
      }
    } else {
      sessionStorage.removeItem('elazab_demo_auth');
    }
    setIsAdmin(false);
  };

  // Theme-specific color classes mapped to semantic Tailwind classes
  const colors = {
    bg: 'bg-theme-bg',
    textMain: 'text-theme-text',
    textMuted: 'text-theme-muted',
    border: 'border-theme-border',
    navBg: 'glass-surface',
    cardBg: 'card-surface',
  };

  if (dbLoading) {
    return <PageLoader isDark={isDark} />;
  }

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route
              path="/"
              element={
                <MainLayout
                  lang={lang}
                  theme={theme}
                  setLang={setLang}
                  setTheme={setTheme}
                  mobileMenuOpen={mobileMenuOpen}
                  setMobileMenuOpen={setMobileMenuOpen}
                  isScrolled={isScrolled}
                  isAdmin={isAdmin}
                  setIsAdmin={setIsAdmin}
                  colors={colors}
                  isRTL={isRTL}
                  isDark={isDark}
                  handleLogout={handleLogout}
                  settings={data.settings}
                />
              }
            >
              {/* Home Page (Eagerly Loaded) */}
              <Route
                index
                element={
                  <Suspense fallback={<PageLoader isDark={isDark} />}>
                    <Home
                      t={t}
                      colors={colors}
                      isDark={isDark}
                      isRTL={isRTL}
                      isAdmin={isAdmin}
                      data={data}
                    />
                  </Suspense>
                }
              />

              {/* Lazy Sub-pages (Suspended) */}
              <Route
                path="gallery"
                element={
                  <Suspense fallback={<PageLoader isDark={isDark} />}>
                    <GalleryPage
                      isRTL={isRTL}
                      gallery={data.gallery}
                      colors={colors}
                      settings={data.settings}
                    />
                  </Suspense>
                }
              />

              <Route
                path="packages"
                element={
                  <Suspense fallback={<PageLoader isDark={isDark} />}>
                    <PackagesPage
                      isRTL={isRTL}
                      packages={data.packages}
                      extrasData={t.extrasData}
                      termsData={t.termsData}
                      colors={colors}
                      settings={data.settings}
                    />
                  </Suspense>
                }
              />

              <Route
                path="about"
                element={
                  <Suspense fallback={<PageLoader isDark={isDark} />}>
                    <AboutPage
                      t={t}
                      colors={colors}
                      isDark={isDark}
                      isRTL={isRTL}
                      aboutImg={data.gallery?.find(g => g.id === 2)?.src || ''}
                      settings={data.settings}
                    />
                  </Suspense>
                }
              />

              <Route
                path="contact"
                element={
                  <Suspense fallback={<PageLoader isDark={isDark} />}>
                    <ContactPage
                      t={t}
                      colors={colors}
                      isDark={isDark}
                      isRTL={isRTL}
                      contactImg={data.gallery?.find(g => g.id === 4)?.src || ''}
                      settings={data.settings}
                    />
                  </Suspense>
                }
              />

              {/* Secure hidden PIN/Credentials authentication entrance */}
              <Route
                path="studio"
                element={
                  <Suspense fallback={<PageLoader isDark={isDark} />}>
                    <AdminLogin colors={colors} isRTL={isRTL} />
                  </Suspense>
                }
              />

              {/* Secure hidden CMS editing control room (Route Guarded) */}
              <Route
                path="studio/dashboard"
                element={
                  <ProtectedRoute isAdmin={isAdmin} loading={dbLoading}>
                    <Suspense fallback={<PageLoader isDark={isDark} />}>
                      <StudioDashboard
                        colors={colors}
                        isRTL={isRTL}
                        masterData={data}
                        setMasterData={setData}
                        handleLogout={handleLogout}
                      />
                    </Suspense>
                  </ProtectedRoute>
                }
              />

              {/* Fallback 404 Page */}
              <Route
                path="*"
                element={
                  <Suspense fallback={<PageLoader isDark={isDark} />}>
                    <NotFoundPage colors={colors} isRTL={isRTL} isDark={isDark} />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
