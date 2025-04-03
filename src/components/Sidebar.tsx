
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  History, 
  BarChart2, 
  Settings,
  DollarSign,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [openSection, setOpenSection] = useState("main");

  const menuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      path: "/"
    },
    {
      label: "Carteiras",
      icon: <Briefcase className="mr-2 h-4 w-4" />,
      path: "/carteiras"
    },
    {
      label: "Depósito/Saque",
      icon: <DollarSign className="mr-2 h-4 w-4" />,
      path: "/deposito-saque"
    },
    {
      label: "Histórico",
      icon: <History className="mr-2 h-4 w-4" />,
      path: "/historico"
    },
    {
      label: "Relatórios",
      icon: <BarChart2 className="mr-2 h-4 w-4" />,
      path: "/relatorios"
    },
    {
      label: "Configurações",
      icon: <Settings className="mr-2 h-4 w-4" />,
      path: "/configuracoes"
    }
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Flame className="h-6 w-6 text-crypto-primary" />
          <span className="text-white">Crypto Manager</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-2 px-3">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive(item.path) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive(item.path) 
                    ? "bg-accent text-accent-foreground" 
                    : "hover:bg-muted"
                )}
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        
        <Separator className="my-4 bg-sidebar-border" />
        
        <div className="px-3 py-2">
          <h3 className="mb-2 text-xs font-medium text-muted-foreground">
            CRIPTOMOEDAS EM ALTA
          </h3>
          <div className="space-y-1">
            <div className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted">
              <div className="flex items-center">
                <div className="mr-2 h-6 w-6 rounded-full bg-crypto-primary/20 flex items-center justify-center">
                  <span className="text-xs text-crypto-primary">BTC</span>
                </div>
                <span>Bitcoin</span>
              </div>
              <span className="text-crypto-green">+5.2%</span>
            </div>
            <div className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted">
              <div className="flex items-center">
                <div className="mr-2 h-6 w-6 rounded-full bg-crypto-purple/20 flex items-center justify-center">
                  <span className="text-xs text-crypto-purple">ETH</span>
                </div>
                <span>Ethereum</span>
              </div>
              <span className="text-crypto-green">+3.8%</span>
            </div>
            <div className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted">
              <div className="flex items-center">
                <div className="mr-2 h-6 w-6 rounded-full bg-crypto-blue/20 flex items-center justify-center">
                  <span className="text-xs text-crypto-blue">SOL</span>
                </div>
                <span>Solana</span>
              </div>
              <span className="text-crypto-red">-1.4%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 mt-auto border-t border-sidebar-border">
        <div className="rounded-lg bg-muted p-3">
          <h4 className="font-medium mb-1">Suporte</h4>
          <p className="text-sm text-muted-foreground mb-2">Precisa de ajuda com sua carteira?</p>
          <Button variant="secondary" size="sm" className="w-full">
            Suporte
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
