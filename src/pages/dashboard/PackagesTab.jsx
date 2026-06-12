import { useState } from 'react';
import { Plus, Trash2, Copy, Move, Eye, EyeOff, Star, Languages, RefreshCw } from 'lucide-react';
import { translateText } from '../../utils/translationHelper';
import TranslateButton from '../../components/TranslateButton';

export default function PackagesTab({
  formData,
  isRTL,
  tEdit,
  handlePackageFieldChange,
  handlePackagePromotionChange,
  handlePackageFeatureChange,
  handleDeletePackageFeature,
  handleAddPackageFeature,
  handleExtraFieldChange,
  handleTermFieldChange,
  handleDeleteTerm,
  handleAddTerm,
  handleAddPackage,
  handleDeletePackage,
  handleDuplicatePackage,
  handleReorderPackages,
  handleAddPackageGalleryImage,
  handleDeletePackageGalleryImage,
  handlePackageGalleryImageChange,
  showToast
}) {
  const [activePkgId, setActivePkgId] = useState(() => {
    return formData.packages?.[0]?.id || null;
  });
  const [loadingField, setLoadingField] = useState(null); // 'features', 'all'

  const activePkg = formData.packages?.find(p => p.id === activePkgId) || formData.packages?.[0];

  // HTML5 Drag & Drop handlers
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;
    handleReorderPackages(sourceIndex, targetIndex);
  };

  const handleTranslateFeatures = async (sourceLang, targetLang) => {
    if (!activePkg) return;
    const sourceList = sourceLang === 'ar' ? activePkg.featuresAr : activePkg.featuresEn;
    const targetList = targetLang === 'ar' ? activePkg.featuresAr : activePkg.featuresEn;

    if (!sourceList || sourceList.length === 0) {
      showToast('error', isRTL ? 'لا توجد ميزات للترجمة.' : 'No features found to translate.');
      return;
    }

    const hasAnyTargetText = targetList?.some(item => item?.trim());
    if (hasAnyTargetText) {
      const confirmReplace = window.confirm(
        isRTL 
          ? 'هل تريد استبدال ترجمة قائمة الميزات الحالية؟' 
          : 'Replace existing features list translation?'
      );
      if (!confirmReplace) return;
    }

    setLoadingField('features');
    try {
      const { translateList } = await import('../../utils/translationHelper');
      const translatedList = await translateList(sourceList, targetLang);
      
      const langType = targetLang === 'ar' ? 'Ar' : 'En';
      translatedList.forEach((val, idx) => {
        handlePackageFeatureChange(activePkg.id, langType, idx, val);
      });
      showToast('success', isRTL ? 'تمت ترجمة الميزات بنجاح!' : 'Features translated successfully!');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setLoadingField(null);
    }
  };

  const handleTranslateAll = async (direction) => {
    if (!activePkg) return;
    const sourceLang = direction === 'ar-to-en' ? 'ar' : 'en';
    const targetLang = direction === 'ar-to-en' ? 'en' : 'ar';
    const langSuffixTarget = targetLang === 'ar' ? 'Ar' : 'En';

    const targetTitle = targetLang === 'ar' ? activePkg.titleAr : activePkg.titleEn;
    const targetDesc = targetLang === 'ar' ? activePkg.descAr : activePkg.descEn;
    const targetPromo = targetLang === 'ar' ? activePkg.promotion?.labelAr : activePkg.promotion?.labelEn;
    const targetFeatures = targetLang === 'ar' ? activePkg.featuresAr : activePkg.featuresEn;

    const hasAnyTargetText = 
      targetTitle?.trim() || 
      targetDesc?.trim() || 
      (activePkg.promotion?.enabled && targetPromo?.trim()) ||
      targetFeatures?.some(item => item?.trim());

    if (hasAnyTargetText) {
      const confirmReplace = window.confirm(
        isRTL 
          ? 'تنبيه: بعض الحقول المستهدفة للباقة تحتوي على نصوص بالفعل. هل تريد استبدالها بالترجمة الجديدة؟' 
          : 'Warning: Some destination package fields already contain text. Do you want to replace them?'
      );
      if (!confirmReplace) return;
    }

    setLoadingField('all');
    try {
      // 1. Translate Title
      const titleVal = sourceLang === 'ar' ? activePkg.titleAr : activePkg.titleEn;
      if (titleVal?.trim()) {
        const titleTrans = await translateText(titleVal, targetLang);
        handlePackageFieldChange(activePkg.id, targetLang === 'ar' ? 'titleAr' : 'titleEn', titleTrans);
      }

      // 2. Translate Description
      const descVal = sourceLang === 'ar' ? activePkg.descAr : activePkg.descEn;
      if (descVal?.trim()) {
        const descTrans = await translateText(descVal, targetLang);
        handlePackageFieldChange(activePkg.id, targetLang === 'ar' ? 'descAr' : 'descEn', descTrans);
      }

      // 3. Translate Promotion Banner
      const promoVal = sourceLang === 'ar' ? activePkg.promotion?.labelAr : activePkg.promotion?.labelEn;
      if (activePkg.promotion?.enabled && promoVal?.trim()) {
        const promoTrans = await translateText(promoVal, targetLang);
        handlePackagePromotionChange(activePkg.id, targetLang === 'ar' ? 'labelAr' : 'labelEn', promoTrans);
      }

      // 4. Translate Features list
      const featuresVal = sourceLang === 'ar' ? activePkg.featuresAr : activePkg.featuresEn;
      if (featuresVal && featuresVal.length > 0) {
        const { translateList } = await import('../../utils/translationHelper');
        const featuresTrans = await translateList(featuresVal, targetLang);
        featuresTrans.forEach((val, idx) => {
          handlePackageFeatureChange(activePkg.id, langSuffixTarget, idx, val);
        });
      }

      showToast('success', isRTL ? 'تمت ترجمة باقة بالكامل بنجاح!' : 'Package fully translated successfully!');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setLoadingField(null);
    }
  };

  return (
    <div className="space-y-10">
      <h3 className="text-lg font-light text-theme-accent border-b border-zinc-900 pb-3" style={{ fontFamily: 'serif' }}>
        {isRTL ? "إدارة باقات الاستثمار والتصوير" : "Premium Package Management"}
      </h3>

      {/* Package Manager Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Package List & Quick Controls */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-zinc-950/40 border border-zinc-900 p-4 rounded">
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
              {isRTL ? "الباقات المتاحة" : "Available Packages"}
            </span>
            <button
              type="button"
              onClick={() => {
                handleAddPackage();
                // Auto-select the newly added package after state updates
                setTimeout(() => {
                  if (formData.packages && formData.packages.length > 0) {
                    const lastPkg = formData.packages[formData.packages.length - 1];
                    if (lastPkg) setActivePkgId(lastPkg.id);
                  }
                }, 50);
              }}
              className="bg-theme-accent text-black px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded hover:opacity-90 flex items-center gap-1 cursor-pointer focus:outline-none"
            >
              <Plus size={12} />
              {isRTL ? "إضافة باقة" : "Add Package"}
            </button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 animate-fade-in">
            {formData.packages?.map((pkg, idx) => {
              const isSelected = activePkg?.id === pkg.id;
              return (
                <div
                  key={pkg.id || idx}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, idx)}
                  onClick={() => setActivePkgId(pkg.id)}
                  className={`flex items-center justify-between p-3 border rounded transition-all duration-300 ${
                    isSelected
                      ? 'border-theme-accent bg-zinc-900/40 shadow-sm'
                      : 'border-zinc-900 bg-zinc-950/20 hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="cursor-grab text-zinc-600 hover:text-zinc-400 p-0.5 flex-shrink-0">
                      <Move size={14} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs truncate font-medium text-zinc-200">
                        {pkg.titleAr || pkg.title || (isRTL ? "باقة غير مسماة" : "Unnamed Package")}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        {pkg.price} {isRTL ? "ج.م" : "EGP"} {pkg.isVisible === false && "• Hidden"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    {/* Featured Star */}
                    {pkg.isFeatured && (
                      <Star size={12} className="text-amber-500 fill-amber-500" title="Featured" />
                    )}
                    {/* Duplicate */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicatePackage(pkg.id);
                      }}
                      className="text-zinc-500 hover:text-theme-accent p-1 focus:outline-none transition-colors cursor-pointer"
                      title={isRTL ? "تكرار الباقة" : "Duplicate Package"}
                    >
                      <Copy size={13} />
                    </button>
                    {/* Delete */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(isRTL ? "هل أنت متأكد من حذف هذه الباقة نهائياً؟" : "Are you sure you want to delete this package permanently?")) {
                          handleDeletePackage(pkg.id);
                          if (isSelected) {
                            const remaining = formData.packages.filter(p => p.id !== pkg.id);
                            setActivePkgId(remaining[0]?.id || null);
                          }
                        }
                      }}
                      className="text-zinc-500 hover:text-red-400 p-1 focus:outline-none transition-colors cursor-pointer"
                      title={isRTL ? "حذف الباقة" : "Delete Package"}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}

            {(!formData.packages || formData.packages.length === 0) && (
              <div className="text-center py-8 text-zinc-500 text-xs border border-dashed border-zinc-900 rounded">
                {isRTL ? "لا يوجد باقات متوفرة حالياً. اضغط إضافة باقة." : "No packages found. Click Add Package."}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Editor Form */}
        <div className="lg:col-span-2">
          {activePkg ? (
            <div className="border border-zinc-900 rounded-lg p-6 bg-zinc-950/20 space-y-6 animate-fade-in">
              
              {/* Header Status & Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                    {isRTL ? "تعديل بيانات الباقة" : "Editing Package Details"}
                  </span>
                  <span className="text-sm font-semibold text-white mt-1">
                    {activePkg.titleAr || activePkg.title || "New Package"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Translate All */}
                  <button
                    type="button"
                    disabled={loadingField !== null}
                    onClick={() => handleTranslateAll('ar-to-en')}
                    className="border border-zinc-900 hover:border-theme-accent text-zinc-400 hover:text-white px-2 py-1 rounded text-[10px] transition-colors inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {loadingField === 'all' ? <RefreshCw className="animate-spin" size={10} /> : <Languages size={10} />}
                    <span>{isRTL ? "✨ ترجمة الباقة إلى EN" : "✨ Translate Package to EN"}</span>
                  </button>
                  <button
                    type="button"
                    disabled={loadingField !== null}
                    onClick={() => handleTranslateAll('en-to-ar')}
                    className="border border-zinc-900 hover:border-theme-accent text-zinc-400 hover:text-white px-2 py-1 rounded text-[10px] transition-colors inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {loadingField === 'all' ? <RefreshCw className="animate-spin" size={10} /> : <Languages size={10} />}
                    <span>{isRTL ? "✨ ترجمة الباقة إلى AR" : "✨ Translate Package to AR"}</span>
                  </button>

                  <div className="h-4 w-px bg-zinc-900"></div>

                  {/* Featured Toggle */}
                  <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={activePkg.isFeatured === true}
                      onChange={(e) => handlePackageFieldChange(activePkg.id, 'isFeatured', e.target.checked)}
                      className="accent-theme-accent"
                    />
                    {isRTL ? "باقة مميزة" : "Featured"}
                  </label>

                  {/* Visibility Toggle */}
                  <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={activePkg.isVisible !== false}
                      onChange={(e) => handlePackageFieldChange(activePkg.id, 'isVisible', e.target.checked)}
                      className="accent-theme-accent"
                    />
                    {activePkg.isVisible !== false ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Eye size={12} /> {isRTL ? "نشطة" : "Visible"}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-zinc-500">
                        <EyeOff size={12} /> {isRTL ? "مخفية" : "Hidden"}
                      </span>
                    )}
                  </label>
                </div>
              </div>

              {/* Title AR / Title EN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-500">
                    {isRTL ? "العنوان بالكامل (العربية)" : "Arabic Title"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled={loadingField !== null}
                      value={activePkg.titleAr || ''}
                      onChange={(e) => handlePackageFieldChange(activePkg.id, 'titleAr', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pl-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                      dir="rtl"
                    />
                    <TranslateButton
                      sourceText={activePkg.titleAr}
                      targetLang="en"
                      onTranslate={(val) => handlePackageFieldChange(activePkg.id, 'titleEn', val)}
                      existingText={activePkg.titleEn}
                      isRTL={isRTL}
                      className="absolute left-2.5 top-2.5"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-500">
                    {isRTL ? "العنوان بالكامل (الإنجليزية)" : "English Title"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled={loadingField !== null}
                      value={activePkg.titleEn || ''}
                      onChange={(e) => handlePackageFieldChange(activePkg.id, 'titleEn', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pr-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                      dir="ltr"
                    />
                    <TranslateButton
                      sourceText={activePkg.titleEn}
                      targetLang="ar"
                      onTranslate={(val) => handlePackageFieldChange(activePkg.id, 'titleAr', val)}
                      existingText={activePkg.titleAr}
                      isRTL={isRTL}
                      className="absolute right-2.5 top-2.5"
                    />
                  </div>
                </div>
              </div>

              {/* Description AR / Description EN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-500">
                    {isRTL ? "وصف قصير (العربية)" : "Arabic Description"}
                  </label>
                  <div className="relative">
                    <textarea
                      disabled={loadingField !== null}
                      value={activePkg.descAr || ''}
                      onChange={(e) => handlePackageFieldChange(activePkg.id, 'descAr', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pl-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none h-16 resize-none"
                      dir="rtl"
                    />
                    <TranslateButton
                      sourceText={activePkg.descAr}
                      targetLang="en"
                      onTranslate={(val) => handlePackageFieldChange(activePkg.id, 'descEn', val)}
                      existingText={activePkg.descEn}
                      isRTL={isRTL}
                      className="absolute left-2.5 bottom-2.5"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-500">
                    {isRTL ? "وصف قصير (الإنجليزية)" : "English Description"}
                  </label>
                  <div className="relative">
                    <textarea
                      disabled={loadingField !== null}
                      value={activePkg.descEn || ''}
                      onChange={(e) => handlePackageFieldChange(activePkg.id, 'descEn', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 pr-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none h-16 resize-none"
                      dir="ltr"
                    />
                    <TranslateButton
                      sourceText={activePkg.descEn}
                      targetLang="ar"
                      onTranslate={(val) => handlePackageFieldChange(activePkg.id, 'descAr', val)}
                      existingText={activePkg.descAr}
                      isRTL={isRTL}
                      className="absolute right-2.5 bottom-2.5"
                    />
                  </div>
                </div>
              </div>

              {/* Price / Old Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                    {isRTL ? "السعر الحالي (جنيه)" : "Current Price (EGP)"}
                  </label>
                  <input
                    type="text"
                    value={activePkg.price || ''}
                    onChange={(e) => handlePackageFieldChange(activePkg.id, 'price', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                    {isRTL ? "السعر السابق (اختياري للخصومات)" : "Old Price (Optional discount)"}
                  </label>
                  <input
                    type="text"
                    value={activePkg.oldPrice || ''}
                    onChange={(e) => handlePackageFieldChange(activePkg.id, 'oldPrice', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none font-sans text-zinc-500"
                    placeholder="E.g. 5,500"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                  {isRTL ? "رابط صورة الغلاف" : "Cover Image URL"}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={activePkg.coverImage || ''}
                    onChange={(e) => handlePackageFieldChange(activePkg.id, 'coverImage', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 rounded p-2.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none font-sans"
                    placeholder="https://..."
                  />
                </div>
                {activePkg.coverImage && (
                  <div className="mt-2.5 relative w-full h-24 rounded border border-zinc-900 overflow-hidden">
                    <img src={activePkg.coverImage} className="w-full h-full object-cover" alt="Cover preview" />
                  </div>
                )}
              </div>

              {/* Banner Settings */}
              <div className="border border-zinc-900 p-4 bg-zinc-950/40 rounded space-y-3">
                <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={activePkg.promotion?.enabled === true}
                    onChange={(e) => handlePackagePromotionChange(activePkg.id, 'enabled', e.target.checked)}
                    className="accent-theme-accent"
                  />
                  {isRTL ? "إظهار شريط ترويجي أعلى الكارت" : "Show promotion badge/banner"}
                </label>

                {activePkg.promotion?.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="block text-[9px] uppercase tracking-wider text-zinc-500">
                        {isRTL ? "نص الشريط بالعربية" : "Banner Text (AR)"}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          disabled={loadingField !== null}
                          value={activePkg.promotion?.labelAr || ''}
                          onChange={(e) => handlePackagePromotionChange(activePkg.id, 'labelAr', e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-900 rounded px-2.5 py-1.5 pl-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                          dir="rtl"
                        />
                        <TranslateButton
                          sourceText={activePkg.promotion?.labelAr}
                          targetLang="en"
                          onTranslate={(val) => handlePackagePromotionChange(activePkg.id, 'labelEn', val)}
                          existingText={activePkg.promotion?.labelEn}
                          isRTL={isRTL}
                          className="absolute left-2.5 top-2"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] uppercase tracking-wider text-zinc-500">
                        {isRTL ? "نص الشريط بالإنجليزية" : "Banner Text (EN)"}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          disabled={loadingField !== null}
                          value={activePkg.promotion?.labelEn || ''}
                          onChange={(e) => handlePackagePromotionChange(activePkg.id, 'labelEn', e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-900 rounded px-2.5 py-1.5 pr-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                          dir="ltr"
                        />
                        <TranslateButton
                          sourceText={activePkg.promotion?.labelEn}
                          targetLang="ar"
                          onTranslate={(val) => handlePackagePromotionChange(activePkg.id, 'labelAr', val)}
                          existingText={activePkg.promotion?.labelAr}
                          isRTL={isRTL}
                          className="absolute right-2.5 top-2"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Features Lists (AR and EN side by side) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-zinc-900 pt-6">
                
                {/* Features Arabic */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                        {isRTL ? "ميزات الباقة بالعربية" : "Arabic Features"}
                      </span>
                      <button
                        type="button"
                        disabled={loadingField !== null}
                        onClick={() => handleTranslateFeatures('ar', 'en')}
                        className="text-[9px] text-theme-accent font-semibold transition-opacity hover:opacity-85 focus:outline-none cursor-pointer disabled:opacity-50"
                        title={isRTL ? "ترجمة الميزات إلى الإنجليزية" : "Translate features to English"}
                      >
                        {loadingField === 'features' ? <RefreshCw className="animate-spin" size={10} /> : "✨ Translate → EN"}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddPackageFeature(activePkg.id, 'Ar')}
                      className="text-theme-accent text-xs font-semibold flex items-center gap-1 focus:outline-none cursor-pointer"
                    >
                      <Plus size={12} /> {isRTL ? "إضافة" : "Add"}
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {activePkg.featuresAr?.map((feat, featIdx) => (
                      <div key={featIdx} className="flex gap-2 items-center relative animate-fade-in">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handlePackageFeatureChange(activePkg.id, 'Ar', featIdx, e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-900 rounded px-2.5 py-1.5 pl-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                          dir="rtl"
                        />
                        <TranslateButton
                          sourceText={feat}
                          targetLang="en"
                          onTranslate={(val) => handlePackageFeatureChange(activePkg.id, 'En', featIdx, val)}
                          existingText={activePkg.featuresEn?.[featIdx]}
                          isRTL={isRTL}
                          className="absolute left-8 top-2"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeletePackageFeature(activePkg.id, 'Ar', featIdx)}
                          className="text-zinc-500 hover:text-red-400 p-1.5 focus:outline-none cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features English */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                        {isRTL ? "ميزات الباقة بالإنجليزية" : "English Features"}
                      </span>
                      <button
                        type="button"
                        disabled={loadingField !== null}
                        onClick={() => handleTranslateFeatures('en', 'ar')}
                        className="text-[9px] text-theme-accent font-semibold transition-opacity hover:opacity-85 focus:outline-none cursor-pointer disabled:opacity-50"
                        title={isRTL ? "ترجمة الميزات إلى العربية" : "Translate features to Arabic"}
                      >
                        {loadingField === 'features' ? <RefreshCw className="animate-spin" size={10} /> : "✨ Translate → AR"}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddPackageFeature(activePkg.id, 'En')}
                      className="text-theme-accent text-xs font-semibold flex items-center gap-1 focus:outline-none cursor-pointer"
                    >
                      <Plus size={12} /> {isRTL ? "Add" : "إضافة"}
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {activePkg.featuresEn?.map((feat, featIdx) => (
                      <div key={featIdx} className="flex gap-2 items-center relative animate-fade-in">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handlePackageFeatureChange(activePkg.id, 'En', featIdx, e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-900 rounded px-2.5 py-1.5 pr-28 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                          dir="ltr"
                        />
                        <TranslateButton
                          sourceText={feat}
                          targetLang="ar"
                          onTranslate={(val) => handlePackageFeatureChange(activePkg.id, 'Ar', featIdx, val)}
                          existingText={activePkg.featuresAr?.[featIdx]}
                          isRTL={isRTL}
                          className="absolute right-8 top-2"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeletePackageFeature(activePkg.id, 'En', featIdx)}
                          className="text-zinc-500 hover:text-red-400 p-1.5 focus:outline-none cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Package Gallery Images */}
              <div className="border-t border-zinc-900 pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                    {isRTL ? "صور الباقة الإضافية (معرض الباقة)" : "Package Gallery Images"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddPackageGalleryImage(activePkg.id)}
                    className="text-theme-accent text-xs font-semibold flex items-center gap-1 focus:outline-none cursor-pointer"
                  >
                    <Plus size={12} /> {isRTL ? "إضافة صورة" : "Add Image"}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-1">
                  {activePkg.galleryImages?.map((imgUrl, imgIdx) => (
                    <div key={imgIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={imgUrl}
                        onChange={(e) => handlePackageGalleryImageChange(activePkg.id, imgIdx, e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-900 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none font-sans"
                        placeholder="https://..."
                      />
                      {imgUrl && (
                        <div className="w-8 h-8 rounded border border-zinc-900 overflow-hidden flex-shrink-0">
                          <img src={imgUrl} className="w-full h-full object-cover" alt="Preview" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeletePackageGalleryImage(activePkg.id, imgIdx)}
                        className="text-zinc-500 hover:text-red-400 p-1.5 focus:outline-none cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="border border-zinc-900 rounded-lg p-12 bg-zinc-950/20 text-center text-zinc-500 text-xs flex items-center justify-center h-full min-h-[300px]">
              {isRTL ? "يرجى تحديد باقة من القائمة لتعديلها أو إضافة واحدة جديدة." : "Please select a package from the list to edit, or add a new one."}
            </div>
          )}
        </div>
      </div>

      {/* Extras Addons Section */}
      <div className="border-t border-zinc-900 pt-8 space-y-4">
        <h4 className="text-sm uppercase tracking-widest text-theme-accent" style={{ fontFamily: 'serif' }}>
          {isRTL ? "الخدمات والمنتجات الإضافية" : "Extra Add-ons"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tEdit.extrasData?.map((extra, idx) => (
            <div key={extra.id || idx} className="border border-zinc-900 p-4 bg-zinc-950/20 rounded flex gap-4 animate-fade-in">
              <div className="flex-1">
                <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">{isRTL ? "الخدمة" : "Service"}</label>
                <input
                  type="text"
                  value={extra.title}
                  onChange={(e) => handleExtraFieldChange(idx, 'title', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                />
              </div>
              <div className="w-24">
                <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">{isRTL ? "السعر" : "Price"}</label>
                <input
                  type="text"
                  value={extra.price}
                  onChange={(e) => handleExtraFieldChange(idx, 'price', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none font-sans"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Terms Section */}
      <div className="border-t border-zinc-900 pt-8 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm uppercase tracking-widest text-theme-accent" style={{ fontFamily: 'serif' }}>
            {isRTL ? "شروط وسياسة الحجز" : "Booking Terms & Conditions"}
          </h4>
          <button
            type="button"
            onClick={handleAddTerm}
            className="border border-zinc-900 hover:border-theme-accent px-3 py-1 rounded text-xs transition-colors focus:outline-none cursor-pointer text-zinc-400 hover:text-white"
          >
            {isRTL ? "إضافة بند حجز" : "Add Term"}
          </button>
        </div>
        
        <div className="space-y-2.5">
          {tEdit.termsData?.map((term, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={term}
                onChange={(e) => handleTermFieldChange(idx, e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded px-3 py-1.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleDeleteTerm(idx)}
                className="p-2 border border-zinc-900 text-zinc-500 hover:text-red-400 hover:border-red-500/20 rounded focus:outline-none cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
