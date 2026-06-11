import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, Shirt, X, Clock, Hash, Calendar
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useLocation } from 'react-router-dom';
import type { ClothingItem, SortOption, FilterOption } from '@/types';
import { CATEGORIES } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { ItemDetailSheet } from '@/components/ItemDetailSheet';

const sortOptions: { key: SortOption; labelKey: string; icon: typeof Hash }[] = [
  { key: 'name', labelKey: 'name', icon: Hash },
  { key: 'last-worn', labelKey: 'lastWorn', icon: Clock },
  { key: 'wear-count', labelKey: 'wearCount', icon: Hash },
  { key: 'date-added', labelKey: 'dateAdded', icon: Calendar },
];

export function Wardrobe() {
  const { items, t, dir } = useApp();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterOption>((location.state as any)?.filter || 'all');
  const [sort, setSort] = useState<SortOption>('date-added');
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [logOutfitMode] = useState(() => !!(location.state as any)?.logOutfit);
  const [selectedForOutfit, setSelectedForOutfit] = useState<Set<string>>(new Set());

  const activeItems = items.filter((i) => !i.donatedDate);

  const filteredItems = useMemo(() => {
    let result = [...activeItems];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.color.toLowerCase().includes(q) ||
          (i.brand && i.brand.toLowerCase().includes(q))
      );
    }

    // Filter
    if (filter !== 'all') {
      if (filter === 'undergarments') {
        result = result.filter((i) => i.isUndergarment);
      } else if (filter === 'donation-candidates') {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        result = result.filter((i) => {
          if (i.donationDismissed) return false;
          if (i.status === 'dirty' || i.status === 'in-wash') return false;
          const lastWorn = i.lastWornDate ? new Date(i.lastWornDate) : null;
          const purchaseDate = i.purchaseDate ? new Date(i.purchaseDate) : null;
          const neverWorn = !lastWorn;
          const notWornRecently = lastWorn && lastWorn < sixMonthsAgo;
          const oldPurchase = neverWorn && purchaseDate && purchaseDate < sixMonthsAgo;
          return notWornRecently || oldPurchase;
        });
      } else {
        result = result.filter((i) => i.category === filter);
      }
    }

    // Sort
    result.sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'last-worn':
          if (!a.lastWornDate && !b.lastWornDate) return 0;
          if (!a.lastWornDate) return 1;
          if (!b.lastWornDate) return -1;
          return new Date(b.lastWornDate).getTime() - new Date(a.lastWornDate).getTime();
        case 'wear-count':
          return b.wearCount - a.wearCount;
        case 'date-added':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [activeItems, search, filter, sort]);

  const toggleOutfitSelection = (id: string) => {
    setSelectedForOutfit((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-semibold tracking-tight text-[#2d2d2d] dark:text-[#f8f7f4]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {t('wardrobe')}
        </h1>
        <p className="text-sm text-[#8a8a8a] mt-0.5">
          {filteredItems.length} {t('allItems').toLowerCase()}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a] ${dir === 'rtl' ? 'right-3' : 'left-3'}`} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className={`w-full h-12 rounded-2xl bg-white/60 backdrop-blur-md border border-[#e6e4dc]/80 pl-10 pr-10 text-sm outline-none focus:border-[#5c5470]/50 transition-colors dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80 dark:text-[#e6e4dc] ${dir === 'rtl' ? 'pr-10 pl-10 text-right' : ''}`}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className={`absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'left-3' : 'right-3'}`}
          >
            <X className="w-4 h-4 text-[#8a8a8a]" />
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            showFilters ? 'bg-[#5c5470] text-white' : 'bg-white/60 border border-[#e6e4dc]/80 text-[#5c5470] dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {t('filterBy')}
        </button>
        {(['all', ...CATEGORIES] as FilterOption[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-[#5c5470] text-white'
                : 'bg-white/60 border border-[#e6e4dc]/80 text-[#8a8a8a] dark:bg-[#2d2d2d]/60 dark:border-[#3d3d3d]/80'
            }`}
          >
            {f === 'all' ? t('allItems') : t(f)}
          </button>
        ))}
        {filter === 'donation-candidates' || (location.state as any)?.filter === 'donation-candidates' ? (
          <button
            onClick={() => setFilter('donation-candidates')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === 'donation-candidates'
                ? 'bg-[#e9c46a] text-[#2d2d2d]'
                : 'bg-[#e9c46a]/20 text-[#d4a373]'
            }`}
          >
            {t('donationSuggestions')}
          </button>
        ) : null}
      </div>

      {/* Sort */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 pb-2">
              <span className="text-xs text-[#8a8a8a] font-medium">{t('sortBy')}:</span>
              {sortOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSort(opt.key)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-colors ${
                    sort === opt.key ? 'bg-[#5c5470]/10 text-[#5c5470] font-medium' : 'text-[#8a8a8a]'
                  }`}
                >
                  <opt.icon className="w-3 h-3" />
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <img src="/empty-wardrobe.jpg" alt="Empty" className="w-40 h-40 rounded-2xl object-cover mb-4 opacity-60" />
          <p className="text-lg font-medium text-[#2d2d2d] dark:text-[#f8f7f4]">{t('noItemsFound')}</p>
          <p className="text-sm text-[#8a8a8a] mt-1">{t('addYourFirstItem')}</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (logOutfitMode && item.status === 'clean') {
                    toggleOutfitSelection(item.id);
                  } else {
                    setSelectedItem(item);
                  }
                }}
                className={`relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-md border transition-all cursor-pointer dark:bg-[#2d2d2d]/60 ${
                  selectedForOutfit.has(item.id)
                    ? 'border-[#5c5470] ring-2 ring-[#5c5470]/20'
                    : 'border-[#e6e4dc]/80 dark:border-[#3d3d3d]/80'
                }`}
              >
                {/* Photo */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  {item.photo ? (
                    <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#dbd8e3]/30 to-[#e6e4dc]/30 flex items-center justify-center">
                      <Shirt className="w-10 h-10 text-[#8a8a8a]/40" />
                    </div>
                  )}
                  {/* Status overlay */}
                  <div className={`absolute top-2 ${dir === 'rtl' ? 'left-2' : 'right-2'}`}>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  {/* Selection check */}
                  {selectedForOutfit.has(item.id) && (
                    <div className="absolute inset-0 bg-[#5c5470]/20 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#5c5470] flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-3">
                  <h3 className="text-sm font-medium truncate text-[#2d2d2d] dark:text-[#f8f7f4]">{item.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#dbd8e3]/30 text-[#5c5470] font-medium">
                      {t(item.category)}
                    </span>
                    {item.wearCount > 0 && (
                      <span className="text-[10px] text-[#8a8a8a]">
                        {item.wearCount === 1 ? t('wornOnce') : t('wornTimes', { count: item.wearCount })}
                      </span>
                    )}
                  </div>
                  {/* Undergarment hygiene indicator */}
                  {item.isUndergarment && item.status === 'worn' && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="flex-1 h-1.5 rounded-full bg-[#dbd8e3]/30 overflow-hidden">
                        <div className="h-full rounded-full bg-[#a7c957]" style={{ width: '70%' }} />
                      </div>
                      <span className="text-[9px] text-[#8a8a8a]">{t('hygieneGood')}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Outfit Log CTA */}
      {logOutfitMode && selectedForOutfit.size > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-24 left-4 right-4 z-40"
        >
          <button
            onClick={() => {
              const { logOutfit } = useApp();
              logOutfit(Array.from(selectedForOutfit));
            }}
            className="w-full py-4 rounded-2xl bg-[#5c5470] text-white font-semibold text-sm shadow-lg"
          >
            {t('logOutfit')} ({selectedForOutfit.size})
          </button>
        </motion.div>
      )}

      {/* Detail Sheet */}
      <AnimatePresence>
        {selectedItem && (
          <ItemDetailSheet
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
