
import { toast } from "sonner";

// Since we're mocking the backend for now, we'll use these types
export interface User {
  id: string;
  saldoReais: number;
  aporteTotal: number;
}

export interface Asset {
  nome: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  percentual: number;
}

export interface Wallet {
  id: string;
  nome: string;
  ativos: Asset[];
  saldoTotal: number;
  aporteTotal: number;
  lucro: number;
  percentualLucro: number;
}

export interface HistoryItem {
  id: string;
  data: string;
  tipo: 'compra' | 'venda' | 'deposito' | 'saque';
  descricao: string;
  valor: number;
}

export interface ChartData {
  labels: string[];
  data: number[];
  backgroundColor: string[];
}

export interface LineChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }>;
}

// Mock data
const mockUser: User = {
  id: "1",
  saldoReais: 10000,
  aporteTotal: 8000,
};

const mockWallets: Wallet[] = [
  {
    id: "1",
    nome: "Carteira Principal",
    ativos: [
      { nome: "Bitcoin", quantidade: 0.5, valorUnitario: 250000, valorTotal: 125000, percentual: 65 },
      { nome: "Ethereum", quantidade: 5, valorUnitario: 13000, valorTotal: 65000, percentual: 30 },
      { nome: "Solana", quantidade: 10, valorUnitario: 500, valorTotal: 5000, percentual: 5 }
    ],
    saldoTotal: 195000,
    aporteTotal: 150000,
    lucro: 45000,
    percentualLucro: 30,
  },
  {
    id: "2",
    nome: "DeFi",
    ativos: [
      { nome: "Aave", quantidade: 20, valorUnitario: 500, valorTotal: 10000, percentual: 40 },
      { nome: "Uniswap", quantidade: 50, valorUnitario: 250, valorTotal: 12500, percentual: 60 }
    ],
    saldoTotal: 22500,
    aporteTotal: 20000,
    lucro: 2500,
    percentualLucro: 12.5,
  }
];

const mockHistory: HistoryItem[] = [
  { id: "1", data: "2023-06-01", tipo: "compra", descricao: "Comprou 0.2 Bitcoin", valor: 50000 },
  { id: "2", data: "2023-06-15", tipo: "compra", descricao: "Comprou 2 Ethereum", valor: 26000 },
  { id: "3", data: "2023-07-01", tipo: "venda", descricao: "Vendeu 0.1 Bitcoin", valor: 25000 },
  { id: "4", data: "2023-07-15", tipo: "deposito", descricao: "Depositou em reais", valor: 5000 },
  { id: "5", data: "2023-07-30", tipo: "compra", descricao: "Comprou 10 Solana", valor: 5000 },
  { id: "6", data: "2023-08-10", tipo: "saque", descricao: "Sacou em reais", valor: 2000 },
  { id: "7", data: "2023-08-20", tipo: "compra", descricao: "Comprou 20 Aave", valor: 10000 },
  { id: "8", data: "2023-09-05", tipo: "compra", descricao: "Comprou 50 Uniswap", valor: 12500 },
  { id: "9", data: "2023-09-20", tipo: "compra", descricao: "Comprou 0.3 Bitcoin", valor: 75000 },
  { id: "10", data: "2023-10-01", tipo: "compra", descricao: "Comprou 3 Ethereum", valor: 39000 },
];

