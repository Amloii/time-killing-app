import React from 'react';
import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, BarChart2, List, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import PointsDisplay from '../common/PointsDisplay';
import UserMenu from '../auth/UserMenu';
import AuthModal from '../auth/AuthModal';
import AuthPrompt from '../auth/AuthPrompt';
import SettingsPanel from '../settings/SettingsPanel';
import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showAuthPrompt, setShowAuthPrompt] = useState(!isAuthenticated && !localStorage.getItem('auth-prompt-dismissed'));
  const [showSettings, setShowSettings] = useState(false);
  
  const navItems = [
    { path: '/dashboard/battle', icon: Home, label: 'Battle' },
    { path: '/dashboard/tasks', icon: List, label: 'Tasks' },
    { path: '/rewards', icon: Trophy, label: 'Rewards' },
    { path: '/statistics', icon: BarChart2, label: 'Stats' },
  ];

  const handleDismissAuthPrompt = () => {
    setShowAuthPrompt(false);
    localStorage.setItem('auth-prompt-dismissed', 'true');
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setShowAuthPrompt(false);
    localStorage.setItem('auth-prompt-dismissed', 'true');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white bg-opacity-90 backdrop-blur-lg border-b border-gray-200 p-4 safe-area-inset">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-400">
              <img
                src="/0609.gif"
                alt="Fight Mode"
                className="w-full h-full object-cover"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <h1 className="text-xl font-bold japanese-brush text-red-600">Fight Mode</h1>
          </div>
          <div className="flex items-center space-x-4">
            <PointsDisplay showProgress={false} size="md" />
            <UserMenu 
              onOpenSettings={() => setShowSettings(true)}
              onOpenAuth={handleOpenAuth}
            />
          </div>
        </div>
      </header>
      
      <main className="flex-1 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {showAuthPrompt && (
            <AuthPrompt
              onSignUp={() => handleOpenAuth('signup')}
              onSignIn={() => handleOpenAuth('signin')}
              onDismiss={handleDismissAuthPrompt}
            />
          )}
        </div>
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-lg border-t border-gray-200 safe-area-inset">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname.startsWith(path);
            
            return (
              <Link
                key={path}
                to={path}
                className="relative flex flex-col items-center"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-lg ${
                    isActive ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs mt-1">{label}</span>
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
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
      
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <SettingsPanel onClose={() => setShowSettings(false)} />
        </div>
      )}
    </div>
  );
};

export default Layout;