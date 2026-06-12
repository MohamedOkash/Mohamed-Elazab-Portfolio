/**
 * Gallery Image Database.
 * Centralized registry of assets used in the photo gallery.
 * In Phase 3, these can be replaced by local import paths or Firebase Storage URLs.
 */
export const defaultGallery = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1606800052052-a08af7148866",
    span: "md:col-span-2 md:row-span-2",
    cat: "wedding_halls",
    titleAr: "قاعة زفاف الكارما",
    titleEn: "Al Karma Wedding Hall",
    locationAr: "المنصورة",
    locationEn: "Mansoura",
    instagramLink: ""
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
    span: "md:col-span-1 md:row-span-1",
    cat: "outdoor_sessions",
    titleAr: "سيشن خارجي رومانسي",
    titleEn: "Romantic Outdoor Session",
    locationAr: "سهل حشيش",
    locationEn: "Sahl Hasheesh",
    instagramLink: "https://www.instagram.com/p/DZD17fbihA7/"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1619086303291-0ef7699e4b31",
    span: "md:col-span-1 md:row-span-2",
    cat: "studio_sessions",
    titleAr: "بورتريه كلاسيكي بالاستوديو",
    titleEn: "Classic Studio Portrait",
    locationAr: "المنصورة",
    locationEn: "Mansoura",
    instagramLink: ""
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1583939000155-263a28c2921a",
    span: "md:col-span-1 md:row-span-1",
    cat: "beach_sessions",
    titleAr: "سيشن على البحر وقت الغروب",
    titleEn: "Sunset Beach Session",
    locationAr: "سهل حشيش",
    locationEn: "Sahl Hasheesh",
    instagramLink: ""
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
    span: "md:col-span-2 md:row-span-1",
    cat: "outdoor_sessions",
    titleAr: "لقطة عفوية بالسيشن الخارجي",
    titleEn: "Candid Outdoor Moment",
    locationAr: "بورسعيد",
    locationEn: "Port Said",
    instagramLink: ""
  }
];

export default defaultGallery;
