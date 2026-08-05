import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/public/LandingPage';
import AboutPage from '../pages/public/AboutPage';
import FeaturesPage from '../pages/public/FeaturesPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import CitizenTriagePage from '../pages/ai-triage/CitizenTriagePage';
import CitizenDashboardPage from '../pages/citizen/CitizenDashboardPage';
import MedicineScannerPage from '../pages/citizen/MedicineScannerPage';
import OfficerDashboardPage from '../pages/dashboard/OfficerDashboardPage';
import CampaignGeneratorPage from '../pages/dashboard/CampaignGeneratorPage';
import ScenarioSimulatorPage from '../pages/dashboard/ScenarioSimulatorPage';
import KnowledgeGraphPage from '../pages/dashboard/KnowledgeGraphPage';
import NewsIntelligencePage from '../pages/dashboard/NewsIntelligencePage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ProfilePage from '../pages/shared/ProfilePage';
import NotificationsPage from '../pages/shared/NotificationsPage';
import SettingsPage from '../pages/shared/SettingsPage';
import HelpPage from '../pages/shared/HelpPage';
import NotFoundPage from '../pages/error/NotFoundPage';
import ForbiddenPage from '../pages/error/ForbiddenPage';
import ServerErrorPage from '../pages/error/ServerErrorPage';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Unauthenticated Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Citizen Access Routes */}
      <Route path="/citizen/triage" element={<CitizenTriagePage />} />
      <Route
        path="/citizen/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CITIZEN', 'ROLE_OFFICER', 'ROLE_ADMIN']}>
            <CitizenDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/medicine-scanner"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CITIZEN', 'ROLE_OFFICER', 'ROLE_ADMIN']}>
            <MedicineScannerPage />
          </ProtectedRoute>
        }
      />

      {/* Officer Intelligence Access Routes */}
      <Route
        path="/officer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ROLE_OFFICER', 'ROLE_ADMIN']}>
            <OfficerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/campaign-generator"
        element={
          <ProtectedRoute allowedRoles={['ROLE_OFFICER', 'ROLE_ADMIN']}>
            <CampaignGeneratorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/scenario-simulator"
        element={
          <ProtectedRoute allowedRoles={['ROLE_OFFICER', 'ROLE_ADMIN']}>
            <ScenarioSimulatorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/knowledge-graph"
        element={
          <ProtectedRoute allowedRoles={['ROLE_OFFICER', 'ROLE_ADMIN']}>
            <KnowledgeGraphPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/news-intelligence"
        element={
          <ProtectedRoute allowedRoles={['ROLE_OFFICER', 'ROLE_ADMIN']}>
            <NewsIntelligencePage />
          </ProtectedRoute>
        }
      />

      {/* Admin Access Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Shared Authenticated Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <HelpPage />
          </ProtectedRoute>
        }
      />

      {/* Error Fallback Routes */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="/500" element={<ServerErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
