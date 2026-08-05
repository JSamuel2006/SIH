import React from 'react';
import Navbar from '../components-shared/navigation/Navbar';
import Footer from '../components-shared/navigation/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative cyber-grid">
      {/* Premium ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[150px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse-slow pointer-events-none" />
      
      <Navbar />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
