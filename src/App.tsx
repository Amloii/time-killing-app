import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Dashboard from './pages/Dashboard';
import TaskDetails from './pages/TaskDetails';
import Statistics from './pages/Statistics';
import Layout from './components/layout/Layout';
import { useAppStore } from './store';
import LoadingScreen from './components/common/LoadingScreen';

function App() {
  const { initializeData, isLoading } = useAppStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <div className="bg-wave-pattern min-h-screen safe-area-inset">
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard/battle\" replace />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/task/:taskId" element={<TaskDetails />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;