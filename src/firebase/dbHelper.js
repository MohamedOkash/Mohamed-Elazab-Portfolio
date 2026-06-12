import { isFirebaseConfigured, getDb } from './firebaseConfig';
import { defaultSiteData } from '../data/siteData';

// Normalized initial settings
const defaultGlobalSettings = {
  siteName: "Mohamed Elazab Photography",
  logo: "M. ELAZAB",
  theme: "luxury-black-gold",
  accentColor: "#d4af37",
  heroImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000",
  contactInfo: {
    phone: "01016585901",
    whatsapp: "201016585901",
    email: "mohamedelazab.ph@gmail.com",
    addressAr: "ميت غراب، السنبلاوين، الدقهلية - بجوار مسجد الأربعين",
    addressEn: "Mit Ghorab, Senbellawein, Dakahlia (next to Al-Arbaeen Mosque)",
    hoursAr: "مواعيد العمل: من 4:00 مساءً إلى 11:00 مساءً",
    hoursEn: "Working Hours: 4 PM - 11 PM"
  },
  socialLinks: {
    tiktok: "https://www.tiktok.com/@mohamed_elazab_p.h",
    whatsapp: "https://wa.me/201016585901",
    instagram: "https://www.instagram.com/p/DZD17fbihA7/",
    facebook: "https://www.facebook.com/share/1JjRpWMEq6/"
  },
  seo: {
    keywords: "محمد العزب, مصور زفاف, مصور المنصورة, تصوير فوتوغرافي, استوديو تصوير, Mohamed Elazab, Wedding Photography, Mansoura Photographer",
    desc: "استوديو محمد العزب للتصوير فوتوغرافي محترف متخصص في توثيق حفلات الزفاف والخطوبة والمناسبات في المنصورة والدقهلية.",
    canonicalUrl: "https://elazab-photography-9812a.web.app/",
    pages: {
      home: { title: '', description: '', keywords: '', ogImage: '' },
      gallery: { title: '', description: '', keywords: '', ogImage: '' },
      packages: { title: '', description: '', keywords: '', ogImage: '' },
      about: { title: '', description: '', keywords: '', ogImage: '' },
      contact: { title: '', description: '', keywords: '', ogImage: '' }
    }
  }
};

/**
 * Normalizes Firestore collections into the unified siteData structure
 * to prevent breaking the existing public components.
 */
