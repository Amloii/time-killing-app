import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Dashboard from './pages/Dashboard';
import TaskDetails from './pages/TaskDetails';
import Statistics from './pages/Statistics';
import Rewards from './pages/Rewards';
import Layout from './components/layout/Layout';
import PointsEarnedNotification from './components/common/PointsEarnedNotification';
import { useAppStore } from './store';
import { useState, useEffect } from 'react';

function App() {
  const { updateStreak } = useAppStore();
  const [pointsNotification, setPointsNotification] = useState<any>(null);
  
  // Update streak on app load
  useEffect(() => {
    updateStreak();
  }, [updateStreak]);
  
  return (
    <BrowserRouter>
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
        <Toaster position="top-right" />
        <PointsEarnedNotification
          pointsBreakdown={pointsNotification}
          onClose={() => setPointsNotification(null)}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;