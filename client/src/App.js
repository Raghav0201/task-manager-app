import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import SingleTaskView from './pages/SingleTaskView';
import CreateTask from './pages/CreateTask';
import EditTaskPage from './pages/EditTaskPage';
import Completed from './pages/Completed';
import Yet from './pages/Yet';
import Prioritize from './pages/Prioritize';

import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-task" element={<CreateTask />} />
        <Route path="/edit/:taskId" element={<EditTaskPage />} />
        <Route path="/task/:id" element={<SingleTaskView />} />
        <Route path="/completed" element={<Completed />} />
        <Route path="/yet" element={<Yet />} />
        <Route path="/prioritize" element={<Prioritize />} />
        <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '40px' }}>404 - Page not found</h2>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
