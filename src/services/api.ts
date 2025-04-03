
import userService from './userService';
import walletService from './walletService';
import historyService from './historyService';
import chartService from './chartService';
import authService from './authService';

// Re-export types
export * from './types';

// Combine all services into a single API object
const api = {
  ...userService,
  ...walletService,
  ...historyService,
  ...chartService,
  ...authService
};

export default api;
