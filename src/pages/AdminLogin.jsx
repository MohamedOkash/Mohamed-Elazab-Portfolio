import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { isFirebaseConfigured } from '../firebase/firebaseEnv';
import { Lock, Mail, Key, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

export default function AdminLogin({ colors, isRTL }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isFirebaseConfigured) {
      let unsubscribe = () => {};
      Promise.all([
        import('../firebase/authClient'),
        import('firebase/auth')
      ]).then(([{ getAuthClient }, { onAuthStateChanged }]) => {
        getAuthClient().then((auth) => {
          if (auth) {
            unsubscribe = onAuthStateChanged(auth, (user) => {
              if (user) {
                navigate('/studio/dashboard');
              }
            });
          }
        });
      });
      return () => unsubscribe();
    } else {
      const demoAuth = sessionStorage.getItem('elazab_demo_auth');
      if (demoAuth === 'true') {
        navigate('/studio/dashboard');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(isRTL ? "يرجى ملء جميع الحقول" : "Please fill in all fields");
      return;
    }

    setLoading(true);
    setError('');

    if (isFirebaseConfigured) {
      try {
        const { getAuthClient } = await import('../firebase/authClient');
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        const auth = await getAuthClient();
        if (auth) {
          await signInWithEmailAndPassword(auth, email, password);
          navigate('/studio/dashboard');
        }
      } catch (err) {
        console.error("Authentication error:", err);
        setError(isRTL ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Incorrect email or password");
      } finally {
        setLoading(false);
      }
    } else {
      // Local Demo Mode (Warn user about environment configurations)
      setTimeout(() => {
        if (email === 'admin@elazab.com' && password === '123456') {
          sessionStorage.setItem('elazab_demo_auth', 'true');
          navigate('/studio/dashboard');
        } else {
          setError(
            isRTL 
              ? "بيئة العمل غير مهيأة ببيانات Firebase. استخدم البريد التجريبي: admin@elazab.com والرمز 123456" 
              : "Firebase keys missing. Enter demo email: admin@elazab.com and password: 123456"
          );
        }
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isRTL ? "بوابة تسجيل الدخول الآمنة | استوديو محمد العزب" : "Secure Login Portal | Mohamed Elazab Studio"}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className={`min-h-[90vh] flex flex-col items-center justify-center px-6 ${colors.bg} font-cairo`}>
        <div className="max-w-md w-full bg-zinc-950/40 border border-zinc-900 rounded-lg p-8 shadow-2xl relative">
          
          {/* Top lock icon header */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full border border-theme-accent/30 flex items-center justify-center text-theme-accent">
              <Lock size={20} className={loading ? "animate-pulse" : ""} />
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <BrandLogo isDark={true} className="scale-75" />
          </div>
          
          <h2 className="text-2xl font-light text-center text-white mb-2" style={{ fontFamily: 'serif' }}>
            {isRTL ? "بوابة استوديو محمد العزب" : "M. Elazab Studio CMS"}
          </h2>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-8 text-center">
            {isRTL ? "تسجيل دخول المشرف الآمن" : "Secure Admin Login Portal"}
          </p>

          {!isFirebaseConfigured && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 px-4 py-3 rounded text-xs mb-6 text-center">
              {isRTL 
                ? "تنبيه: بيئة عمل Firebase غير متصلة. سيتم الدخول في وضع التجربة المحلي." 
                : "Note: Firebase environment keys are not configured. Running in local fallback mode."}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded text-xs mb-6 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2" htmlFor="email">
                {isRTL ? "البريد الإلكتروني" : "Email Address"}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                  <Mail size={16} />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setError('');
                    setEmail(e.target.value);
                  }}
                  placeholder="admin@elazab.com"
                  className="w-full bg-zinc-950/80 border border-zinc-900 rounded py-3 pl-10 pr-4 text-sm focus:border-theme-accent focus:outline-none text-zinc-300 transition-all font-sans"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2" htmlFor="password">
                {isRTL ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                  <Key size={16} />
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setError('');
                    setPassword(e.target.value);
                  }}
                  placeholder="••••••"
                  className="w-full bg-zinc-950/80 border border-zinc-900 rounded py-3 pl-10 pr-4 text-sm focus:border-theme-accent focus:outline-none text-zinc-300 transition-all font-sans"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-theme-accent hover:opacity-90 text-black font-semibold py-3 rounded text-sm transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer focus:outline-none mt-8"
            >
              {loading ? (
                <span>{isRTL ? "جاري التحقق..." : "Authenticating..."}</span>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>{isRTL ? "تسجيل الدخول" : "Sign In"}</span>
                </>
              )}
            </button>
          </form>

          {/* Return link */}
          <div className="mt-8 flex justify-center border-t border-zinc-900/60 pt-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 hover:text-theme-accent transition-colors group"
            >
              {isRTL ? (
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              ) : (
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              )}
              <span>{isRTL ? "العودة للموقع" : "Return to site"}</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
