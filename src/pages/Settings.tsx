import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon, Sun, Globe, MapPin, Bell, Upload,
  Trash2, Shield, ChevronRight, FileText, FileJson,
  FileSpreadsheet, AlertTriangle
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useWeather } from '@/hooks/useWeather';
import { useExport } from '@/hooks/useExport';
import type { Language, ExportFormat, ClothingItem } from '@/types';

interface SettingsSectionItem {
  icon: React.ElementType;
  label: React.ReactNode;
  value?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  fullWidth?: boolean;
}

interface SettingsSection {
  title: string;
  items: SettingsSectionItem[];
}

export function Settings() {
  const {
    settings, updateSettings, t, addToast, isDark,
    language, setLanguage, setTheme, resetAllData, importItems,
    items, wornToday, weather,
  } = useApp();
  const { fetchWeather, geocodeCity } = useWeather();
  const { exportAsPDF, exportAsTXT, exportAsJSON } = useExport();
  const [cityInput, setCityInput] = useState(settings.city);
  const [testingWeather, setTestingWeather] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTestWeather = async () => {
    if (!cityInput.trim()) return;
    setTestingWeather(true);
    const geo = await geocodeCity(cityInput.trim());
    if (geo) {
      updateSettings({
        city: cityInput.trim(),
        cityCoordinates: { lat: geo.latitude, lon: geo.longitude },
      });
      const result = await fetchWeather({
        ...settings,
        city: cityInput.trim(),
        cityCoordinates: { lat: geo.latitude, lon: geo.longitude },
      });
      if (result) {
        addToast({ type: 'success', message: 'weatherSuccess' });
      } else {
        addToast({ type: 'error', message: 'weatherError' });
      }
    } else {
      addToast({ type: 'error', message: 'weatherError' });
    }
    setTestingWeather(false);
  };

  const handleExport = (format: ExportFormat) => {
    const data = { items, wornToday, weather, settings };
    switch (format) {
      case 'pdf':
        exportAsPDF(data);
        break;
      case 'txt':
        exportAsTXT(data);
        break;
      case 'json':
        exportAsJSON(data);
        break;
    }
    addToast({ type: 'success', message: 'exportSuccess' });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.items || !Array.isArray(data.items)) {
        addToast({ type: 'error', message: 'importError' });
        return;
      }

      const validItems: ClothingItem[] = data.items.filter((item: any) =>
        item.id && item.name && item.category && item.status !== undefined && item.wearCount !== undefined
      );

      if (validItems.length === 0) {
        addToast({ type: 'error', message: 'importError' });
        return;
      }

      importItems(validItems);
    } catch {
      addToast({ type: 'error', message: 'importError' });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    resetAllData();
    setShowResetConfirm(false);
  };

  const sections: SettingsSection[] = [
    {
      title: t('appearance'),
      items: [
        {
          icon: isDark ? Sun : Moon,
          label: t('darkMode'),
          value: (
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                isDark ? 'bg-[#5c5470]' : 'bg-[#dbd8e3]'
              }`}
            >
              <motion.div
                animate={{ x: isDark ? 20 : 2 }}
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
              />
            </button>
          ),
        },
      ],
    },
    {
      title: t('language'),
      items: [
        {
          icon: Globe,
          label: t('language'),
          value: (
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-sm text-[#5c5470] font-medium outline-none cursor-pointer text-right"
            >
              <option value="en">{t('english')}</option>
              <option value="ar">{t('arabic')}</option>
              <option value="fr">{t('french')}</option>
              <option value="system">{t('systemDefault')}</option>
            </select>
          ),
        },
      ],
    },
    {
      title: t('weatherSettings'),
      items: [
        {
          icon: MapPin,
          label: (
            <div className="flex-1">
              <p className="text-sm font-medium">{t('city')}</p>
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder={t('cityPlaceholder')}
                className="w-full text-xs text-[#8a8a8a] bg-transparent outline-none mt-0.5"
              />
            </div>
          ),
          value: (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleTestWeather}
              disabled={testingWeather}
              className="px-3 py-1.5 rounded-xl bg-[#5c5470]/10 text-[#5c5470] text-xs font-medium"
            >
              {testingWeather ? '...' : t('testWeather')}
            </motion.button>
          ),
          fullWidth: true,
        },
      ],
    },
    {
      title: t('notifications'),
      items: [
        {
          icon: Bell,
          label: t('enableNotifications'),
          value: (
            <button
              onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                settings.notificationsEnabled ? 'bg-[#5c5470]' : 'bg-[#dbd8e3]'
              }`}
            >
              <motion.div
                animate={{ x: settings.notificationsEnabled ? 20 : 2 }}
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
              />
            </button>
          ),
        },
        {
          icon: Bell,
          label: t('undergarmentReminder'),
          value: (
            <input
              type="number"
              min={6}
              max={72}
              value={settings.undergarmentReminderInterval}
              onChange={(e) => updateSettings({ undergarmentReminderInterval: Number(e.target.value) })}
              className="w-16 h-8 rounded-lg bg-white/60 border border-[#e6e4dc]/80 text-center text-sm outline-none dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80"
            />
          ),
        },
        {
          icon: Bell,
          label: t('laundryReminder'),
          value: (
            <input
              type="number"
              min={1}
              max={14}
              value={settings.laundryReminderFrequency}
              onChange={(e) => updateSettings({ laundryReminderFrequency: Number(e.target.value) })}
              className="w-16 h-8 rounded-lg bg-white/60 border border-[#e6e4dc]/80 text-center text-sm outline-none dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80"
            />
          ),
        },
      ],
    },
    {
      title: t('export'),
      items: [
        {
          icon: FileSpreadsheet,
          label: t('exportAsPDF'),
          value: <ChevronRight className="w-4 h-4 text-[#8a8a8a]" />,
          onClick: () => handleExport('pdf'),
        },
        {
          icon: FileText,
          label: t('exportAsTXT'),
          value: <ChevronRight className="w-4 h-4 text-[#8a8a8a]" />,
          onClick: () => handleExport('txt'),
        },
        {
          icon: FileJson,
          label: t('exportAsJSON'),
          value: <ChevronRight className="w-4 h-4 text-[#8a8a8a]" />,
          onClick: () => handleExport('json'),
        },
        {
          icon: Upload,
          label: t('importBackup'),
          value: <ChevronRight className="w-4 h-4 text-[#8a8a8a]" />,
          onClick: () => fileInputRef.current?.click(),
        },
      ],
    },
    {
      title: t('dataManagement'),
      items: [
        {
          icon: Trash2,
          label: (
            <div>
              <p className="text-sm font-medium text-[#e76f51]">{t('resetData')}</p>
            </div>
          ),
          onClick: () => setShowResetConfirm(true),
          danger: true,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-semibold tracking-tight text-[#2d2d2d] dark:text-[#f8f7f4]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {t('settings')}
        </h1>
      </div>

      {/* Privacy Notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-gradient-to-br from-[#5c5470]/5 to-[#a7c957]/5 border border-[#5c5470]/10"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5c5470]/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-[#5c5470]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#2d2d2d] dark:text-[#f8f7f4]">{t('privacyNotice')}</h3>
            <p className="text-xs text-[#8a8a8a] mt-1 leading-relaxed">{t('privacyDetails')}</p>
          </div>
        </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-5">
        {sections.map((section, si) => (
          <div key={si}>
            <h2 className="text-xs font-semibold text-[#8a8a8a] uppercase tracking-wider mb-2 px-1">
              {section.title}
            </h2>
            <div className="space-y-1">
              {section.items.map((item, ii) => (
                <motion.button
                  key={ii}
                  whileTap={item.onClick ? { scale: 0.98 } : undefined}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl text-left transition-colors ${
                    item.danger
                      ? 'bg-[#e76f51]/5 border border-[#e76f51]/10'
                      : 'bg-white/60 backdrop-blur-md border border-[#e6e4dc]/80 dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80'
                  } ${item.onClick ? 'cursor-pointer' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    item.danger ? 'bg-[#e76f51]/10' : 'bg-[#5c5470]/5'
                  }`}>
                    <item.icon className={`w-4 h-4 ${item.danger ? 'text-[#e76f51]' : 'text-[#5c5470]'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    {typeof item.label === 'string' ? (
                      <p className="text-sm font-medium">{item.label}</p>
                    ) : (
                      item.label
                    )}
                  </div>
                  {item.value}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />

      {/* Reset Confirmation */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm p-5 rounded-3xl bg-[#f8f7f4] dark:bg-[#2a2a2a]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#e76f51]/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#e76f51]" />
                </div>
                <h3 className="text-lg font-semibold">{t('resetData')}</h3>
              </div>
              <p className="text-sm text-[#8a8a8a] mb-6">{t('resetConfirm')}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 rounded-2xl bg-white/60 border border-[#e6e4dc]/80 text-sm font-medium dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-2xl bg-[#e76f51] text-white text-sm font-medium"
                >
                  {t('confirm')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Version */}
      <div className="text-center pt-4 pb-2">
        <p className="text-xs text-[#8a8a8a]">{t('about')}</p>
        <p className="text-[10px] text-[#8a8a8a]/60 mt-0.5">{t('version')}</p>
      </div>
    </div>
  );
}
