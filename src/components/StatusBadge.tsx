import { motion } from 'framer-motion';
import type { ItemStatus } from '@/types';
import { useApp } from '@/context/AppContext';

interface StatusBadgeProps {
  status: ItemStatus;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

const statusConfig: Record<ItemStatus, { bg: string; text: string; labelKey: string }> = {
  clean: { bg: 'bg-[#a7c957]/15', text: 'text-[#5a7d24]', labelKey: 'clean' },
  dirty: { bg: 'bg-[#e76f51]/15', text: 'text-[#c45a3e]', labelKey: 'dirty' },
  'in-wash': { bg: 'bg-[#2a9d8f]/15', text: 'text-[#1d7066]', labelKey: 'in-wash' },
  worn: { bg: 'bg-[#5c5470]/15', text: 'text-[#5c5470]', labelKey: 'worn' },
};

export function StatusBadge({ status, onClick, size = 'sm' }: StatusBadgeProps) {
  const { t } = useApp();
  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <motion.button
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${config.bg} ${config.text} ${sizeClasses} ${
        onClick ? 'cursor-pointer hover:opacity-80' : ''
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.text.replace('text-', 'bg-')}`} />
      {t(config.labelKey)}
    </motion.button>
  );
}
