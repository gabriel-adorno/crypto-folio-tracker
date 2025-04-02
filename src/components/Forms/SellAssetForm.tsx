
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { Asset } from "@/services/api";
import api from "@/services/api";
import { toast } from "sonner";

interface SellAssetFormProps {
  asset: Asset;
  onCancel: () => void;
}

const SellAssetForm = ({ asset, onCancel }: SellAssetFormProps) => {
  const { walletId } = useParams<{ walletId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState("0");
  const [price, setPrice] = useState(asset.valorUnitario.toString());
  
  const totalValue = parseFloat(quantity || "0") * parseFloat(price || "0");
  const maxQuantity = asset.quantidade;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const qtd = parseFloat(quantity);
    
    if (!quantity || qtd <= 0 || qtd > maxQuantity) {
      toast.error(`Informe uma quantidade válida (máximo: ${formatNumber(maxQuantity)})`);
      return;
    }
    
    if (!price || parseFloat(price) <= 0) {
      toast.error("Informe um preço válido");
      return;
    }
    
    setLoading(true);
    
    try {
      await api.sellAsset(walletId!, {
        nome: asset.nome,
        quantidade: parseFloat(quantity),
        valorUnitario: parseFloat(price),
      });
      
      navigate(`/carteiras/${walletId}`);
    } catch (error) {
      console.error("Erro ao vender ativo:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Vender {asset.nome}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Quantidade disponível</span>
              <span>{formatNumber(asset.quantidade)} {asset.nome}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">Preço médio de compra</span>
              <span>{formatCurrency(asset.valorUnitario)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade para vender</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="0,00"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              step="any"
              min="0"
              max={maxQuantity}
            />
            <div className="text-xs text-right text-muted-foreground">
              Máximo: {formatNumber(maxQuantity)}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Preço de venda unitário (R$)</Label>
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
              <span className="text-sm text-muted-foreground">Valor total da venda</span>
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
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading || parseFloat(quantity) <= 0 || parseFloat(quantity) > maxQuantity}>
            {loading ? "Vendendo..." : "Confirmar Venda"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SellAssetForm;
