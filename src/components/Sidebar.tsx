
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  History, 
  BarChart2, 
  Settings,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UserInfo from "./UserInfo";
import CurrencySwitcher from "./CurrencySwitcher";

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

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

  return (
    <div className="h-full flex flex-col border-r bg-background">
      <div className="p-4">
        <h1 className="text-xl font-bold">Crypto Manager</h1>
      </div>
      
      <Separator />
      
      <UserInfo />
      
      <Separator />
      
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={pathname === item.path ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 mt-auto">
        <CurrencySwitcher />
      </div>
    </div>
  );
};

export default Sidebar;
