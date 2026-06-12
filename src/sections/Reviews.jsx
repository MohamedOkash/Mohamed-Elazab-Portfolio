import { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import Reveal from '../components/animations/Reveal';
import EditableText from '../components/EditableText';

export default function Reviews({
  t,
  colors,
  testimonials = [],
  isRTL
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [honeypot, setHoneypot] = useState(''); // Anti-spam honeypot
  
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  // Filter out unpublished reviews
  const publishedReviews = testimonials.filter(r => r.isPublished !== false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Honeypot spam check
    if (honeypot) {
      return; // Silently ignore bot submission
    }

    // Full Name Word Validation (minimum 2 words)
    const trimmedName = name.trim();
    const nameWords = trimmedName.split(/\s+/).filter(word => word.length > 0);
    if (nameWords.length < 2) {
      setSubmitStatus({
        type: 'error',
        message: isRTL 
          ? 'الرجاء إدخال الاسم الأول والأخير (اسم ثنائي على الأقل).' 
          : 'Please enter your first and last name (at least two words).'
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setSubmitStatus({
        type: 'error',
        message: isRTL ? 'الرجاء إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.'
      });
      return;
    }

    // Text content validation
    if (!text.trim() || text.trim().length < 10) {
      setSubmitStatus({
        type: 'error',
        message: isRTL ? 'الرجاء كتابة تقييم لا يقل عن 10 أحرف.' : 'Please write a review of at least 10 characters.'
      });
      return;
    }

    // Cooldown spam check using localStorage
    const lastSubmitTime = localStorage.getItem('elazab_last_review_submit');
    if (lastSubmitTime && Date.now() - parseInt(lastSubmitTime, 10) < 300000) { // 5 minutes cooldown
      setSubmitStatus({
        type: 'error',
        message: isRTL 
          ? 'لقد قمت بإرسال تقييم مؤخراً. يرجى الانتظار 5 دقائق قبل إرسال تقييم جديد.' 
          : 'You have submitted a review recently. Please wait 5 minutes before trying again.'
      });
      return;
    }

    setSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const { submitReview } = await import('../firebase/dbHelper');
      await submitReview({
        name: trimmedName,
        email: email.trim(),
        text: text.trim(),
        rating
      });

      localStorage.setItem('elazab_last_review_submit', Date.now().toString());
      setSubmitStatus({
        type: 'success',
        message: isRTL 
          ? 'تم إرسال تقييمك بنجاح! سيتم نشره بعد مراجعة المصور للموافقة.' 
          : 'Your review was submitted! It will appear publicly after approval.'
      });

      // Clear fields
      setName('');
      setEmail('');
      setText('');
      setRating(5);
      
      // Auto close form after 3s
      setTimeout(() => {
        setShowForm(false);
        setSubmitStatus({ type: '', message: '' });
      }, 4000);
    } catch (err) {
      console.error(err);
      setSubmitStatus({
        type: 'error',
        message: isRTL ? 'فشل إرسال التقييم. الرجاء المحاولة مرة أخرى.' : 'Failed to submit review. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="reviews"
      className={`py-24 bg-theme-elevated border-y ${
        colors.border
      } relative z-10`}
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Reveal type="fade-up">
            <EditableText
              text={t.reviews.subtitle}
              tagName="h2"
              className="text-theme-accent text-xs tracking-[0.3em] uppercase mb-4 block"
            />
          </Reveal>
          <Reveal type="mask-up">
            <h3
              className={`text-4xl md:text-5xl font-light ${colors.textMain}`}
              style={{ fontFamily: 'serif' }}
            >
              <EditableText
                text={t.reviews.title}
                tagName="span"
              />
            </h3>
          </Reveal>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {publishedReviews.map((review, idx) => (
            <Reveal key={review.id || idx} type="fade-up" delay={idx * 100}>
              <div
                className={`${colors.cardBg} p-8 border ${
                  colors.border
                } rounded-xl hover:-translate-y-2 transition-transform duration-500 relative`}
              >
                {/* Star Ratings */}
                <div className="flex gap-1 text-amber-500 mb-6 font-sans">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                {/* Review Body */}
                <p className={`${colors.textMain} font-light leading-relaxed mb-6 italic text-sm`}>
                  "{review.text}"
                </p>

                {/* Reviewer Details & Date */}
                <div className="flex justify-between items-center w-full mt-4 border-t border-theme-border/20 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-theme-bg border border-theme-border/40 flex items-center justify-center text-theme-accent font-serif font-bold text-xs">
                      {review.name ? review.name.charAt(0) : 'U'}
                    </div>
                    <span className="text-theme-accent font-bold text-xs">{review.name}</span>
                  </div>
                  {review.createdAt && (
                    <span className="text-[10px] text-theme-muted font-light font-sans">
                      {(() => {
                        const date = new Date(review.createdAt);
                        if (isNaN(date.getTime())) return '';
                        if (isRTL) {
                          const day = String(date.getDate()).padStart(2, '0');
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const year = date.getFullYear();
                          return `${day} / ${month} / ${year}`;
                        } else {
                          const day = date.getDate();
                          const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                          const month = monthNames[date.getMonth()];
                          const year = date.getFullYear();
                          return `${day} ${month} ${year}`;
                        }
                      })()}
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Toggle Form Trigger */}
        <div className="text-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="border border-theme-border hover:border-theme-accent text-zinc-300 hover:text-white px-6 py-2.5 rounded text-xs transition-all tracking-wider uppercase inline-flex items-center gap-2 cursor-pointer font-semibold"
          >
            <MessageSquarePlus size={14} />
            {isRTL ? "اكتب تقييمك وتجربتك" : "Write a Review"}
          </button>
        </div>

        {/* Review Form Area */}
        {showForm && (
          <Reveal type="fade-up">
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-10 p-8 border border-theme-border bg-theme-bg/60 backdrop-blur-md rounded-xl space-y-4">
              <h4 className="text-sm uppercase tracking-widest text-theme-accent font-light font-serif text-center mb-2">
                {isRTL ? "شاركنا رأيك في خدماتنا" : "Submit Your Review"}
              </h4>

              {submitStatus.message && (
                <div className={`p-4 rounded border text-xs flex items-start gap-2.5 ${
                  submitStatus.type === 'success' 
                    ? 'bg-emerald-950/25 border-emerald-900/40 text-emerald-400' 
                    : 'bg-red-950/25 border-red-900/40 text-red-400'
                }`}>
                  {submitStatus.type === 'success' ? <CheckCircle size={14} className="mt-0.5" /> : <AlertCircle size={14} className="mt-0.5" />}
                  <span>{submitStatus.message}</span>
                </div>
              )}

              {/* Honeypot field (hidden from users) */}
              <input 
                type="text" 
                value={honeypot} 
                onChange={(e) => setHoneypot(e.target.value)} 
                className="hidden" 
                tabIndex="-1" 
                autoComplete="off" 
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                    {isRTL ? "الاسم الكريم (الاسم الأول والأخير)" : "Full Name (First & Last Name)"}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-theme-elevated border border-theme-border rounded px-3 py-2.5 text-xs text-theme-text focus:border-theme-accent focus:outline-none"
                    placeholder={isRTL ? "أحمد محمد" : "John Doe"}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1 flex items-center gap-1">
                    <Mail size={10} className="text-zinc-500" />
                    {isRTL ? "البريد الإلكتروني" : "Email Address"}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-theme-elevated border border-theme-border rounded px-3 py-2.5 text-xs text-theme-text focus:border-theme-accent focus:outline-none font-mono"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              {/* Interactive Star rating selector */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                  {isRTL ? "تقييمك بالنجوم" : "Your Rating"}
                </label>
                <div className="flex gap-1.5 text-zinc-600">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isActive = starVal <= (hoverRating || rating);
                    return (
                      <button
                        type="button"
                        key={starVal}
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={`focus:outline-none cursor-pointer p-0.5 transition-colors ${
                          isActive ? 'text-amber-500' : 'text-zinc-700 hover:text-amber-400'
                        }`}
                      >
                        <Star size={22} fill={isActive ? 'currentColor' : 'transparent'} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                  {isRTL ? "اكتب تجربتك بالتفصيل" : "Review Text"}
                </label>
                <textarea
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-theme-elevated border border-theme-border rounded p-3 text-xs text-theme-text focus:border-theme-accent focus:outline-none h-24 resize-none"
                  placeholder={isRTL ? "كانت تجربة رائعة..." : "We loved the photos..."}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-theme-accent text-black font-semibold py-3 rounded text-xs tracking-wider uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting && <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>}
                {isRTL ? "إرسال التقييم للمراجعة" : "Submit Review"}
              </button>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}
