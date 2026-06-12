export const defaultSiteData = {
  ar: {
    hero: {
      subtitle: 'عشان فرحة العمر بتتعاش مرة واحدة',
      title: 'بنخلد ذكرياتكم',
      titleItalic: 'لتعيش العمر كله',
      desc: 'يوم فرحك هو أهم يوم في حياتك، وعشان كدا بنهتم بكل تفصيلة عشان نطلعلك صور مليانة مشاعر وحياة، تفضل معاك ذكرى حلوة لكل الأجيال اللي جاية.'
    },
    about: {
      subtitle: 'نبذة عني',
      title: 'أكتر من مجرد صورة،',
      titleBr: 'قصة حب بنحكيها للزمن.',
      desc: 'أنا محمد العزب، مصور فوتوغرافي متخصص في توثيق حفلات الزفاف والمناسبات السعيدة. هدفي مش بس إني أدوس على زرار الكاميرا، هدفي إني أكون جزء من يومكم وأسجل تفاصيل ومشاعر ليلة العمر بصدق وبدون تكلف.'
    },
    reviews: {
      title: 'آراء العرسان',
      subtitle: 'شهادات نعتز بها من شركاء النجاح'
    },
    contact: {
      title: 'التواصل والحجز',
      subtitle: 'دعنا نصنع التحفة القادمة'
    },
    extrasData: [
      { id: 'ex1', title: 'سيشن خطوبة', price: '2,000' },
      { id: 'ex2', title: 'تصوير القاعة', price: '1,200' },
      { id: 'ex3', title: 'تصوير التجهيزات', price: '1,800' },
      { id: 'ex4', title: 'تصوير ريلز (1-2 دقيقة)', price: '1,500' }
    ],
    termsData: [
      "مقدم الحجز 1500 جنيه، وفي حالة إلغاء الحجز لا يُرد العربون.",
      "يتم تقفيل باقي الحساب في سيشن الكاجوال أو قبل الفرح بـ 5 أيام على الأقل.",
      "رسوم لوكيشن التصوير على العميل، وأسعار الباقات لا تشمل أرضيات أماكن التصوير.",
      "في حالة وجود قاعات خارج المنصورة يُضاف فرق السعر حسب المكان.",
      "تسليم الصور خلال 21 يوماً.",
      "يتم اختيار صور الطباعة في خلال أسبوع من تسليم الصور، وفي حالة التأخير عن تسليمها لأكثر من شهر يتم دفع فرق الطباعة."
    ]
  },
  en: {
    hero: {
      subtitle: 'Because the joy of a lifetime is lived once',
      title: 'Immortalizing Memories',
      titleItalic: 'For a Lifetime',
      desc: 'Your wedding day is the most important day of your life. We care about every detail to deliver photos full of emotion.'
    },
    about: {
      subtitle: 'About Me',
      title: 'More than a picture,',
      titleBr: 'A love story told to time.',
      desc: 'I am Mohamed Elazab, a professional photographer specializing in documenting weddings and happy occasions.'
    },
    reviews: {
      title: 'Client Reviews',
      subtitle: 'Testimonials we are proud of'
    },
    contact: {
      title: 'Contact & Booking',
      subtitle: 'Let\'s create the next masterpiece'
    },
    extrasData: [
      { id: 'ex1', title: 'Engagement Session', price: '2,000' },
      { id: 'ex2', title: 'Hall Photography', price: '1,200' },
      { id: 'ex3', title: 'Preparation Coverage', price: '1,800' },
      { id: 'ex4', title: 'Reels (1-2 min)', price: '1,500' }
    ],
    termsData: [
      "Deposit is 1500 EGP, non-refundable in case of cancellation.",
      "Remaining balance must be paid during casual session or 5 days before wedding.",
      "Location fees are covered by the client.",
      "Travel fees apply for venues outside Mansoura.",
      "Photo delivery within 21 days.",
      "Print selection must be made within a week of receiving photos."
    ]
  },
  gallery: [
    { id: 1, src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=2000&q=80", span: "md:col-span-2 md:row-span-2", cat: "wedding_halls", titleAr: "قاعة زفاف الكارما", titleEn: "Al Karma Wedding Hall", locationAr: "المنصورة", locationEn: "Mansoura", instagramLink: "" },
    { id: 2, src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80", span: "md:col-span-1 md:row-span-1", cat: "outdoor_sessions", titleAr: "سيشن خارجي رومانسي", titleEn: "Romantic Outdoor Session", locationAr: "سهل حشيش", locationEn: "Sahl Hasheesh", instagramLink: "https://www.instagram.com/p/DZD17fbihA7/" },
    { id: 3, src: "https://images.unsplash.com/photo-1619086303291-0ef7699e4b31?auto=format&fit=crop&w=1200&q=80", span: "md:col-span-1 md:row-span-2", cat: "studio_sessions", titleAr: "بورتريه كلاسيكي بالاستوديو", titleEn: "Classic Studio Portrait", locationAr: "المنصورة", locationEn: "Mansoura", instagramLink: "" },
    { id: 4, src: "https://images.unsplash.com/photo-1583939000155-263a28c2921a?auto=format&fit=crop&w=1200&q=80", span: "md:col-span-1 md:row-span-1", cat: "beach_sessions", titleAr: "سيشن على البحر وقت الغروب", titleEn: "Sunset Beach Session", locationAr: "سهل حشيش", locationEn: "Sahl Hasheesh", instagramLink: "" },
    { id: 5, src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80", span: "md:col-span-2 md:row-span-1", cat: "outdoor_sessions", titleAr: "لقطة عفوية بالسيشن الخارجي", titleEn: "Candid Outdoor Moment", locationAr: "بورسعيد", locationEn: "Port Said", instagramLink: "" },
  ],
  testimonials: [
    { id: 1, name: "أحمد ومريم", text: "أفضل مصور في المنصورة، الصور طلعت تحفة وعاش معانا كل لحظة بحب واهتمام!", rating: 5 },
    { id: 2, name: "محمود وسارة", text: "شغل احترافي جداً والتسليم في الميعاد، شكراً يا عزب على توثيق ليلة عمرنا بأجمل شكل.", rating: 5 },
    { id: 3, name: "مصطفى وندى", text: "تفاصيل الصور والإضاءة عالمية، بجد تسلم إيدك وفريق العمل كله محترم جداً.", rating: 5 }
  ],
  packages: [
    { title: "WEDDING SESSION", price: "4,000", features: ["سيشن زفاف", "تغطية القاعة", "ألبوم 10 صور مقاس 30-45", "برواز مقاس 50-70"] },
    { title: "HALF DAY", price: "4,500", features: ["سيشن زفاف", "تغطية القاعة", "ألبوم 20 صورة مقاس 40-60", "برواز مقاس 50-70"] },
    { title: "FULL DAY", price: "6,000", features: ["سيشن زفاف", "تجهيزات الميكب أو الكاجوال", "تغطية القاعة", "ألبوم 20 صورة مقاس 40-60", "برواز مقاس 50-70"] },
    { title: "VIB", price: "8,000", features: ["سيشن زفاف", "حنة وكتب كتاب", "سيشن كاجوال", "تغطية القاعة", "ألبوم 12 صورة مقاس 40-60", "برواز مقاس 50-70"] },
    { title: "VIB PLUS", price: "12,000", promotion: { enabled: true, labelAr: "الاختيار المميز", labelEn: "Signature Choice" }, features: ["سيشن زفاف", "تجهيزات الميكب والحنة", "سيشن كاجوال وكتب كتاب", "تغطية القاعة (2 فوتوغرافر)", "ألبوم 20 صورة مقاس 40-60", "ألبوم 10 صور مقاس 30-45", "ميديا كافريدج يوم كامل (2 ريلز)"] }
  ]
};
