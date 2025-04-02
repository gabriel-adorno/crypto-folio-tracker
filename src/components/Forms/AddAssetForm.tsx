
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/formatters";
import api from "@/services/api";
import { toast } from "sonner";

const cryptoOptions = [
  { value: "Bitcoin", label: "Bitcoin (BTC)" },
  { value: "Ethereum", label: "Ethereum (ETH)" },
  { value: "Solana", label: "Solana (SOL)" },
  { value: "Cardano", label: "Cardano (ADA)" },
  { value: "Polkadot", label: "Polkadot (DOT)" },
  { value: "Avalanche", label: "Avalanche (AVAX)" },
  { value: "Ripple", label: "Ripple (XRP)" },
  { value: "Polygon", label: "Polygon (MATIC)" },
  { value: "Aave", label: "Aave (AAVE)" },
  { value: "Uniswap", label: "Uniswap (UNI)" },
];

const AddAssetForm = () => {
  const { walletId } = useParams<{ walletId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  
  const totalValue = parseFloat(quantity || "0") * parseFloat(price || "0");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCrypto) {
      toast.error("Selecione uma criptomoeda");
      return;
    }
    
    if (!quantity || parseFloat(quantity) <= 0) {
      toast.error("Informe uma quantidade válida");
      return;
    }
    
    if (!price || parseFloat(price) <= 0) {
      toast.error("Informe um preço válido");
      return;
    }
    
    setLoading(true);
    
    try {
      await api.addAsset(walletId!, {
        nome: selectedCrypto,
        quantidade: parseFloat(quantity),
        valorUnitario: parseFloat(price),
      });
      
      navigate(`/carteiras/${walletId}`);
    } catch (error) {
      console.error("Erro ao adicionar ativo:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Adicionar Ativo</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crypto">Criptomoeda</Label>
            <Select
              value={selectedCrypto}
              onValueChange={setSelectedCrypto}
            >
              <SelectTrigger id="crypto">
                <SelectValue placeholder="Selecione uma criptomoeda" />
              </SelectTrigger>
              <SelectContent>
                {cryptoOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="0,00"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              step="any"
              min="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Preço unitário (R$)</Label>
            <Input
              id="price"
              type="number"
              placeholder="0,00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="any"
              min="0"
            />
          </div>
          
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Valor total</span>
              <span className="text-lg font-medium">
                {formatCurrency(totalValue)}
              </span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/carteiras/${walletId}`)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Adicionando..." : "Adicionar Ativo"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddAssetForm;
