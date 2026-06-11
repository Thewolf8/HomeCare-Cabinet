import type { Language } from '@/types';

interface TranslationDict {
  [key: string]: string;
}

const translations: Record<string, TranslationDict> = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    wardrobe: 'Wardrobe',
    addItem: 'Add Item',
    laundry: 'Laundry',
    settings: 'Settings',

    // Dashboard
    totalItems: 'Total Items',
    currentlyWorn: 'Currently Worn',
    inLaundry: 'In Laundry',
    hygieneAlerts: 'Hygiene Alerts',
    logOutfit: "Log Today's Outfit",
    quickAdd: 'Quick Add',
    donationSuggestions: 'Consider Donating',
    itemsToDonate: '{{count}} items not worn in 6+ months',
    weatherWidget: 'Weather',
    noWeather: 'Set your city in settings',
    tapToSetWeather: 'Tap to configure weather',
    outfitLogged: "Today's outfit logged successfully",
    smartSuggestions: 'Smart Suggestions',

    // Add Item Form
    itemName: 'Item Name',
    itemNamePlaceholder: 'e.g. Blue Oxford Shirt',
    photo: 'Photo',
    takePhoto: 'Take Photo',
    chooseFromGallery: 'Choose from Gallery',
    removePhoto: 'Remove Photo',
    category: 'Category',
    selectCategory: 'Select category',
    seasons: 'Seasons',
    color: 'Color',
    material: 'Material',
    materialPlaceholder: 'e.g. Cotton, Wool',
    brand: 'Brand',
    brandPlaceholder: 'e.g. Zara, Nike',
    purchaseDate: 'Purchase Date',
    notes: 'Notes',
    notesPlaceholder: 'Any additional details...',
    saveItem: 'Save Item',
    saving: 'Saving...',
    autoSaved: 'Saved',

    // Undergarment fields
    undergarmentSettings: 'Undergarment Settings',
    changeInterval: 'Change interval (days)',
    noBaseLayer: 'No base layer worn with this item',
    noBaseLayerHint: 'Enable if this item is in direct skin contact',

    // Categories
    tops: 'Tops',
    bottoms: 'Bottoms',
    outerwear: 'Outerwear',
    shoes: 'Shoes',
    accessories: 'Accessories',
    undergarments: 'Undergarments',
    sleepwear: 'Sleepwear',
    sportswear: 'Sportswear',
    other: 'Other',

    // Seasons
    summer: 'Summer',
    winter: 'Winter',
    'spring-autumn': 'Spring/Autumn',
    'all-seasons': 'All Seasons',

    // Status
    clean: 'Clean',
    dirty: 'Dirty',
    'in-wash': 'In Wash',
    worn: 'Currently Worn',

    // Weather conditions
    sunny: 'Sunny',
    cloudy: 'Cloudy',
    rainy: 'Rainy',
    snowy: 'Snowy',
    windy: 'Windy',

    // Wardrobe
    searchPlaceholder: 'Search items...',
    filterBy: 'Filter by',
    sortBy: 'Sort by',
    allItems: 'All Items',
    name: 'Name',
    lastWorn: 'Last Worn',
    wearCount: 'Wear Count',
    dateAdded: 'Date Added',
    wornTimes: 'Worn {{count}} times',
    wornOnce: 'Worn once',
    neverWorn: 'Never worn',
    daysSinceWorn: '{{days}} days since worn',
    edit: 'Edit',
    delete: 'Delete',
    deleteConfirm: 'Are you sure you want to delete "{{name}}"?',
    cancel: 'Cancel',
    confirm: 'Confirm',
    noItemsFound: 'No items found',
    addYourFirstItem: 'Add your first clothing item to get started',

    // Item Detail
    itemDetails: 'Item Details',
    markAsWorn: 'Mark as Worn Today',
    changeStatus: 'Change Status',
    hygieneStatus: 'Hygiene Status',
    hygieneGood: 'Good',
    hygieneWarning: 'Change Soon',
    hygieneAlert: 'Change Now',

    // Outfit Logger
    selectOutfit: 'Select Your Outfit',
    selectItemsWearing: 'Select items you are wearing today',
    noCleanItems: 'No clean items available',
    markAsChanged: 'Mark as Changed',
    outfitInProgress: 'Current Outfit',
    startedWearing: 'Started {{time}}',

    // Laundry
    markAllClean: 'Laundry Done!',
    laundryEmpty: 'No items in laundry',
    laundryEmptyHint: 'Items marked as dirty or in-wash will appear here',
    dirtyItems: 'Dirty Items',
    inWashItems: 'In Wash',

    // Donation
    notWornInMonths: 'Not worn in {{months}} months',
    keepIt: 'Keep It',
    markDonated: 'Mark as Donated',
    donated: 'Donated',
    donationNote: 'Items not worn in 6+ months that are still clean',

    // Settings
    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    language: 'Language',
    english: 'English',
    arabic: 'Arabic',
    french: 'French',
    systemDefault: 'System Default',
    weatherSettings: 'Weather',
    city: 'City',
    cityPlaceholder: 'Enter your city name',
    testWeather: 'Test Weather Fetch',
    weatherSuccess: 'Weather fetched successfully',
    weatherError: 'Failed to fetch weather',
    notifications: 'Notifications',
    enableNotifications: 'Enable Notifications',
    undergarmentReminder: 'Undergarment reminder (hours)',
    laundryReminder: 'Laundry reminder (days)',
    outfitReminder: 'Outfit log reminder (days)',
    export: 'Export & Backup',
    exportFormat: 'Default Export Format',
    exportAsPDF: 'Export as PDF',
    exportAsTXT: 'Export as TXT',
    exportAsJSON: 'Export as JSON',
    importBackup: 'Import Backup',
    importHint: 'Import a previously exported JSON backup',
    dataManagement: 'Data Management',
    resetData: 'Reset All Data',
    resetConfirm: 'This will delete all your wardrobe data. This cannot be undone.',
    privacy: 'Privacy',
    privacyNotice: 'Your privacy is our priority',
    privacyDetails: 'No cloud storage. No account required. All data stays on your device. Camera photos are stored as base64 in localStorage only.',
    about: 'About',
    version: 'Version 1.0.0',

    // Toasts
    itemAdded: 'Item added successfully',
    itemUpdated: 'Item updated',
    itemDeleted: 'Item deleted',
    statusUpdated: 'Status updated',
    dataReset: 'All data has been reset',
    exportSuccess: 'Export successful',
    importSuccess: '{{count}} items imported successfully',
    importError: 'Invalid backup file',
    saved: 'Saved',

    // Weather advice
    hotWeather: 'Hot weather — stay cool',
    warmWeather: 'Warm weather — dress light',
    coolWeather: 'Cool weather — layer up',
    coldWeather: 'Cold weather — stay warm',

    // Misc
    close: 'Close',
    done: 'Done',
    back: 'Back',
    next: 'Next',
    skip: 'Skip',
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    noResults: 'No results',
    pullToRefresh: 'Pull to refresh',
  },
  ar: {
    // Navigation
    dashboard: 'لوحة التحكم',
    wardrobe: 'خزانة الملابس',
    addItem: 'إضافة قطعة',
    laundry: 'الغسيل',
    settings: 'الإعدادات',

    // Dashboard
    totalItems: 'إجمالي القطع',
    currentlyWorn: 'الملبوسة الآن',
    inLaundry: 'في الغسيل',
    hygieneAlerts: 'تنبيهات النظافة',
    logOutfit: 'تسجيل ملابس اليوم',
    quickAdd: 'إضافة سريعة',
    donationSuggestions: 'التبرع المقترح',
    itemsToDonate: '{{count}} قطع لم تُلبس منذ 6 أشهر',
    weatherWidget: 'الطقس',
    noWeather: 'عيّن مدينتك في الإعدادات',
    tapToSetWeather: 'اضغط لتهيئة الطقس',
    outfitLogged: 'تم تسجيل ملابس اليوم',
    smartSuggestions: 'اقتراحات ذكية',

    // Add Item Form
    itemName: 'اسم القطعة',
    itemNamePlaceholder: 'مثال: قميص أزرق أوكسفورد',
    photo: 'الصورة',
    takePhoto: 'التقاط صورة',
    chooseFromGallery: 'اختيار من المعرض',
    removePhoto: 'إزالة الصورة',
    category: 'الفئة',
    selectCategory: 'اختر الفئة',
    seasons: 'الفصول',
    color: 'اللون',
    material: 'المادة',
    materialPlaceholder: 'مثال: قطن، صوف',
    brand: 'الماركة',
    brandPlaceholder: 'مثال: زارا، نايك',
    purchaseDate: 'تاريخ الشراء',
    notes: 'ملاحظات',
    notesPlaceholder: 'أي تفاصيل إضافية...',
    saveItem: 'حفظ القطعة',
    saving: 'جاري الحفظ...',
    autoSaved: 'تم الحفظ',

    // Undergarment fields
    undergarmentSettings: 'إعدادات الملابس الداخلية',
    changeInterval: 'فترة التغيير (بالأيام)',
    noBaseLayer: 'لا يوجد طبقة أساسية مع هذه القطعة',
    noBaseLayerHint: 'فعّل إذا كانت القطعة على تماس مباشر مع الجلد',

    // Categories
    tops: 'قمصان',
    bottoms: 'سفليات',
    outerwear: 'معاطف',
    shoes: 'أحذية',
    accessories: 'إكسسوارات',
    undergarments: 'ملابس داخلية',
    sleepwear: 'ملابس النوم',
    sportswear: 'ملابس رياضية',
    other: 'أخرى',

    // Seasons
    summer: 'الصيف',
    winter: 'الشتاء',
    'spring-autumn': 'الربيع/الخريف',
    'all-seasons': 'جميع الفصول',

    // Status
    clean: 'نظيف',
    dirty: 'متسخ',
    'in-wash': 'في الغسيل',
    worn: 'مُلبَس الآن',

    // Weather conditions
    sunny: 'مشمس',
    cloudy: 'غائم',
    rainy: 'ممطر',
    snowy: 'مثلج',
    windy: 'عاصف',

    // Wardrobe
    searchPlaceholder: 'البحث في القطع...',
    filterBy: 'تصفية حسب',
    sortBy: 'ترتيب حسب',
    allItems: 'جميع القطع',
    name: 'الاسم',
    lastWorn: 'آخر مرة',
    wearCount: 'مرات الارتداء',
    dateAdded: 'تاريخ الإضافة',
    wornTimes: 'مُلبَس {{count}} مرات',
    wornOnce: 'مُلبَس مرة واحدة',
    neverWorn: 'لم يُلبَس',
    daysSinceWorn: '{{days}} يوم منذ آخر ارتداء',
    edit: 'تعديل',
    delete: 'حذف',
    deleteConfirm: 'هل أنت متأكد من حذف "{{name}}"؟',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    noItemsFound: 'لم يتم العثور على قطع',
    addYourFirstItem: 'أضف قطعتك الأولى للبدء',

    // Item Detail
    itemDetails: 'تفاصيل القطعة',
    markAsWorn: 'تسجيل كمُلبَس اليوم',
    changeStatus: 'تغيير الحالة',
    hygieneStatus: 'حالة النظافة',
    hygieneGood: 'جيدة',
    hygieneWarning: 'التغيير قريباً',
    hygieneAlert: 'التغيير الآن',

    // Outfit Logger
    selectOutfit: 'اختر ملابسك',
    selectItemsWearing: 'اختر القطع التي تلبسها اليوم',
    noCleanItems: 'لا توجد قطع نظيفة متاحة',
    markAsChanged: 'تسجيل كمُغيّر',
    outfitInProgress: 'الملابس الحالية',
    startedWearing: 'بدأ {{time}}',

    // Laundry
    markAllClean: 'انتهى الغسيل!',
    laundryEmpty: 'لا توجد قطع في الغسيل',
    laundryEmptyHint: 'القطع المعلّمة كمتسخة أو في الغسيل ستظهر هنا',
    dirtyItems: 'قطع متسخة',
    inWashItems: 'في الغسيل',

    // Donation
    notWornInMonths: 'لم يُلبَس منذ {{months}} أشهر',
    keepIt: 'احتفظ به',
    markDonated: 'تسجيل كمتبرع به',
    donated: 'تم التبرع',
    donationNote: 'قطع لم تُلبَس منذ 6 أشهر وما زالت نظيفة',

    // Settings
    appearance: 'المظهر',
    darkMode: 'الوضع الداكن',
    language: 'اللغة',
    english: 'English',
    arabic: 'العربية',
    french: 'Français',
    systemDefault: 'افتراضي النظام',
    weatherSettings: 'الطقس',
    city: 'المدينة',
    cityPlaceholder: 'أدخل اسم مدينتك',
    testWeather: 'اختبار جلب الطقس',
    weatherSuccess: 'تم جلب الطقس بنجاح',
    weatherError: 'فشل جلب الطقس',
    notifications: 'الإشعارات',
    enableNotifications: 'تفعيل الإشعارات',
    undergarmentReminder: 'تذكير الملابس الداخلية (بالساعات)',
    laundryReminder: 'تذكير الغسيل (بالأيام)',
    outfitReminder: 'تذكير تسجيل الملابس (بالأيام)',
    export: 'التصدير والنسخ الاحتياطي',
    exportFormat: 'تنسيق التصدير الافتراضي',
    exportAsPDF: 'تصدير كـ PDF',
    exportAsTXT: 'تصدير كـ TXT',
    exportAsJSON: 'تصدير كـ JSON',
    importBackup: 'استيراد نسخة احتياطية',
    importHint: 'استيراد نسخة JSON سابقة',
    dataManagement: 'إدارة البيانات',
    resetData: 'مسح جميع البيانات',
    resetConfirm: 'سيتم حذف جميع بيانات خزانتك. لا يمكن التراجع عن هذا.',
    privacy: 'الخصوصية',
    privacyNotice: 'خصوصيتك أولويتنا',
    privacyDetails: 'لا يوجد تخزين سحابي. لا يحتاج إلى حساب. جميع البيانات تبقى على جهازك. صور الكاميرا تُخزّن كـ base64 فقط.',
    about: 'حول',
    version: 'الإصدار 1.0.0',

    // Toasts
    itemAdded: 'تمت إضافة القطعة',
    itemUpdated: 'تم تحديث القطعة',
    itemDeleted: 'تم حذف القطعة',
    statusUpdated: 'تم تحديث الحالة',
    dataReset: 'تم مسح جميع البيانات',
    exportSuccess: 'تم التصدير بنجاح',
    importSuccess: 'تم استيراد {{count}} قطعة بنجاح',
    importError: 'ملف النسخ الاحتياطي غير صالح',
    saved: 'تم الحفظ',

    // Weather advice
    hotWeather: 'طقس حار — ابقَ بارداً',
    warmWeather: 'طقس دافئ — البس خفيفاً',
    coolWeather: 'طقس بارد — البس طبقات',
    coldWeather: 'طقس شديد البرودة — ابقَ دافئاً',

    // Misc
    close: 'إغلاق',
    done: 'تم',
    back: 'رجوع',
    next: 'التالي',
    skip: 'تخطي',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    retry: 'إعادة المحاولة',
    noResults: 'لا توجد نتائج',
    pullToRefresh: 'اسحب للتحديث',
  },
  fr: {
    // Navigation
    dashboard: 'Tableau de bord',
    wardrobe: 'Garde-robe',
    addItem: 'Ajouter',
    laundry: 'Lessive',
    settings: 'Paramètres',

    // Dashboard
    totalItems: 'Articles Total',
    currentlyWorn: 'Portés Aujourd\'hui',
    inLaundry: 'En Lessive',
    hygieneAlerts: 'Alertes Hygiène',
    logOutfit: 'Tenue du Jour',
    quickAdd: 'Ajout Rapide',
    donationSuggestions: 'Don Suggéré',
    itemsToDonate: '{{count}} articles non portés depuis 6+ mois',
    weatherWidget: 'Météo',
    noWeather: 'Définissez votre ville',
    tapToSetWeather: 'Appuyez pour configurer',
    outfitLogged: 'Tenue enregistrée',
    smartSuggestions: 'Suggestions',

    // Add Item Form
    itemName: 'Nom de l\'Article',
    itemNamePlaceholder: 'ex. Chemise Oxford Bleue',
    photo: 'Photo',
    takePhoto: 'Prendre une Photo',
    chooseFromGallery: 'Choisir dans la Galerie',
    removePhoto: 'Supprimer la Photo',
    category: 'Catégorie',
    selectCategory: 'Sélectionner une catégorie',
    seasons: 'Saisons',
    color: 'Couleur',
    material: 'Matière',
    materialPlaceholder: 'ex. Coton, Laine',
    brand: 'Marque',
    brandPlaceholder: 'ex. Zara, Nike',
    purchaseDate: 'Date d\'achat',
    notes: 'Notes',
    notesPlaceholder: 'Détails supplémentaires...',
    saveItem: 'Enregistrer',
    saving: 'Enregistrement...',
    autoSaved: 'Enregistré',

    // Undergarment fields
    undergarmentSettings: 'Paramètres sous-vêtements',
    changeInterval: 'Intervalle de changement (jours)',
    noBaseLayer: 'Pas de couche de base',
    noBaseLayerHint: 'Activez si contact direct avec la peau',

    // Categories
    tops: 'Hauts',
    bottoms: 'Bas',
    outerwear: 'Manteaux',
    shoes: 'Chaussures',
    accessories: 'Accessoires',
    undergarments: 'Sous-vêtements',
    sleepwear: 'Pyjamas',
    sportswear: 'Sport',
    other: 'Autre',

    // Seasons
    summer: 'Été',
    winter: 'Hiver',
    'spring-autumn': 'Printemps/Automne',
    'all-seasons': 'Toutes Saisons',

    // Status
    clean: 'Propre',
    dirty: 'Sale',
    'in-wash': 'En Lavage',
    worn: 'Porté',

    // Weather conditions
    sunny: 'Ensoleillé',
    cloudy: 'Nuageux',
    rainy: 'Pluvieux',
    snowy: 'Neigeux',
    windy: 'Venteux',

    // Wardrobe
    searchPlaceholder: 'Rechercher...',
    filterBy: 'Filtrer par',
    sortBy: 'Trier par',
    allItems: 'Tous les Articles',
    name: 'Nom',
    lastWorn: 'Dernier Port',
    wearCount: 'Nombre de Ports',
    dateAdded: 'Date d\'ajout',
    wornTimes: 'Porté {{count}} fois',
    wornOnce: 'Porté une fois',
    neverWorn: 'Jamais porté',
    daysSinceWorn: '{{days}} jours depuis le dernier port',
    edit: 'Modifier',
    delete: 'Supprimer',
    deleteConfirm: 'Supprimer "{{name}}" ?',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    noItemsFound: 'Aucun article trouvé',
    addYourFirstItem: 'Ajoutez votre premier article',

    // Item Detail
    itemDetails: 'Détails',
    markAsWorn: 'Marquer comme Porté',
    changeStatus: 'Changer le Statut',
    hygieneStatus: 'État d\'Hygiène',
    hygieneGood: 'Bon',
    hygieneWarning: 'Changement Bientôt',
    hygieneAlert: 'Changer Maintenant',

    // Outfit Logger
    selectOutfit: 'Choisir la Tenue',
    selectItemsWearing: 'Sélectionnez les articles portés',
    noCleanItems: 'Aucun article propre',
    markAsChanged: 'Marquer comme Changé',
    outfitInProgress: 'Tenue Actuelle',
    startedWearing: 'Depuis {{time}}',

    // Laundry
    markAllClean: 'Lessive Terminée !',
    laundryEmpty: 'Aucun article en lessive',
    laundryEmptyHint: 'Les articles marqués sales apparaissent ici',
    dirtyItems: 'Articles Sales',
    inWashItems: 'En Lavage',

    // Donation
    notWornInMonths: 'Non porté depuis {{months}} mois',
    keepIt: 'Garder',
    markDonated: 'Marquer comme Donné',
    donated: 'Donné',
    donationNote: 'Articles non portés depuis 6+ mois encore propres',

    // Settings
    appearance: 'Apparence',
    darkMode: 'Mode Sombre',
    language: 'Langue',
    english: 'English',
    arabic: 'العربية',
    french: 'Français',
    systemDefault: 'Par Défaut',
    weatherSettings: 'Météo',
    city: 'Ville',
    cityPlaceholder: 'Entrez votre ville',
    testWeather: 'Tester la Météo',
    weatherSuccess: 'Météo récupérée',
    weatherError: 'Échec de la récupération',
    notifications: 'Notifications',
    enableNotifications: 'Activer les Notifications',
    undergarmentReminder: 'Rappel sous-vêtements (heures)',
    laundryReminder: 'Rappel lessive (jours)',
    outfitReminder: 'Rappel tenue (jours)',
    export: 'Export et Sauvegarde',
    exportFormat: 'Format d\'export par défaut',
    exportAsPDF: 'Exporter en PDF',
    exportAsTXT: 'Exporter en TXT',
    exportAsJSON: 'Exporter en JSON',
    importBackup: 'Importer une Sauvegarde',
    importHint: 'Importer une sauvegarde JSON',
    dataManagement: 'Gestion des Données',
    resetData: 'Réinitialiser les Données',
    resetConfirm: 'Cela supprimera toutes vos données. Action irréversible.',
    privacy: 'Confidentialité',
    privacyNotice: 'Votre vie privée est notre priorité',
    privacyDetails: 'Pas de stockage cloud. Pas de compte requis. Toutes les données restent sur votre appareil. Les photos sont stockées en base64.',
    about: 'À Propos',
    version: 'Version 1.0.0',

    // Toasts
    itemAdded: 'Article ajouté',
    itemUpdated: 'Article mis à jour',
    itemDeleted: 'Article supprimé',
    statusUpdated: 'Statut mis à jour',
    dataReset: 'Données réinitialisées',
    exportSuccess: 'Export réussi',
    importSuccess: '{{count}} articles importés',
    importError: 'Fichier de sauvegarde invalide',
    saved: 'Enregistré',

    // Weather advice
    hotWeather: 'Chaud — restez au frais',
    warmWeather: 'Doux — habillez-vous léger',
    coolWeather: 'Frais — superposez vos vêtements',
    coldWeather: 'Froid — restez au chaud',

    // Misc
    close: 'Fermer',
    done: 'Terminé',
    back: 'Retour',
    next: 'Suivant',
    skip: 'Passer',
    loading: 'Chargement...',
    error: 'Erreur',
    retry: 'Réessayer',
    noResults: 'Aucun résultat',
    pullToRefresh: 'Tirez pour actualiser',
  },
};

export function getTranslation(language: Language): TranslationDict {
  if (language === 'system') {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ar')) return translations.ar;
    if (browserLang.startsWith('fr')) return translations.fr;
    return translations.en;
  }
  return translations[language] || translations.en;
}

export function t(dict: TranslationDict, key: string, params?: Record<string, string | number>): string {
  let value = dict[key] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      value = value.replace(`{{${k}}}`, String(v));
    });
  }
  return value;
}
