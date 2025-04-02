
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
