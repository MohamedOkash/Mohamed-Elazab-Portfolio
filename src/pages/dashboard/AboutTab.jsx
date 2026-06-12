import { useState } from 'react';
import { Upload, Languages, RefreshCw } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageHelper';
import { translateText } from '../../utils/translationHelper';
import TranslateButton from '../../components/TranslateButton';

export default function AboutTab({
  isRTL,
  formData,
  handleBilingualFieldChange,
  handleImageUpload,
  showToast
}) {
  const [loadingField, setLoadingField] = useState(null); // 'all'
  const aboutAr = formData.ar?.about || {};
  const aboutEn = formData.en?.about || {};

  const handleTranslateAll = async (direction) => {
    const sourceLang = direction === 'ar-to-en' ? 'ar' : 'en';
    const targetLang = direction === 'ar-to-en' ? 'en' : 'ar';
    const sourceData = sourceLang === 'ar' ? aboutAr : aboutEn;
    const targetData = targetLang === 'ar' ? aboutAr : aboutEn;

    const fieldsToTranslate = ['subtitle', 'title', 'titleBr', 'desc'];
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
          handleBilingualFieldChange(targetLang, 'about', field, translation);
        }
      }
      showToast('success', isRTL ? 'تمت ترجمة كافة حقول السيرة الذاتية بنجاح!' : 'All About fields translated successfully!');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setLoadingField(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tab Header & Translate All */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-900 pb-4">
        <div>
          <h3 className="text-lg font-light text-theme-accent font-serif" style={{ fontFamily: 'serif' }}>
            {isRTL ? "تفاصيل السيرة الذاتية (About)" : "Photographer Biography"}
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            {isRTL ? "تعديل السيرة الذاتية للمصور والترجمة التلقائية بضغطة زر." : "Edit photographer biography and translate instantly using AI."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleTranslateAll('ar-to-en')}
            disabled={loadingField !== null}
            className="border border-zinc-900 hover:border-theme-accent text-zinc-400 hover:text-white px-3 py-1.5 rounded text-[10px] transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loadingField === 'all' ? <RefreshCw className="animate-spin" size={12} /> : <Languages size={12} />}
            <span>{isRTL ? "✨ ترجمة القسم إلى الإنجليزية" : "✨ Translate About to EN"}</span>
          </button>
          <button
            type="button"
            onClick={() => handleTranslateAll('en-to-ar')}
            disabled={loadingField !== null}
            className="border border-zinc-900 hover:border-theme-accent text-zinc-400 hover:text-white px-3 py-1.5 rounded text-[10px] transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loadingField === 'all' ? <RefreshCw className="animate-spin" size={12} /> : <Languages size={12} />}
            <span>{isRTL ? "✨ ترجمة القسم إلى العربية" : "✨ Translate About to AR"}</span>
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
                value={aboutAr.subtitle || ''}
                onChange={(e) => handleBilingualFieldChange('ar', 'about', 'subtitle', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pl-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                dir="rtl"
              />
              <TranslateButton
                sourceText={aboutAr.subtitle}
                targetLang="en"
                onTranslate={(val) => handleBilingualFieldChange('en', 'about', 'subtitle', val)}
                existingText={aboutEn.subtitle}
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
                value={aboutEn.subtitle || ''}
                onChange={(e) => handleBilingualFieldChange('en', 'about', 'subtitle', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pr-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                dir="ltr"
              />
              <TranslateButton
                sourceText={aboutEn.subtitle}
                targetLang="ar"
                onTranslate={(val) => handleBilingualFieldChange('ar', 'about', 'subtitle', val)}
                existingText={aboutAr.subtitle}
                isRTL={isRTL}
                className="absolute right-2.5 top-2.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Field: Headline Line 1 */}
      <div className="space-y-3">
        <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          {isRTL ? "العنوان الرئيسي (السطر الأول)" : "Headline Line 1"}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] text-zinc-500 uppercase">{isRTL ? "العربية" : "Arabic"}</label>
            <div className="relative">
              <input
                type="text"
                disabled={loadingField !== null}
                value={aboutAr.title || ''}
                onChange={(e) => handleBilingualFieldChange('ar', 'about', 'title', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pl-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                dir="rtl"
              />
              <TranslateButton
                sourceText={aboutAr.title}
                targetLang="en"
                onTranslate={(val) => handleBilingualFieldChange('en', 'about', 'title', val)}
                existingText={aboutEn.title}
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
                value={aboutEn.title || ''}
                onChange={(e) => handleBilingualFieldChange('en', 'about', 'title', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pr-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                dir="ltr"
              />
              <TranslateButton
                sourceText={aboutEn.title}
                targetLang="ar"
                onTranslate={(val) => handleBilingualFieldChange('ar', 'about', 'title', val)}
                existingText={aboutAr.title}
                isRTL={isRTL}
                className="absolute right-2.5 top-2.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Field: Headline Line 2 */}
      <div className="space-y-3">
        <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          {isRTL ? "العنوان الرئيسي (السطر الثاني)" : "Headline Line 2"}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] text-zinc-500 uppercase">{isRTL ? "العربية" : "Arabic"}</label>
            <div className="relative">
              <input
                type="text"
                disabled={loadingField !== null}
                value={aboutAr.titleBr || ''}
                onChange={(e) => handleBilingualFieldChange('ar', 'about', 'titleBr', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pl-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                dir="rtl"
              />
              <TranslateButton
                sourceText={aboutAr.titleBr}
                targetLang="en"
                onTranslate={(val) => handleBilingualFieldChange('en', 'about', 'titleBr', val)}
                existingText={aboutEn.titleBr}
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
                value={aboutEn.titleBr || ''}
                onChange={(e) => handleBilingualFieldChange('en', 'about', 'titleBr', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pr-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                dir="ltr"
              />
              <TranslateButton
                sourceText={aboutEn.titleBr}
                targetLang="ar"
                onTranslate={(val) => handleBilingualFieldChange('ar', 'about', 'titleBr', val)}
                existingText={aboutAr.titleBr}
                isRTL={isRTL}
                className="absolute right-2.5 top-2.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Field: Biography Content */}
      <div className="space-y-3">
        <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          {isRTL ? "السيرة الذاتية" : "Biography Content"}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] text-zinc-500 uppercase">{isRTL ? "العربية" : "Arabic"}</label>
            <div className="relative">
              <textarea
                disabled={loadingField !== null}
                value={aboutAr.desc || ''}
                onChange={(e) => handleBilingualFieldChange('ar', 'about', 'desc', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pl-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none h-40 resize-none"
                dir="rtl"
              />
              <TranslateButton
                sourceText={aboutAr.desc}
                targetLang="en"
                onTranslate={(val) => handleBilingualFieldChange('en', 'about', 'desc', val)}
                existingText={aboutEn.desc}
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
                value={aboutEn.desc || ''}
                onChange={(e) => handleBilingualFieldChange('en', 'about', 'desc', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pr-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none h-40 resize-none"
                dir="ltr"
              />
              <TranslateButton
                sourceText={aboutEn.desc}
                targetLang="ar"
                onTranslate={(val) => handleBilingualFieldChange('ar', 'about', 'desc', val)}
                existingText={aboutAr.desc}
                isRTL={isRTL}
                className="absolute right-2.5 bottom-2.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* About Portrait Image */}
      <div className="border-t border-zinc-900 pt-6 space-y-4">
        <label className="block text-xs uppercase tracking-widest text-zinc-500">
          {isRTL ? "صورة المصور الشخصية" : "Photographer Portrait"}
        </label>
        <div className="flex items-center gap-6">
          {formData.gallery?.find(g => g.id === 2) && (
            <img
              src={getOptimizedImageUrl(formData.gallery.find(g => g.id === 2).src, 120)}
              alt="About Portrait"
              className="w-24 h-32 object-cover border border-zinc-800 bg-zinc-900 rounded"
            />
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              id="about-portrait-uploader"
              onChange={(e) => handleImageUpload(e, 'about')}
              className="hidden"
            />
            <label
              htmlFor="about-portrait-uploader"
              className="inline-flex items-center gap-2 border border-zinc-900 hover:border-theme-accent hover:text-white px-4 py-2 rounded text-xs transition-colors cursor-pointer"
            >
              <Upload size={12} />
              <span>{isRTL ? "تحميل صورة شخصية" : "Upload Portrait"}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
