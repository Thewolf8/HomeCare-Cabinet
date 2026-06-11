import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ClothingItem, WornItem, AppSettings, WeatherData, ToastMessage, Language, Theme } from '@/types';
import { getTranslation, t } from '@/lib/i18n';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

interface AppContextType {
  // Data
  items: ClothingItem[];
  wornToday: WornItem[];
  settings: AppSettings;
  weather: WeatherData | null;

  // Actions
  addItem: (item: Omit<ClothingItem, 'id' | 'dateAdded' | 'wearCount' | 'lastWornDate' | 'status' | 'donationDismissed' | 'donatedDate'>) => void;
  updateItem: (id: string, updates: Partial<ClothingItem>) => void;
  deleteItem: (id: string) => void;
  cycleStatus: (id: string) => void;
  logOutfit: (itemIds: string[]) => void;
  markAsChanged: (itemId: string) => void;
  removeFromOutfit: (itemId: string) => void;
  markAllLaundryDone: () => void;
  dismissDonation: (id: string) => void;
  markDonated: (id: string) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  setWeather: (weather: WeatherData | null) => void;
  resetAllData: () => void;
  importItems: (newItems: ClothingItem[]) => number;

  // Derived
  cleanItems: ClothingItem[];
  dirtyItems: ClothingItem[];
  inWashItems: ClothingItem[];
  currentlyWornItems: ClothingItem[];
  donationCandidates: ClothingItem[];
  hygieneAlerts: number;

  // i18n
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
  t: (key: string, params?: Record<string, string | number>) => string;

  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;

  // Toast
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const defaultSettings: AppSettings = {
  language: 'system',
  theme: 'light',
  city: '',
  cityCoordinates: null,
  notificationsEnabled: false,
  undergarmentReminderInterval: 24,
  laundryReminderFrequency: 3,
  outfitReminderDays: 3,
  defaultExportFormat: 'pdf',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<ClothingItem[]>('mywardrobe_items', []);
  const [wornToday, setWornToday] = useLocalStorage<WornItem[]>('mywardrobe_worn_today', []);
  const [settings, setSettings] = useLocalStorage<AppSettings>('mywardrobe_settings', defaultSettings);
  const [weather, setWeatherState] = useLocalStorage<WeatherData | null>('mywardrobe_weather', null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Effective language
  const [effectiveLang, setEffectiveLang] = useState<Language>('en');
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    let lang: Language;
    if (settings.language === 'system') {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('ar')) lang = 'ar';
      else if (browserLang.startsWith('fr')) lang = 'fr';
      else lang = 'en';
    } else {
      lang = settings.language;
    }
    setEffectiveLang(lang);
    setDir(lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang === 'ar' ? 'ar' : lang === 'fr' ? 'fr' : 'en';
  }, [settings.language]);