export const normalizeContent = (settings, contentAr, contentEn, galleryItems, packagesItems, reviewsItems) => {
  const normalizedGallery = galleryItems.map(item => ({
    id: item.id || Math.random(),
    src: item.src || item.imageUrl || item.image || item.url || item.photo || '',
    mediumUrl: item.mediumUrl || item.medium_url || item.src || item.imageUrl || item.image || item.url || item.photo || '',
    thumbnailUrl: item.thumbnailUrl || item.thumbnail_url || item.src || item.imageUrl || item.image || item.url || item.photo || '',
    cat: item.category || item.cat || 'outdoor_sessions',
    category: item.category || item.cat || 'outdoor_sessions',
    titleAr: item.titleAr || '',
    titleEn: item.titleEn || '',
    locationAr: item.locationAr || item.location || 'عام',
    locationEn: item.locationEn || item.location || 'General',
    instagramLink: item.instagramLink || '',
    span: item.span || 'md:col-span-1 md:row-span-1',
    order: item.order || 0,
    featured: item.featured || false,
    createdAt: item.createdAt || ''
  }));

  const normalizedSettings = {
    ...defaultGlobalSettings,
    ...settings,
    heroImageUrl: settings?.heroImageUrl || normalizedGallery.find(g => g.id === 1 || g.id === '1')?.src || defaultGlobalSettings.heroImageUrl,
    seo: {
      ...defaultGlobalSettings.seo,
      ...(settings?.seo || {}),
      pages: {
        ...defaultGlobalSettings.seo.pages,
        ...(settings?.seo?.pages || {})
      }
    }
  };

  return {
    ar: {
      hero: contentAr?.hero || defaultSiteData.ar.hero,
      about: contentAr?.about || defaultSiteData.ar.about,
      reviews: contentAr?.reviews || defaultSiteData.ar.reviews,
      contact: contentAr?.contact || defaultSiteData.ar.contact,
      extrasData: contentAr?.extrasData || defaultSiteData.ar.extrasData,
      termsData: contentAr?.termsData || defaultSiteData.ar.termsData,
    },
    en: {
      hero: contentEn?.hero || defaultSiteData.en.hero,
      about: contentEn?.about || defaultSiteData.en.about,
      reviews: contentEn?.reviews || defaultSiteData.en.reviews,
      contact: contentEn?.contact || defaultSiteData.en.contact,
      extrasData: contentEn?.extrasData || defaultSiteData.en.extrasData,
      termsData: contentEn?.termsData || defaultSiteData.en.termsData,
    },
    gallery: normalizedGallery,
    testimonials: reviewsItems.map(item => ({
      id: item.id || Math.random(),
      name: item.name || '',
      phone: item.phone || '',
      email: item.email || '',
      text: item.review || '',
      rating: item.rating || 5,
      isPublished: item.isPublished !== false,
      createdAt: item.createdAt || ''
    })),
    packages: packagesItems.map(item => ({
      id: item.id || Math.random().toString(36).substring(2, 9),
      title: item.title || '',
      titleAr: item.titleAr || item.title || '',
      titleEn: item.titleEn || item.title || '',
      descAr: item.descAr || '',
      descEn: item.descEn || '',
      price: item.price || '',
      oldPrice: item.oldPrice || '',
      features: item.features || [],
      featuresAr: item.featuresAr || (item.features || []),
      featuresEn: item.featuresEn || (item.features || []),
      coverImage: item.coverImage || '',
      galleryImages: item.galleryImages || [],
      promotion: {
        enabled: item.promotion?.enabled === true,
        labelAr: item.promotion?.labelAr || '',
        labelEn: item.promotion?.labelEn || ''
      },
      isFeatured: item.isFeatured === true,
      isVisible: item.isVisible !== false,
      order: item.order || 0
    })),
    settings: normalizedSettings
  };
};

/**
 * Bootstraps initial default data into Firestore if empty.
 */
export const bootstrapFirestore = async () => {
  if (!isFirebaseConfigured) return;
  const db = await getDb();
  if (!db) return;

  try {
    const { doc, getDoc, setDoc, getDocs, collection } = await import('firebase/firestore');

    // 1. Settings
    const settingsRef = doc(db, 'settings', 'global');
    const settingsSnap = await getDoc(settingsRef);
    if (!settingsSnap.exists()) {
      await setDoc(settingsRef, defaultGlobalSettings);
    }

    // 2. Content
    const contentArRef = doc(db, 'content', 'ar');
    const contentArSnap = await getDoc(contentArRef);
    if (!contentArSnap.exists()) {
      await setDoc(contentArRef, {
        hero: defaultSiteData.ar.hero,
        about: defaultSiteData.ar.about,
        reviews: defaultSiteData.ar.reviews,
        contact: defaultSiteData.ar.contact,
        extrasData: defaultSiteData.ar.extrasData,
        termsData: defaultSiteData.ar.termsData,
      });
    }

    const contentEnRef = doc(db, 'content', 'en');
    const contentEnSnap = await getDoc(contentEnRef);
    if (!contentEnSnap.exists()) {
      await setDoc(contentEnRef, {
        hero: defaultSiteData.en.hero,
        about: defaultSiteData.en.about,
        reviews: defaultSiteData.en.reviews,
        contact: defaultSiteData.en.contact,
        extrasData: defaultSiteData.en.extrasData,
        termsData: defaultSiteData.en.termsData,
      });
    }

    // 3. Gallery
    const gallerySnap = await getDocs(collection(db, 'gallery'));
    if (gallerySnap.empty) {
      for (const item of defaultSiteData.gallery) {
        const docId = `img_${item.id}`;
        await setDoc(doc(db, 'gallery', docId), {
          id: item.id,
          imageUrl: item.src,
          thumbnailUrl: item.src,
          category: item.category || item.cat || 'outdoor_sessions',
          titleAr: item.titleAr || '',
          titleEn: item.titleEn || '',
          locationAr: item.locationAr || item.location || 'عام',
          locationEn: item.locationEn || item.location || 'General',
          instagramLink: item.instagramLink || '',
          span: item.span || 'md:col-span-1 md:row-span-1',
          featured: true,
          order: item.id,
          createdAt: new Date().toISOString()
        });
      }
    }

    // 4. Packages
    const packagesSnap = await getDocs(collection(db, 'packages'));
    if (packagesSnap.empty) {
      let idx = 0;
      for (const item of defaultSiteData.packages) {
        const docId = item.title.toLowerCase().replace(/\s+/g, '-');
        await setDoc(doc(db, 'packages', docId), {
          title: item.title,
          price: item.price,
          features: item.features,
          order: idx++,
          promotion: item.promotion || { enabled: false, labelAr: '', labelEn: '' }
        });
      }
    }

    // 5. Reviews
    const reviewsSnap = await getDocs(collection(db, 'reviews'));
    if (reviewsSnap.empty) {
      for (const item of defaultSiteData.testimonials) {
        const docId = `review_${item.id}`;
        await setDoc(doc(db, 'reviews', docId), {
          id: item.id,
          name: item.name,
          review: item.text,
          rating: item.rating,
          isPublished: true,
          createdAt: new Date().toISOString()
        });
      }
    }

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Bootstrapping error:", error);
  }
};

