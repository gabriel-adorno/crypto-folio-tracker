
import apiClient, { handleApiError } from './apiClient';
import { User, LoginResponse, RegisterData, LoginData } from './types';
import { toast } from 'sonner';

// Token handling functions
const saveToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const removeToken = () => {
  localStorage.removeItem('auth_token');
};

// Set authorization header for all requests
export const setupAuthHeader = () => {
  const token = getToken();
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Call this when app loads
setupAuthHeader();

const authService = {
  register: async (userData: RegisterData): Promise<User> => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      const { token, user } = response.data as LoginResponse;
      
      // Save token and set auth header
      saveToken(token);
      setupAuthHeader();
      
      toast.success('Conta criada com sucesso!');
      return user;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  login: async (credentials: LoginData): Promise<User> => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { token, user } = response.data as LoginResponse;
      
      // Save token and set auth header
      saveToken(token);
      setupAuthHeader();
      
      toast.success(`Bem-vindo de volta, ${user.nome}!`);
      return user;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  logout: () => {
    removeToken();
    setupAuthHeader();
    toast.success('Logout realizado com sucesso');
    return true;
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    if (!getToken()) return null;
    
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      // Se o token expirou ou é inválido, limpe-o
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        removeToken();
        setupAuthHeader();
      }
      return null;
    }
  },
  
  isAuthenticated: (): boolean => {
    return !!getToken();
  }
};

export default authService;
