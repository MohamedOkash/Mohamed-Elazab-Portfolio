import { Plus, Trash2, Check, X, ShieldAlert } from 'lucide-react';
import { detectLanguage } from '../../utils/translationHelper';
import TranslateButton from '../../components/TranslateButton';

export default function ReviewsTab({
  formData,
  isRTL,
  handleAddReview,
  handleReviewChange,
  handleDeleteReview
}) {
  const testimonials = formData.testimonials || [];

  // Categorize reviews
  const pendingReviews = testimonials
    .map((r, originalIndex) => ({ ...r, originalIndex }))
    .filter((r) => r.isPublished === false);

  const publishedReviews = testimonials
    .map((r, originalIndex) => ({ ...r, originalIndex }))
    .filter((r) => r.isPublished !== false);

  return (
    <div className="space-y-8">
      {/* Header and Add Button */}
      <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
        <h3 className="text-lg font-light text-theme-accent font-serif" style={{ fontFamily: 'serif' }}>
          {isRTL ? "إدارة تقييمات العملاء" : "Client Testimonials Moderation"}
        </h3>
        <button
          type="button"
          onClick={handleAddReview}
          className="bg-theme-accent text-black px-4 py-2 text-xs font-bold rounded cursor-pointer transition-colors inline-flex items-center gap-1.5 hover:opacity-90 focus:outline-none"
        >
          <Plus size={14} />
          {isRTL ? "إضافة تقييم يدوي" : "Add Review Manually"}
        </button>
      </div>

      {/* SECTION 1: Pending Reviews */}
      <div className="space-y-4">
        <h4 className="text-xs uppercase tracking-widest text-amber-500 font-semibold flex items-center gap-1.5">
          <ShieldAlert size={14} />
          {isRTL ? "تقييمات معلقة بانتظار الموافقة" : "Pending Reviews & Moderation Queue"}
          <span className="bg-amber-950/40 border border-amber-900 text-amber-400 text-[9px] px-2 py-0.5 rounded-full font-mono ml-2">
            {pendingReviews.length}
          </span>
        </h4>

        {pendingReviews.length === 0 ? (
          <div className="text-center py-6 text-zinc-500 text-xs border border-dashed border-zinc-900 rounded bg-zinc-950/5">
            {isRTL ? "لا توجد تقييمات معلقة بانتظار المراجعة حالياً." : "No pending reviews in the queue."}
          </div>
        ) : (
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {pendingReviews.map((review) => (
              <div key={review.id} className="border border-amber-900/30 p-4 bg-amber-950/5 rounded-lg space-y-3 flex flex-col justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[8px] uppercase tracking-wider text-zinc-500 mb-0.5">{isRTL ? "الاسم" : "Name"}</label>
                    <input
                      type="text"
                      value={review.name}
                      onChange={(e) => handleReviewChange(review.originalIndex, 'name', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded px-2 py-1 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase tracking-wider text-zinc-500 mb-0.5">{isRTL ? "التقييم" : "Rating"}</label>
                    <select
                      value={review.rating}
                      onChange={(e) => handleReviewChange(review.originalIndex, 'rating', parseInt(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded px-2 py-1 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                    >
                      <option value="5">★★★★★ (5)</option>
                      <option value="4">★★★★☆ (4)</option>
                      <option value="3">★★★☆☆ (3)</option>
                      <option value="2">★★☆☆☆ (2)</option>
                      <option value="1">★☆☆☆☆ (1)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label className="block text-[8px] uppercase tracking-wider text-zinc-500 mb-0.5">{isRTL ? "البريد الإلكتروني" : "Email Address"}</label>
                    <input
                      type="email"
                      value={review.email || ''}
                      onChange={(e) => handleReviewChange(review.originalIndex, 'email', e.target.value)}
                      placeholder="example@email.com"
                      className="w-full bg-zinc-950 border border-zinc-900 rounded px-2 py-1 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-0.5">
                      <label className="block text-[8px] uppercase tracking-wider text-zinc-500">{isRTL ? "محتوى التقييم" : "Review text"}</label>
                      <TranslateButton
                        sourceText={review.text}
                        targetLang={detectLanguage(review.text || '') === 'ar' ? 'en' : 'ar'}
                        onTranslate={(val) => handleReviewChange(review.originalIndex, 'text', val)}
                        existingText={review.text}
                        isRTL={isRTL}
                      />
                    </div>
                    <textarea
                      value={review.text}
                      onChange={(e) => handleReviewChange(review.originalIndex, 'text', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 text-xs h-16 text-zinc-300 focus:border-theme-accent focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-zinc-900/60 pt-2">
                  <span className="text-[9px] text-zinc-500 font-mono">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleReviewChange(review.originalIndex, 'isPublished', true)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-black px-2.5 py-1 text-[10px] font-bold uppercase rounded flex items-center gap-1 cursor-pointer transition-colors focus:outline-none"
                    >
                      <Check size={11} />
                      {isRTL ? "موافقة ونشر" : "Approve"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(review.originalIndex)}
                      className="bg-red-950/20 border border-red-900/50 hover:bg-red-900/40 text-red-400 px-2.5 py-1 text-[10px] font-bold uppercase rounded flex items-center gap-1 cursor-pointer transition-colors focus:outline-none"
                    >
                      <Trash2 size={11} />
                      {isRTL ? "رفض وحذف" : "Reject & Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Published Reviews */}
      <div className="space-y-4 border-t border-zinc-900 pt-8">
        <h4 className="text-xs uppercase tracking-widest text-theme-accent font-semibold flex items-center gap-1.5">
          <Check size={14} />
          {isRTL ? "التقييمات المنشورة" : "Published Testimonials"}
          <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] px-2 py-0.5 rounded-full font-mono ml-2">
            {publishedReviews.length}
          </span>
        </h4>

        {publishedReviews.length === 0 ? (
          <div className="text-center py-6 text-zinc-500 text-xs border border-dashed border-zinc-900 rounded">
            {isRTL ? "لا توجد تقييمات منشورة على الموقع حالياً." : "No published testimonials found."}
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {publishedReviews.map((review) => (
              <div key={review.id} className="border border-zinc-900 p-4 bg-zinc-950/20 rounded-lg space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[8px] uppercase tracking-wider text-zinc-500 mb-0.5">{isRTL ? "الاسم" : "Name"}</label>
                    <input
                      type="text"
                      value={review.name}
                      onChange={(e) => handleReviewChange(review.originalIndex, 'name', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded px-2 py-1 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase tracking-wider text-zinc-500 mb-0.5">{isRTL ? "التقييم" : "Rating"}</label>
                    <select
                      value={review.rating}
                      onChange={(e) => handleReviewChange(review.originalIndex, 'rating', parseInt(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded px-2 py-1 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                    >
                      <option value="5">★★★★★ (5)</option>
                      <option value="4">★★★★☆ (4)</option>
                      <option value="3">★★★☆☆ (3)</option>
                      <option value="2">★★☆☆☆ (2)</option>
                      <option value="1">★☆☆☆☆ (1)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label className="block text-[8px] uppercase tracking-wider text-zinc-500 mb-0.5">{isRTL ? "البريد الإلكتروني" : "Email Address"}</label>
                    <input
                      type="email"
                      value={review.email || ''}
                      onChange={(e) => handleReviewChange(review.originalIndex, 'email', e.target.value)}
                      placeholder="example@email.com"
                      className="w-full bg-zinc-950 border border-zinc-900 rounded px-2 py-1 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-0.5">
                      <label className="block text-[8px] uppercase tracking-wider text-zinc-500">{isRTL ? "محتوى التقييم" : "Review text"}</label>
                      <TranslateButton
                        sourceText={review.text}
                        targetLang={detectLanguage(review.text || '') === 'ar' ? 'en' : 'ar'}
                        onTranslate={(val) => handleReviewChange(review.originalIndex, 'text', val)}
                        existingText={review.text}
                        isRTL={isRTL}
                      />
                    </div>
                    <textarea
                      value={review.text}
                      onChange={(e) => handleReviewChange(review.originalIndex, 'text', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 text-xs h-16 text-zinc-300 focus:border-theme-accent focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-zinc-900/60 pt-2">
                  <span className="text-[9px] text-zinc-500 font-mono">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleReviewChange(review.originalIndex, 'isPublished', false)}
                      className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 px-2.5 py-1 text-[10px] font-bold uppercase rounded flex items-center gap-1 cursor-pointer transition-colors focus:outline-none"
                    >
                      <X size={11} />
                      {isRTL ? "إلغاء النشر" : "Unpublish"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(review.originalIndex)}
                      className="text-zinc-500 hover:text-red-400 p-1.5 focus:outline-none transition-colors"
                      title={isRTL ? "حذف نهائياً" : "Delete Permanently"}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
