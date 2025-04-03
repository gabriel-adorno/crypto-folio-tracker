
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '@/services/api';
import { toast } from 'sonner';

type CurrencyType = 'BRL' | 'USD';

interface CurrencyContextType {
  currentCurrency: CurrencyType;
  exchangeRate: number;
  setCurrency: (currency: CurrencyType) => void;
  convertValue: (valueBRL: number) => number;
  formatCurrency: (value: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyType>('BRL');
  const [exchangeRate, setExchangeRate] = useState<number>(5.0); // Valor padrão

  // Buscar a cotação do dólar ao iniciar
  useEffect(() => {
    const fetchDollarRate = async () => {
      try {
        const rate = await api.getDollarRate();
        if (rate) {
          setExchangeRate(rate.valor);
        }
      } catch (error) {
        console.error('Erro ao buscar cotação do dólar:', error);
        toast.error('Não foi possível obter a cotação do dólar');
      }
    };

    fetchDollarRate();
  }, []);

  // Função para mudar a moeda
  const setCurrency = (currency: CurrencyType) => {
    setCurrentCurrency(currency);
    toast.success(`Moeda alterada para ${currency === 'BRL' ? 'Real' : 'Dólar'}`);
  };

  // Função para converter valores de BRL para a moeda selecionada
  const convertValue = (valueBRL: number): number => {
    if (currentCurrency === 'BRL') return valueBRL;
    return valueBRL / exchangeRate;
  };

  // Função para formatar valores na moeda atual
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat(currentCurrency === 'BRL' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: currentCurrency,
    }).format(convertValue(value));
  };

  const value = {
    currentCurrency,
    exchangeRate,
    setCurrency,
    convertValue,
    formatCurrency,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
