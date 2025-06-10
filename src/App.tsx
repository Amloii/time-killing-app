import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import TaskDetails from './pages/TaskDetails';
import Statistics from './pages/Statistics';
import Rewards from './pages/Rewards';
import Layout from './components/layout/Layout';
import PointsEarnedNotification from './components/common/PointsEarnedNotification';
import PWAInstallPrompt from './components/common/PWAInstallPrompt';
import OfflineIndicator from './components/common/OfflineIndicator';
import TouchGestures from './components/common/TouchGestures';
import { useAppStore } from './store';
import { registerServiceWorker } from './utils/pwaUtils';
import { useNotifications } from './hooks/useNotifications';
import { useState } from 'react';

function App() {
  const { updateStreak, setActiveTab } = useAppStore();
  const { requestPermission } = useNotifications();
  const [pointsNotification, setPointsNotification] = useState<any>(null);
  
  // Initialize PWA features
  useEffect(() => {
    // Register service worker
    registerServiceWorker();
    
    // Update streak on app load
    updateStreak();
    
    // Request notification permission after a delay
    setTimeout(() => {
      requestPermission();
    }, 5000);
  }, [updateStreak, requestPermission]);
  
  // Handle swipe gestures for navigation
  const handleSwipeLeft = () => {
    // Navigate to next tab
    setActiveTab('battle');
  };
  
  const handleSwipeRight = () => {
    // Navigate to previous tab
    setActiveTab('tasks');
  };
  
  return (
    <BrowserRouter>
      <TouchGestures
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
      >
        <div className="bg-wave-pattern min-h-screen safe-area-inset">
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard/battle\" replace />} />
              <Route path="/dashboard/*\" element={<Dashboard />} />
              <Route path="/task/:taskId" element={<TaskDetails />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/statistics" element={<Statistics />} />
            </Routes>
          </Layout>
          
          {/* PWA Components */}
          <PWAInstallPrompt />
          <OfflineIndicator />
          
          {/* Notifications */}
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: '#fff',
                color: '#333',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
                padding: '12px 16px',
              },
            }}
          />
          <PointsEarnedNotification
            pointsBreakdown={pointsNotification}
            onClose={() => setPointsNotification(null)}
          />
        </div>
      </TouchGestures>
    </BrowserRouter>
  );
}

export default App;