/**
 * Fetches all database contents and normalizes them.
 */
export const fetchSiteData = async () => {
  // If not configured, load from localStorage or defaultSiteData
  if (!isFirebaseConfigured) {
    const saved = localStorage.getItem('elazab_site_data_v6');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        console.warn("Parsing cached v6 data failed, loading defaultSiteData");
      }
    }
    // Return structured default siteData
    return normalizeContent(
      defaultGlobalSettings,
      defaultSiteData.ar,
      defaultSiteData.ar, // fallback
      defaultSiteData.gallery,
      defaultSiteData.packages,
      defaultSiteData.testimonials
    );
  }

  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Firestore not initialized");
    }

    // Ensure database contains bootstrap values
    await bootstrapFirestore();

    const { doc, getDoc, getDocs, collection, query, orderBy } = await import('firebase/firestore');

    // Fetch collections in parallel
    const [
      settingsSnap,
      contentArSnap,
      contentEnSnap,
      gallerySnap,
      packagesSnap,
      reviewsSnap
    ] = await Promise.all([
      getDoc(doc(db, 'settings', 'global')),
      getDoc(doc(db, 'content', 'ar')),
      getDoc(doc(db, 'content', 'en')),
      getDocs(query(collection(db, 'gallery'), orderBy('order', 'asc'))),
      getDocs(query(collection(db, 'packages'), orderBy('order', 'asc'))),
      getDocs(collection(db, 'reviews'))
    ]);

    const settings = settingsSnap.data();
    const contentAr = contentArSnap.data();
    const contentEn = contentEnSnap.data();

    const galleryItems = [];
    gallerySnap.forEach(doc => {
      galleryItems.push({ docId: doc.id, ...doc.data() });
    });

    const packagesItems = [];
    packagesSnap.forEach(doc => {
      packagesItems.push({ docId: doc.id, ...doc.data() });
    });

    const reviewsItems = [];
    reviewsSnap.forEach(doc => {
      reviewsItems.push({ docId: doc.id, ...doc.data() });
    });

    const normalized = normalizeContent(
      settings,
      contentAr,
      contentEn,
      galleryItems,
      packagesItems,
      reviewsItems
    );

    // Cache to local storage
    try {
      localStorage.setItem('elazab_site_data_v6', JSON.stringify(normalized));
      if (normalized.settings?.heroImageUrl) {
        localStorage.setItem('elazab_hero_bg', normalized.settings.heroImageUrl);
      }
    } catch (e) {
      console.warn("Failed to write Firestore cache to localStorage:", e);
    }

    return normalized;
  } catch (error) {
    console.error("Error fetching Firestore collections:", error);
    // Fallback on error
    const saved = localStorage.getItem('elazab_site_data_v6');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Ignore parse error and fall back to default data
      }
    }
    return normalizeContent(
      defaultGlobalSettings,
      defaultSiteData.ar,
      defaultSiteData.ar,
      defaultSiteData.gallery,
      defaultSiteData.packages,
      defaultSiteData.testimonials
    );
  }
};

