
import apiClient, { handleApiError } from './apiClient';
import { HistoryItem } from './types';

const historyService = {
  getHistory: async (): Promise<HistoryItem[]> => {
    try {
      const response = await apiClient.get('/historico');
      return response.data;
    } catch (error) {
      return handleApiError(error, []);
    }
  }
};

export default historyService;
