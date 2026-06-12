import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { translateText } from '../utils/translationHelper';

export default function TranslateButton({
  sourceText,
  targetLang,
  onTranslate,
  existingText,
  isRTL,
  className = ""
}) {
  const [status, setStatus] = useState('idle'); // 'idle', 'translating', 'success', 'error'

  const handleTranslate = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === 'translating') return;

    const cleanSource = (sourceText || '').trim();
    if (!cleanSource) {
      alert(isRTL ? 'الرجاء إدخال نص للترجمة أولاً.' : 'Please enter text to translate first.');
      return;
    }

    if (existingText?.trim()) {
      const confirmReplace = window.confirm(
        isRTL 
          ? 'هل تريد استبدال الترجمة الحالية؟' 
          : 'Replace existing translation?'
      );
      if (!confirmReplace) return;
    }

    setStatus('translating');
    try {
      const translation = await translateText(cleanSource, targetLang);
      onTranslate(translation);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  const getLabel = () => {
    if (status === 'translating') return isRTL ? '✨ جاري الترجمة...' : '✨ Translating...';
    if (status === 'success') return isRTL ? '✓ تم الترجمة' : '✓ Translated';
    if (status === 'error') return isRTL ? '❌ فشلت الترجمة' : '❌ Translation Failed';
    return targetLang === 'ar' ? '✨ Translate → AR' : '✨ Translate → EN';
  };

  return (
    <button
      type="button"
      disabled={status === 'translating'}
      onClick={handleTranslate}
      className={`text-[10px] text-theme-accent hover:opacity-85 font-semibold transition-all focus:outline-none cursor-pointer disabled:opacity-50 inline-flex items-center gap-1 select-none ${className}`}
    >
      {status === 'translating' && <RefreshCw className="animate-spin" size={10} />}
      <span>{getLabel()}</span>
    </button>
  );
}
