import { useState } from 'react';
import { MapPin, Clock, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';
import Reveal from '../components/animations/Reveal';
import EditableText from '../components/EditableText';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { getOptimizedImageUrl, getPlaceholderImageUrl } from '../utils/imageHelper';

export default function Contact({
  t,
  colors,
  isDark,
  isRTL,
  contactImg,
  settings
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [sessionType, setSessionType] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const address = isRTL
    ? (settings?.contactInfo?.addressAr || 'ميت غراب، السنبلاوين، الدقهلية - بجوار مسجد الأربعين')
    : (settings?.contactInfo?.addressEn || 'Mit Ghorab, Senbellawein, Dakahlia (next to Al-Arbaeen Mosque)');

  const hours = isRTL
    ? (settings?.contactInfo?.hoursAr || 'مواعيد العمل: يومياً من 4:00 م إلى 11:00 م')
    : (settings?.contactInfo?.hoursEn || 'Working Hours: Daily 4 PM - 11 PM');

  const photographerWhatsapp = settings?.contactInfo?.whatsapp || '201016585901';

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = name.trim();
    const nameWords = trimmedName.split(/\s+/).filter(word => word.length > 0);
    if (nameWords.length < 2) {
      setErrorMsg(isRTL 
        ? 'الرجاء إدخال الاسم الأول والأخير (اسم ثنائي على الأقل).' 
        : 'Please enter your first and last name (at least two words).');
      return;
    }

    const trimmedPhone = phone.trim();
    const phoneClean = trimmedPhone.replace(/[\s\-+]/g, '');
    if (!/^\d{8,15}$/.test(phoneClean)) {
      setErrorMsg(isRTL 
        ? 'الرجاء إدخال رقم هاتف صحيح.' 
        : 'Please enter a valid phone number (at least 8 digits).');
      return;
    }

    if (!date) {
      setErrorMsg(isRTL ? 'الرجاء اختيار تاريخ الحجز.' : 'Please choose a booking date.');
      return;
    }

    if (!sessionType) {
      setErrorMsg(isRTL ? 'الرجاء اختيار نوع الجلسة.' : 'Please select a session type.');
      return;
    }

    // Format date for message: day / month / year
    const parts = date.split('-');
    const formattedDate = parts.length === 3 ? `${parts[2]} / ${parts[1]} / ${parts[0]}` : date;

    // Localized session types labels in message
    const getSessionLabel = (val) => {
      const mapping = {
        wedding: 'Wedding Session',
        half_day: 'Half Day',
        full_day: 'Full Day',
        vib: 'VIB',
        vib_plus: 'VIB PLUS',
        other: isRTL ? 'أخرى' : 'Other'
      };
      return mapping[val] || val;
    };

    const sessionLabel = getSessionLabel(sessionType);

    const messageText = isRTL
      ? `مرحباً، أرغب في حجز جلسة تصوير.\n\nالاسم: ${trimmedName}\nرقم الهاتف: ${trimmedPhone}\nنوع الجلسة: ${sessionLabel}\nتاريخ الحجز: ${formattedDate}`
      : `Hello, I would like to book a photography session.\n\nName: ${trimmedName}\nPhone: ${trimmedPhone}\nSession Type: ${sessionLabel}\nBooking Date: ${formattedDate}`;

    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${photographerWhatsapp}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="contact"
      className={`relative py-0 ${colors.bg} overflow-hidden z-10 border-t ${colors.border}`}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Contact Form Column */}
        <div className="w-full lg:w-1/2 p-6 sm:p-12 lg:p-24 flex flex-col justify-center">
          <Reveal type="fade-up">
            <EditableText
              text={t.contact.subtitle}
              tagName="h2"
              className="text-sm tracking-[0.3em] uppercase text-zinc-500 mb-4 block"
            />
            <EditableText
              text={t.contact.title}
              tagName="h3"
              className={`text-4xl md:text-5xl font-light mb-8 ${colors.textMain}`}
              style={{ fontFamily: 'serif' }}
            />

            {/* Location & Time Info */}
            <div className={`mb-12 ${colors.textMuted} font-light text-sm space-y-4`}>
              <p className="flex items-center gap-3">
                <MapPin size={18} className="text-theme-accent flex-shrink-0" />
                <span>{address}</span>
              </p>
              <p className="flex items-center gap-3">
                <Clock size={18} className="text-theme-accent flex-shrink-0" />
                <span>{hours}</span>
              </p>
            </div>

            {/* Booking Form */}
            <form className="space-y-10" onSubmit={handleBookingSubmit}>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-transparent border-b ${colors.border} py-3 px-0 ${colors.textMain} focus:outline-none focus:border-theme-accent transition-colors peer placeholder-transparent`}
                  placeholder={isRTL ? "الاسم" : "Name"}
                  id="name"
                />
                <label
                  htmlFor="name"
                  className={`absolute ${isRTL ? 'right-0' : 'left-0'} -top-3 text-xs text-zinc-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-xs font-light`}
                >
                  {isRTL ? 'الاسم الكريم' : 'Full Name'}
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Phone */}
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full bg-transparent border-b ${colors.border} py-3 px-0 ${colors.textMain} focus:outline-none focus:border-theme-accent transition-colors peer placeholder-transparent`}
                    placeholder={isRTL ? "الهاتف" : "Phone"}
                    id="phone"
                    dir="ltr"
                  />
                  <label
                    htmlFor="phone"
                    className={`absolute ${isRTL ? 'right-0' : 'left-0'} -top-3 text-xs text-zinc-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-xs font-light`}
                  >
                    {isRTL ? 'رقم الهاتف للتواصل' : 'Phone Number'}
                  </label>
                </div>
                {/* Event Date */}
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={date}
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = 'text';
                    }}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full bg-transparent border-b ${colors.border} py-3 px-0 ${colors.textMain} focus:outline-none focus:border-theme-accent transition-colors peer font-light placeholder-transparent`}
                    placeholder="dd / mm / yyyy"
                    id="date"
                  />
                  <label
                    htmlFor="date"
                    className={`absolute ${isRTL ? 'right-0' : 'left-0'} -top-3 text-xs text-zinc-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-xs font-light`}
                  >
                    {isRTL ? 'تاريخ المناسبة' : 'Event Date'}
                  </label>
                </div>
              </div>

              {/* Session Type Select */}
              <div className="relative">
                <select
                  required
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  className={`w-full bg-transparent border-b ${colors.border} py-3 px-0 ${colors.textMain} focus:outline-none focus:border-theme-accent transition-colors peer font-light appearance-none`}
                  style={{ backgroundColor: isDark ? '#09090b' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}
                >
                  <option value="" disabled style={{ backgroundColor: isDark ? '#09090b' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>
                    {isRTL ? 'نوع الجلسة...' : 'Session Type...'}
                  </option>
                  <option value="wedding" style={{ backgroundColor: isDark ? '#09090b' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>{isRTL ? 'جلسة زفاف كاملة' : 'Wedding Session'}</option>
                  <option value="half_day" style={{ backgroundColor: isDark ? '#09090b' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>{isRTL ? 'نصف يوم' : 'Half Day'}</option>
                  <option value="full_day" style={{ backgroundColor: isDark ? '#09090b' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>{isRTL ? 'يوم كامل' : 'Full Day'}</option>
                  <option value="vib" style={{ backgroundColor: isDark ? '#09090b' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>{isRTL ? 'جلسة VIB' : 'VIB Session'}</option>
                  <option value="vib_plus" style={{ backgroundColor: isDark ? '#09090b' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>{isRTL ? 'جلسة VIB PLUS المميزة' : 'VIB PLUS Signature Session'}</option>
                  <option value="other" style={{ backgroundColor: isDark ? '#09090b' : '#ffffff', color: isDark ? '#ffffff' : '#000000' }}>{isRTL ? 'أخرى' : 'Other'}</option>
                </select>
                <ChevronDown 
                  className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-4 w-4 h-4 text-zinc-500 pointer-events-none`}
                  aria-hidden="true"
                />
              </div>

              {errorMsg && (
                <div className="p-4 rounded border text-xs flex items-center gap-2.5 bg-red-950/25 border-red-900/40 text-red-400 font-sans mt-6">
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="mt-8">
                <button
                  type="submit"
                  className={`flex items-center justify-center w-full gap-4 border-0 ${
                    isDark ? 'bg-white text-black hover:bg-theme-accent hover:text-black' : 'bg-black text-white hover:bg-theme-accent hover:text-black'
                  } px-10 py-5 transition-colors duration-500 group cursor-pointer`}
                >
                  <span className="text-sm tracking-widest uppercase font-bold">
                    {isRTL ? 'تواصل للحجز عبر واتساب' : 'Book via WhatsApp'}
                  </span>
                  {isRTL ? (
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
                  ) : (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  )}
                </button>
              </div>
            </form>
          </Reveal>
        </div>

        {/* Side Image Column */}
        <div className="w-full lg:w-1/2 h-[40vh] lg:h-auto relative">
          <ImageWithSkeleton
            src={getOptimizedImageUrl(contactImg, 1200, 85)}
            placeholderSrc={getPlaceholderImageUrl(contactImg)}
            alt="Contact side banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-black/40' : 'bg-white/20'}`}></div>
        </div>
      </div>
    </section>
  );
}
