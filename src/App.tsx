
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import WalletsPage from "./pages/WalletsPage";
import WalletDetailsPage from "./pages/WalletDetailsPage";
import CreateWalletPage from "./pages/CreateWalletPage";
import AddAssetPage from "./pages/AddAssetPage";
import HistoryPage from "./pages/HistoryPage";
import DepositWithdrawPage from "./pages/DepositWithdrawPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/carteiras" element={<WalletsPage />} />
          <Route path="/carteiras/nova" element={<CreateWalletPage />} />
          <Route path="/carteiras/:walletId" element={<WalletDetailsPage />} />
          <Route path="/carteiras/:walletId/adicionar" element={<AddAssetPage />} />
          <Route path="/historico" element={<HistoryPage />} />
          <Route path="/deposito-saque" element={<DepositWithdrawPage />} />
          <Route path="/relatorios" element={<ReportsPage />} />
          <Route path="/configuracoes" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
