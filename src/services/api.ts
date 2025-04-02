
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
  lucro?: number;
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
      return handleApiError(error);
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
      return handleApiError(error);
    }
  },

  // Wallet endpoints
  getWallets: async (): Promise<Wallet[]> => {
    try {
      const response = await apiClient.get('/carteira');
      return response.data.map((wallet: any) => ({
        id: wallet._id,
        nome: wallet.nome,
        ativos: wallet.ativos || [],
        saldoTotal: wallet.saldoTotal,
        aporteTotal: wallet.aporteTotal,
        lucro: wallet.lucro,
        percentualLucro: wallet.percentualLucro
      }));
    } catch (error) {
      return handleApiError(error, []);
    }
  },

  getWallet: async (id: string): Promise<Wallet | undefined> => {
    try {
      const response = await apiClient.get(`/carteira/${id}`);
      return {
        id: response.data._id,
        nome: response.data.nome,
        ativos: response.data.ativos || [],
        saldoTotal: response.data.saldoTotal,
        aporteTotal: response.data.aporteTotal,
        lucro: response.data.lucro,
        percentualLucro: response.data.percentualLucro
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  createWallet: async (name: string): Promise<Wallet> => {
    try {
      const response = await apiClient.post('/carteira', { nome: name });
      toast.success(`Carteira "${name}" criada com sucesso!`);
      return {
        id: response.data.id,
        nome: response.data.nome,
        ativos: response.data.ativos || [],
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
      await apiClient.post(`/carteira/${walletId}/venda`, asset);
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
      return handleApiError(error, []);
    }
  },

  // Chart endpoints
  getWalletPieChart: async (walletId: string): Promise<ChartData> => {
    try {
      const response = await apiClient.get(`/graficos/pizza/carteira/${walletId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, { labels: [], data: [], backgroundColor: [] });
    }
  },

  getGeneralPieChart: async (): Promise<ChartData> => {
    try {
      const response = await apiClient.get('/graficos/pizza/geral');
      return response.data;
    } catch (error) {
      return handleApiError(error, { labels: [], data: [], backgroundColor: [] });
    }
  },

  getWalletPerformanceChart: async (walletId: string): Promise<LineChartData> => {
    try {
      const response = await apiClient.get(`/graficos/aporte-saldo/carteira/${walletId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, { 
        labels: [], 
        datasets: [
          { label: 'Aporte', data: [], borderColor: '#9b87f5', backgroundColor: 'rgba(155, 135, 245, 0.1)' },
          { label: 'Saldo', data: [], borderColor: '#00e4ca', backgroundColor: 'rgba(0, 228, 202, 0.1)' }
        ] 
      });
    }
  },

  getGeneralPerformanceChart: async (): Promise<LineChartData> => {
    try {
      const response = await apiClient.get('/graficos/aporte-saldo/geral');
      return response.data;
    } catch (error) {
      return handleApiError(error, { 
        labels: [], 
        datasets: [
          { label: 'Aporte Total', data: [], borderColor: '#9b87f5', backgroundColor: 'rgba(155, 135, 245, 0.1)' },
          { label: 'Saldo Total', data: [], borderColor: '#00e4ca', backgroundColor: 'rgba(0, 228, 202, 0.1)' }
        ] 
      });
    }
  }
};

export default api;
