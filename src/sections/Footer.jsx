import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, Copy, Check, X } from 'lucide-react';
import Reveal from '../components/animations/Reveal';
import { TikTokIcon, WhatsAppBrandIcon, InstagramIcon, FacebookIcon } from '../components/Icons';

const formatPhone = (phoneStr) => {
  if (!phoneStr) return '';
  const cleaned = phoneStr.replace(/\s+/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
  }
  return phoneStr;
};

export default function Footer({
  colors,
  isRTL,
  settings
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedType, setCopiedType] = useState(''); // 'email' or 'whatsapp'
  const [isHovered, setIsHovered] = useState(false);

  const developerEmail = "mohamed.okash1998@gmail.com";
  const developerPhone = "+20 101 412 8610";

  const handleCopy = useCallback((text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      copiedType === type ? null : setCopiedType(type);
      const timer = setTimeout(() => setCopiedType(''), 2500);
      return () => clearTimeout(timer);
    }).catch(err => {
      console.error("Failed to copy text:", err);
    });
  }, [copiedType]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Resolve Photographer Details from CMS Settings
  const logoText = settings?.logo || 'M. ELAZAB';
  const studioTitle = isRTL 
    ? (settings?.siteName || 'ستوديو محمد العزب للتصوير') 
    : (settings?.siteName || 'Mohamed Elazab Studio');
  
  const studioAddr = isRTL 
    ? (settings?.contactInfo?.addressAr || 'ميت غراب، السنبلاوين، الدقهلية - بجوار مسجد الأربعين') 
    : (settings?.contactInfo?.addressEn || 'Mit Ghorab, Senbellawein, Dakahlia (next to Al-Arbaeen Mosque)');
  
  const studioHours = isRTL 
    ? (settings?.contactInfo?.hoursAr || 'مواعيد العمل: يومياً من 4:00 م إلى 11:00 م') 
    : (settings?.contactInfo?.hoursEn || 'Working Hours: Daily 4 PM - 11 PM');
  
  const studioEmail = settings?.contactInfo?.email || 'mohamedelazab.ph@gmail.com';
  const studioPhone = settings?.contactInfo?.phone || '01016585901';
  const studioWhatsapp = settings?.contactInfo?.whatsapp || '201016585901';

  return (
    <>
      <footer
        className={`${colors.bg} pt-24 pb-12 px-6 md:px-12 border-t ${
          colors.border
        } relative z-10`}
      >
        {/* Parent layout forced to ltr direction to ensure Developer is always LEFT and Client is always RIGHT on desktop */}
        <div className="max-w-screen-2xl mx-auto flex flex-col w-full gap-12 md:gap-20">
          
          {/* MAIN FOOTER CONTENT (Photographer/Client Section) */}
          <div className="w-full flex justify-center md:justify-end" dir="ltr">
            <div 
              className="w-full md:w-auto flex flex-col items-center md:items-end gap-6 text-center md:text-right"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {/* Logo */}
              <Reveal type="fade-up" delay={100}>
                <div className="flex flex-col items-center md:items-end">
                  <span
                    className={`text-4xl font-light tracking-widest uppercase ${colors.textMain} mb-1`}
                    style={{ fontFamily: 'serif' }}
                  >
                    {logoText}
                  </span>
                  <span className="text-[0.65rem] tracking-[0.4em] text-theme-accent">
                    PHOTOGRAPHY
                  </span>
                </div>
              </Reveal>

              {/* Social Icons */}
              <Reveal type="fade-up" delay={120}>
                <div className="flex gap-6">
                  <a
                    href={`https://wa.me/${studioWhatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-theme-accent transition-all hover:scale-110 duration-300"
                    title="WhatsApp"
                    aria-label="WhatsApp Social Link"
                  >
                    <WhatsAppBrandIcon size={22} />
                  </a>
                  <a
                    href={settings?.socialLinks?.instagram || "https://www.instagram.com/p/DZD17fbihA7/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-theme-accent transition-all hover:scale-110 duration-300"
                    title="Instagram"
                    aria-label="Instagram Social Link"
                  >
                    <InstagramIcon size={22} />
                  </a>
                  <a
                    href={settings?.socialLinks?.facebook || "https://www.facebook.com/share/1JjRpWMEq6/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-theme-accent transition-all hover:scale-110 duration-300"
                    title="Facebook"
                    aria-label="Facebook Social Link"
                  >
                    <FacebookIcon size={22} />
                  </a>
                  <a
                    href={settings?.socialLinks?.tiktok || "https://www.tiktok.com/@mohamed_elazab_p.h"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-theme-accent transition-all hover:scale-110 duration-300"
                    title="TikTok"
                    aria-label="TikTok Social Link"
                  >
                    <TikTokIcon size={22} />
                  </a>
                </div>
              </Reveal>

              {/* Studio Info */}
              <Reveal type="fade-up" delay={150}>
                <div className="flex flex-col gap-2 items-center md:items-end">
                  <span className={`${colors.textMain} font-medium tracking-wider text-sm`}>
                    {studioTitle}
                  </span>
                  <span className="font-light opacity-80 text-xs">{studioAddr}</span>
                  <span className="font-light opacity-80 text-xs">{studioHours}</span>
                </div>
              </Reveal>

              {/* Phone & Email */}
              <Reveal type="fade-up" delay={180}>
                <div className="flex flex-col items-center md:items-end gap-2 text-xs">
                  <a
                    href={`https://wa.me/${studioWhatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-theme-accent font-bold text-lg tracking-widest hover:opacity-85 transition-opacity flex items-center gap-1.5"
                    title={isRTL ? "تواصل عبر واتساب" : "Contact via WhatsApp"}
                    aria-label={isRTL ? "رابط واتساب المصور" : "Client WhatsApp Connection"}
                    dir="ltr"
                  >
                    {formatPhone(studioPhone)}
                  </a>
                  
                  {studioEmail && (
                    <a
                      href={`mailto:${studioEmail}`}
                      className="text-theme-muted hover:text-theme-accent transition-colors flex items-center gap-1.5"
                      title={isRTL ? "أرسل بريد إلكتروني" : "Email Studio"}
                      aria-label={isRTL ? "رابط البريد الإلكتروني للمصور" : "Client Email Connection"}
                    >
                      <span>{studioEmail}</span>
                    </a>
                  )}
                </div>
              </Reveal>
            </div>
          </div>

          {/* BOTTOM ROW (Developer & Copyright) */}
          <div 
            className="w-full flex flex-col md:flex-row justify-between items-center md:items-end gap-6 pt-8 border-t border-zinc-800/50" 
            dir="ltr"
          >
            {/* LEFT SIDE: Developer Signature */}
            <div className="flex flex-col items-center md:items-start order-2 md:order-1" dir={isRTL ? 'rtl' : 'ltr'}>
              <Reveal type="fade-up" delay={100}>
                <motion.button
                  onClick={openModal}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="flex flex-col items-center md:items-start gap-1 cursor-pointer bg-transparent border-none outline-none focus:outline-none group text-center md:text-left"
                  aria-label={isRTL ? "معلومات الاتصال بالمطور محمد عكاش" : "Contact Developer Mohamed Okash"}
                  title={isRTL ? "تفاصيل الاتصال بالمطور" : "Developer Contact Details"}
                >
                  <span 
                    className="text-theme-text group-hover:text-theme-accent font-semibold transition-all duration-300 relative tracking-[0.2em] text-[11px]"
                    style={{
                      textShadow: isHovered 
                        ? '0 0 10px color-mix(in srgb, var(--accent) 60%, transparent)' 
                        : 'none'
                    }}
                  >
                    MOHAMED OKASH
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-theme-accent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  </span>
                  <span className="text-[9px] text-theme-muted group-hover:text-theme-accent uppercase tracking-[0.25em] font-light transition-all duration-300">
                    CRAFTED BY
                  </span>
                </motion.button>
              </Reveal>
            </div>

            {/* RIGHT SIDE: Copyright */}
            <div className={`w-full md:w-auto order-1 md:order-2 flex flex-col items-center text-center ${isRTL ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
              <Reveal type="fade-up" delay={200}>
                <div className="text-[10px] text-theme-muted font-light">
                  &copy; {new Date().getFullYear()} {studioTitle}. All rights reserved.
                </div>
              </Reveal>
            </div>
          </div>

        </div>
      </footer>

      {/* Developer Contact Glassmorphic Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--bg) 75%, transparent)'
            }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-md w-full card-surface p-8 rounded-2xl text-center shadow-2xl flex flex-col items-center gap-6 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-theme-muted hover:text-theme-accent cursor-pointer transition-colors p-1.5 rounded-full"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--surface-elevated) 40%, transparent)'
                }}
                aria-label={isRTL ? "إغلاق نافذة الاتصال" : "Close contact modal"}
              >
                <X size={18} />
              </button>

              {/* Decorative Glow */}
              <div 
                className="absolute -top-12 -left-12 w-28 h-28 rounded-full blur-2xl pointer-events-none"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)'
                }}
              />
              <div 
                className="absolute -bottom-12 -right-12 w-28 h-28 rounded-full blur-2xl pointer-events-none"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)'
                }}
              />

              {/* Luxury Signature Logo Area */}
              <div className="relative mt-4 flex flex-col items-center select-none w-full">
                {/* Monogram / Signature container */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex items-center justify-center cursor-pointer"
                >
                  {/* Soft Glow Pulse */}
                  <motion.div
                    className="absolute inset-0 rounded-full blur-lg opacity-25"
                    style={{
                      background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 80%)',
                    }}
                    animate={{
                      scale: [1, 1.06, 1],
                      opacity: [0.15, 0.3, 0.15]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Signature Name in cursive font with gold gradient and drop shadow */}
                  <span 
                    className="text-4xl sm:text-5xl text-center select-none relative z-10 block px-4 py-2"
                    style={{
                      fontFamily: "'Pinyon Script', cursive",
                      background: 'linear-gradient(135deg, #ffe875 0%, #d4af37 40%, #b8860b 80%, #ffd700 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                    }}
                  >
                    Mohamed Okash
                  </span>
                </motion.div>

                {/* Subtitle below signature */}
                <div className="flex flex-col items-center mt-3 gap-0.5">
                  <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#ffd700] font-serif">
                    Mohamed Okash
                  </span>
                  <span className="text-[9px] text-theme-muted uppercase tracking-[0.2em] font-light">
                    Full Stack Developer
                  </span>
                </div>
              </div>

              <div className="w-full flex flex-col gap-4 mt-2">
                {/* Email Option Card */}
                <div 
                  className="flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:border-theme-accent/30 group/card"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--surface-elevated) 45%, transparent)',
                    borderColor: 'rgba(255,255,255,0.05)'
                  }}
                >
                  <a
                    href={`mailto:${developerEmail}`}
                    className="flex items-center gap-3.5 text-left min-w-0 flex-1 hover:text-[#ffd700] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-theme-accent/10 text-theme-accent transition-colors group-hover/card:bg-theme-accent/20">
                      <Mail size={16} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-theme-muted">
                        Email
                      </span>
                      <span className="text-[13px] text-theme-text font-light truncate">
                        {developerEmail}
                      </span>
                    </div>
                  </a>
                  <button
                    onClick={() => handleCopy(developerEmail, 'email')}
                    className="p-2 text-theme-muted hover:text-theme-accent rounded transition-all cursor-pointer bg-white/5 hover:bg-white/10 shrink-0 ml-3"
                    title={isRTL ? "نسخ البريد الإلكتروني" : "Copy Email"}
                    aria-label={isRTL ? "نسخ البريد الإلكتروني للمطور" : "Copy developer email"}
                  >
                    {copiedType === 'email' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </div>

                {/* WhatsApp Option Card */}
                <div 
                  className="flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:border-green-400/30 group/card"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--surface-elevated) 45%, transparent)',
                    borderColor: 'rgba(255,255,255,0.05)'
                  }}
                >
                  <a
                    href="https://wa.me/201014128610"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 text-left min-w-0 flex-1 hover:text-green-400 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-green-500/10 text-green-400 transition-colors group-hover/card:bg-green-500/20">
                      <MessageSquare size={16} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-theme-muted">
                        WhatsApp
                      </span>
                      <span className="text-[13px] text-theme-text font-light truncate" dir="ltr">
                        {developerPhone}
                      </span>
                    </div>
                  </a>
                  <button
                    onClick={() => handleCopy(developerPhone, 'whatsapp')}
                    className="p-2 text-theme-muted hover:text-theme-accent rounded transition-all cursor-pointer bg-white/5 hover:bg-white/10 shrink-0 ml-3"
                    title={isRTL ? "نسخ رقم الواتساب" : "Copy WhatsApp Number"}
                    aria-label={isRTL ? "نسخ رقم واتساب للمطور" : "Copy developer whatsapp"}
                  >
                    {copiedType === 'whatsapp' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Action Toast Notification */}
      <AnimatePresence>
        {copiedType && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] px-6 py-3 rounded-full glass-surface flex items-center gap-3 text-xs font-light tracking-wider"
            style={{
              boxShadow: 'var(--card-hover-shadow)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface-elevated)'
            }}
          >
            <Check size={14} className="text-green-500" />
            <span className="text-theme-text">
              {copiedType === 'email' 
                ? (isRTL ? 'تم نسخ البريد الإلكتروني بنجاح!' : 'Email copied to clipboard successfully!') 
                : (isRTL ? 'تم نسخ رقم الواتساب بنجاح!' : 'WhatsApp number copied successfully!')}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