// API methods
const api = {
  // User endpoints
  getUser: async (): Promise<User> => {
    // In a real app, this would be a fetch call to the backend
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUser), 500);
    });
  },

  deposit: async (amount: number): Promise<User> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        mockUser.saldoReais += amount;
        toast.success(`Depósito de R$ ${amount.toLocaleString()} realizado com sucesso!`);
        resolve(mockUser);
      }, 500);
    });
  },

  withdraw: async (amount: number): Promise<User> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (amount > mockUser.saldoReais) {
          toast.error("Saldo insuficiente para saque!");
          reject(new Error("Saldo insuficiente"));
          return;
        }
        mockUser.saldoReais -= amount;
        toast.success(`Saque de R$ ${amount.toLocaleString()} realizado com sucesso!`);
        resolve(mockUser);
      }, 500);
    });
  },

  getUserOverview: async (): Promise<{
    saldoReais: number;
    aporteTotal: number;
    saldoCarteiras: number;
    lucroTotal: number;
    percentualLucro: number;
  }> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const saldoCarteiras = mockWallets.reduce((sum, wallet) => sum + wallet.saldoTotal, 0);
        const aporteTotal = mockWallets.reduce((sum, wallet) => sum + wallet.aporteTotal, 0);
        const lucroTotal = saldoCarteiras - aporteTotal;
        const percentualLucro = (lucroTotal / aporteTotal) * 100;

        resolve({
          saldoReais: mockUser.saldoReais,
          aporteTotal,
          saldoCarteiras,
          lucroTotal,
          percentualLucro,
        });
      }, 500);
    });
  },

  // Wallet endpoints
  getWallets: async (): Promise<Wallet[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockWallets), 500);
    });
  },

  getWallet: async (id: string): Promise<Wallet | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const wallet = mockWallets.find(w => w.id === id);
        resolve(wallet);
      }, 500);
    });
  },

  createWallet: async (name: string): Promise<Wallet> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newWallet: Wallet = {
          id: `${mockWallets.length + 1}`,
          nome: name,
          ativos: [],
          saldoTotal: 0,
          aporteTotal: 0,
          lucro: 0,
          percentualLucro: 0,
        };
        mockWallets.push(newWallet);
        toast.success(`Carteira "${name}" criada com sucesso!`);
        resolve(newWallet);
      }, 500);
    });
  },

  addAsset: async (walletId: string, asset: { nome: string; quantidade: number; valorUnitario: number }): Promise<Wallet> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const walletIndex = mockWallets.findIndex(w => w.id === walletId);
        if (walletIndex === -1) {
          toast.error("Carteira não encontrada!");
          reject(new Error("Carteira não encontrada"));
          return;
        }

        const wallet = mockWallets[walletIndex];
        const valorTotal = asset.quantidade * asset.valorUnitario;

        if (valorTotal > mockUser.saldoReais) {
          toast.error("Saldo em reais insuficiente para este aporte!");
          reject(new Error("Saldo insuficiente"));
          return;
        }

        // Update user balance
        mockUser.saldoReais -= valorTotal;
        mockUser.aporteTotal += valorTotal;

        // Update or add asset
        const existingAssetIndex = wallet.ativos.findIndex(a => a.nome === asset.nome);
        if (existingAssetIndex >= 0) {
          const existingAsset = wallet.ativos[existingAssetIndex];
          const newQuantity = existingAsset.quantidade + asset.quantidade;
          const newTotal = existingAsset.valorTotal + valorTotal;
          const newAvgPrice = newTotal / newQuantity;
          
          wallet.ativos[existingAssetIndex] = {
            ...existingAsset,
            quantidade: newQuantity,
            valorUnitario: newAvgPrice,
            valorTotal: newTotal,
          };
        } else {
          wallet.ativos.push({
            nome: asset.nome,
            quantidade: asset.quantidade,
            valorUnitario: asset.valorUnitario,
            valorTotal,
            percentual: 0,
          });
        }

        // Update wallet totals
        wallet.aporteTotal += valorTotal;
        wallet.saldoTotal += valorTotal;

        // Recalculate percentages
        wallet.ativos.forEach(a => {
          a.percentual = (a.valorTotal / wallet.saldoTotal) * 100;
        });

        // Add to history
        mockHistory.unshift({
          id: `${mockHistory.length + 1}`,
          data: new Date().toISOString().split('T')[0],
          tipo: 'compra',
          descricao: `Comprou ${asset.quantidade} ${asset.nome}`,
          valor: valorTotal,
        });

        toast.success(`Compra de ${asset.quantidade} ${asset.nome} realizada com sucesso!`);
        resolve(wallet);
      }, 500);
    });
  },

  sellAsset: async (walletId: string, asset: { nome: string; quantidade: number; valorUnitario: number }): Promise<Wallet> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const walletIndex = mockWallets.findIndex(w => w.id === walletId);
        if (walletIndex === -1) {
          toast.error("Carteira não encontrada!");
          reject(new Error("Carteira não encontrada"));
          return;
        }

        const wallet = mockWallets[walletIndex];
        const existingAssetIndex = wallet.ativos.findIndex(a => a.nome === asset.nome);

        if (existingAssetIndex === -1) {
          toast.error(`Ativo ${asset.nome} não encontrado na carteira!`);
          reject(new Error("Ativo não encontrado"));
          return;
        }

        const existingAsset = wallet.ativos[existingAssetIndex];
        if (existingAsset.quantidade < asset.quantidade) {
          toast.error(`Quantidade insuficiente de ${asset.nome} para venda!`);
          reject(new Error("Quantidade insuficiente"));
          return;
        }

        const valorVenda = asset.quantidade * asset.valorUnitario;
        const valorCusto = asset.quantidade * existingAsset.valorUnitario;
        const lucroVenda = valorVenda - valorCusto;

        // Update user balance
        mockUser.saldoReais += valorVenda;

        // Update asset
        existingAsset.quantidade -= asset.quantidade;
        existingAsset.valorTotal = existingAsset.quantidade * existingAsset.valorUnitario;

        if (existingAsset.quantidade === 0) {
          wallet.ativos.splice(existingAssetIndex, 1);
        }

        // Update wallet totals
        wallet.saldoTotal = wallet.ativos.reduce((sum, a) => sum + a.valorTotal, 0);
        wallet.lucro = wallet.saldoTotal - wallet.aporteTotal;
        wallet.percentualLucro = wallet.aporteTotal > 0 ? (wallet.lucro / wallet.aporteTotal) * 100 : 0;

        // Recalculate percentages
        if (wallet.saldoTotal > 0) {
          wallet.ativos.forEach(a => {
            a.percentual = (a.valorTotal / wallet.saldoTotal) * 100;
          });
        }

        // Add to history
        mockHistory.unshift({
          id: `${mockHistory.length + 1}`,
          data: new Date().toISOString().split('T')[0],
          tipo: 'venda',
          descricao: `Vendeu ${asset.quantidade} ${asset.nome}`,
          valor: valorVenda,
        });

        const resultMessage = lucroVenda >= 0 
          ? `Venda realizada com lucro de R$ ${lucroVenda.toLocaleString()}` 
          : `Venda realizada com prejuízo de R$ ${Math.abs(lucroVenda).toLocaleString()}`;
        
        toast.success(`Venda de ${asset.quantidade} ${asset.nome} realizada! ${resultMessage}`);
        resolve(wallet);
      }, 500);
    });
  },

  // History endpoint
  getHistory: async (): Promise<HistoryItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockHistory]), 500);
    });
  },

  // Chart endpoints
  getWalletPieChart: async (walletId: string): Promise<ChartData> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const wallet = mockWallets.find(w => w.id === walletId);
        if (!wallet) {
          reject(new Error("Carteira não encontrada"));
          return;
        }

        const colors = [
          '#00e4ca', '#9b87f5', '#ff9332', '#1199fa', '#2ebd85', '#ff4c4c',
          '#00b8d9', '#6554c0', '#ff8800', '#36b37e', '#ff5630', '#6554c0'
        ];

        resolve({
          labels: wallet.ativos.map(a => a.nome),
          data: wallet.ativos.map(a => a.percentual),
          backgroundColor: wallet.ativos.map((_, index) => colors[index % colors.length]),
        });
      }, 500);
    });
  },

  getGeneralPieChart: async (): Promise<ChartData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const totalValue = mockWallets.reduce((sum, wallet) => sum + wallet.saldoTotal, 0);
        const walletData = mockWallets.map(wallet => ({
          name: wallet.nome,
          value: wallet.saldoTotal,
          percentage: (wallet.saldoTotal / totalValue) * 100
        }));

        const colors = [
          '#00e4ca', '#9b87f5', '#ff9332', '#1199fa', '#2ebd85', '#ff4c4c',
          '#00b8d9', '#6554c0', '#ff8800', '#36b37e', '#ff5630', '#6554c0'
        ];

        resolve({
          labels: walletData.map(w => w.name),
          data: walletData.map(w => w.percentage),
          backgroundColor: walletData.map((_, index) => colors[index % colors.length]),
        });
      }, 500);
    });
  },

  getWalletPerformanceChart: async (walletId: string): Promise<LineChartData> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const wallet = mockWallets.find(w => w.id === walletId);
        if (!wallet) {
          reject(new Error("Carteira não encontrada"));
          return;
        }

        // Generate mock data for 6 months
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        const aporteData = [wallet.aporteTotal * 0.3, wallet.aporteTotal * 0.5, wallet.aporteTotal * 0.7, 
                           wallet.aporteTotal * 0.8, wallet.aporteTotal * 0.9, wallet.aporteTotal];
        const saldoData = [wallet.aporteTotal * 0.28, wallet.aporteTotal * 0.48, wallet.aporteTotal * 0.75, 
                          wallet.aporteTotal * 0.9, wallet.aporteTotal * 1.05, wallet.saldoTotal];

        resolve({
          labels: months,
          datasets: [
            {
              label: 'Aporte',
              data: aporteData,
              borderColor: '#9b87f5',
              backgroundColor: 'rgba(155, 135, 245, 0.1)',
            },
            {
              label: 'Saldo',
              data: saldoData,
              borderColor: '#00e4ca',
              backgroundColor: 'rgba(0, 228, 202, 0.1)',
            }
          ]
        });
      }, 500);
    });
  },

  getGeneralPerformanceChart: async (): Promise<LineChartData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate mock data for 6 months
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        const totalAporte = mockWallets.reduce((sum, wallet) => sum + wallet.aporteTotal, 0);
        const totalSaldo = mockWallets.reduce((sum, wallet) => sum + wallet.saldoTotal, 0);
        
        const aporteData = [totalAporte * 0.3, totalAporte * 0.5, totalAporte * 0.7, 
                           totalAporte * 0.8, totalAporte * 0.9, totalAporte];
        const saldoData = [totalAporte * 0.28, totalAporte * 0.48, totalAporte * 0.75, 
                          totalAporte * 0.9, totalAporte * 1.05, totalSaldo];

        resolve({
          labels: months,
          datasets: [
            {
              label: 'Aporte Total',
              data: aporteData,
              borderColor: '#9b87f5',
              backgroundColor: 'rgba(155, 135, 245, 0.1)',
            },
            {
              label: 'Saldo Total',
              data: saldoData,
              borderColor: '#00e4ca',
              backgroundColor: 'rgba(0, 228, 202, 0.1)',
            }
          ]
        });
      }, 500);
    });
  }
};

export default api;
