
import apiClient, { handleApiError } from './apiClient';
import { ChartData, LineChartData } from './types';

const chartService = {
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

export default chartService;
