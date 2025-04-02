
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Wallet,
  LayoutDashboard,
  History,
  Settings,
  DollarSign,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const routes = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Carteiras",
      path: "/carteiras",
      icon: <Wallet size={20} />,
    },
    {
      name: "Histórico",
      path: "/historico",
      icon: <History size={20} />,
    },
    {
      name: "Depósito/Saque",
      path: "/deposito-saque",
      icon: <DollarSign size={20} />,
    },
    {
      name: "Relatórios",
      path: "/relatorios",
      icon: <LineChart size={20} />,
    },
    {
      name: "Configurações",
      path: "/configuracoes",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="text-primary">Crypto</span>
          <span className="text-secondary">Folio</span>
        </h1>
      </div>

      <nav className="flex-1 py-6 px-3">
        <ul className="space-y-1">
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                to={route.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive(route.path)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {route.icon}
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 border-t border-border">
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-colors text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
