
export interface User {
  id: string;
  email: string;
  nome: string;
  saldoReais: number;
  aporteTotal: number;
}

export interface Asset {
  nome: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  precoAtual?: number;
  valorAtual?: number;
  percentual: number;
}

export interface Wallet {
  id: string;
  userId: string;  // Adicionado userId para vinculação ao usuário
  nome: string;
  ativos: Asset[];
  saldoTotal: number;
  aporteTotal: number;
  lucro: number;
  percentualLucro: number;
}

export interface HistoryItem {
  id: string;
  userId: string;  // Adicionado userId para vinculação ao usuário
  data: string;
  tipo: 'compra' | 'venda' | 'deposito' | 'saque' | 'criacao';
  descricao: string;
  valor: number;
  carteiraId?: string;
  carteiraNome?: string;
  lucro?: number;
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

export interface UserOverview {
  saldoReais: number;
  aporteTotal: number;
  saldoCarteiras: number;
  lucroTotal: number;
  percentualLucro: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface Crypto {
  nome: string;
  simbolo: string;
  precoAtual: number;
  variacao24h: number;
  marketCap: number;
  volume24h: number;
  ultimaAtualizacao: string;
}

export interface ExchangeRate {
  moeda: string;
  valor: number;
  data: string;
}
