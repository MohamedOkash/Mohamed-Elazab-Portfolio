import { useState, useRef } from 'react';
import { Plus, Search, Trash2, Copy, Check, RefreshCw, Eye, Calendar, X } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageHelper';

export default function MediaManagerTab({
  isRTL,
  handleMediaUpload,
  uploadingMedia,
  mediaSearch,
  setMediaSearch,
  mediaLoading,
  filteredMedia,
  copyUrlToClipboard,
  copiedIndex,
  handleMediaDelete
}) {
  const [selectedFileForPreview, setSelectedFileForPreview] = useState(null);
  const [replaceTargetFileName, setReplaceTargetFileName] = useState(null);
  
  const replaceInputRef = useRef(null);

  const handleTriggerReplace = (fileName) => {
    setReplaceTargetFileName(fileName);
    if (replaceInputRef.current) {
      replaceInputRef.current.click();
    }
  };

  const onReplaceFileSelected = (e) => {
    if (replaceTargetFileName) {
      handleMediaUpload(e, replaceTargetFileName);
      setReplaceTargetFileName(null);
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return isRTL ? 'تاريخ غير معروف' : 'Unknown Date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-900 pb-4">
        <div>
          <h3 className="text-lg font-light text-theme-accent font-serif" style={{ fontFamily: 'serif' }}>
            {isRTL ? "مستودع الوسائط والصور" : "Media Asset Manager"}
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            {isRTL 
              ? "قم برفع وإدارة ملفات الصور الخاصة بك هنا واستخدم روابطها في الموقع." 
              : "Upload, replace, copy paths, and manage your image assets without needing the Firebase Console."}
          </p>
        </div>

        {/* Global Upload Buttons */}
        <div className="flex gap-3 items-center">
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            id="media-uploader-input"
            onChange={(e) => handleMediaUpload(e)}
            disabled={uploadingMedia}
            className="hidden"
          />
          <label
            htmlFor="media-uploader-input"
            className="bg-theme-accent text-black px-4 py-2.5 text-xs font-bold rounded cursor-pointer transition-colors inline-flex items-center gap-2 hover:opacity-90 focus:outline-none"
          >
            <Plus size={14} />
            <span>
              {uploadingMedia ? (isRTL ? "جاري الرفع..." : "Uploading...") : (isRTL ? "رفع ملف جديد" : "Upload New File")}
            </span>
          </label>

          {/* Hidden File Input specifically for Overwrite/Replace */}
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            ref={replaceInputRef}
            onChange={onReplaceFileSelected}
            className="hidden"
          />
        </div>
      </div>

      {/* Search / Filter bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder={isRTL ? "البحث باسم الملف..." : "Search files by name..."}
          value={mediaSearch}
          onChange={(e) => setMediaSearch(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-900 rounded py-2.5 pl-10 pr-4 text-xs text-zinc-300 focus:border-theme-accent focus:outline-none"
        />
      </div>

      {/* Media Files Grid */}
      {mediaLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-zinc-900 border-t-theme-accent rounded-full animate-spin"></div>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-16 text-xs text-zinc-500 border border-dashed border-zinc-900 rounded-lg bg-zinc-950/10">
          {isRTL ? "لا توجد ملفات وسائط متطابقة" : "No media files matching search criteria."}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2">
          {filteredMedia.map((file, idx) => (
            <div key={idx} className="border border-zinc-900 p-3 rounded-lg bg-zinc-950/20 space-y-3 flex flex-col group relative">
              
              {/* Thumbnail Container */}
              <div className="aspect-square bg-zinc-900 overflow-hidden relative rounded-md group">
                <img
                  src={getOptimizedImageUrl(file.url, 200)}
                  alt={file.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Lightbox / Preview Hover Trigger */}
                <button
                  onClick={() => setSelectedFileForPreview(file)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white focus:outline-none cursor-pointer"
                  title={isRTL ? "تكبير الصورة" : "Preview Image"}
                >
                  <Eye size={20} className="text-theme-accent" />
                </button>
              </div>
              
              {/* Filename & Upload Date */}
              <div className="space-y-1 min-w-0">
                <span className="text-[10px] text-zinc-200 truncate block font-sans" title={file.name}>
                  {file.name}
                </span>
                <span className="text-[9px] text-zinc-500 font-sans flex items-center gap-1">
                  <Calendar size={10} />
                  {formatDate(file.uploadDate)}
                </span>
              </div>

              {/* Actions row */}
              <div className="flex gap-1.5 pt-1 mt-auto">
                <button
                  onClick={() => copyUrlToClipboard(file.url, idx)}
                  className="flex-1 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800 rounded text-[9px] font-bold uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer focus:outline-none"
                >
                  {copiedIndex === idx ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                  {copiedIndex === idx ? (isRTL ? "تم النسخ" : "Copied!") : (isRTL ? "نسخ الرابط" : "Copy URL")}
                </button>
                
                {/* Replace File */}
                <button
                  onClick={() => handleTriggerReplace(file.name)}
                  className="p-1.5 border border-zinc-850 text-zinc-500 hover:text-theme-accent hover:border-theme-accent/25 rounded focus:outline-none cursor-pointer"
                  title={isRTL ? "استبدال الملف" : "Replace/Overwrite File"}
                >
                  <RefreshCw size={12} />
                </button>

                {/* Delete File */}
                <button
                  onClick={() => handleMediaDelete(file)}
                  className="p-1.5 border border-zinc-850 text-zinc-500 hover:text-red-400 hover:border-red-500/25 rounded focus:outline-none cursor-pointer"
                  title={isRTL ? "حذف الملف" : "Delete File"}
                >
                  <Trash2 size={12} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {selectedFileForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in">
          <button
            onClick={() => setSelectedFileForPreview(null)}
            className="absolute top-6 right-6 text-zinc-400 hover:text-white focus:outline-none p-2 cursor-pointer"
          >
            <X size={24} />
          </button>
          
          <div className="max-w-3xl max-h-[80vh] flex flex-col items-center gap-4 bg-zinc-950 p-4 border border-zinc-900 rounded-lg">
            <img 
              src={selectedFileForPreview.url} 
              alt={selectedFileForPreview.name} 
              className="max-w-full max-h-[60vh] object-contain rounded"
            />
            
            <div className="w-full text-center space-y-2">
              <p className="text-xs text-zinc-300 font-mono truncate max-w-lg mx-auto">{selectedFileForPreview.name}</p>
              <p className="text-[10px] text-zinc-500 font-sans">{isRTL ? "تاريخ الرفع: " : "Uploaded: "}{formatDate(selectedFileForPreview.uploadDate)}</p>
              
              <div className="flex justify-center gap-4 mt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedFileForPreview.url);
                    alert(isRTL ? "تم نسخ رابط الصورة!" : "Image URL copied to clipboard!");
                  }}
                  className="bg-theme-accent text-black font-semibold px-4 py-1.5 text-xs rounded uppercase hover:opacity-90 cursor-pointer"
                >
                  {isRTL ? "نسخ رابط الصورة" : "Copy Image Link"}
                </button>
                <button
                  onClick={() => setSelectedFileForPreview(null)}
                  className="border border-zinc-800 text-zinc-400 hover:text-white px-4 py-1.5 text-xs rounded uppercase hover:bg-zinc-900 cursor-pointer"
                >
                  {isRTL ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
