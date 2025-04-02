
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HistoryItem } from "@/services/api";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { ArrowUpCircle, ArrowDownCircle, CircleDollarSign, Wallet, RefreshCw } from "lucide-react";

interface TransactionListProps {
  transactions: HistoryItem[];
}

const TransactionList = ({ transactions }: TransactionListProps) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p className="mb-4">Nenhuma transação encontrada.</p>
        <p className="text-sm">Faça operações de depósito, compra ou venda para visualizar seu histórico.</p>
      </div>
    );
  }

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "compra":
        return <ArrowUpCircle className="text-crypto-green" size={18} />;
      case "venda":
        return <ArrowDownCircle className="text-crypto-red" size={18} />;
      case "deposito":
        return <CircleDollarSign className="text-crypto-blue" size={18} />;
      case "saque":
        return <Wallet className="text-crypto-orange" size={18} />;
      case "criacao":
        return <RefreshCw className="text-muted-foreground" size={18} />;
      default:
        return null;
    }
  };

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case "compra":
        return "text-crypto-green";
      case "venda":
        return "text-crypto-red";
      case "deposito":
        return "text-crypto-blue";
      case "saque":
        return "text-crypto-orange";
      case "criacao":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Data</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{formatDate(transaction.data)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getIcon(transaction.tipo)}
                  <span className={cn("capitalize text-sm", getTypeColor(transaction.tipo))}>
                    {transaction.tipo}
                  </span>
                </div>
              </TableCell>
              <TableCell>{transaction.descricao}</TableCell>
              <TableCell className="text-right">{formatCurrency(transaction.valor)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionList;
