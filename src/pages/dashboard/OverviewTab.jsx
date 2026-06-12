import { Download, Upload, Info, Cpu, CheckCircle, Calendar } from 'lucide-react';
import { isFirebaseConfigured } from '../../firebase/firebaseEnv';

export default function OverviewTab({
  formData,
  isRTL,
  handleExportBackup,
  handleImportBackup
}) {
  return (
    <div className="space-y-10">
      {/* Title */}
      <h3 className="text-lg font-light text-theme-accent border-b border-zinc-900 pb-3 font-serif" style={{ fontFamily: 'serif' }}>
        {isRTL ? "حالة النظام ونظرة عامة" : "System Status & Overview"}
      </h3>

      {/* Grid Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-zinc-900 p-5 rounded-lg bg-zinc-950/40">
          <span className="text-zinc-500 text-[10px] uppercase tracking-wider block mb-1">
            {isRTL ? "صور معرض الأعمال" : "Total Portfolio Images"}
          </span>
          <span className="text-3xl font-light text-white font-sans">
            {formData.gallery?.length || 0}
          </span>
        </div>
        
        <div className="border border-zinc-900 p-5 rounded-lg bg-zinc-950/40">
          <span className="text-zinc-500 text-[10px] uppercase tracking-wider block mb-1">
            {isRTL ? "باقات الأسعار النشطة" : "Active Pricing Tiers"}
          </span>
          <span className="text-3xl font-light text-white font-sans">
            {formData.packages?.length || 0}
          </span>
        </div>

        <div className="border border-zinc-900 p-5 rounded-lg bg-zinc-950/40">
          <span className="text-zinc-500 text-[10px] uppercase tracking-wider block mb-1">
            {isRTL ? "تقييمات العرسان" : "Testimonial Reviews"}
          </span>
          <span className="text-3xl font-light text-white font-sans">
            {formData.testimonials?.length || 0}
          </span>
        </div>
      </div>

      {/* About System Info Card */}
      <div className="border border-zinc-900 rounded-lg p-6 bg-zinc-950/25 space-y-4">
        <h4 className="text-xs uppercase tracking-widest text-theme-accent font-semibold flex items-center gap-2">
          <Info size={14} />
          {isRTL ? "بيانات ومعلومات النظام" : "System Information"}
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-theme-accent">
              <Cpu size={16} />
            </div>
            <div>
              <span className="text-[9px] text-zinc-500 block uppercase tracking-wider">{isRTL ? "الإصدار" : "Version"}</span>
              <span className="text-zinc-200 font-semibold font-mono">v1.0.0</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-theme-accent">
              <Calendar size={16} />
            </div>
            <div>
              <span className="text-[9px] text-zinc-500 block uppercase tracking-wider">{isRTL ? "رقم البناء" : "Build Number"}</span>
              <span className="text-zinc-200 font-semibold font-mono">2026.06.12</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-theme-accent">
              <CheckCircle size={16} />
            </div>
            <div>
              <span className="text-[9px] text-zinc-500 block uppercase tracking-wider">{isRTL ? "المطور" : "Developer Attribution"}</span>
              <span className="text-zinc-200 font-semibold">Mohamed Okash</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-zinc-500 border-t border-zinc-900/40 pt-3 flex justify-between items-center">
          <span>{isRTL ? "الربط السحابي مع Firestore" : "Firestore Database Sync"}</span>
          <span className={isFirebaseConfigured ? "text-emerald-400 font-bold" : "text-amber-500 font-bold"}>
            {isFirebaseConfigured ? (isRTL ? "نشط ومؤمن" : "ACTIVE & SYNCED") : (isRTL ? "وضع التجربة المحلي" : "LOCAL DEMO MODE")}
          </span>
        </div>
      </div>

      {/* Backup Actions */}
      <div className="border-t border-zinc-900 pt-8 space-y-4">
        <div>
          <h4 className="text-xs uppercase tracking-widest text-theme-accent mb-2">
            {isRTL ? "النسخ الاحتياطي وتأمين البيانات" : "Content Backups & Recovery"}
          </h4>
          <p className="text-xs text-zinc-500">
            {isRTL 
              ? "قم بتصدير البيانات كملف احتياطي لحمايتها من الضياع، أو قم باستيراد نسخة سابقة." 
              : "Download your website's content layout as a JSON file, or restore a previous snapshot."}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          {/* Export */}
          <button
            onClick={handleExportBackup}
            className="inline-flex items-center gap-2 border border-zinc-900 hover:border-theme-accent hover:text-white px-5 py-2.5 rounded text-xs transition-colors cursor-pointer text-zinc-400 focus:outline-none"
          >
            <Download size={14} />
            <span>{isRTL ? "تصدير نسخة احتياطية (JSON)" : "Export Backup (JSON)"}</span>
          </button>

          {/* Import */}
          <div className="relative">
            <input
              type="file"
              accept=".json"
              id="import-backup-file"
              onChange={handleImportBackup}
              className="hidden"
            />
            <label
              htmlFor="import-backup-file"
              className="inline-flex items-center gap-2 border border-zinc-900 hover:border-theme-accent hover:text-white px-5 py-2.5 rounded text-xs transition-colors cursor-pointer text-zinc-400"
            >
              <Upload size={14} />
              <span>{isRTL ? "استيراد نسخة احتياطية" : "Import Backup (JSON)"}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
