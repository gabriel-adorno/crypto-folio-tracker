
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import UserInfo from './UserInfo';
import CurrencySwitcher from './CurrencySwitcher';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = "Crypto Manager" }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPage = pathSegments[0] || 'dashboard';
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
          <div className="flex items-center">
            {!sidebarOpen && (
              <button
                className="mr-4 text-muted-foreground hover:text-foreground md:hidden"
                onClick={toggleSidebar}
                aria-label="Open menu"
              >
                ☰
              </button>
            )}
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Pesquisar..."
                className="w-[200px] bg-muted pl-8 md:w-[250px] lg:w-[300px]"
              />
            </div>
            
            <CurrencySwitcher />
            
            <button className="relative p-2 text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
            </button>
            
            <UserInfo />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
