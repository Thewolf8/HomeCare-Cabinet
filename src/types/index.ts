export type Category =
  | 'tops'
  | 'bottoms'
  | 'outerwear'
  | 'shoes'
  | 'accessories'
  | 'undergarments'
  | 'sleepwear'
  | 'sportswear'
  | 'other';

export type Season = 'summer' | 'winter' | 'spring-autumn' | 'all-seasons';

export type ItemStatus = 'clean' | 'dirty' | 'in-wash' | 'worn';

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';

export type Language = 'en' | 'ar' | 'fr' | 'system';

export type Theme = 'light' | 'dark' | 'system';

export type ExportFormat = 'pdf' | 'txt' | 'json';

export interface ClothingItem {
  id: string;
  name: string;
  photo: string | null;
  category: Category;
  seasons: Season[];
  color: string;
  material?: string;
  brand?: string;
  purchaseDate?: string;
  notes?: string;
  status: ItemStatus;
  wearCount: number;
  lastWornDate: string | null;
  dateAdded: string;
  isUndergarment: boolean;
  changeIntervalDays: number;
  noBaseLayer: boolean;
  donationDismissed: boolean;
  donatedDate: string | null;
}

export interface WornItem {
  itemId: string;
  wornSince: string;
}

export interface AppSettings {
  language: Language;
  theme: Theme;
  city: string;
  cityCoordinates: { lat: number; lon: number } | null;
  notificationsEnabled: boolean;
  undergarmentReminderInterval: number;
  laundryReminderFrequency: number;
  outfitReminderDays: number;
  defaultExportFormat: ExportFormat;
}

export interface WeatherData {
  temperature: number;
  condition: WeatherCondition;
  humidity: number;
  lastFetched: string;
}

export type SortOption = 'name' | 'last-worn' | 'wear-count' | 'date-added';

export type FilterOption = 'all' | Category | 'undergarments' | 'donation-candidates';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  params?: Record<string, string | number>;
}

export const CATEGORIES: Category[] = [
  'tops',
  'bottoms',
  'outerwear',
  'shoes',
  'accessories',
  'undergarments',
  'sleepwear',
  'sportswear',
  'other',
];

export const SEASONS: Season[] = ['summer', 'winter', 'spring-autumn', 'all-seasons'];

export const PRESET_COLORS = [
  '#1a1a1a', '#3d3d3d', '#5c5470', '#8b7355', '#d4a373',
  '#e9c46a', '#a7c957', '#2a9d8f', '#264653', '#e76f51',
  '#f4a261', '#e9c46a', '#ffffff', '#f8f7f4', '#dbd8e3',
  '#b5838d', '#6d6875', '#4a4e69', '#9a8c98', '#c9ada7',
  '#f2e9e4', '#ead2ac', '#e6beae', '#d5bdaf', '#edede9',
];
