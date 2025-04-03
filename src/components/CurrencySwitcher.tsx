
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCurrency } from "@/contexts/CurrencyContext";
import { ChevronDown, DollarSign, ChevronsUpDown } from 'lucide-react';

const CurrencySwitcher = () => {
  const { currency, setCurrency } = useCurrency();
  
  const currencies = [
    { value: 'BRL', label: 'BRL (R$)', icon: 'R$' },
    { value: 'USD', label: 'USD ($)', icon: '$' }
  ];
  
  const selectedCurrency = currencies.find(c => c.value === currency) || currencies[0];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-2 min-w-[70px] bg-muted/50"
        >
          <span className="font-medium">{selectedCurrency.icon}</span>
          <ChevronsUpDown className="ml-1 h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {currencies.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onClick={() => setCurrency(item.value as 'BRL' | 'USD')}
            className={currency === item.value ? 'bg-muted font-medium' : ''}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySwitcher;
