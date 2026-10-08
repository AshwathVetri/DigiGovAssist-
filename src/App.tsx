import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { RootLayout } from './layouts/RootLayout';
import { LandingPage } from './pages/LandingPage';
import { NavigatorPage } from './pages/NavigatorPage';
import { ServicesCatalogPage } from './pages/ServicesCatalogPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ApplicationFlowPage } from './pages/ApplicationFlowPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ApplicationTrackingPage } from './pages/ApplicationTrackingPage';
import { DigiProHubPage } from './pages/DigiProHubPage';
import { ConsentHistoryPage } from './pages/ConsentHistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { PaymentPage } from './pages/PaymentPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="navigator" element={<NavigatorPage />} />
            <Route path="services" element={<ServicesCatalogPage />} />
            <Route path="services/:id" element={<ServiceDetailPage />} />
            <Route path="apply/:serviceId" element={<ApplicationFlowPage />} />
            <Route path="payment/:applicationId" element={<PaymentPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="applications/:id" element={<ApplicationTrackingPage />} />
            <Route path="digipro" element={<DigiProHubPage />} />
            <Route path="consent-history" element={<ConsentHistoryPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
