
import axios from 'axios';
import { toast } from "sonner";

// Define the API base URL
const API_URL = 'http://localhost:5000';

// Types
export interface User {
  id: string;
  saldoReais: number;
  aporteTotal: number;
}

export interface Asset {
  nome: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  percentual: number;
}

export interface Wallet {
  id: string;
  nome: string;
  ativos: Asset[];
  saldoTotal: number;
  aporteTotal: number;
  lucro: number;
  percentualLucro: number;
}

export interface HistoryItem {
  id: string;
  data: string;
  tipo: 'compra' | 'venda' | 'deposito' | 'saque' | 'criacao';
  descricao: string;
  valor: number;
  carteiraId?: string;
  carteiraNome?: string;
}

export interface ChartData {
  labels: string[];
  data: number[];
  backgroundColor: string[];
}

export interface LineChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }>;
}

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for fallback (if API is not running)
const mockUser: User = {
  id: "1",
  saldoReais: 10000,
  aporteTotal: 8000,
};

const mockWallets: Wallet[] = [
  {
    id: "1",
    nome: "Carteira Principal",
    ativos: [
      { nome: "Bitcoin", quantidade: 0.5, valorUnitario: 250000, valorTotal: 125000, percentual: 65 },
      { nome: "Ethereum", quantidade: 5, valorUnitario: 13000, valorTotal: 65000, percentual: 30 },
      { nome: "Solana", quantidade: 10, valorUnitario: 500, valorTotal: 5000, percentual: 5 }
    ],
    saldoTotal: 195000,
    aporteTotal: 150000,
    lucro: 45000,
    percentualLucro: 30,
  },
  {
    id: "2",
    nome: "DeFi",
    ativos: [
      { nome: "Aave", quantidade: 20, valorUnitario: 500, valorTotal: 10000, percentual: 40 },
      { nome: "Uniswap", quantidade: 50, valorUnitario: 250, valorTotal: 12500, percentual: 60 }
    ],
    saldoTotal: 22500,
    aporteTotal: 20000,
    lucro: 2500,
    percentualLucro: 12.5,
  }
];

const mockHistory: HistoryItem[] = [
  { id: "1", data: "2023-06-01", tipo: "compra", descricao: "Comprou 0.2 Bitcoin", valor: 50000 },
  { id: "2", data: "2023-06-15", tipo: "compra", descricao: "Comprou 2 Ethereum", valor: 26000 },
  { id: "3", data: "2023-07-01", tipo: "venda", descricao: "Vendeu 0.1 Bitcoin", valor: 25000 },
  { id: "4", data: "2023-07-15", tipo: "deposito", descricao: "Depositou em reais", valor: 5000 },
  { id: "5", data: "2023-07-30", tipo: "compra", descricao: "Comprou 10 Solana", valor: 5000 },
  { id: "6", data: "2023-08-10", tipo: "saque", descricao: "Sacou em reais", valor: 2000 },
  { id: "7", data: "2023-08-20", tipo: "compra", descricao: "Comprou 20 Aave", valor: 10000 },
  { id: "8", data: "2023-09-05", tipo: "compra", descricao: "Comprou 50 Uniswap", valor: 12500 },
  { id: "9", data: "2023-09-20", tipo: "compra", descricao: "Comprou 0.3 Bitcoin", valor: 75000 },
  { id: "10", data: "2023-10-01", tipo: "compra", descricao: "Comprou 3 Ethereum", valor: 39000 },
];

// Helper function to handle API errors
const handleApiError = (error: any, fallbackData: any = null) => {
  console.error('API Error:', error);
  
  let errorMessage = 'Erro na comunicação com o servidor';
  
  if (error.response) {
    // The request was made and the server responded with a status code
    errorMessage = error.response.data?.error || `Erro ${error.response.status}`;
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'Servidor não respondeu. Verifique se o backend está em execução.';
  }
  
  toast.error(errorMessage);
  
  // Return fallback data if provided
  if (fallbackData !== null) {
    console.warn('Using mock data as fallback');
    return Promise.resolve(fallbackData);
  }
  
  return Promise.reject(error);
};

