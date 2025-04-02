
import apiClient, { handleApiError } from './apiClient';
import { User, UserOverview } from './types';
import { toast } from "sonner";

const userService = {
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
      return await userService.getUser();
    } catch (error) {
      return handleApiError(error);
    }
  },

  withdraw: async (amount: number): Promise<User> => {
    try {
      const response = await apiClient.post('/usuario/saque', { valor: amount });
      toast.success(`Saque de R$ ${amount.toLocaleString()} realizado com sucesso!`);
      
      // Get updated user data
      return await userService.getUser();
    } catch (error) {
      return handleApiError(error);
    }
  },

  getUserOverview: async (): Promise<UserOverview> => {
    try {
      const response = await apiClient.get('/usuario/geral');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export default userService;
