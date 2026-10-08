import React from 'react';
import { Outlet } from 'react-router-dom';
import { DemoToolbar } from '../components/common/DemoToolbar';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ToastContainer } from '../components/common/ToastContainer';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a] font-sans selection:bg-[#dbeafe] selection:text-[#0b387b]">
      {/* Demo Prototype Testing Bar (Subtle & Minimizable) */}
      <DemoToolbar />

      {/* Official Government Header & Navigation */}
      <Navbar />

      {/* Main Official Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Official Government Footer */}
      <Footer />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