// API methods
const api = {
  // User endpoints
  getUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get('/usuario');
      return {
        id: response.data._id,
        saldoReais: response.data.saldoReais,
        aporteTotal: response.data.aporteTotal
      };
    } catch (error) {
      return handleApiError(error, mockUser);
    }
  },

  deposit: async (amount: number): Promise<User> => {
    try {
      const response = await apiClient.post('/usuario/deposito', { valor: amount });
      toast.success(`Depósito de R$ ${amount.toLocaleString()} realizado com sucesso!`);
      
      // Get updated user data
      return await api.getUser();
    } catch (error) {
      return handleApiError(error);
    }
  },

  withdraw: async (amount: number): Promise<User> => {
    try {
      const response = await apiClient.post('/usuario/saque', { valor: amount });
      toast.success(`Saque de R$ ${amount.toLocaleString()} realizado com sucesso!`);
      
      // Get updated user data
      return await api.getUser();
    } catch (error) {
      return handleApiError(error);
    }
  },

  getUserOverview: async (): Promise<{
    saldoReais: number;
    aporteTotal: number;
    saldoCarteiras: number;
    lucroTotal: number;
    percentualLucro: number;
  }> => {
    try {
      const response = await apiClient.get('/usuario/geral');
      return response.data;
    } catch (error) {
      // Fallback calculation based on mock data
      const saldoCarteiras = mockWallets.reduce((sum, wallet) => sum + wallet.saldoTotal, 0);
      const aporteTotal = mockWallets.reduce((sum, wallet) => sum + wallet.aporteTotal, 0);
      const lucroTotal = saldoCarteiras - aporteTotal;
      const percentualLucro = (lucroTotal / aporteTotal) * 100;

      return handleApiError(error, {
        saldoReais: mockUser.saldoReais,
        aporteTotal,
        saldoCarteiras,
        lucroTotal,
        percentualLucro,
      });
    }
  },

  // Wallet endpoints
  getWallets: async (): Promise<Wallet[]> => {
    try {
      const response = await apiClient.get('/carteira');
      return response.data.map((wallet: any) => ({
        id: wallet._id,
        nome: wallet.nome,
        ativos: wallet.ativos,
        saldoTotal: wallet.saldoTotal,
        aporteTotal: wallet.aporteTotal,
        lucro: wallet.lucro,
        percentualLucro: wallet.percentualLucro
      }));
    } catch (error) {
      return handleApiError(error, mockWallets);
    }
  },

  getWallet: async (id: string): Promise<Wallet | undefined> => {
    try {
      const response = await apiClient.get(`/carteira/${id}`);
      return {
        id: response.data._id,
        nome: response.data.nome,
        ativos: response.data.ativos,
        saldoTotal: response.data.saldoTotal,
        aporteTotal: response.data.aporteTotal,
        lucro: response.data.lucro,
        percentualLucro: response.data.percentualLucro
      };
    } catch (error) {
      return handleApiError(error, mockWallets.find(w => w.id === id));
    }
  },

  createWallet: async (name: string): Promise<Wallet> => {
    try {
      const response = await apiClient.post('/carteira', { nome: name });
      toast.success(`Carteira "${name}" criada com sucesso!`);
      return {
        id: response.data.id,
        nome: response.data.nome,
        ativos: response.data.ativos,
        saldoTotal: response.data.saldoTotal,
        aporteTotal: response.data.aporteTotal,
        lucro: response.data.lucro,
        percentualLucro: response.data.percentualLucro
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  addAsset: async (walletId: string, asset: { nome: string; quantidade: number; valorUnitario: number }): Promise<Wallet> => {
    try {
      await apiClient.post(`/carteira/${walletId}/aporte`, asset);
      toast.success(`Compra de ${asset.quantidade} ${asset.nome} realizada com sucesso!`);
      
      // Get updated wallet
      const updatedWallet = await api.getWallet(walletId);
      if (!updatedWallet) {
        throw new Error('Falha ao atualizar carteira');
      }
      return updatedWallet;
    } catch (error) {
      return handleApiError(error);
    }
  },

  sellAsset: async (walletId: string, asset: { nome: string; quantidade: number; valorUnitario: number }): Promise<Wallet> => {
    try {
      const response = await apiClient.post(`/carteira/${walletId}/venda`, asset);
      toast.success(`Venda de ${asset.quantidade} ${asset.nome} realizada com sucesso!`);
      
      // Get updated wallet
      const updatedWallet = await api.getWallet(walletId);
      if (!updatedWallet) {
        throw new Error('Falha ao atualizar carteira');
      }
      return updatedWallet;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // History endpoint
  getHistory: async (): Promise<HistoryItem[]> => {
    try {
      const response = await apiClient.get('/historico');
      return response.data;
    } catch (error) {
      return handleApiError(error, mockHistory);
    }
  },

  // Chart endpoints
  getWalletPieChart: async (walletId: string): Promise<ChartData> => {
    try {
      const response = await apiClient.get(`/graficos/pizza/carteira/${walletId}`);
      return response.data;
    } catch (error) {
      // Fallback data from mock
      const wallet = mockWallets.find(w => w.id === walletId);
      if (!wallet) {
        return handleApiError(error);
      }
      
      const colors = [
        '#00e4ca', '#9b87f5', '#ff9332', '#1199fa', '#2ebd85', '#ff4c4c',
        '#00b8d9', '#6554c0', '#ff8800', '#36b37e', '#ff5630', '#6554c0'
      ];
      
      return handleApiError(error, {
        labels: wallet.ativos.map(a => a.nome),
        data: wallet.ativos.map(a => a.percentual),
        backgroundColor: wallet.ativos.map((_, index) => colors[index % colors.length]),
      });
    }
  },

  getGeneralPieChart: async (): Promise<ChartData> => {
    try {
      const response = await apiClient.get('/graficos/pizza/geral');
      return response.data;
    } catch (error) {
      // Fallback calculation from mock data
      const totalValue = mockWallets.reduce((sum, wallet) => sum + wallet.saldoTotal, 0);
      const walletData = mockWallets.map(wallet => ({
        name: wallet.nome,
        value: wallet.saldoTotal,
        percentage: (wallet.saldoTotal / totalValue) * 100
      }));
      
      const colors = [
        '#00e4ca', '#9b87f5', '#ff9332', '#1199fa', '#2ebd85', '#ff4c4c',
        '#00b8d9', '#6554c0', '#ff8800', '#36b37e', '#ff5630', '#6554c0'
      ];
      
      return handleApiError(error, {
        labels: walletData.map(w => w.name),
        data: walletData.map(w => w.percentage),
        backgroundColor: walletData.map((_, index) => colors[index % colors.length]),
      });
    }
  },

  getWalletPerformanceChart: async (walletId: string): Promise<LineChartData> => {
    try {
      const response = await apiClient.get(`/graficos/aporte-saldo/carteira/${walletId}`);
      return response.data;
    } catch (error) {
      // Fallback from mock data
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
      const wallet = mockWallets.find(w => w.id === walletId);
      
      if (!wallet) {
        return handleApiError(error);
      }
      
      const aporteData = [wallet.aporteTotal * 0.3, wallet.aporteTotal * 0.5, wallet.aporteTotal * 0.7, 
                         wallet.aporteTotal * 0.8, wallet.aporteTotal * 0.9, wallet.aporteTotal];
      const saldoData = [wallet.aporteTotal * 0.28, wallet.aporteTotal * 0.48, wallet.aporteTotal * 0.75, 
                        wallet.aporteTotal * 0.9, wallet.aporteTotal * 1.05, wallet.saldoTotal];
      
      return handleApiError(error, {
        labels: months,
        datasets: [
          {
            label: 'Aporte',
            data: aporteData,
            borderColor: '#9b87f5',
            backgroundColor: 'rgba(155, 135, 245, 0.1)',
          },
          {
            label: 'Saldo',
            data: saldoData,
            borderColor: '#00e4ca',
            backgroundColor: 'rgba(0, 228, 202, 0.1)',
          }
        ]
      });
    }
  },

  getGeneralPerformanceChart: async (): Promise<LineChartData> => {
    try {
      const response = await apiClient.get('/graficos/aporte-saldo/geral');
      return response.data;
    } catch (error) {
      // Fallback from mock data
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
      const totalAporte = mockWallets.reduce((sum, wallet) => sum + wallet.aporteTotal, 0);
      const totalSaldo = mockWallets.reduce((sum, wallet) => sum + wallet.saldoTotal, 0);
      
      const aporteData = [totalAporte * 0.3, totalAporte * 0.5, totalAporte * 0.7, 
                         totalAporte * 0.8, totalAporte * 0.9, totalAporte];
      const saldoData = [totalAporte * 0.28, totalAporte * 0.48, totalAporte * 0.75, 
                        totalAporte * 0.9, totalAporte * 1.05, totalSaldo];
      
      return handleApiError(error, {
        labels: months,
        datasets: [
          {
            label: 'Aporte Total',
            data: aporteData,
            borderColor: '#9b87f5',
            backgroundColor: 'rgba(155, 135, 245, 0.1)',
          },
          {
            label: 'Saldo Total',
            data: saldoData,
            borderColor: '#00e4ca',
            backgroundColor: 'rgba(0, 228, 202, 0.1)',
          }
        ]
      });
    }
  }
};

export default api;
