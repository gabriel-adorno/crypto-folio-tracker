
import apiClient, { handleApiError } from './apiClient';
import { toast } from "sonner";

export interface Crypto {
  nome: string;
  simbolo: string;
  precoAtual: number;
  variacao24h: number;
  marketCap: number;
  volume24h: number;
  ultimaAtualizacao: string;
}

const cryptoService = {
  getAllCryptos: async (): Promise<Crypto[]> => {
    try {
      const response = await apiClient.get('/cripto');
      return response.data;
    } catch (error) {
      return handleApiError(error, []);
    }
  },

  getCryptoByName: async (name: string): Promise<Crypto | undefined> => {
    try {
      const response = await apiClient.get(`/cripto/${name}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateCrypto: async (crypto: Partial<Crypto>): Promise<boolean> => {
    try {
      await apiClient.post('/cripto', crypto);
      toast.success(`Criptomoeda ${crypto.nome} atualizada com sucesso!`);
      return true;
    } catch (error) {
      return handleApiError(error, false);
    }
  },

  deleteCrypto: async (name: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/cripto/${name}`);
      toast.success(`Criptomoeda ${name} excluída com sucesso!`);
      return true;
    } catch (error) {
      return handleApiError(error, false);
    }
  }
};

export default cryptoService;
