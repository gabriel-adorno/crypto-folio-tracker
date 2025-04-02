
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { formatCurrency, formatPercentage, getColorForPercentage } from "@/lib/formatters";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Wallet as WalletType } from "@/services/api";

interface WalletCardProps {
  wallet: WalletType;
}

const WalletCard = ({ wallet }: WalletCardProps) => {
  const { id, nome, saldoTotal, aporteTotal, lucro, percentualLucro, ativos } = wallet;
  
  return (
    <Card className="crypto-card overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Wallet size={18} />
            </div>
            <h3 className="font-medium">{nome}</h3>
          </div>
          <div className={cn("text-sm font-medium", getColorForPercentage(percentualLucro))}>
            {percentualLucro > 0 ? "+" : ""}{formatPercentage(percentualLucro)}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">Saldo total</span>
              <span className="text-sm font-medium">{formatCurrency(saldoTotal)}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">Aporte</span>
              <span className="text-sm">{formatCurrency(aporteTotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Lucro</span>
              <span className={cn("text-sm font-medium", getColorForPercentage(lucro))}>
                {lucro > 0 ? "+" : ""}{formatCurrency(lucro)}
              </span>
            </div>
          </div>
          
          {ativos.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground">Principais ativos</span>
              {ativos.slice(0, 3).map((ativo) => (
                <div key={ativo.nome}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs">{ativo.nome}</span>
                    <span className="text-xs">{formatPercentage(ativo.percentual)}</span>
                  </div>
                  <Progress 
                    value={ativo.percentual} 
                    className="h-1"
                    indicatorClassName={
                      ativo.nome === "Bitcoin" ? "bg-crypto-orange" :
                      ativo.nome === "Ethereum" ? "bg-crypto-purple" :
                      "bg-crypto-teal"
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/30 p-4 flex justify-between">
        <Link 
          to={`/carteiras/${id}`}
          className="text-xs text-primary hover:underline"
        >
          Ver detalhes
        </Link>
        <Link 
          to={`/carteiras/${id}/adicionar`}
          className="text-xs text-primary hover:underline"
        >
          Adicionar ativo
        </Link>
      </CardFooter>
    </Card>
  );
};

export default WalletCard;
