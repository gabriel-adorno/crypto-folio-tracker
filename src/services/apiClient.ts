
import axios from 'axios';
import { toast } from "sonner";

// Define the API base URL
const API_URL = 'http://localhost:5000';

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to handle API errors
export const handleApiError = (error: any, fallbackData: any = null) => {
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

export default apiClient;
