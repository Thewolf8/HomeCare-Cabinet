import { motion } from 'framer-motion';
import {
  X, Shirt, Calendar, Hash, Palette, Tag, Building2,
  FileText, Clock, AlertTriangle, Trash2, CheckCircle
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { ClothingItem } from '@/types';
import { StatusBadge } from './StatusBadge';
import { useState } from 'react';

interface Props {
  item: ClothingItem;
  onClose: () => void;
}

export function ItemDetailSheet({ item, onClose }: Props) {
  const { t, cycleStatus, deleteItem, wornToday, markAsChanged, logOutfit } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isWorn = wornToday.some((w) => w.itemId === item.id);
  const daysSinceWorn = item.lastWornDate
    ? Math.floor((Date.now() - new Date(item.lastWornDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const handleDelete = () => {
    deleteItem(item.id);
    onClose();
  };

  const handleWear = () => {
    logOutfit([item.id]);
    onClose();
  };

  const handleChange = () => {
    markAsChanged(item.id);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-[32px] bg-[#f8f7f4] dark:bg-[#2a2a2a]"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#dbd8e3]" />
        </div>

        {/* Photo */}
        <div className="relative aspect-square mx-4 rounded-2xl overflow-hidden bg-gradient-to-br from-[#dbd8e3]/30 to-[#e6e4dc]/30">
          {item.photo ? (
            <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Shirt className="w-20 h-20 text-[#8a8a8a]/30" />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-3">
            <StatusBadge status={item.status} onClick={() => cycleStatus(item.id)} size="md" />
          </div>
        </div>

        {/* Info */}
        <div className="px-5 pt-4 pb-8 space-y-4">
          <div>
            <h2
              className="text-2xl font-semibold text-[#2d2d2d] dark:text-[#f8f7f4]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {item.name}
            </h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-[#5c5470]/10 text-[#5c5470] text-xs font-medium">
                {t(item.category)}
              </span>
              {item.seasons.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-full bg-[#d4a373]/10 text-[#d4a373] text-[10px] font-medium">
                  {t(s)}
                </span>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {item.color && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/60 border border-[#e6e4dc]/80 dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.color + '20' }}>
                  <Palette className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-[10px] text-[#8a8a8a] uppercase tracking-wider font-medium">{t('color')}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full border border-[#e6e4dc]" style={{ backgroundColor: item.color }} />
                    <p className="text-sm font-medium">{item.color}</p>
                  </div>
                </div>
              </div>
            )}
            {item.brand && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/60 border border-[#e6e4dc]/80 dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80">
                <div className="w-8 h-8 rounded-lg bg-[#2a9d8f]/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#2a9d8f]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#8a8a8a] uppercase tracking-wider font-medium">{t('brand')}</p>
                  <p className="text-sm font-medium">{item.brand}</p>
                </div>
              </div>
            )}
            {item.material && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/60 border border-[#e6e4dc]/80 dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80">
                <div className="w-8 h-8 rounded-lg bg-[#d4a373]/10 flex items-center justify-center">
                  <Tag className="w-4 h-4 text-[#d4a373]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#8a8a8a] uppercase tracking-wider font-medium">{t('material')}</p>
                  <p className="text-sm font-medium">{item.material}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/60 border border-[#e6e4dc]/80 dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80">
              <div className="w-8 h-8 rounded-lg bg-[#5c5470]/10 flex items-center justify-center">
                <Hash className="w-4 h-4 text-[#5c5470]" />
              </div>
              <div>
                <p className="text-[10px] text-[#8a8a8a] uppercase tracking-wider font-medium">{t('wearCount')}</p>
                <p className="text-sm font-medium">{item.wearCount}</p>
              </div>
            </div>
            {item.purchaseDate && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/60 border border-[#e6e4dc]/80 dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80">
                <div className="w-8 h-8 rounded-lg bg-[#e9c46a]/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-[#e9c46a]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#8a8a8a] uppercase tracking-wider font-medium">{t('purchaseDate')}</p>
                  <p className="text-sm font-medium">{new Date(item.purchaseDate).toLocaleDateString()}</p>
                </div>
              </div>
            )}
            {daysSinceWorn !== null && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/60 border border-[#e6e4dc]/80 dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80">
                <div className="w-8 h-8 rounded-lg bg-[#a7c957]/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#a7c957]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#8a8a8a] uppercase tracking-wider font-medium">{t('lastWorn')}</p>
                  <p className="text-sm font-medium">
                    {daysSinceWorn === 0 ? 'Today' : daysSinceWorn === 1 ? 'Yesterday' : `${daysSinceWorn} days ago`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {item.notes && (
            <div className="p-3 rounded-xl bg-white/60 border border-[#e6e4dc]/80 dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80">
              <div className="flex items-center gap-2 mb-1.5">
                <FileText className="w-3.5 h-3.5 text-[#8a8a8a]" />
                <p className="text-[10px] text-[#8a8a8a] uppercase tracking-wider font-medium">{t('notes')}</p>
              </div>
              <p className="text-sm text-[#2d2d2d] dark:text-[#e6e4dc]">{item.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {!isWorn && item.status === 'clean' && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleWear}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#5c5470] text-white font-medium text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                {t('markAsWorn')}
              </motion.button>
            )}
            {isWorn && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleChange}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#2a9d8f] text-white font-medium text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                {t('markAsChanged')}
              </motion.button>
            )}
          </div>

          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-[#e76f51]/20 text-[#e76f51] font-medium text-sm flex-1"
            >
              <Trash2 className="w-4 h-4" />
              {t('delete')}
            </motion.button>
          </div>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-[#e76f51]/5 border border-[#e76f51]/20"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#e76f51] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#e76f51]">{t('deleteConfirm', { name: item.name })}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-[#8a8a8a] bg-white/60"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#e76f51]"
                    >
                      {t('confirm')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
