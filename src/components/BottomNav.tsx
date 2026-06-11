import { motion } from 'framer-motion';
import { LayoutDashboard, Shirt, Plus, Droplets, Settings } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', icon: LayoutDashboard, labelKey: 'dashboard' },
  { path: '/wardrobe', icon: Shirt, labelKey: 'wardrobe' },
  { path: '/add', icon: Plus, labelKey: 'addItem', isFab: true },
  { path: '/laundry', icon: Droplets, labelKey: 'laundry' },
  { path: '/settings', icon: Settings, labelKey: 'settings' },
];

export function BottomNav() {
  const { t, dirtyItems, inWashItems } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const laundryCount = dirtyItems.length + inWashItems.length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="mx-auto max-w-lg px-4 pb-4 pt-2">
        <div
          className="flex items-center justify-around h-16 rounded-3xl backdrop-blur-xl bg-white/85 border border-[#e6e4dc]/80 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:bg-[#2d2d2d]/85 dark:border-[#3d3d3d]/80"
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            if (item.isFab) {
              return (
                <motion.button
                  key={item.path}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(item.path)}
                  className="relative -mt-6 flex items-center justify-center w-14 h-14 rounded-full bg-[#5c5470] text-white shadow-lg shadow-[#5c5470]/30"
                >
                  <motion.div
                    animate={{ boxShadow: ['0 0 0 0 rgba(92,84,112,0.3)', '0 0 0 8px rgba(92,84,112,0)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full"
                  />
                  <Icon className="w-6 h-6" />
                </motion.button>
              );
            }

            return (
              <motion.button
                key={item.path}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center justify-center gap-0.5 w-16 h-14 rounded-2xl transition-colors ${
                  isActive ? 'text-[#5c5470]' : 'text-[#8a8a8a]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -top-0.5 w-8 h-0.5 rounded-full bg-[#5c5470]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.path === '/laundry' && laundryCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold text-white bg-[#e76f51] rounded-full">
                      {laundryCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