/**
 * Lazy data fetching for single collections on admin dashboard
 */
export const fetchSingleCollection = async (collectionName) => {
  if (!isFirebaseConfigured) {
    const saved = localStorage.getItem('elazab_site_data_v6');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (collectionName === 'settings') return parsed.settings;
        if (collectionName === 'content_ar') return parsed.ar;
        if (collectionName === 'content_en') return parsed.en;
        if (collectionName === 'gallery') return parsed.gallery;
        if (collectionName === 'packages') return parsed.packages;
        if (collectionName === 'reviews') return parsed.testimonials;
      } catch {
        return collectionName === 'settings' ? defaultGlobalSettings : [];
      }
    }
    // Return empty fallback array/object
    return collectionName === 'settings' ? defaultGlobalSettings : [];
  }

  try {
    const db = await getDb();
    if (!db) {
      return collectionName === 'settings' ? defaultGlobalSettings : [];
    }

    const { doc, getDoc, getDocs, collection, query, orderBy } = await import('firebase/firestore');

    if (collectionName === 'settings') {
      const snap = await getDoc(doc(db, 'settings', 'global'));
      return snap.exists() ? snap.data() : defaultGlobalSettings;
    }
    if (collectionName === 'content_ar') {
      const snap = await getDoc(doc(db, 'content', 'ar'));
      return snap.exists() ? snap.data() : defaultSiteData.ar;
    }
    if (collectionName === 'content_en') {
      const snap = await getDoc(doc(db, 'content', 'en'));
      return snap.exists() ? snap.data() : defaultSiteData.en;
    }
    if (collectionName === 'gallery') {
      const snap = await getDocs(query(collection(db, 'gallery'), orderBy('order', 'asc')));
      const items = [];
      snap.forEach(d => items.push({ docId: d.id, ...d.data() }));
      return items.map(item => ({
        id: item.id,
        src: item.imageUrl || '',
        mediumUrl: item.mediumUrl || item.imageUrl || '',
        thumbnailUrl: item.thumbnailUrl || item.imageUrl || '',
        cat: item.category || item.cat || 'outdoor_sessions',
        category: item.category || item.cat || 'outdoor_sessions',
        titleAr: item.titleAr || '',
        titleEn: item.titleEn || '',
        locationAr: item.locationAr || item.location || 'عام',
        locationEn: item.locationEn || item.location || 'General',
        instagramLink: item.instagramLink || '',
        span: item.span || 'md:col-span-1 md:row-span-1',
        order: item.order || 0,
        featured: item.featured || false,
        createdAt: item.createdAt || ''
      }));
    }
    if (collectionName === 'packages') {
      const snap = await getDocs(query(collection(db, 'packages'), orderBy('order', 'asc')));
      const items = [];
      snap.forEach(d => items.push({ docId: d.id, ...d.data() }));
      return items.map(item => ({
        title: item.title || '',
        price: item.price || '',
        features: item.features || [],
        order: item.order || 0,
        promotion: {
          enabled: item.promotion?.enabled === true,
          labelAr: item.promotion?.labelAr || '',
          labelEn: item.promotion?.labelEn || ''
        }
      }));
    }
    if (collectionName === 'reviews') {
      const snap = await getDocs(collection(db, 'reviews'));
      const items = [];
      snap.forEach(d => items.push({ docId: d.id, ...d.data() }));
      return items.map(item => ({
        id: item.id,
        name: item.name || '',
        text: item.review || '',
        rating: item.rating || 5,
        isPublished: item.isPublished !== false,
        createdAt: item.createdAt || ''
      }));
    }
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Saves a specific collection to Firestore (or localStorage in offline mode)
 */
export const saveCollectionToDb = async (collectionName, data) => {
  if (!isFirebaseConfigured) {
    // In local mode, save the full state
    localStorage.setItem('elazab_site_data_v6', JSON.stringify(data));
    return true;
  }

  try {
    const db = await getDb();
    if (!db) {
      localStorage.setItem('elazab_site_data_v6', JSON.stringify(data));
      return true;
    }

    const { doc, setDoc, deleteDoc, getDocs, collection } = await import('firebase/firestore');

    if (collectionName === 'settings') {
      await setDoc(doc(db, 'settings', 'global'), data.settings);
    } else if (collectionName === 'content_ar') {
      await setDoc(doc(db, 'content', 'ar'), {
        hero: data.ar.hero,
        about: data.ar.about,
        reviews: data.ar.reviews,
        contact: data.ar.contact,
        extrasData: data.ar.extrasData,
        termsData: data.ar.termsData
      });
    } else if (collectionName === 'content_en') {
      await setDoc(doc(db, 'content', 'en'), {
        hero: data.en.hero,
        about: data.en.about,
        reviews: data.en.reviews,
        contact: data.en.contact,
        extrasData: data.en.extrasData,
        termsData: data.en.termsData
      });
    } else if (collectionName === 'gallery') {
      // Fetch existing documents to delete any removed items
      const gallerySnap = await getDocs(collection(db, 'gallery'));
      const activeIds = new Set(data.gallery.map(item => `img_${item.id}`));
      for (const d of gallerySnap.docs) {
        if (!activeIds.has(d.id)) {
          await deleteDoc(doc(db, 'gallery', d.id));
        }
      }

      // Overwrite/Sync active gallery items
      for (const item of data.gallery) {
        const docId = `img_${item.id}`;
        await setDoc(doc(db, 'gallery', docId), {
          id: item.id,
          imageUrl: item.src,
          mediumUrl: item.mediumUrl || item.src,
          thumbnailUrl: item.thumbnailUrl || item.src,
          category: item.category || item.cat || 'outdoor_sessions',
          titleAr: item.titleAr || '',
          titleEn: item.titleEn || '',
          locationAr: item.locationAr || item.location || 'عام',
          locationEn: item.locationEn || item.location || 'General',
          instagramLink: item.instagramLink || '',
          span: item.span,
          featured: item.featured || false,
          order: item.order || 0,
          createdAt: item.createdAt || new Date().toISOString()
        });
      }
    } else if (collectionName === 'packages') {
      // Fetch existing documents to delete any removed packages
      const packagesSnap = await getDocs(collection(db, 'packages'));
      const activeIds = new Set(data.packages.map(item => `pkg_${item.id}`));
      for (const d of packagesSnap.docs) {
        if (!activeIds.has(d.id)) {
          await deleteDoc(doc(db, 'packages', d.id));
        }
      }

      for (const item of data.packages) {
        const docId = `pkg_${item.id}`;
        await setDoc(doc(db, 'packages', docId), {
          id: item.id,
          title: item.title || '',
          titleAr: item.titleAr || item.title || '',
          titleEn: item.titleEn || item.title || '',
          descAr: item.descAr || '',
          descEn: item.descEn || '',
          price: item.price || '',
          oldPrice: item.oldPrice || '',
          features: item.features || [],
          featuresAr: item.featuresAr || (item.features || []),
          featuresEn: item.featuresEn || (item.features || []),
          coverImage: item.coverImage || '',
          galleryImages: item.galleryImages || [],
          promotion: item.promotion || { enabled: false, labelAr: '', labelEn: '' },
          isFeatured: item.isFeatured === true,
          isVisible: item.isVisible !== false,
          order: item.order || 0
        });
      }
    } else if (collectionName === 'reviews') {
      // Fetch existing documents to delete any removed reviews
      const reviewsSnap = await getDocs(collection(db, 'reviews'));
      const activeIds = new Set(data.testimonials.map(item => `review_${item.id}`));
      for (const d of reviewsSnap.docs) {
        if (!activeIds.has(d.id)) {
          await deleteDoc(doc(db, 'reviews', d.id));
        }
      }

      for (const item of data.testimonials) {
        const docId = `review_${item.id}`;
        await setDoc(doc(db, 'reviews', docId), {
          id: item.id,
          name: item.name,
          email: item.email || '',
          phone: item.phone || '',
          review: item.text,
          rating: item.rating,
          isPublished: item.isPublished !== false,
          createdAt: item.createdAt || new Date().toISOString()
        });
      }
    }
    return true;
  } catch (error) {
    console.error(`Error saving ${collectionName} to Firestore:`, error);
    throw error;
  }
};

/**
 * Completely imports a backup JSON object, replacing all collections.
 */
export const importBackupJson = async (backupData) => {
  if (!isFirebaseConfigured) {
    localStorage.setItem('elazab_site_data_v6', JSON.stringify(backupData));
    return true;
  }

  try {
    const db = await getDb();
    if (!db) {
      localStorage.setItem('elazab_site_data_v6', JSON.stringify(backupData));
      return true;
    }

    const { doc, setDoc } = await import('firebase/firestore');

    // 1. Settings
    if (backupData.settings) {
      await setDoc(doc(db, 'settings', 'global'), backupData.settings);
    }
    // 2. Content AR/EN
    if (backupData.ar) {
      await setDoc(doc(db, 'content', 'ar'), backupData.ar);
    }
    if (backupData.en) {
      await setDoc(doc(db, 'content', 'en'), backupData.en);
    }
    // 3. Gallery
    if (backupData.gallery && Array.isArray(backupData.gallery)) {
      for (const item of backupData.gallery) {
        const docId = `img_${item.id}`;
        await setDoc(doc(db, 'gallery', docId), {
          id: item.id,
          imageUrl: item.src,
          mediumUrl: item.mediumUrl || item.src,
          thumbnailUrl: item.thumbnailUrl || item.src,
          category: item.category || item.cat || 'outdoor_sessions',
          titleAr: item.titleAr || '',
          titleEn: item.titleEn || '',
          locationAr: item.locationAr || item.location || 'عام',
          locationEn: item.locationEn || item.location || 'General',
          instagramLink: item.instagramLink || '',
          span: item.span || 'md:col-span-1 md:row-span-1',
          featured: item.featured || false,
          order: item.order || 0,
          createdAt: item.createdAt || new Date().toISOString()
        });
      }
    }
    // 4. Packages
    if (backupData.packages && Array.isArray(backupData.packages)) {
      for (const item of backupData.packages) {
        const docId = item.title.toLowerCase().replace(/\s+/g, '-');
        await setDoc(doc(db, 'packages', docId), {
          title: item.title,
          price: item.price,
          features: item.features,
          order: item.order || 0,
          promotion: item.promotion || { enabled: false, labelAr: '', labelEn: '' }
        });
      }
    }
    // 5. Reviews
    if (backupData.testimonials && Array.isArray(backupData.testimonials)) {
      for (const item of backupData.testimonials) {
        const docId = `review_${item.id}`;
        await setDoc(doc(db, 'reviews', docId), {
          id: item.id,
          name: item.name,
          review: item.text,
          rating: item.rating,
          isPublished: item.isPublished !== false,
          createdAt: item.createdAt || new Date().toISOString()
        });
      }
    }
    return true;
  } catch (error) {
    console.error("Backup import error:", error);
    throw error;
  }
};

/**
 * Submits a new testimonial review from a visitor as pending approval.
 */
export const submitReview = async (reviewData) => {
  if (!isFirebaseConfigured) {
    try {
      const saved = localStorage.getItem('elazab_site_data_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.testimonials) parsed.testimonials = [];
        const newId = parsed.testimonials.length > 0 ? Math.max(...parsed.testimonials.map(t => t.id)) + 1 : 1;
        parsed.testimonials.push({
          id: newId,
          name: reviewData.name,
          email: reviewData.email || '',
          phone: reviewData.phone || '',
          text: reviewData.text,
          rating: reviewData.rating || 5,
          isPublished: false,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('elazab_site_data_v6', JSON.stringify(parsed));
      }
    } catch (err) {
      console.error("Local storage submit review failed:", err);
    }
    return true;
  }

  try {
    const db = await getDb();
    if (!db) throw new Error("Firestore not initialized");

    const { doc, setDoc } = await import('firebase/firestore');
    const newId = Date.now();
    const docId = `review_${newId}`;
    
    await setDoc(doc(db, 'reviews', docId), {
      id: newId,
      name: reviewData.name,
      email: reviewData.email || '',
      phone: reviewData.phone || '',
      review: reviewData.text,
      rating: reviewData.rating || 5,
      isPublished: false,
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error submitting review to Firestore:", error);
    throw error;
  }
};