  // Theme
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const dark = settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const tFn = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const dict = getTranslation(effectiveLang);
      return t(dict, key, params);
    },
    [effectiveLang]
  );

  // Toast
  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Actions
  const addItem = useCallback(
    (itemData: Omit<ClothingItem, 'id' | 'dateAdded' | 'wearCount' | 'lastWornDate' | 'status' | 'donationDismissed' | 'donatedDate'>) => {
      const newItem: ClothingItem = {
        ...itemData,
        id: uuidv4(),
        dateAdded: new Date().toISOString(),
        wearCount: 0,
        lastWornDate: null,
        status: 'clean',
        donationDismissed: false,
        donatedDate: null,
      };
      setItems((prev) => [newItem, ...prev]);
      addToast({ type: 'success', message: 'itemAdded' });
    },
    [setItems, addToast]
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<ClothingItem>) => {
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
      addToast({ type: 'success', message: 'itemUpdated' });
    },
    [setItems, addToast]
  );

  const deleteItem = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setWornToday((prev) => prev.filter((w) => w.itemId !== id));
      addToast({ type: 'success', message: 'itemDeleted' });
    },
    [setItems, setWornToday, addToast]
  );

  const cycleStatus = useCallback(
    (id: string) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const cycle: Record<string, ClothingItem['status']> = {
            clean: 'dirty',
            dirty: 'in-wash',
            'in-wash': 'clean',
            worn: 'dirty',
          };
          return { ...item, status: cycle[item.status] || 'clean' };
        })
      );
      addToast({ type: 'info', message: 'statusUpdated' });
    },
    [setItems, addToast]
  );

  const logOutfit = useCallback(
    (itemIds: string[]) => {
      const now = new Date().toISOString();
      const newWorn: WornItem[] = itemIds.map((id) => ({ itemId: id, wornSince: now }));
      setWornToday(newWorn);
      setItems((prev) =>
        prev.map((item) => {
          if (!itemIds.includes(item.id)) return item;
          return {
            ...item,
            status: 'worn' as const,
            wearCount: item.wearCount + 1,
            lastWornDate: now,
          };
        })
      );
      addToast({ type: 'success', message: 'outfitLogged' });
    },
    [setWornToday, setItems, addToast]
  );

  const markAsChanged = useCallback(
    (itemId: string) => {
      setWornToday((prev) => prev.filter((w) => w.itemId !== itemId));
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, status: 'clean' as const } : item
        )
      );
      addToast({ type: 'success', message: 'statusUpdated' });
    },
    [setWornToday, setItems, addToast]
  );

  const removeFromOutfit = useCallback(
    (itemId: string) => {
      setWornToday((prev) => prev.filter((w) => w.itemId !== itemId));
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, status: 'dirty' as const } : item
        )
      );
    },
    [setWornToday, setItems]
  );

  const markAllLaundryDone = useCallback(() => {
    setItems((prev) =>
      prev.map((item) =>
        item.status === 'in-wash' ? { ...item, status: 'clean' as const } : item
      )
    );
    addToast({ type: 'success', message: 'statusUpdated' });
  }, [setItems, addToast]);

  const dismissDonation = useCallback(
    (id: string) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, donationDismissed: true } : item))
      );
    },
    [setItems]
  );

  const markDonated = useCallback(
    (id: string) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, donatedDate: new Date().toISOString(), status: 'clean' as const }
            : item
        )
      );
      addToast({ type: 'success', message: 'donated' });
    },
    [setItems, addToast]
  );

  const updateSettings = useCallback(
    (updates: Partial<AppSettings>) => {
      setSettings((prev) => ({ ...prev, ...updates }));
    },
    [setSettings]
  );

  const setWeather = useCallback(
    (w: WeatherData | null) => {
      setWeatherState(w);
    },
    [setWeatherState]
  );

  const resetAllData = useCallback(() => {
    setItems([]);
    setWornToday([]);
    setWeatherState(null);
    addToast({ type: 'info', message: 'dataReset' });
  }, [setItems, setWornToday, setWeatherState, addToast]);

  const importItems = useCallback(
    (newItems: ClothingItem[]) => {
      let imported = 0;
      setItems((prev) => {
        const existingIds = new Set(prev.map((i) => i.id));
        const toAdd = newItems.filter((i) => !existingIds.has(i.id));
        imported = toAdd.length;
        return [...toAdd, ...prev];
      });
      if (imported > 0) {
        addToast({ type: 'success', message: 'importSuccess', params: { count: imported } });
      }
      return imported;
    },
    [setItems, addToast]
  );

  // Derived state
  const cleanItems = items.filter((i) => i.status === 'clean' && !i.donatedDate);
  const dirtyItems = items.filter((i) => i.status === 'dirty');
  const inWashItems = items.filter((i) => i.status === 'in-wash');
  const currentlyWornItems = items.filter((i) => i.status === 'worn');

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const donationCandidates = items.filter((i) => {
    if (i.donatedDate || i.donationDismissed) return false;
    if (i.status === 'dirty' || i.status === 'in-wash') return false;
    const lastWorn = i.lastWornDate ? new Date(i.lastWornDate) : null;
    const purchaseDate = i.purchaseDate ? new Date(i.purchaseDate) : null;
    const neverWorn = !lastWorn;
    const notWornRecently = lastWorn && lastWorn < sixMonthsAgo;
    const oldPurchase = neverWorn && purchaseDate && purchaseDate < sixMonthsAgo;
    return notWornRecently || oldPurchase;
  });

  // Calculate hygiene alerts
  const now = Date.now();
  const hygieneAlerts = wornToday.filter((w) => {
    const item = items.find((i) => i.id === w.itemId);
    if (!item || !item.isUndergarment) return false;
    const hoursWorn = (now - new Date(w.wornSince).getTime()) / (1000 * 60 * 60);
    const threshold = item.noBaseLayer
      ? weather && weather.temperature > 28 ? 12 : 24
      : item.changeIntervalDays * 24;
    return hoursWorn >= threshold;
  }).length;

  const value: AppContextType = {
    items,
    wornToday,
    settings,
    weather,
    addItem,
    updateItem,
    deleteItem,
    cycleStatus,
    logOutfit,
    markAsChanged,
    removeFromOutfit,
    markAllLaundryDone,
    dismissDonation,
    markDonated,
    updateSettings,
    setWeather,
    resetAllData,
    importItems,
    cleanItems,
    dirtyItems,
    inWashItems,
    currentlyWornItems,
    donationCandidates,
    hygieneAlerts,
    language: settings.language,
    setLanguage: (lang) => updateSettings({ language: lang }),
    dir,
    t: tFn,
    theme: settings.theme,
    setTheme: (theme) => updateSettings({ theme }),
    isDark,
    toasts,
    addToast,
    removeToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
