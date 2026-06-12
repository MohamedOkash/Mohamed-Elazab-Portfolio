import { useState, useCallback, useEffect } from 'react';
import { Plus, Trash2, RefreshCw, Save, ArrowUp, ArrowDown } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageHelper';
import TranslateButton from '../../components/TranslateButton';

export default function GalleryTab({
  formData,
  isRTL,
  handleImageUpload,
  handleGalleryCategoryChange,
  handleGalleryFieldChange,
  handleGallerySpanChange,
  handleMoveGalleryItem,
  handleDeleteGalleryItem,
  saveGalleryData // Pass a function from StudioDashboard to manually trigger gallery save
}) {
  const [dirtyItems, setDirtyItems] = useState(new Set());
  const [isSavingGlobal, setIsSavingGlobal] = useState(false);
  const [savingItemIds, setSavingItemIds] = useState(new Set());

  // Track field changes and mark dirty
  const wrappedFieldChange = (idx, field, value) => {
    handleGalleryFieldChange(idx, field, value);
    setDirtyItems(prev => new Set(prev).add(formData.gallery[idx]?.id));
  };

  const wrappedSpanChange = (idx, value) => {
    handleGallerySpanChange(idx, value);
    setDirtyItems(prev => new Set(prev).add(formData.gallery[idx]?.id));
  };

  const wrappedCategoryChange = (idx, value) => {
    handleGalleryFieldChange(idx, 'category', value);
    handleGalleryCategoryChange(idx, value);
    setDirtyItems(prev => new Set(prev).add(formData.gallery[idx]?.id));
  };

  const handleGlobalSave = async () => {
    if (!saveGalleryData) return;
    setIsSavingGlobal(true);
    await saveGalleryData();
    setDirtyItems(new Set());
    setIsSavingGlobal(false);
  };

  const handleItemSave = async (idx, id) => {
    if (!saveGalleryData) return;
    setSavingItemIds(prev => new Set(prev).add(id));
    await saveGalleryData(); // Save global state for now since firestore doesn't easily isolate array items without a dedicated collection
    
    setDirtyItems(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setSavingItemIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // Provide fallback save function if not passed
  const executeSave = saveGalleryData || (async () => {
    console.warn("saveGalleryData not provided from parent, simulating save...");
    return new Promise(res => setTimeout(res, 1000));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-zinc-900 pb-4">
        <h3 className="text-lg font-light text-theme-accent" style={{ fontFamily: 'serif' }}>
          {isRTL ? "إدارة معرض الصور" : "Portfolio Image Gallery"}
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              setIsSavingGlobal(true);
              await executeSave();
              setDirtyItems(new Set());
              setIsSavingGlobal(false);
            }}
            disabled={dirtyItems.size === 0 || isSavingGlobal}
            className={`px-4 py-2 text-xs font-bold rounded flex items-center gap-1.5 transition-all ${
              dirtyItems.size > 0 
                ? 'bg-theme-accent text-black hover:opacity-90 shadow-lg shadow-theme-accent/20 cursor-pointer' 
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {isSavingGlobal ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {isRTL ? "حفظ كل التغييرات" : "Save All Gallery Changes"}
          </button>
          
          <input
            type="file"
            accept="image/*"
            id="new-gallery-uploader"
            onChange={(e) => handleImageUpload(e, 'new_gallery_item')}
            className="hidden"
          />
          <label
            htmlFor="new-gallery-uploader"
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 text-xs font-bold rounded cursor-pointer transition-colors inline-flex items-center gap-1.5 border border-zinc-700"
          >
            <Plus size={14} />
            {isRTL ? "إضافة صورة" : "Add Image"}
          </label>
        </div>
      </div>

      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 pb-10">
        {formData.gallery?.map((item, idx) => {
          const isDirty = dirtyItems.has(item.id);
          const isSaving = savingItemIds.has(item.id);

          return (
            <div key={item.id} className={`flex flex-col gap-4 border p-4 bg-zinc-950/40 rounded animate-fade-in transition-colors ${isDirty ? 'border-theme-accent/50 shadow-[0_0_15px_rgba(212,175,55,0.05)]' : 'border-zinc-900'}`}>
              
              {/* Header Actions */}
              <div className="flex justify-between items-center pb-3 border-b border-zinc-900/50">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                  {isDirty ? (
                    <span className="text-theme-accent flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
                      {isRTL ? "تغييرات غير محفوظة" : "Unsaved Changes"}
                    </span>
                  ) : (
                    <span className="text-emerald-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {isRTL ? "تم الحفظ" : "Saved"}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => handleMoveGalleryItem(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 rounded transition-colors"
                    title={isRTL ? "تحريك لأعلى" : "Move Up"}
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleMoveGalleryItem(idx, 1)}
                    disabled={idx === formData.gallery.length - 1}
                    className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 rounded transition-colors"
                    title={isRTL ? "تحريك لأسفل" : "Move Down"}
                  >
                    <ArrowDown size={14} />
                  </button>
                  
                  <div className="w-px h-4 bg-zinc-800 mx-1" />

                  <input
                    type="file"
                    accept="image/*"
                    id={`replace-gallery-${idx}`}
                    onChange={(e) => {
                      handleImageUpload(e, 'gallery', idx);
                      setDirtyItems(prev => new Set(prev).add(item.id));
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor={`replace-gallery-${idx}`}
                    className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-theme-accent rounded cursor-pointer transition-colors"
                    title={isRTL ? "تغيير الصورة" : "Replace Image"}
                  >
                    <RefreshCw size={14} />
                  </label>

                  <button
                    type="button"
                    onClick={() => handleDeleteGalleryItem(idx)}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                    title={isRTL ? "حذف" : "Delete"}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="shrink-0 space-y-3">
                  <img
                    src={getOptimizedImageUrl(item.src, 200)}
                    alt={item.cat}
                    className="w-32 h-24 object-cover border border-zinc-800 bg-black rounded"
                  />
                  <button
                    onClick={async () => {
                      setSavingItemIds(prev => new Set(prev).add(item.id));
                      await executeSave();
                      setDirtyItems(prev => {
                        const next = new Set(prev);
                        next.delete(item.id);
                        return next;
                      });
                      setSavingItemIds(prev => {
                        const next = new Set(prev);
                        next.delete(item.id);
                        return next;
                      });
                    }}
                    disabled={!isDirty || isSaving}
                    className={`w-full py-1.5 text-[10px] uppercase tracking-wider font-bold rounded flex justify-center items-center gap-1.5 transition-all ${
                      isDirty
                        ? 'bg-theme-accent/10 border border-theme-accent/50 text-theme-accent hover:bg-theme-accent hover:text-black cursor-pointer'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    {isSaving ? (
                      <RefreshCw size={12} className="animate-spin" />
                    ) : (
                      <Save size={12} />
                    )}
                    {isRTL ? "حفظ التغييرات" : "Save Changes"}
                  </button>
                </div>
                
                <div className="flex-1 space-y-4 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[9px] uppercase tracking-wider text-zinc-500">
                          {isRTL ? "العنوان (عربي)" : "Title (Ar)"}
                        </label>
                        <TranslateButton
                          text={item.titleEn}
                          sourceLang="en"
                          targetLang="ar"
                          onTranslate={(val) => wrappedFieldChange(idx, 'titleAr', val)}
                          label={isRTL ? 'ترجم من الإنجليزية' : 'Translate from EN'}
                        />
                      </div>
                      <input
                        type="text"
                        value={item.titleAr || ''}
                        onChange={(e) => wrappedFieldChange(idx, 'titleAr', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-900 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[9px] uppercase tracking-wider text-zinc-500">
                          {isRTL ? "العنوان (إنجليزي)" : "Title (En)"}
                        </label>
                        <TranslateButton
                          text={item.titleAr}
                          sourceLang="ar"
                          targetLang="en"
                          onTranslate={(val) => wrappedFieldChange(idx, 'titleEn', val)}
                          label={isRTL ? 'ترجم من العربية' : 'Translate from AR'}
                        />
                      </div>
                      <input
                        type="text"
                        value={item.titleEn || ''}
                        onChange={(e) => wrappedFieldChange(idx, 'titleEn', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-900 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[9px] uppercase tracking-wider text-zinc-500">
                          {isRTL ? "المكان (عربي)" : "Location (Ar)"}
                        </label>
                        <TranslateButton
                          text={item.locationEn}
                          sourceLang="en"
                          targetLang="ar"
                          onTranslate={(val) => wrappedFieldChange(idx, 'locationAr', val)}
                          label={isRTL ? 'ترجم من الإنجليزية' : 'Translate from EN'}
                        />
                      </div>
                      <input
                        type="text"
                        value={item.locationAr || ''}
                        onChange={(e) => wrappedFieldChange(idx, 'locationAr', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-900 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[9px] uppercase tracking-wider text-zinc-500">
                          {isRTL ? "المكان (إنجليزي)" : "Location (En)"}
                        </label>
                        <TranslateButton
                          text={item.locationAr}
                          sourceLang="ar"
                          targetLang="en"
                          onTranslate={(val) => wrappedFieldChange(idx, 'locationEn', val)}
                          label={isRTL ? 'ترجم من العربية' : 'Translate from AR'}
                        />
                      </div>
                      <input
                        type="text"
                        value={item.locationEn || ''}
                        onChange={(e) => wrappedFieldChange(idx, 'locationEn', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-900 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">
                        {isRTL ? "القسم" : "Category"}
                      </label>
                      <select
                        value={item.category || item.cat || 'outdoor_sessions'}
                        onChange={(e) => wrappedCategoryChange(idx, e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-900 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                      >
                        <option value="wedding_halls">{isRTL ? "قاعات الزفاف" : "Wedding Halls"}</option>
                        <option value="beach_sessions">{isRTL ? "جلسات البحر" : "Beach Sessions"}</option>
                        <option value="outdoor_sessions">{isRTL ? "جلسات خارجية" : "Outdoor Sessions"}</option>
                        <option value="studio_sessions">{isRTL ? "جلسات الاستوديو" : "Studio Sessions"}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">
                        {isRTL ? "رابط انستجرام" : "Instagram Link"}
                      </label>
                      <input
                        type="text"
                        value={item.instagramLink || ''}
                        placeholder="https://instagram.com/..."
                        onChange={(e) => wrappedFieldChange(idx, 'instagramLink', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-900 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">
                      {isRTL ? "أبعاد العرض بالشبكة" : "Grid Span Width"}
                    </label>
                    <select
                      value={item.span}
                      onChange={(e) => wrappedSpanChange(idx, e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
                    >
                      <option value="md:col-span-1 md:row-span-1">{isRTL ? "مربع صغير (1x1)" : "Small Box (1x1)"}</option>
                      <option value="md:col-span-2 md:row-span-1">{isRTL ? "عريض (2x1)" : "Wide Banner (2x1)"}</option>
                      <option value="md:col-span-1 md:row-span-2">{isRTL ? "طويل (1x2)" : "Tall Frame (1x2)"}</option>
                      <option value="md:col-span-2 md:row-span-2">{isRTL ? "كبير جداً (2x2)" : "Huge Poster (2x2)"}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
