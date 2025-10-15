import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface DockProps {
  children: ReactNode;
  className?: string;
}

interface DockItemProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

const Dock = ({ children, className = "" }: DockProps) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl">
        {children}
      </div>
    </div>
  );
};

const DockItem = ({ children, className = "", href, onClick, isActive }: DockItemProps) => {
  const itemClasses = `flex items-center justify-center rounded-xl p-3 cursor-pointer transition-all duration-200 ${
    isActive 
      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
  } ${className}`;

  if (href) {
    return (
      <motion.div
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <a href={href} className={itemClasses}>
          <div className="w-6 h-6">
            {children}
          </div>
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={itemClasses}
      onClick={onClick}
    >
      <div className="w-6 h-6">
        {children}
      </div>
    </motion.div>
  );
};

export { Dock, DockItem };