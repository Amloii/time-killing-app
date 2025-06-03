import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Dashboard from './pages/Dashboard';
import TaskDetails from './pages/TaskDetails';
import Statistics from './pages/Statistics';
import Layout from './components/layout/Layout';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-wave-pattern min-h-screen safe-area-inset">
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard/battle\" replace />} />
            <Route path="/dashboard/:tab" element={<Dashboard />} />
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