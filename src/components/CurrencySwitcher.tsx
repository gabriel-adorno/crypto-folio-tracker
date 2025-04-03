
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";

const CurrencySwitcher = () => {
  const { currentCurrency, setCurrency } = useCurrency();

  const toggleCurrency = () => {
    setCurrency(currentCurrency === 'BRL' ? 'USD' : 'BRL');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleCurrency}
      className="w-20"
    >
      {currentCurrency === 'BRL' ? 'R$' : 'US$'}
    </Button>
  );
};

export default CurrencySwitcher;
