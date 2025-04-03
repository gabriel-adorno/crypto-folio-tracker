
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';

import AuthGuard from './components/AuthGuard';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import WalletsPage from './pages/WalletsPage';
import WalletDetailsPage from './pages/WalletDetailsPage';
import CreateWalletPage from './pages/CreateWalletPage';
import AddAssetPage from './pages/AddAssetPage';
import HistoryPage from './pages/HistoryPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import DepositWithdrawPage from './pages/DepositWithdrawPage';
import { CurrencyProvider } from './contexts/CurrencyContext';

// Configure Query Client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <Router>
          <Toaster />
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            
            <Route element={<AuthGuard />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/carteiras" element={<WalletsPage />} />
              <Route path="/carteiras/:id" element={<WalletDetailsPage />} />
              <Route path="/carteiras/nova" element={<CreateWalletPage />} />
              <Route path="/carteiras/:id/adicionar" element={<AddAssetPage />} />
              <Route path="/historico" element={<HistoryPage />} />
              <Route path="/relatorios" element={<ReportsPage />} />
              <Route path="/configuracoes" element={<SettingsPage />} />
              <Route path="/deposito-saque" element={<DepositWithdrawPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CurrencyProvider>
    </QueryClientProvider>
  );
}

export default App;
