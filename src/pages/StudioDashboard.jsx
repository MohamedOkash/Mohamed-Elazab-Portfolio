import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import BrandLogo from '../components/BrandLogo';
import { isFirebaseConfigured } from '../firebase/firebaseEnv';
import { saveCollectionToDb, importBackupJson } from '../firebase/dbHelper';
import { 
  Settings, LogOut, Image as ImageIcon,
  Layers, User, DollarSign, MessageSquare, Phone, Globe, 
  ShieldCheck, Menu, X, RefreshCw, Key
} from 'lucide-react';

const OverviewTab = lazy(() => import('./dashboard/OverviewTab'));
const HeroTab = lazy(() => import('./dashboard/HeroTab'));
const AboutTab = lazy(() => import('./dashboard/AboutTab'));
const GalleryTab = lazy(() => import('./dashboard/GalleryTab'));
const PackagesTab = lazy(() => import('./dashboard/PackagesTab'));
const ReviewsTab = lazy(() => import('./dashboard/ReviewsTab'));
const ContactTab = lazy(() => import('./dashboard/ContactTab'));
const SeoTab = lazy(() => import('./dashboard/SeoTab'));
const SettingsTab = lazy(() => import('./dashboard/SettingsTab'));
const MediaManagerTab = lazy(() => import('./dashboard/MediaManagerTab'));
const AccountTab = lazy(() => import('./dashboard/AccountTab'));

// Pure/external filename helper to satisfy strict render purity linter checks
const generateStoragePath = (fileName) => {
  return `portfolio/${Date.now()}_${fileName}`;
};

