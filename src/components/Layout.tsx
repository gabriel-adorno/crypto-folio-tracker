
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={cn("flex-1 p-6 md:p-8 overflow-y-auto", className)}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
