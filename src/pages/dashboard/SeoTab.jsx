import { useState } from 'react';
import { Languages, RefreshCw } from 'lucide-react';
import { translateText } from '../../utils/translationHelper';
import TranslateButton from '../../components/TranslateButton';

const pages = ['home', 'gallery', 'packages', 'about', 'contact'];

export default function SeoTab({ formData, isRTL, handleGlobalFieldChange, showToast }) {
  const [activePage, setActivePage] = useState('home');
  const [loadingField, setLoadingField] = useState(null); // 'all'
  const seo = formData.settings?.seo || {};
  const pageSeo = seo.pages?.[activePage] || {};

  const updatePage = (field, value) => {
    handleGlobalFieldChange('settings', 'seo', {
      ...seo,
      pages: {
        ...(seo.pages || {}),
        [activePage]: {
          ...(seo.pages?.[activePage] || {}),
          [field]: value
        }
      }
    });
  };

  const handleTranslateAll = async (direction) => {
    const sourceLang = direction === 'ar-to-en' ? 'ar' : 'en';
    const targetLang = direction === 'ar-to-en' ? 'en' : 'ar';
    const suffixSource = sourceLang === 'ar' ? 'Ar' : 'En';
    const suffixTarget = targetLang === 'ar' ? 'Ar' : 'En';

    const fields = ['title', 'description', 'keywords'];
    const hasAnyContent = fields.some(f => pageSeo[`${f}${suffixSource}`]?.trim());

    if (!hasAnyContent) {
      showToast('error', isRTL ? 'لا يوجد محتوى للترجمة.' : 'No content found to translate.');
      return;
    }

    const hasAnyTargetText = fields.some(f => pageSeo[`${f}${suffixTarget}`]?.trim());
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
      let updatedPageData = { ...(seo.pages?.[activePage] || {}) };
      for (const field of fields) {
        const textVal = pageSeo[`${field}${suffixSource}`];
        if (textVal?.trim()) {
          const translation = await translateText(textVal, targetLang);
          updatedPageData[`${field}${suffixTarget}`] = translation;
        }
      }
      handleGlobalFieldChange('settings', 'seo', {
        ...seo,
        pages: {
          ...(seo.pages || {}),
          [activePage]: updatedPageData
        }
      });
      showToast('success', isRTL ? 'تمت ترجمة كافة حقول الأرشفة بنجاح!' : 'All SEO fields translated successfully!');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setLoadingField(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tab Header & Global Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-900 pb-4">
        <div>
          <h3 className="text-lg font-light text-theme-accent font-serif" style={{ fontFamily: 'serif' }}>
            {isRTL ? "تهيئة صفحات محركات البحث" : "Per-page Search Engine Optimization"}
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            {isRTL ? "قم بتهيئة العناوين والكلمات المفتاحية لكل صفحة لزيادة ظهورك في البحث." : "Configure title tags, descriptions and keywords to boost your search presence."}
          </p>
        </div>

        {/* Bulk Translate */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleTranslateAll('ar-to-en')}
            disabled={loadingField !== null}
            className="border border-zinc-900 hover:border-theme-accent text-zinc-400 hover:text-white px-3 py-1.5 rounded text-[10px] transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loadingField === 'all' ? <RefreshCw className="animate-spin" size={12} /> : <Languages size={12} />}
            <span>{isRTL ? "✨ ترجمة القسم إلى الإنجليزية" : "✨ Translate SEO to EN"}</span>
          </button>
          <button
            type="button"
            onClick={() => handleTranslateAll('en-to-ar')}
            disabled={loadingField !== null}
            className="border border-zinc-900 hover:border-theme-accent text-zinc-400 hover:text-white px-3 py-1.5 rounded text-[10px] transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loadingField === 'all' ? <RefreshCw className="animate-spin" size={12} /> : <Languages size={12} />}
            <span>{isRTL ? "✨ ترجمة القسم إلى العربية" : "✨ Translate SEO to AR"}</span>
          </button>
        </div>
      </div>

      {/* Page Selector */}
      <div className="flex flex-wrap gap-2">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => setActivePage(page)}
            className={`px-3 py-1.5 rounded border text-[10px] tracking-wider uppercase font-semibold transition-all ${
              activePage === page 
                ? 'border-theme-accent text-theme-accent bg-zinc-900/50' 
                : 'border-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Field: Title */}
      <div className="space-y-3">
        <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          {isRTL ? "عنوان الصفحة" : "Page Title"}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] text-zinc-500 uppercase">{isRTL ? "العربية" : "Arabic"}</label>
            <div className="relative">
              <input
                type="text"
                disabled={loadingField !== null}
                value={pageSeo.titleAr || ''}
                onChange={(e) => updatePage('titleAr', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pl-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                dir="rtl"
              />
              <TranslateButton
                sourceText={pageSeo.titleAr}
                targetLang="en"
                onTranslate={(val) => updatePage('titleEn', val)}
                existingText={pageSeo.titleEn}
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
                value={pageSeo.titleEn || ''}
                onChange={(e) => updatePage('titleEn', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pr-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                dir="ltr"
              />
              <TranslateButton
                sourceText={pageSeo.titleEn}
                targetLang="ar"
                onTranslate={(val) => updatePage('titleAr', val)}
                existingText={pageSeo.titleAr}
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
          {isRTL ? "وصف الميتا" : "Meta Description"}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] text-zinc-500 uppercase">{isRTL ? "العربية" : "Arabic"}</label>
            <div className="relative">
              <textarea
                disabled={loadingField !== null}
                value={pageSeo.descriptionAr || ''}
                onChange={(e) => updatePage('descriptionAr', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pl-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none h-24 resize-none"
                dir="rtl"
              />
              <TranslateButton
                sourceText={pageSeo.descriptionAr}
                targetLang="en"
                onTranslate={(val) => updatePage('descriptionEn', val)}
                existingText={pageSeo.descriptionEn}
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
                value={pageSeo.descriptionEn || ''}
                onChange={(e) => updatePage('descriptionEn', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pr-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none h-24 resize-none"
                dir="ltr"
              />
              <TranslateButton
                sourceText={pageSeo.descriptionEn}
                targetLang="ar"
                onTranslate={(val) => updatePage('descriptionAr', val)}
                existingText={pageSeo.descriptionAr}
                isRTL={isRTL}
                className="absolute right-2.5 bottom-2.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Field: Keywords */}
      <div className="space-y-3">
        <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          {isRTL ? "الكلمات المفتاحية" : "Keywords"}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] text-zinc-500 uppercase">{isRTL ? "العربية" : "Arabic"}</label>
            <div className="relative">
              <input
                type="text"
                disabled={loadingField !== null}
                value={pageSeo.keywordsAr || ''}
                onChange={(e) => updatePage('keywordsAr', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pl-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                dir="rtl"
                placeholder="مثال: تصوير زفاف، مصور خطوبة"
              />
              <TranslateButton
                sourceText={pageSeo.keywordsAr}
                targetLang="en"
                onTranslate={(val) => updatePage('keywordsEn', val)}
                existingText={pageSeo.keywordsEn}
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
                value={pageSeo.keywordsEn || ''}
                onChange={(e) => updatePage('keywordsEn', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pr-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                dir="ltr"
                placeholder="e.g. wedding photography, booking"
              />
              <TranslateButton
                sourceText={pageSeo.keywordsEn}
                targetLang="ar"
                onTranslate={(val) => updatePage('keywordsAr', val)}
                existingText={pageSeo.keywordsAr}
                isRTL={isRTL}
                className="absolute right-2.5 top-2.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Field: OG Image URL */}
      <div className="space-y-2 border-t border-zinc-900 pt-6">
        <label className="block text-xs uppercase tracking-widest text-zinc-500">{isRTL ? "صورة المشاركة (OG Image)" : "Open Graph Image URL"}</label>
        <input
          type="text"
          value={pageSeo.ogImage || ''}
          onChange={(e) => updatePage('ogImage', e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
          placeholder="https://..."
        />
      </div>
    </div>
  );
}
