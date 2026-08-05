import React, { useState } from 'react';
import Navbar from '../components-shared/navigation/Navbar';
import Sidebar from '../components-shared/navigation/Sidebar';
import Footer from '../components-shared/navigation/Footer';

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
