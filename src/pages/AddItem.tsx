import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Image, X, Palette, Tag, Building2,
  Calendar, Check
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import type { Category, Season } from '@/types';
import { CATEGORIES, SEASONS, PRESET_COLORS } from '@/types';

export function AddItem() {
  const { t, addItem } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState('');
  const [savedIndicator] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>('tops');
  const [seasons, setSeasons] = useState<Season[]>(['all-seasons']);
  const [color, setColor] = useState('#5c5470');
  const [material, setMaterial] = useState('');
  const [brand, setBrand] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isUndergarment, setIsUndergarment] = useState(false);
  const [changeInterval, setChangeInterval] = useState(1);
  const [noBaseLayer, setNoBaseLayer] = useState(false);

  // Auto-update isUndergarment when category changes
  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setIsUndergarment(cat === 'undergarments');
  };

  // Photo handling
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleCameraCapture = useCallback(async () => {
    try {
      // Try to use Capacitor Camera if available
      const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      if (image.dataUrl) {
        setPhoto(image.dataUrl);
      }
    } catch {
      // Fallback to file input
      fileInputRef.current?.click();
    }
  }, []);

  const handleGallerySelect = useCallback(async () => {
    try {
      const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });
      if (image.dataUrl) {
        setPhoto(image.dataUrl);
      }
    } catch {
      fileInputRef.current?.click();
    }
  }, []);

  const toggleSeason = (season: Season) => {
    setSeasons((prev) => {
      if (season === 'all-seasons') return ['all-seasons'];
      const filtered = prev.filter((s) => s !== 'all-seasons');
      if (filtered.includes(season)) {
        const next = filtered.filter((s) => s !== season);
        return next.length === 0 ? ['all-seasons'] : next;
      }
      return [...filtered, season];
    });
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    addItem({
      name: name.trim(),
      photo,
      category,
      seasons,
      color,
      material: material || undefined,
      brand: brand || undefined,
      purchaseDate: purchaseDate || undefined,
      notes: notes || undefined,
      isUndergarment,
      changeIntervalDays: isUndergarment ? changeInterval : 1,
      noBaseLayer: isUndergarment ? noBaseLayer : false,
    });

    navigate('/wardrobe');
  };

  const isValid = name.trim().length > 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1
          className="text-3xl font-semibold tracking-tight text-[#2d2d2d] dark:text-[#f8f7f4]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {t('addItem')}
        </h1>
        {savedIndicator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1 text-xs text-[#a7c957] font-medium"
          >
            <Check className="w-3.5 h-3.5" />
            {t('autoSaved')}
          </motion.div>
        )}
      </div>

      {/* Photo Area */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        {photo ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden"
          >
            <img src={photo} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={() => setPhoto(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#dbd8e3]/30 to-[#e6e4dc]/30 border-2 border-dashed border-[#dbd8e3] flex flex-col items-center justify-center gap-3">
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCameraCapture}
                className="flex flex-col items-center gap-2 px-6 py-4 rounded-2xl bg-white/60 backdrop-blur-sm"
              >
                <Camera className="w-6 h-6 text-[#5c5470]" />
                <span className="text-xs font-medium text-[#5c5470]">{t('takePhoto')}</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleGallerySelect}
                className="flex flex-col items-center gap-2 px-6 py-4 rounded-2xl bg-white/60 backdrop-blur-sm"
              >
                <Image className="w-6 h-6 text-[#5c5470]" />
                <span className="text-xs font-medium text-[#5c5470]">{t('chooseFromGallery')}</span>
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-[#8a8a8a] uppercase tracking-wider mb-1.5">
            {t('itemName')} *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('itemNamePlaceholder')}
            className="w-full h-12 rounded-2xl bg-white/60 border border-[#e6e4dc]/80 px-4 text-sm outline-none focus:border-[#5c5470]/50 transition-colors dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80 dark:text-[#e6e4dc]"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-[#8a8a8a] uppercase tracking-wider mb-2">
            {t('category')}
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  category === cat
                    ? 'bg-[#5c5470] text-white'
                    : 'bg-white/60 border border-[#e6e4dc]/80 text-[#5c5470] dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80'
                }`}
              >
                {t(cat)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Seasons */}
        <div>
          <label className="block text-xs font-medium text-[#8a8a8a] uppercase tracking-wider mb-2">
            {t('seasons')}
          </label>
          <div className="flex flex-wrap gap-2">
            {SEASONS.map((season) => (
              <motion.button
                key={season}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleSeason(season)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  seasons.includes(season)
                    ? 'bg-[#d4a373] text-white'
                    : 'bg-white/60 border border-[#e6e4dc]/80 text-[#8a8a8a] dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80'
                }`}
              >
                {t(season)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-xs font-medium text-[#8a8a8a] uppercase tracking-wider mb-2">
            {t('color')}
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((c) => (
              <motion.button
                key={c}
                whileTap={{ scale: 0.8 }}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  color === c ? 'border-[#5c5470] scale-110 shadow-md' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#dbd8e3] to-[#e6e4dc] flex items-center justify-center"
            >
              <Palette className="w-3.5 h-3.5 text-[#5c5470]" />
            </button>
          </div>
          <AnimatePresence>
            {showColorPicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <input
                  type="color"
                  value={customColor || color}
                  onChange={(e) => { setCustomColor(e.target.value); setColor(e.target.value); }}
                  className="w-full h-10 mt-2 rounded-xl"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Optional Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#8a8a8a] uppercase tracking-wider mb-1.5">
              {t('material')}
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a]" />
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder={t('materialPlaceholder')}
                className="w-full h-11 rounded-2xl bg-white/60 border border-[#e6e4dc]/80 pl-10 pr-3 text-sm outline-none focus:border-[#5c5470]/50 transition-colors dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80 dark:text-[#e6e4dc]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#8a8a8a] uppercase tracking-wider mb-1.5">
              {t('brand')}
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a]" />
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder={t('brandPlaceholder')}
                className="w-full h-11 rounded-2xl bg-white/60 border border-[#e6e4dc]/80 pl-10 pr-3 text-sm outline-none focus:border-[#5c5470]/50 transition-colors dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80 dark:text-[#e6e4dc]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#8a8a8a] uppercase tracking-wider mb-1.5">
              {t('purchaseDate')}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a]" />
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full h-11 rounded-2xl bg-white/60 border border-[#e6e4dc]/80 pl-10 pr-3 text-sm outline-none focus:border-[#5c5470]/50 transition-colors dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80 dark:text-[#e6e4dc]"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-[#8a8a8a] uppercase tracking-wider mb-1.5">
            {t('notes')}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('notesPlaceholder')}
            rows={3}
            className="w-full rounded-2xl bg-white/60 border border-[#e6e4dc]/80 px-4 py-3 text-sm outline-none focus:border-[#5c5470]/50 transition-colors resize-none dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80 dark:text-[#e6e4dc]"
          />
        </div>

        {/* Undergarment-specific fields */}
        <AnimatePresence>
          {isUndergarment && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-[#5c5470]/5 border border-[#5c5470]/10 space-y-3">
                <h3 className="text-sm font-semibold text-[#5c5470]">{t('undergarmentSettings')}</h3>

                <div>
                  <label className="block text-xs font-medium text-[#8a8a8a] mb-1.5">
                    {t('changeInterval')}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={changeInterval}
                    onChange={(e) => setChangeInterval(Number(e.target.value))}
                    className="w-full h-11 rounded-2xl bg-white/60 border border-[#e6e4dc]/80 px-4 text-sm outline-none focus:border-[#5c5470]/50 dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80 dark:text-[#e6e4dc]"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noBaseLayer}
                    onChange={(e) => setNoBaseLayer(e.target.checked)}
                    className="w-5 h-5 rounded-lg border-[#dbd8e3] text-[#5c5470] accent-[#5c5470]"
                  />
                  <div>
                    <p className="text-sm font-medium">{t('noBaseLayer')}</p>
                    <p className="text-xs text-[#8a8a8a]">{t('noBaseLayerHint')}</p>
                  </div>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full py-4 rounded-2xl font-semibold text-sm transition-colors mt-2 ${
            isValid
              ? 'bg-[#5c5470] text-white shadow-lg shadow-[#5c5470]/20'
              : 'bg-[#dbd8e3]/50 text-[#8a8a8a] cursor-not-allowed'
          }`}
        >
          {t('saveItem')}
        </motion.button>
      </div>
    </div>
  );
}
