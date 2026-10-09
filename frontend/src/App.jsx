import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/nav/Navbar';
import AuthModal from './components/auth/AuthModal';

import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import ToolDetailPage from './pages/ToolDetailPage';
import LearnPage from './pages/LearnPage';
import ProjectsPage from './pages/ProjectsPage';
import RoadmapsPage from './pages/RoadmapsPage';
import CommunityPage from './pages/CommunityPage';
import OpenSourcePage from './pages/OpenSourcePage';
import AuthPage from './pages/AuthPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', background: '#020812', color: '#f8fafc', overflowX: 'hidden' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/:id" element={<ToolDetailPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/learn/:id" element={<LearnPage />} />
            <Route path="/open-source" element={<OpenSourcePage />} />
            <Route path="/open-source/:id" element={<OpenSourcePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectsPage />} />
            <Route path="/roadmaps" element={<RoadmapsPage />} />
            <Route path="/roadmaps/:id" element={<RoadmapsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
          </Routes>
          <AuthModal />
        </div>
      </Router>
    </AuthProvider>
  );
}
