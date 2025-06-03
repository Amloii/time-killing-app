import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, BarChart2, Menu, Swords, ListChecks, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard/battle', icon: Swords, label: 'Battle' },
    { path: '/dashboard/tasks', icon: ListChecks, label: 'Tasks' },
    { path: '/dashboard/chop', icon: Scissors, label: 'Chop' },
    { path: '/statistics', icon: BarChart2, label: 'Stats' },
  ];

  const isPathActive = (path: string) => {
    if (path === '/statistics') {
      return location.pathname === path;
    }
    return location.pathname.includes(path.split('/').pop() || '');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-16">{children}</main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-lg border-t border-gray-200 safe-area-inset">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = isPathActive(path);
            
            return (
              <Link
                key={path}
                to={path}
                className="relative flex flex-col items-center px-2"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-lg ${
                    isActive ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs mt-0.5">{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;