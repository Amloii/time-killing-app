import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Cloud, CloudOff, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore } from '../../store';

interface UserMenuProps {
  onOpenSettings: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onOpenSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const { lastSyncTime } = useAppStore();

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const formatSyncTime = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-red-600" />
        </div>
        {isAuthenticated && (
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-gray-900">
              {user?.email?.split('@')[0]}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              {isAuthenticated ? (
                <>
                  <Cloud className="w-3 h-3 mr-1" />
                  Synced {formatSyncTime(lastSyncTime)}
                </>
              ) : (
                <>
                  <CloudOff className="w-3 h-3 mr-1" />
                  Offline
                </>
              )}
            </div>
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.email}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Cloud className="w-3 h-3 mr-1" />
                    Last sync: {formatSyncTime(lastSyncTime)}
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    onOpenSettings();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </button>
                
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="px-4 py-2">
                <div className="text-sm text-gray-700 mb-2">
                  You're using Fight Mode offline
                </div>
                <div className="text-xs text-gray-500">
                  Sign in to sync your data across devices
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserMenu;