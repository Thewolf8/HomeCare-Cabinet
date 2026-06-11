import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, CheckCircle2, RotateCcw } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Laundry() {
  const { dirtyItems, inWashItems, cycleStatus, markAllLaundryDone, t } = useApp();

  const allItems = [...dirtyItems, ...inWashItems];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-semibold tracking-tight text-[#2d2d2d] dark:text-[#f8f7f4]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('laundry')}
          </h1>
          <p className="text-sm text-[#8a8a8a] mt-0.5">
            {allItems.length} {allItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        {inWashItems.length > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={markAllLaundryDone}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#2a9d8f] text-white text-sm font-medium"
          >
            <CheckCircle2 className="w-4 h-4" />
            {t('markAllClean')}
          </motion.button>
        )}
      </div>

      {allItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <img src="/empty-laundry.jpg" alt="Empty laundry" className="w-40 h-40 rounded-2xl object-cover mb-4 opacity-60" />
          <p className="text-lg font-medium text-[#2d2d2d] dark:text-[#f8f7f4]">{t('laundryEmpty')}</p>
          <p className="text-sm text-[#8a8a8a] mt-1 max-w-xs">{t('laundryEmptyHint')}</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Dirty Items */}
          {dirtyItems.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-[#8a8a8a] uppercase tracking-wider mb-3">
                {t('dirtyItems')} ({dirtyItems.length})
              </h2>
              <div className="space-y-2">
                <AnimatePresence>
                  {dirtyItems.map((item) => (
                    <LaundryItemCard
                      key={item.id}
                      item={item}
                      onCycleStatus={() => cycleStatus(item.id)}
                      t={t}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* In Wash Items */}
          {inWashItems.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-[#8a8a8a] uppercase tracking-wider mb-3">
                {t('inWashItems')} ({inWashItems.length})
              </h2>
              <div className="space-y-2">
                <AnimatePresence>
                  {inWashItems.map((item) => (
                    <LaundryItemCard
                      key={item.id}
                      item={item}
                      onCycleStatus={() => cycleStatus(item.id)}
                      t={t}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LaundryItemCard({
  item,
  onCycleStatus,
  t,
}: {
  item: { id: string; name: string; photo: string | null; category: string; status: string; color: string };
  onCycleStatus: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 backdrop-blur-md border border-[#e6e4dc]/80 dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80"
    >
      {item.photo ? (
        <img src={item.photo} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
      ) : (
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#dbd8e3]/30 to-[#e6e4dc]/30 flex items-center justify-center flex-shrink-0">
          <Shirt className="w-6 h-6 text-[#8a8a8a]/40" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.name}</p>
        <p className="text-xs text-[#8a8a8a]">{t(item.category)}</p>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onCycleStatus}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2a9d8f]/10 text-[#2a9d8f] text-xs font-medium"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        {item.status === 'dirty' ? t('in-wash') : t('clean')}
      </motion.button>
    </motion.div>
  );
}
