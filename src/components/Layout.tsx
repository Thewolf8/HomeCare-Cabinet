import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNav } from './BottomNav';
import { ToastContainer } from './Toast';
import { useApp } from '@/context/AppContext';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export function Layout() {
  const location = useLocation();
  const { dir } = useApp();

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[#f8f7f4] dark:bg-[#1a1a1a] text-[#2d2d2d] dark:text-[#e6e4dc] transition-colors duration-300 font-sans"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <ToastContainer />
      <main className="pb-28 px-4 pt-4 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
}
