
import apiClient, { handleApiError } from './apiClient';
import { Wallet } from './types';
import { toast } from "sonner";

const walletService = {
  getWallets: async (): Promise<Wallet[]> => {
    try {
      const response = await apiClient.get('/carteira');
      return response.data.map((wallet: any) => ({
        id: wallet._id,
        userId: wallet.userId || "", // Ensure userId is always set
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
        userId: response.data.userId || "", // Ensure userId is always set
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
        userId: response.data.userId || "", // Ensure userId is always set
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
      const updatedWallet = await walletService.getWallet(walletId);
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
      const updatedWallet = await walletService.getWallet(walletId);
      if (!updatedWallet) {
        throw new Error('Falha ao atualizar carteira');
      }
      return updatedWallet;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export default walletService;
