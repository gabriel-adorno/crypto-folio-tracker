
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Asset } from "@/services/api";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/formatters";
import { Button } from "@/components/ui/button";

interface AssetListProps {
  assets: Asset[];
  onSellAsset: (asset: Asset) => void;
}

const AssetList = ({ assets, onSellAsset }: AssetListProps) => {
  if (assets.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Nenhum ativo encontrado nesta carteira.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Ativo</TableHead>
            <TableHead className="text-right">Quantidade</TableHead>
            <TableHead className="text-right">Preço médio</TableHead>
            <TableHead className="text-right">Valor total</TableHead>
            <TableHead className="text-right">Alocação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.nome}>
              <TableCell className="font-medium">{asset.nome}</TableCell>
              <TableCell className="text-right">{formatNumber(asset.quantidade)}</TableCell>
              <TableCell className="text-right">{formatCurrency(asset.valorUnitario)}</TableCell>
              <TableCell className="text-right">{formatCurrency(asset.valorTotal)}</TableCell>
              <TableCell className="text-right">{formatPercentage(asset.percentual)}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onSellAsset(asset)}
                >
                  Vender
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssetList;
