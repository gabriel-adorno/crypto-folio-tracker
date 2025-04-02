
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import TransactionList from "@/components/History/TransactionList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import api, { HistoryItem } from "@/services/api";

const HistoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<HistoryItem[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getHistory();
        setTransactions(data);
        setFilteredTransactions(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    let results = transactions;
    
    // Filter by type
    if (typeFilter !== "all") {
      results = results.filter((item) => item.tipo === typeFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (item) => item.descricao.toLowerCase().includes(term)
      );
    }
    
    setFilteredTransactions(results);
  }, [typeFilter, searchTerm, transactions]);
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Histórico</h1>
        <p className="text-muted-foreground">
          Visualize todas as transações realizadas
        </p>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar em transações..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de operação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="compra">Compra</SelectItem>
                <SelectItem value="venda">Venda</SelectItem>
                <SelectItem value="deposito">Depósito</SelectItem>
                <SelectItem value="saque">Saque</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[400px]" />
          ) : (
            <TransactionList transactions={filteredTransactions} />
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default HistoryPage;
