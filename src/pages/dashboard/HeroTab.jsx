import { useState } from 'react';
import { Upload, Languages, RefreshCw } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageHelper';
import { translateText } from '../../utils/translationHelper';
import TranslateButton from '../../components/TranslateButton';

export default function HeroTab({
  isRTL,
  formData,
  handleBilingualFieldChange,
  handleImageUpload,
  showToast
}) {
  const [loadingField, setLoadingField] = useState(null); // 'all'
  const heroAr = formData.ar?.hero || {};
  const heroEn = formData.en?.hero || {};

  const handleTranslateAll = async (direction) => {
    const sourceLang = direction === 'ar-to-en' ? 'ar' : 'en';
    const targetLang = direction === 'ar-to-en' ? 'en' : 'ar';
    const sourceData = sourceLang === 'ar' ? heroAr : heroEn;
    const targetData = targetLang === 'ar' ? heroAr : heroEn;

    const fieldsToTranslate = ['subtitle', 'title', 'titleItalic', 'desc'];
    const hasAnyContent = fieldsToTranslate.some(f => sourceData[f]?.trim());

    if (!hasAnyContent) {
      showToast('error', isRTL ? 'لا يوجد محتوى للترجمة.' : 'No content found to translate.');
      return;
    }

    const hasAnyTargetText = fieldsToTranslate.some(f => targetData[f]?.trim());
    if (hasAnyTargetText) {
      const confirmReplace = window.confirm(
        isRTL 
          ? 'تنبيه: بعض الحقول المستهدفة تحتوي على نصوص بالفعل. هل تريد استبدالها بالترجمة الجديدة؟' 
          : 'Warning: Some destination fields already contain text. Do you want to replace them?'
      );
      if (!confirmReplace) return;
    }

    setLoadingField('all');
    try {
      for (const field of fieldsToTranslate) {
        const textVal = sourceData[field];
        if (textVal?.trim()) {
          const translation = await translateText(textVal, targetLang);
          handleBilingualFieldChange(targetLang, 'hero', field, translation);
        }
      }
      showToast('success', isRTL ? 'تمت ترجمة كافة حقول الواجهة بنجاح!' : 'All Hero fields translated successfully!');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setLoadingField(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tab Header & Translate All Buttons */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-900 pb-4">
        <div>
          <h3 className="text-lg font-light text-theme-accent font-serif" style={{ fontFamily: 'serif' }}>
            {isRTL ? "محتوى واجهة البداية (Hero)" : "Hero Header Contents"}
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            {isRTL ? "تعديل نصوص الواجهة والترجمة التلقائية بضغطة زر." : "Edit landing texts and translate instantly using AI."}
          </p>
        </div>

        {/* Global Translate All */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleTranslateAll('ar-to-en')}
            disabled={loadingField !== null}
            className="border border-zinc-900 hover:border-theme-accent text-zinc-400 hover:text-white px-3 py-1.5 rounded text-[10px] transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loadingField === 'all' ? <RefreshCw className="animate-spin" size={12} /> : <Languages size={12} />}
            <span>{isRTL ? "✨ ترجمة القسم إلى الإنجليزية" : "✨ Translate Hero to EN"}</span>
          </button>
          <button
            type="button"
            onClick={() => handleTranslateAll('en-to-ar')}
            disabled={loadingField !== null}
            className="border border-zinc-900 hover:border-theme-accent text-zinc-400 hover:text-white px-3 py-1.5 rounded text-[10px] transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loadingField === 'all' ? <RefreshCw className="animate-spin" size={12} /> : <Languages size={12} />}
            <span>{isRTL ? "✨ ترجمة القسم إلى العربية" : "✨ Translate Hero to AR"}</span>
          </button>
        </div>
      </div>

      {/* Field: Subtitle */}
      <div className="space-y-3">
        <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          {isRTL ? "العنوان الفرعي" : "Subtitle Tagline"}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] text-zinc-500 uppercase">{isRTL ? "العربية" : "Arabic"}</label>
            <div className="relative">
              <input
                type="text"
                disabled={loadingField !== null}
                value={heroAr.subtitle || ''}
                onChange={(e) => handleBilingualFieldChange('ar', 'hero', 'subtitle', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pl-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                dir="rtl"
              />
              <TranslateButton
                sourceText={heroAr.subtitle}
                targetLang="en"
                onTranslate={(val) => handleBilingualFieldChange('en', 'hero', 'subtitle', val)}
                existingText={heroEn.subtitle}
                isRTL={isRTL}
                className="absolute left-2.5 top-2.5"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] text-zinc-500 uppercase">{isRTL ? "الإنجليزية" : "English"}</label>
            <div className="relative">
              <input
                type="text"
                disabled={loadingField !== null}
                value={heroEn.subtitle || ''}
                onChange={(e) => handleBilingualFieldChange('en', 'hero', 'subtitle', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pr-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                dir="ltr"
              />
              <TranslateButton
                sourceText={heroEn.subtitle}
                targetLang="ar"
                onTranslate={(val) => handleBilingualFieldChange('ar', 'hero', 'subtitle', val)}
                existingText={heroAr.subtitle}
                isRTL={isRTL}
                className="absolute right-2.5 top-2.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Field: Title Regular */}
      <div className="space-y-3">
        <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          {isRTL ? "العنوان الرئيسي (عادي)" : "Primary Title (Regular)"}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] text-zinc-500 uppercase">{isRTL ? "العربية" : "Arabic"}</label>
            <div className="relative">
              <input
                type="text"
                disabled={loadingField !== null}
                value={heroAr.title || ''}
                onChange={(e) => handleBilingualFieldChange('ar', 'hero', 'title', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pl-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                dir="rtl"
              />
              <TranslateButton
                sourceText={heroAr.title}
                targetLang="en"
                onTranslate={(val) => handleBilingualFieldChange('en', 'hero', 'title', val)}
                existingText={heroEn.title}
                isRTL={isRTL}
                className="absolute left-2.5 top-2.5"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] text-zinc-500 uppercase">{isRTL ? "الإنجليزية" : "English"}</label>
            <div className="relative">
              <input
                type="text"
                disabled={loadingField !== null}
                value={heroEn.title || ''}
                onChange={(e) => handleBilingualFieldChange('en', 'hero', 'title', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pr-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                dir="ltr"
              />
              <TranslateButton
                sourceText={heroEn.title}
                targetLang="ar"
                onTranslate={(val) => handleBilingualFieldChange('ar', 'hero', 'title', val)}
                existingText={heroAr.title}
                isRTL={isRTL}
                className="absolute right-2.5 top-2.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Field: Title Italic */}
      <div className="space-y-3">
        <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          {isRTL ? "العنوان الرئيسي (مائل)" : "Secondary Title (Italic)"}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] text-zinc-500 uppercase">{isRTL ? "العربية" : "Arabic"}</label>
            <div className="relative">
              <input
                type="text"
                disabled={loadingField !== null}
                value={heroAr.titleItalic || ''}
                onChange={(e) => handleBilingualFieldChange('ar', 'hero', 'titleItalic', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pl-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                dir="rtl"
              />
              <TranslateButton
                sourceText={heroAr.titleItalic}
                targetLang="en"
                onTranslate={(val) => handleBilingualFieldChange('en', 'hero', 'titleItalic', val)}
                existingText={heroEn.titleItalic}
                isRTL={isRTL}
                className="absolute left-2.5 top-2.5"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] text-zinc-500 uppercase">{isRTL ? "الإنجليزية" : "English"}</label>
            <div className="relative">
              <input
                type="text"
                disabled={loadingField !== null}
                value={heroEn.titleItalic || ''}
                onChange={(e) => handleBilingualFieldChange('en', 'hero', 'titleItalic', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pr-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                dir="ltr"
              />
              <TranslateButton
                sourceText={heroEn.titleItalic}
                targetLang="ar"
                onTranslate={(val) => handleBilingualFieldChange('ar', 'hero', 'titleItalic', val)}
                existingText={heroAr.titleItalic}
                isRTL={isRTL}
                className="absolute right-2.5 top-2.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Field: Description */}
      <div className="space-y-3">
        <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          {isRTL ? "نص الوصف" : "Hero Description"}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] text-zinc-500 uppercase">{isRTL ? "العربية" : "Arabic"}</label>
            <div className="relative">
              <textarea
                disabled={loadingField !== null}
                value={heroAr.desc || ''}
                onChange={(e) => handleBilingualFieldChange('ar', 'hero', 'desc', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pl-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none h-28 resize-none"
                dir="rtl"
              />
              <TranslateButton
                sourceText={heroAr.desc}
                targetLang="en"
                onTranslate={(val) => handleBilingualFieldChange('en', 'hero', 'desc', val)}
                existingText={heroEn.desc}
                isRTL={isRTL}
                className="absolute left-2.5 bottom-2.5"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] text-zinc-500 uppercase">{isRTL ? "الإنجليزية" : "English"}</label>
            <div className="relative">
              <textarea
                disabled={loadingField !== null}
                value={heroEn.desc || ''}
                onChange={(e) => handleBilingualFieldChange('en', 'hero', 'desc', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pr-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none h-28 resize-none"
                dir="ltr"
              />
              <TranslateButton
                sourceText={heroEn.desc}
                targetLang="ar"
                onTranslate={(val) => handleBilingualFieldChange('ar', 'hero', 'desc', val)}
                existingText={heroAr.desc}
                isRTL={isRTL}
                className="absolute right-2.5 bottom-2.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hero BG image */}
      <div className="border-t border-zinc-900 pt-6 space-y-4">
        <label className="block text-xs uppercase tracking-widest text-zinc-500">
          {isRTL ? "صورة الخلفية" : "Hero Cover Image"}
        </label>
        <div className="flex items-center gap-6">
          {formData.gallery?.find(g => g.id === 1) && (
            <img
              src={getOptimizedImageUrl(formData.gallery.find(g => g.id === 1).src, 160)}
              alt="Hero Preview"
              className="w-32 h-20 object-cover border border-zinc-800 bg-zinc-900 rounded"
            />
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              id="hero-image-uploader"
              onChange={(e) => handleImageUpload(e, 'hero')}
              className="hidden"
            />
            <label
              htmlFor="hero-image-uploader"
              className="inline-flex items-center gap-2 border border-zinc-900 hover:border-theme-accent hover:text-white px-4 py-2 rounded text-xs transition-colors cursor-pointer"
            >
              <Upload size={12} />
              <span>{isRTL ? "تحميل صورة جديدة" : "Upload Image"}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
