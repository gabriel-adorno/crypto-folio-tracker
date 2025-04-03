
import apiClient, { handleApiError } from './apiClient';
import { ExchangeRate } from './types';

const exchangeService = {
  getDollarRate: async (): Promise<ExchangeRate | undefined> => {
    try {
      const response = await apiClient.get('/cotacao/dolar');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateDollarRate: async (valor: number): Promise<boolean> => {
    try {
      await apiClient.post('/cotacao/dolar', { valor });
      return true;
    } catch (error) {
      return handleApiError(error, false);
    }
  }
};

export default exchangeService;
