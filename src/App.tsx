
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import Dashboard from "./pages/Dashboard";
import WalletsPage from "./pages/WalletsPage";
import WalletDetailsPage from "./pages/WalletDetailsPage";
import CreateWalletPage from "./pages/CreateWalletPage";
import AddAssetPage from "./pages/AddAssetPage";
import HistoryPage from "./pages/HistoryPage";
import DepositWithdrawPage from "./pages/DepositWithdrawPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Protected routes */}
          <Route path="/" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/carteiras" element={<AuthGuard><WalletsPage /></AuthGuard>} />
          <Route path="/carteiras/nova" element={<AuthGuard><CreateWalletPage /></AuthGuard>} />
          <Route path="/carteiras/:walletId" element={<AuthGuard><WalletDetailsPage /></AuthGuard>} />
          <Route path="/carteiras/:walletId/adicionar" element={<AuthGuard><AddAssetPage /></AuthGuard>} />
          <Route path="/historico" element={<AuthGuard><HistoryPage /></AuthGuard>} />
          <Route path="/deposito-saque" element={<AuthGuard><DepositWithdrawPage /></AuthGuard>} />
          <Route path="/relatorios" element={<AuthGuard><ReportsPage /></AuthGuard>} />
          <Route path="/configuracoes" element={<AuthGuard><SettingsPage /></AuthGuard>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
