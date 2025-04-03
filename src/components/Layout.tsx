
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import UserInfo from './UserInfo';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = "Crypto Manager" }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-6">
            <h1 className="text-xl font-bold">Crypto Manager</h1>
            <button
              className="text-white md:hidden"
              onClick={toggleSidebar}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          
          <UserInfo />
          
          <div className="flex-1 overflow-y-auto">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center bg-slate-900 px-6 shadow-md">
          {!sidebarOpen && (
            <button
              className="mr-4 text-white md:hidden"
              onClick={toggleSidebar}
              aria-label="Open menu"
            >
              ☰
            </button>
          )}
          <h1 className="text-xl font-bold">{title}</h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
