
import userService from './userService';
import walletService from './walletService';
import historyService from './historyService';
import chartService from './chartService';
import authService from './authService';
import cryptoService from './cryptoService';
import exchangeService from './exchangeService';

// Re-export types
export * from './types';
export * from './cryptoService';

// Combine all services into a single API object
const api = {
  ...userService,
  ...walletService,
  ...historyService,
  ...chartService,
  ...authService,
  ...cryptoService,
  ...exchangeService
};

export default api;
