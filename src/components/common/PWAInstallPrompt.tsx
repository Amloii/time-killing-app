import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Zap, Shield, Wifi } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';
import Button from './Button';

const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    const success = await installApp();
    setIsInstalling(false);
    
    if (success) {
      setIsDismissed(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if not installable, already dismissed, or user previously dismissed
  if (!isInstallable || isDismissed || localStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto"
      >
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl shadow-2xl border border-red-400 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Install Fight Mode</h3>
                  <p className="text-red-100 text-sm">Get the full app experience</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Smartphone className="w-4 h-4" />
                </div>
                <p className="text-xs text-red-100">Native Feel</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-4 h-4" />
                </div>
                <p className="text-xs text-red-100">Faster</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Wifi className="w-4 h-4" />
                </div>
                <p className="text-xs text-red-100">Offline</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleInstall}
                disabled={isInstalling}
                fullWidth
                size="md"
                className="bg-white text-red-600 hover:bg-gray-100 font-semibold"
              >
                {isInstalling ? 'Installing...' : 'Install App'}
              </Button>
              <Button
                onClick={handleDismiss}
                variant="secondary"
                size="md"
                className="bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30"
              >
                Later
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;