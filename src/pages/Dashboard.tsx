import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Shirt, Droplets, Sparkles, AlertTriangle,
  Sun, Cloud, CloudRain, Snowflake, Wind, ChevronRight,
  Plus, LogIn, HeartHandshake
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useWeather, getWeatherIcon, getTemperatureAdvice } from '@/hooks/useWeather';
import { StatusBadge } from '@/components/StatusBadge';
import { useNavigate } from 'react-router-dom';

const weatherIcons: Record<string, React.ElementType> = {
  sun: Sun,
  cloud: Cloud,
  'cloud-rain': CloudRain,
  snowflake: Snowflake,
  wind: Wind,
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Dashboard() {
  const {
    items, currentlyWornItems, dirtyItems, inWashItems,
    donationCandidates, hygieneAlerts, weather, settings,
    setWeather, t, wornToday, addToast,
  } = useApp();
  const { fetchWeather } = useWeather();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const totalItems = items.filter((i) => !i.donatedDate).length;
  const laundryCount = dirtyItems.length + inWashItems.length;

  useEffect(() => {
    if (settings.city && !weather) {
      handleFetchWeather();
    }
  }, []);

  const handleFetchWeather = useCallback(async () => {
    setRefreshing(true);
    const result = await fetchWeather(settings);
    if (result) {
      setWeather(result);
      addToast({ type: 'success', message: 'weatherSuccess' });
    } else {
      addToast({ type: 'error', message: 'weatherError' });
    }
    setRefreshing(false);
  }, [settings, fetchWeather, setWeather, addToast]);

  const handleLogOutfit = useCallback(() => {
    navigate('/wardrobe', { state: { logOutfit: true } });
  }, [navigate]);

  const WeatherIcon = weather ? weatherIcons[getWeatherIcon(weather.condition)] || Sun : Sun;
  const weatherAdvice = weather ? getTemperatureAdvice(weather.temperature) : '';

  const stats = [
    { label: t('totalItems'), value: totalItems, icon: Shirt, color: 'bg-[#5c5470]/10 text-[#5c5470]' },
    { label: t('currentlyWorn'), value: currentlyWornItems.length, icon: Sparkles, color: 'bg-[#d4a373]/10 text-[#d4a373]' },
    { label: t('inLaundry'), value: laundryCount, icon: Droplets, color: 'bg-[#2a9d8f]/10 text-[#2a9d8f]' },
    { label: t('hygieneAlerts'), value: hygieneAlerts, icon: AlertTriangle, color: hygieneAlerts > 0 ? 'bg-[#e76f51]/10 text-[#e76f51]' : 'bg-[#a7c957]/10 text-[#5a7d24]' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-5"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-semibold tracking-tight text-[#2d2d2d] dark:text-[#f8f7f4]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('dashboard')}
          </h1>
          <p className="text-sm text-[#8a8a8a] mt-0.5">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
        </div>
      </motion.div>

      {/* Weather Widget */}
      <motion.div
        variants={itemVariants}
        onClick={() => !weather && navigate('/settings')}
        className={`relative overflow-hidden rounded-3xl p-5 ${
          weather
            ? 'bg-gradient-to-br from-[#5c5470] to-[#6d6875] text-white'
            : 'bg-white/60 backdrop-blur-md border border-[#e6e4dc]/80 cursor-pointer'
        }`}
      >
        {weather ? (
          <>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <WeatherIcon className="w-5 h-5 text-[#d4a373]" />
                  <span className="text-sm font-medium opacity-80">{settings.city}</span>
                </div>
                <div className="text-5xl font-light tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {weather.temperature}°
                </div>
                <p className="text-sm opacity-70 mt-1">{t(weather.condition)} · {weather.humidity}% {t('weatherWidget')}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9, rotate: 180 }}
                onClick={(e) => { e.stopPropagation(); handleFetchWeather(); }}
                className="p-2 rounded-full bg-white/10"
                animate={refreshing ? { rotate: 360 } : {}}
                transition={refreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
              >
                <Sun className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-xs opacity-60">{t(weatherAdvice)}</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <Cloud className="w-8 h-8 text-[#8a8a8a] mb-2" />
            <p className="text-sm text-[#8a8a8a]">{t('noWeather')}</p>
            <p className="text-xs text-[#8a8a8a] mt-1">{t('tapToSetWeather')}</p>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/add')}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#5c5470] text-white font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          {t('quickAdd')}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLogOutfit}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/60 backdrop-blur-md border border-[#e6e4dc]/80 text-[#5c5470] font-medium text-sm dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80"
        >
          <LogIn className="w-4 h-4" />
          {wornToday.length > 0 ? t('outfitInProgress') : t('logOutfit')}
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.08 + 0.2 }}
            whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-md border border-[#e6e4dc]/80 p-4 dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80"
          >
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${stat.color}`}>
              <stat.icon className="w-4.5 h-4.5" />
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                {stat.value}
              </div>
              <div className="text-xs text-[#8a8a8a] font-medium mt-0.5">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Donation Banner */}
      {donationCandidates.length > 0 && (
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="rounded-2xl bg-gradient-to-r from-[#e9c46a]/10 to-[#d4a373]/10 border border-[#e9c46a]/20 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#e9c46a]/20">
              <HeartHandshake className="w-5 h-5 text-[#d4a373]" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[#2d2d2d] dark:text-[#f8f7f4]">{t('donationSuggestions')}</h3>
              <p className="text-xs text-[#8a8a8a] mt-0.5">
                {t('itemsToDonate', { count: donationCandidates.length })}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/wardrobe', { state: { filter: 'donation-candidates' } })}
              className="p-2 rounded-full bg-[#e9c46a]/20"
            >
              <ChevronRight className="w-4 h-4 text-[#d4a373]" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Currently Worn Section */}
      {wornToday.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-3">
          <h2 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('currentlyWorn')}
          </h2>
          <div className="space-y-2">
            {wornToday.map((worn) => {
              const item = items.find((i) => i.id === worn.itemId);
              if (!item) return null;
              const hoursWorn = (Date.now() - new Date(worn.wornSince).getTime()) / (1000 * 60 * 60);
              return (
                <motion.div
                  key={worn.itemId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 backdrop-blur-md border border-[#e6e4dc]/80 dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80"
                >
                  {item.photo ? (
                    <img src={item.photo} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#dbd8e3]/50 flex items-center justify-center">
                      <Shirt className="w-5 h-5 text-[#8a8a8a]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-[#8a8a8a]">
                      {hoursWorn < 24
                        ? `${Math.round(hoursWorn)}h`
                        : `${Math.round(hoursWorn / 24)}d`}
                    </p>
                  </div>
                  <StatusBadge status={item.status} size="sm" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