export default function StudioDashboard({ 
  colors, isRTL, masterData, setMasterData, handleLogout 
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [editingLang, setEditingLang] = useState('ar');
  
  // Sidebar states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error', 'draft'
  const [modifiedCollections, setModifiedCollections] = useState(new Set());
  
  // Form state
  const [formData, setFormData] = useState(null);
  
  // Media manager states
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaSearch, setMediaSearch] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const saveTimeoutRef = useRef(null);

  const [toast, setToast] = useState(null);
  
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const handleBilingualFieldChange = (lang, section, key, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      if (!updated[lang]) updated[lang] = {};
      if (!updated[lang][section]) updated[lang][section] = {};
      updated[lang][section][key] = value;
      return updated;
    });
    markAsModified(`content_${lang}`);
  };

  const loadMediaFiles = async () => {
    setMediaLoading(true);
    if (isFirebaseConfigured) {
      try {
        const { getStorageClient } = await import('../firebase/storageClient');
        const storage = await getStorageClient();
        if (storage) {
          const { ref, listAll, getDownloadURL, getMetadata } = await import('firebase/storage');
          const listRef = ref(storage, 'portfolio');
          const res = await listAll(listRef);
          const files = await Promise.all(
            res.items.map(async (itemRef) => {
              const url = await getDownloadURL(itemRef);
              let uploadDate = '';
              try {
                const meta = await getMetadata(itemRef);
                uploadDate = meta.timeCreated;
              } catch (e) {
                console.error("Failed to load metadata", e);
              }
              return { name: itemRef.name, url, uploadDate };
            })
          );
          setMediaFiles(files);
        }
      } catch (err) {
        console.error("Error listing media files:", err);
      } finally {
        setMediaLoading(false);
      }
    } else {
      // Local demo files simulation
      const cached = localStorage.getItem('elazab_demo_media');
      setMediaFiles(cached ? JSON.parse(cached) : [
        { name: "sample_wedding_1.jpg", url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800", uploadDate: "2026-06-11T12:00:00Z" },
        { name: "sample_wedding_2.jpg", url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800", uploadDate: "2026-06-11T12:30:00Z" }
      ]);
      setMediaLoading(false);
    }
  };

  // Clone masterData locally for editing
  useEffect(() => {
    if (masterData && !formData) {
      const timer = setTimeout(() => {
        setFormData(JSON.parse(JSON.stringify(masterData)));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [masterData, formData]);

  // Load media files on tab change
  useEffect(() => {
    if (activeTab === 'media') {
      const timer = setTimeout(() => {
        loadMediaFiles();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // Debounced auto-save triggers
  const markAsModified = (collectionName) => {
    setSaveStatus('draft');
    setModifiedCollections((prev) => {
      const next = new Set(prev);
      next.add(collectionName);
      return next;
    });
  };

  // Debounced Auto-Save System
  useEffect(() => {
    if (modifiedCollections.size === 0) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        const collectionsToSave = Array.from(modifiedCollections);
        
        await Promise.all(
          collectionsToSave.map(async (col) => {
            await saveCollectionToDb(col, formData);
          })
        );
        
        // Update global app state
        setMasterData(JSON.parse(JSON.stringify(formData)));
        setModifiedCollections(new Set());
        setSaveStatus('saved');
      } catch (err) {
        console.error("Auto-save failed:", err);
        setSaveStatus('error');
      }
    }, 1500); // 1.5 seconds debounce

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [formData, modifiedCollections, setMasterData]);


  const handleGlobalFieldChange = (section, key, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      if (!updated[section]) updated[section] = {};
      updated[section][key] = value;
      return updated;
    });
    markAsModified(section);
  };

  // Upload/Replace handlers
  const handleImageUpload = async (e, type, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    setSaveStatus('saving');
    
    if (isFirebaseConfigured) {
      try {
        const { getStorageClient } = await import('../firebase/storageClient');
        const storage = await getStorageClient();
        if (storage) {
          const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
          const fileRef = ref(storage, generateStoragePath(file.name));
          const snapshot = await uploadBytes(fileRef, file);
          const downloadUrl = await getDownloadURL(snapshot.ref);

          applyUploadedImageUrl(downloadUrl, type, index);
          setSaveStatus('saved');
        }
      } catch (err) {
        console.error("Firebase upload failed:", err);
        setSaveStatus('error');
      }
    } else {
      // Local Base64 fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        applyUploadedImageUrl(reader.result, type, index);
        setSaveStatus('saved');
      };
      reader.readAsDataURL(file);
    }
  };

  const applyUploadedImageUrl = (url, type, index) => {
    setFormData((prev) => {
      const updated = { ...prev };
      if (type === 'gallery' && index !== null) {
        updated.gallery[index].src = url;
        updated.gallery[index].mediumUrl = url;
        updated.gallery[index].thumbnailUrl = url;
      } else if (type === 'about') {
        // Find index representing bio image (we assume index 2 is default)
        const idx = updated.gallery.findIndex(g => g.id === 2);
        if (idx !== -1) updated.gallery[idx].src = url;
      } else if (type === 'hero') {
        const idx = updated.gallery.findIndex(g => g.id === 1);
        if (idx !== -1) {
          updated.gallery[idx].src = url;
          updated.gallery[idx].mediumUrl = url;
          updated.gallery[idx].thumbnailUrl = url;
        }
        updated.settings = {
          ...(updated.settings || {}),
          heroImageUrl: url,
          heroImageUpdatedAt: new Date().toISOString()
        };
      } else if (type === 'contact') {
        const idx = updated.gallery.findIndex(g => g.id === 4);
        if (idx !== -1) updated.gallery[idx].src = url;
      } else if (type === 'new_gallery_item') {
        const newId = updated.gallery.length > 0 ? Math.max(...updated.gallery.map(g => g.id)) + 1 : 1;
        updated.gallery.push({
          id: newId,
          src: url,
          mediumUrl: url,
          thumbnailUrl: url,
          span: "md:col-span-1 md:row-span-1",
          cat: "outdoor_sessions",
          category: "outdoor_sessions",
          titleAr: "",
          titleEn: "",
          locationAr: "عام",
          locationEn: "General",
          instagramLink: "",
          order: newId
        });
      }
      return updated;
    });
    markAsModified('gallery');
    if (type === 'hero') markAsModified('settings');
  };

  // Gallery control updates
  const handleGallerySpanChange = (index, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated.gallery[index].span = value;
      return updated;
    });
    markAsModified('gallery');
  };

  const handleGalleryCategoryChange = (index, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated.gallery[index].cat = value;
      return updated;
    });
    markAsModified('gallery');
  };

  const handleGalleryFieldChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      if (!updated.gallery[index]) return updated;
      updated.gallery[index][field] = value;
      return updated;
    });
    markAsModified('gallery');
  };

  const handleMoveGalleryItem = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= formData.gallery.length) return;
    
    setFormData((prev) => {
      const updated = { ...prev };
      const list = [...updated.gallery];
      const temp = list[index];
      list[index] = list[nextIndex];
      list[nextIndex] = temp;
      
      // Update order indexes
      list.forEach((item, idx) => {
        item.order = idx;
      });
      
      updated.gallery = list;
      return updated;
    });
    markAsModified('gallery');
  };

  const handleDeleteGalleryItem = (index) => {
    if (!window.confirm(isRTL ? "هل أنت متأكد من الحذف؟" : "Are you sure you want to delete this item?")) return;
    setFormData((prev) => {
      const updated = { ...prev };
      updated.gallery.splice(index, 1);
      return updated;
    });
    markAsModified('gallery');
  };

  // Package control updates
  const handleAddPackage = () => {
    setFormData((prev) => {
      const updated = { ...prev };
      const newPkg = {
        id: Math.random().toString(36).substring(2, 9),
        title: "New Package",
        titleAr: "باقة جديدة",
        titleEn: "New Package",
        descAr: "وصف الباقة الجديدة",
        descEn: "Description of the new package",
        price: "1,000",
        oldPrice: "",
        features: ["ميزة جديدة"],
        featuresAr: ["ميزة جديدة"],
        featuresEn: ["New feature"],
        coverImage: "",
        galleryImages: [],
        promotion: { enabled: false, labelAr: "", labelEn: "" },
        isFeatured: false,
        isVisible: true,
        order: updated.packages.length
      };
      updated.packages.push(newPkg);
      return updated;
    });
    markAsModified('packages');
  };

  const handleDeletePackage = (pkgId) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated.packages = updated.packages.filter(p => p.id !== pkgId);
      updated.packages.forEach((p, idx) => {
        p.order = idx;
      });
      return updated;
    });
    markAsModified('packages');
  };

  const handleDuplicatePackage = (pkgId) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const original = updated.packages.find(p => p.id === pkgId);
      if (original) {
        const clone = {
          ...JSON.parse(JSON.stringify(original)),
          id: Math.random().toString(36).substring(2, 9),
          titleAr: original.titleAr + " (نسخة)",
          titleEn: original.titleEn + " (Copy)",
          order: updated.packages.length
        };
        updated.packages.push(clone);
      }
      return updated;
    });
    markAsModified('packages');
  };

  const handleReorderPackages = (sourceIdx, targetIdx) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const list = [...updated.packages];
      const [moved] = list.splice(sourceIdx, 1);
      list.splice(targetIdx, 0, moved);
      list.forEach((item, idx) => {
        item.order = idx;
      });
      updated.packages = list;
      return updated;
    });
    markAsModified('packages');
  };

  const handlePackageFieldChange = (pkgId, field, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const pkg = updated.packages.find(p => p.id === pkgId);
      if (pkg) pkg[field] = value;
      return updated;
    });
    markAsModified('packages');
  };

  const handlePackagePromotionChange = (pkgId, field, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const pkg = updated.packages.find(p => p.id === pkgId);
      if (pkg) {
        pkg.promotion = {
          enabled: false,
          labelAr: '',
          labelEn: '',
          ...(pkg.promotion || {}),
          [field]: value
        };
      }
      return updated;
    });
    markAsModified('packages');
  };

  const handlePackageFeatureChange = (pkgId, langType, featIndex, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const pkg = updated.packages.find(p => p.id === pkgId);
      if (pkg) {
        const fieldName = `features${langType}`;
        pkg[fieldName][featIndex] = value;
      }
      return updated;
    });
    markAsModified('packages');
  };

  const handleAddPackageFeature = (pkgId, langType) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const pkg = updated.packages.find(p => p.id === pkgId);
      if (pkg) {
        const fieldName = `features${langType}`;
        if (!pkg[fieldName]) pkg[fieldName] = [];
        pkg[fieldName].push(langType === 'Ar' ? "ميزة جديدة" : "New feature");
      }
      return updated;
    });
    markAsModified('packages');
  };

  const handleDeletePackageFeature = (pkgId, langType, featIndex) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const pkg = updated.packages.find(p => p.id === pkgId);
      if (pkg) {
        const fieldName = `features${langType}`;
        pkg[fieldName].splice(featIndex, 1);
      }
      return updated;
    });
    markAsModified('packages');
  };

  const handleAddPackageGalleryImage = (pkgId) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const pkg = updated.packages.find(p => p.id === pkgId);
      if (pkg) {
        if (!pkg.galleryImages) pkg.galleryImages = [];
        pkg.galleryImages.push('');
      }
      return updated;
    });
    markAsModified('packages');
  };

  const handleDeletePackageGalleryImage = (pkgId, imgIndex) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const pkg = updated.packages.find(p => p.id === pkgId);
      if (pkg) {
        pkg.galleryImages.splice(imgIndex, 1);
      }
      return updated;
    });
    markAsModified('packages');
  };

  const handlePackageGalleryImageChange = (pkgId, imgIndex, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const pkg = updated.packages.find(p => p.id === pkgId);
      if (pkg) {
        pkg.galleryImages[imgIndex] = value;
      }
      return updated;
    });
    markAsModified('packages');
  };

  // Extras CMS updates
  const handleExtraFieldChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated[editingLang].extrasData[index][field] = value;
      return updated;
    });
    markAsModified(`content_${editingLang}`);
  };

  // Terms CMS updates
  const handleTermFieldChange = (index, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated[editingLang].termsData[index] = value;
      return updated;
    });
    markAsModified(`content_${editingLang}`);
  };

  const handleAddTerm = () => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated[editingLang].termsData.push(editingLang === 'ar' ? "قاعدة جديدة" : "New booking rule");
      return updated;
    });
    markAsModified(`content_${editingLang}`);
  };

  const handleDeleteTerm = (index) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated[editingLang].termsData.splice(index, 1);
      return updated;
    });
    markAsModified(`content_${editingLang}`);
  };

  // Reviews CMS updates
  const handleReviewChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated.testimonials[index][field] = value;
      return updated;
    });
    markAsModified('reviews');
  };

  const handleAddReview = () => {
    setFormData((prev) => {
      const updated = { ...prev };
      const newId = updated.testimonials.length > 0 ? Math.max(...updated.testimonials.map(t => t.id)) + 1 : 1;
      updated.testimonials.push({
        id: newId,
        name: editingLang === 'ar' ? "عرسان جدد" : "New Couple",
        email: "",
        phone: "",
        text: editingLang === 'ar' ? "اكتب تفاصيل التقييم هنا..." : "Write review description...",
        rating: 5,
        isPublished: true,
        createdAt: new Date().toISOString()
      });
      return updated;
    });
    markAsModified('reviews');
  };

  const handleDeleteReview = (index) => {
    if (!window.confirm(isRTL ? "هل أنت متأكد من الحذف؟" : "Are you sure you want to delete this review?")) return;
    setFormData((prev) => {
      const updated = { ...prev };
      updated.testimonials.splice(index, 1);
      return updated;
    });
    markAsModified('reviews');
  };

  // Backup handlers
  const handleExportBackup = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `elazab_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportBackup = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (!importedData.ar || !importedData.en || !importedData.gallery) {
          alert(isRTL ? "ملف النسخ الاحتياطي غير صالح" : "Invalid backup file structure.");
          return;
        }

        if (window.confirm(isRTL ? "هل أنت متأكد من استيراد هذه النسخة الاحتياطية؟ سيتم استبدال محتويات الموقع بالكامل." : "Are you sure? This will replace all current website contents.")) {
          setSaveStatus('saving');
          await importBackupJson(importedData);
          setFormData(importedData);
          setMasterData(importedData);
          setSaveStatus('saved');
          alert(isRTL ? "تم استيراد المحتويات واسترجاع النسخة الاحتياطية!" : "Backup restored successfully!");
        }
      } catch (err) {
        console.error(err);
        alert(isRTL ? "حدث خطأ أثناء قراءة ملف النسخ الاحتياطي" : "Failed to read backup file.");
      }
    };
    reader.readAsText(file);
  };

  // Media Manager specific functions
  const handleMediaUpload = async (e, fileNameToOverwrite = null) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(isRTL ? "عذراً، الحد الأقصى لحجم الملف هو 5 ميجابايت" : "Maximum file size allowed is 5MB.");
      return;
    }

    setUploadingMedia(true);
    const targetName = fileNameToOverwrite || generateStoragePath(file.name);
    
    if (isFirebaseConfigured) {
      try {
        const { getStorageClient } = await import('../firebase/storageClient');
        const storage = await getStorageClient();
        if (storage) {
          const { ref, uploadBytes } = await import('firebase/storage');
          const fileRef = ref(storage, targetName.startsWith('portfolio/') ? targetName : `portfolio/${targetName}`);
          await uploadBytes(fileRef, file);
          await loadMediaFiles();
        }
      } catch (err) {
        console.error("Storage upload error:", err);
      } finally {
        setUploadingMedia(false);
      }
    } else {
      // Demo mode fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFile = { 
          name: targetName.includes('/') ? targetName.split('/').pop() : targetName, 
          url: reader.result,
          uploadDate: new Date().toISOString()
        };
        let updated;
        if (fileNameToOverwrite) {
          updated = mediaFiles.map(f => f.name === fileNameToOverwrite ? newFile : f);
        } else {
          updated = [...mediaFiles, newFile];
        }
        localStorage.setItem('elazab_demo_media', JSON.stringify(updated));
        setMediaFiles(updated);
        setUploadingMedia(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaDelete = async (file) => {
    if (!window.confirm(isRTL ? "هل أنت متأكد من حذف هذا الملف من وحدة التخزين نهائياً؟" : "Are you sure you want to permanently delete this file from storage?")) return;

    if (isFirebaseConfigured) {
      try {
        const { getStorageClient } = await import('../firebase/storageClient');
        const storage = await getStorageClient();
        if (storage) {
          const { ref, deleteObject } = await import('firebase/storage');
          const fileRef = ref(storage, `portfolio/${file.name}`);
          await deleteObject(fileRef);
          await loadMediaFiles();
        }
      } catch (err) {
        console.error("Error deleting storage object:", err);
      }
    } else {
      const updated = mediaFiles.filter(f => f.name !== file.name);
      localStorage.setItem('elazab_demo_media', JSON.stringify(updated));
      setMediaFiles(updated);
    }
  };

  const copyUrlToClipboard = (url, index) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!formData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${colors.bg}`}>
        <div className="w-8 h-8 border-2 border-zinc-800 border-theme-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  const tEdit = formData[editingLang] || formData['ar'];

  const filteredMedia = mediaFiles.filter(file => 
    file.name.toLowerCase().includes(mediaSearch.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>{isRTL ? "لوحة تحكم المشرف الفاخرة | استوديو العزب" : "Luxury Studio CMS | Elazab Photography"}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className={`min-h-screen ${colors.bg} ${colors.textMain} pt-16 pb-20 font-cairo flex admin-dashboard-root`}>
        
        {/* SIDEBAR drawer / Collapsible layout */}
        <div 
          className={`fixed inset-y-0 z-40 w-64 bg-zinc-950 border-zinc-900 transition-transform duration-300 lg:translate-x-0 lg:static lg:w-72 ${
            isRTL ? 'right-0 border-l' : 'left-0 border-r'
          } ${
            sidebarOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')
          }`}
        >
          {/* Logo brand & Close button */}
          <div className="p-6 border-b border-zinc-900 flex justify-between items-center relative overflow-hidden">
            <div className="w-full flex flex-col items-center">
              {formData.settings?.logo && (formData.settings.logo.startsWith('http') || formData.settings.logo.includes('/')) && formData.settings.logo !== 'M. ELAZAB' ? (
                <img 
                  src={formData.settings.logo} 
                  alt="Studio Logo" 
                  className="object-contain select-none h-[50px] mb-2"
                />
              ) : (
                <BrandLogo 
                  isDark={true} 
                  className="scale-75 origin-center mb-1"
                  monogram={formData.settings?.logoMonogram || "AZ"}
                  title={formData.settings?.logoText || "MOHAMED AZAB"}
                  subtitle={formData.settings?.logoSubtitle || "PHOTOGRAPHY"}
                />
              )}
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden absolute top-4 right-4 text-zinc-500 hover:text-white focus:outline-none z-50"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
            {[
              { id: 'overview', label: isRTL ? 'نظرة عامة' : 'Overview', icon: ShieldCheck },
              { id: 'hero', label: isRTL ? 'الواجهة الرئيسية' : 'Hero Section', icon: Layers },
              { id: 'about', label: isRTL ? 'عن المصور' : 'About Bio', icon: User },
              { id: 'gallery', label: isRTL ? 'معرض الأعمال' : 'Gallery Portfolio', icon: ImageIcon },
              { id: 'packages', label: isRTL ? 'باقات الأسعار' : 'Pricing Tiers', icon: DollarSign },
              { id: 'reviews', label: isRTL ? 'تقييمات العملاء' : 'Testimonials', icon: MessageSquare },
              { id: 'contact', label: isRTL ? 'بيانات الاتصال' : 'Contact Details', icon: Phone },
              { id: 'seo', label: isRTL ? 'إعدادات الأرشفة (SEO)' : 'SEO Tags', icon: Globe },
              { id: 'settings', label: isRTL ? 'إعدادات المظهر' : 'Layout Settings', icon: Settings },
              { id: 'account', label: isRTL ? 'إعدادات الحساب' : 'Account Settings', icon: Key },
              { id: 'media', label: isRTL ? 'مدير الوسائط' : 'Media Manager', icon: ImageIcon },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs transition-all focus:outline-none ${
                    activeTab === tab.id
                      ? 'bg-zinc-900 text-theme-accent font-semibold'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-950/40'
                  }`}
                >
                  <TabIcon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Backdrop for mobile drawer */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)} 
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          ></div>
        )}

        {/* MAIN content container */}
        <div className="flex-1 flex flex-col min-w-0 px-6 lg:px-12">
          
          {/* Dashboard Header Bar */}
          <div className="flex justify-between items-center border-b border-zinc-900 pb-5 mb-8">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-zinc-400 hover:text-white border border-zinc-900 rounded focus:outline-none"
              >
                <Menu size={18} />
              </button>
              
              <div>
                <h2 className="text-xl font-light text-white" style={{ fontFamily: 'serif' }}>
                  {isRTL ? "لوحة الإدارة الفاخرة" : "Studio Admin Panel"}
                </h2>
                <span className="text-[10px] text-zinc-500 font-medium">
                  {isFirebaseConfigured ? "SECURE FIRESTORE SYNC ACTIVE" : "LOCAL CACHE MODE"}
                </span>
              </div>
            </div>

            {/* Sync / Language Actions */}
            <div className="flex items-center gap-3">
              {/* Save Status Badge */}
              <div className="text-[10px] px-3 py-1.5 rounded border flex items-center gap-1.5 font-semibold font-sans tracking-wide">
                {saveStatus === 'saved' && (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    SAVED
                  </span>
                )}
                {saveStatus === 'saving' && (
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <RefreshCw size={10} className="animate-spin" />
                    SAVING...
                  </span>
                )}
                {saveStatus === 'draft' && (
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full"></span>
                    DRAFT (UNSAVED)
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="text-red-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                    FAILED TO SAVE
                  </span>
                )}
              </div>

              {/* Language toggle for content translation */}
              {activeTab !== 'overview' && activeTab !== 'media' && activeTab !== 'settings' && activeTab !== 'account' && (
                <div className="flex border border-zinc-900 bg-zinc-950 p-0.5 rounded text-[10px]">
                  <button
                    onClick={() => setEditingLang('ar')}
                    className={`px-3 py-1 rounded transition-colors focus:outline-none ${
                      editingLang === 'ar' ? 'bg-theme-accent text-black font-bold' : 'text-zinc-500'
                    }`}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => setEditingLang('en')}
                    className={`px-3 py-1 rounded transition-colors focus:outline-none ${
                      editingLang === 'en' ? 'bg-theme-accent text-black font-bold' : 'text-zinc-500'
                    }`}
                  >
                    EN
                  </button>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="p-2 border border-zinc-900 text-zinc-500 hover:text-red-400 hover:border-red-500/20 rounded transition-colors cursor-pointer focus:outline-none"
                title={isRTL ? "تسجيل الخروج" : "Log Out"}
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

          {/* EDITING FORM VIEWS */}
          <div className="bg-zinc-950/20 border border-zinc-900 rounded-lg p-6 lg:p-8 max-w-4xl shadow-sm">
            
            <Suspense fallback={<div className="h-40 animate-pulse bg-zinc-950/20" />}>
            {activeTab === 'overview' && <OverviewTab formData={formData} isRTL={isRTL} handleExportBackup={handleExportBackup} handleImportBackup={handleImportBackup} />}
            {activeTab === 'hero' && <HeroTab isRTL={isRTL} formData={formData} handleBilingualFieldChange={handleBilingualFieldChange} handleImageUpload={handleImageUpload} showToast={showToast} />}
            {activeTab === 'about' && <AboutTab isRTL={isRTL} formData={formData} handleBilingualFieldChange={handleBilingualFieldChange} handleImageUpload={handleImageUpload} showToast={showToast} />}
            {activeTab === 'gallery' && <GalleryTab formData={formData} isRTL={isRTL} handleImageUpload={handleImageUpload} handleGalleryCategoryChange={handleGalleryCategoryChange} handleGalleryFieldChange={handleGalleryFieldChange} handleGallerySpanChange={handleGallerySpanChange} handleMoveGalleryItem={handleMoveGalleryItem} handleDeleteGalleryItem={handleDeleteGalleryItem} saveGalleryData={() => saveCollectionToDb('gallery')} />}
            {activeTab === 'packages' && <PackagesTab formData={formData} isRTL={isRTL} tEdit={tEdit} handlePackageFieldChange={handlePackageFieldChange} handlePackagePromotionChange={handlePackagePromotionChange} handlePackageFeatureChange={handlePackageFeatureChange} handleDeletePackageFeature={handleDeletePackageFeature} handleAddPackageFeature={handleAddPackageFeature} handleExtraFieldChange={handleExtraFieldChange} handleTermFieldChange={handleTermFieldChange} handleDeleteTerm={handleDeleteTerm} handleAddTerm={handleAddTerm} handleAddPackage={handleAddPackage} handleDeletePackage={handleDeletePackage} handleDuplicatePackage={handleDuplicatePackage} handleReorderPackages={handleReorderPackages} handleAddPackageGalleryImage={handleAddPackageGalleryImage} handleDeletePackageGalleryImage={handleDeletePackageGalleryImage} handlePackageGalleryImageChange={handlePackageGalleryImageChange} showToast={showToast} />}
            {activeTab === 'reviews' && <ReviewsTab formData={formData} isRTL={isRTL} handleAddReview={handleAddReview} handleReviewChange={handleReviewChange} handleDeleteReview={handleDeleteReview} showToast={showToast} />}
            {activeTab === 'contact' && <ContactTab isRTL={isRTL} formData={formData} handleBilingualFieldChange={handleBilingualFieldChange} handleImageUpload={handleImageUpload} showToast={showToast} />}
            {activeTab === 'seo' && <SeoTab formData={formData} isRTL={isRTL} handleGlobalFieldChange={handleGlobalFieldChange} showToast={showToast} />}
            {activeTab === 'settings' && <SettingsTab formData={formData} isRTL={isRTL} handleGlobalFieldChange={handleGlobalFieldChange} showToast={showToast} />}
            {activeTab === 'account' && <AccountTab isRTL={isRTL} />}
            {activeTab === 'media' && <MediaManagerTab isRTL={isRTL} handleMediaUpload={handleMediaUpload} uploadingMedia={uploadingMedia} mediaSearch={mediaSearch} setMediaSearch={setMediaSearch} mediaLoading={mediaLoading} filteredMedia={filteredMedia} copyUrlToClipboard={copyUrlToClipboard} copiedIndex={copiedIndex} handleMediaDelete={handleMediaDelete} />}
            </Suspense>

          </div>

          {/* CMS Footer */}
<div className="mt-8 pt-4 border-t border-zinc-900/60 max-w-4xl text-[10px] text-zinc-600 flex justify-between items-center font-sans">

  <span>Portfolio CMS v1.0</span>

  <a
    href="https://wa.me/201016585901"
    target="_blank"
    rel="noopener noreferrer"
    className="tracking-[0.25em] uppercase text-theme-accent hover:text-white transition-all duration-300 hover:scale-105"
  >
    Crafted By Mohamed Okash
  </a>

</div>

        </div>
      </div>
      {toast && (
        <div className={`fixed top-4 right-4 z-[999] p-4 rounded-lg shadow-2xl border flex items-center gap-3 transition-all duration-300 font-sans text-xs ${
          toast.type === 'success' 
            ? 'bg-emerald-950/95 border-emerald-800 text-emerald-300' 
            : toast.type === 'error' 
              ? 'bg-red-950/95 border-red-905 text-red-300' 
              : 'bg-zinc-900/95 border-zinc-800 text-zinc-300'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}
    </>
  );
}
