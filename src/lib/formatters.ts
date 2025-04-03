
import { useCurrency } from '@/contexts/CurrencyContext';

// Versão antiga da função formatCurrency que permanece para compatibilidade
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Hook para formatar moeda usando o contexto
export const useFormatCurrency = () => {
  const { formatCurrency } = useCurrency();
  return formatCurrency;
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

export const getColorForPercentage = (percentage: number): string => {
  if (percentage > 0) return 'text-crypto-green';
  if (percentage < 0) return 'text-crypto-red';
  return 'text-muted-foreground';
};
