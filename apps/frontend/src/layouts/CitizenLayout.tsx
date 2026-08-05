import React, { useState } from 'react';
import Navbar from '../components-shared/navigation/Navbar';
import Sidebar from '../components-shared/navigation/Sidebar';
import Footer from '../components-shared/navigation/Footer';

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 relative cyber-grid">
      {/* Interactive Command Center glowing orbs */}
      <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[180px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[60%] bg-cyan-600/5 rounded-full blur-[180px] pointer-events-none animate-pulse-slow" />

      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 flex overflow-hidden relative z-10">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
