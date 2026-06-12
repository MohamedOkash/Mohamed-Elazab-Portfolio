import TranslateButton from '../../components/TranslateButton';

export default function SettingsTab({
  formData,
  isRTL,
  handleGlobalFieldChange
}) {
  const rawTheme = formData.settings?.theme || 'luxury-black-gold';
  const mapTheme = (t) => {
    if (t === 'gold' || t === 'dark' || t === 'dark-luxury' || t === 'rose-gold-luxury' || t === 'gold-luxury' || t === 'luxury-black-gold') {
      return 'luxury-black-gold';
    }
    if (t === 'light' || t === 'light-luxury' || t === 'ivory-luxury' || t === 'luxury-ivory-gold') {
      return 'luxury-ivory-gold';
    }
    return 'luxury-black-gold';
  };
  const theme = mapTheme(rawTheme);
  const accent = formData.settings?.accentColor || '#d4af37';
  const contactInfo = formData.settings?.contactInfo || {};

  const themes = [
    {
      id: 'luxury-black-gold',
      nameEn: 'Luxury Black Gold',
      nameAr: 'المظلم الذهبي الفاخر',
      bg: '#050505',
      surface: '#0f0f0f',
      accent: '#d4af37',
    },
    {
      id: 'luxury-ivory-gold',
      nameEn: 'Luxury Ivory Gold',
      nameAr: 'العاجي الذهبي الفاخر',
      bg: '#faf7f2',
      surface: '#ffffff',
      accent: '#c5a880',
    }
  ];

  const selectedThemeInfo = themes.find(t => t.id === theme) || themes[0];
  const previewBackground = selectedThemeInfo.bg;
  const previewText = selectedThemeInfo.id.includes('light') || selectedThemeInfo.id.includes('ivory') || selectedThemeInfo.id.includes('luxury-ivory-gold') ? '#2d261e' : '#faf0ec';
  const previewBorder = selectedThemeInfo.id.includes('light') || selectedThemeInfo.id.includes('ivory') || selectedThemeInfo.id.includes('luxury-ivory-gold') ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';

  const updateContactInfo = (field, value) => {
    handleGlobalFieldChange('settings', 'contactInfo', {
      ...contactInfo,
      [field]: value
    });
  };

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-light text-theme-accent border-b border-zinc-900 pb-3" style={{ fontFamily: 'serif' }}>
        {isRTL ? "إعدادات المظهر والهوية" : "Website Layout & Settings"}
      </h3>

      {/* Site Logo Label */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
          {isRTL ? "شعار الموقع اللفظي" : "Site Logo Label"}
        </label>
        <input
          type="text"
          value={formData.settings?.logo || ''}
          onChange={(event) => handleGlobalFieldChange('settings', 'logo', event.target.value)}
          className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 text-xs focus:border-theme-accent focus:outline-none text-zinc-300"
        />
      </div>

      {/* Global Theme */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-3">
          {isRTL ? "المظهر الافتراضي" : "Default Global Theme"}
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {themes.map((tInfo) => {
            const isSelected = theme === tInfo.id;
            return (
              <div
                key={tInfo.id}
                onClick={() => handleGlobalFieldChange('settings', 'theme', tInfo.id)}
                className={`group cursor-pointer rounded-lg p-3 border transition-all duration-300 relative flex flex-col justify-between ${
                  isSelected 
                    ? 'border-zinc-100 bg-zinc-900/60 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                    : 'border-zinc-900 bg-zinc-950 hover:border-zinc-700'
                }`}
              >
                {/* Check icon */}
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-zinc-100 text-black rounded-full p-0.5 z-10 shadow">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                
                {/* Visual Preview Box */}
                <div 
                  className="h-16 rounded border border-zinc-800/40 p-2 flex flex-col justify-between transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{ backgroundColor: tInfo.bg }}
                >
                  <div className="flex justify-between items-start">
                    <span 
                      className="text-[8px] font-bold tracking-[0.2em] font-serif"
                      style={{ color: tInfo.accent }}
                    >
                      M. ELAZAB
                    </span>
                    {/* Miniature Surface Box */}
                    <div 
                      className="w-8 h-4 rounded border border-zinc-800/40"
                      style={{ backgroundColor: tInfo.surface }}
                    />
                  </div>
                  
                  {/* Decorative lines/elements using accent */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tInfo.accent }} />
                    <div className="h-0.5 flex-1 rounded-full opacity-40" style={{ backgroundColor: tInfo.accent }} />
                  </div>
                </div>
                
                {/* Info */}
                <div className="mt-1">
                  <span className="block text-xs font-medium text-zinc-200">
                    {isRTL ? tInfo.nameAr : tInfo.nameEn}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tInfo.accent }} />
                    {tInfo.accent.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Theme Accent Color */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">
          {isRTL ? "اللون الرئيسي" : "Theme Accent Color"}
        </label>
        <div className="flex gap-4 items-center">
          <input
            type="color"
            value={accent}
            onChange={(event) => handleGlobalFieldChange('settings', 'accentColor', event.target.value)}
            className="w-12 h-10 border border-zinc-900 bg-transparent rounded cursor-pointer"
          />
          <span className="text-sm font-mono text-zinc-400">{accent}</span>
        </div>
      </div>

      {/* Global Contact Info Fields (Phone & Socials & Localized details) */}
      <div className="border-t border-zinc-900 pt-6 space-y-5">
        <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          {isRTL ? "بيانات التواصل العالمية" : "Global Contact Details"}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] text-zinc-500 uppercase mb-1.5">{isRTL ? "رقم الهاتف" : "Phone Number"}</label>
            <input
              type="text"
              value={contactInfo.phone || ''}
              onChange={(e) => updateContactInfo('phone', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 uppercase mb-1.5">{isRTL ? "رقم الواتساب" : "WhatsApp Number"}</label>
            <input
              type="text"
              value={contactInfo.whatsapp || ''}
              onChange={(e) => updateContactInfo('whatsapp', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 uppercase mb-1.5">{isRTL ? "البريد الإلكتروني للمحل" : "Studio Email"}</label>
            <input
              type="email"
              value={contactInfo.email || ''}
              onChange={(e) => updateContactInfo('email', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Bilingual: Address */}
        <div className="space-y-2">
          <label className="block text-[10px] text-zinc-500 uppercase">{isRTL ? "العنوان بالتفصيل" : "Bilingual Address"}</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[9px] text-zinc-600 uppercase">{isRTL ? "العربية" : "Arabic"}</label>
              <div className="relative">
                <input
                  type="text"
                  value={contactInfo.addressAr || ''}
                  onChange={(e) => updateContactInfo('addressAr', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pl-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                  dir="rtl"
                />
                <TranslateButton
                  sourceText={contactInfo.addressAr}
                  targetLang="en"
                  onTranslate={(val) => updateContactInfo('addressEn', val)}
                  existingText={contactInfo.addressEn}
                  isRTL={isRTL}
                  className="absolute left-2.5 top-2.5"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[9px] text-zinc-600 uppercase">{isRTL ? "الإنجليزية" : "English"}</label>
              <div className="relative">
                <input
                  type="text"
                  value={contactInfo.addressEn || ''}
                  onChange={(e) => updateContactInfo('addressEn', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pr-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                  dir="ltr"
                />
                <TranslateButton
                  sourceText={contactInfo.addressEn}
                  targetLang="ar"
                  onTranslate={(val) => updateContactInfo('addressAr', val)}
                  existingText={contactInfo.addressAr}
                  isRTL={isRTL}
                  className="absolute right-2.5 top-2.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bilingual: Hours */}
        <div className="space-y-2">
          <label className="block text-[10px] text-zinc-500 uppercase">{isRTL ? "مواعيد وأوقات العمل" : "Bilingual Working Hours"}</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[9px] text-zinc-600 uppercase">{isRTL ? "العربية" : "Arabic"}</label>
              <div className="relative">
                <input
                  type="text"
                  value={contactInfo.hoursAr || ''}
                  onChange={(e) => updateContactInfo('hoursAr', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pl-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                  dir="rtl"
                />
                <TranslateButton
                  sourceText={contactInfo.hoursAr}
                  targetLang="en"
                  onTranslate={(val) => updateContactInfo('hoursEn', val)}
                  existingText={contactInfo.hoursEn}
                  isRTL={isRTL}
                  className="absolute left-2.5 top-2.5"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[9px] text-zinc-600 uppercase">{isRTL ? "الإنجليزية" : "English"}</label>
              <div className="relative">
                <input
                  type="text"
                  value={contactInfo.hoursEn || ''}
                  onChange={(e) => updateContactInfo('hoursEn', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pr-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                  dir="ltr"
                />
                <TranslateButton
                  sourceText={contactInfo.hoursEn}
                  targetLang="ar"
                  onTranslate={(val) => updateContactInfo('hoursAr', val)}
                  existingText={contactInfo.hoursAr}
                  isRTL={isRTL}
                  className="absolute right-2.5 top-2.5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Preview */}
      <div className="border-t border-zinc-900 pt-6">
        <span className="block text-xs uppercase tracking-widest text-zinc-500 mb-3">
          {isRTL ? "معاينة المظهر" : "Theme Preview"}
        </span>
        <div 
          className="rounded border p-5 transition-all duration-500" 
          style={{ backgroundColor: previewBackground, color: previewText, borderColor: previewBorder }}
        >
          <div className="text-[10px] uppercase tracking-[0.25em]" style={{ color: accent }}>M. Elazab Photography</div>
          <div className="mt-3 text-2xl font-light font-serif">
            {isRTL ? "ذكريات خالدة" : "Timeless Memories"}
          </div>
          <div className="mt-4 h-px w-full opacity-30 animate-pulse" style={{ backgroundColor: accent }} />
        </div>
      </div>
    </div>
  );
}
