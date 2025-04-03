
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import StatCard from "@/components/Dashboard/StatCard";
import WalletCard from "@/components/Portfolio/WalletCard";
import TransactionList from "@/components/History/TransactionList";
import { Button } from "@/components/ui/button";
import { CardTitle, Card, CardHeader, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Wallet, 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  Plus, 
  ArrowUpRight,
  Bell,
  Clock
} from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import api, { HistoryItem, Wallet as WalletType } from "@/services/api";
import PieChart from "@/components/Charts/PieChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({
    saldoReais: 0,
    aporteTotal: 0,
    saldoCarteiras: 0,
    lucroTotal: 0,
    percentualLucro: 0,
  });
  const [wallets, setWallets] = useState<WalletType[]>([]);
  const [transactions, setTransactions] = useState<HistoryItem[]>([]);
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userOverview, walletsData, historyData, pieChartData] = await Promise.all([
          api.getUserOverview(),
          api.getWallets(),
          api.getHistory(),
          api.getGeneralPieChart(),
        ]);

        setOverview(userOverview);
        setWallets(walletsData);
        setTransactions(historyData.slice(0, 5)); // Show only 5 most recent
        
        // Format chart data
        setChartData(
          pieChartData.labels.map((label, index) => ({
            name: label,
            value: pieChartData.data[index],
          }))
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout title="Dashboard">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Visão geral da sua carteira de criptomoedas
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" className="h-9">
              <Bell className="mr-2 h-4 w-4" />
              Alertas
            </Button>
            <Button size="sm" className="h-9">
              <Plus className="mr-2 h-4 w-4" />
              Novo Aporte
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-[100px] mb-2" />
                  <Skeleton className="h-8 w-[150px] mb-2" />
                  <Skeleton className="h-4 w-[80px]" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-muted-foreground">Saldo em Reais</p>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <DollarSign size={16} className="text-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">{formatCurrency(overview.saldoReais)}</h3>
                  <p className="text-sm text-muted-foreground">Disponível para investir</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-muted-foreground">Saldo em Criptomoedas</p>
                  <div className="p-2 bg-secondary/10 rounded-full">
                    <Wallet size={16} className="text-secondary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">{formatCurrency(overview.saldoCarteiras)}</h3>
                  {overview.percentualLucro > 0 ? (
                    <p className="text-sm text-crypto-green flex items-center">
                      <ArrowUpRight size={14} className="mr-1" />
                      {formatPercentage(overview.percentualLucro)}
                    </p>
                  ) : (
                    <p className="text-sm text-crypto-red flex items-center">
                      <ArrowUpRight size={14} className="mr-1 rotate-180" />
                      {formatPercentage(Math.abs(overview.percentualLucro))}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-muted-foreground">Aporte Total</p>
                  <div className="p-2 bg-crypto-blue/10 rounded-full">
                    <BarChart3 size={16} className="text-crypto-blue" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">{formatCurrency(overview.aporteTotal)}</h3>
                  <p className="text-sm text-muted-foreground">Valor investido</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-muted-foreground">Lucro Total</p>
                  <div className="p-2 bg-crypto-green/10 rounded-full">
                    <TrendingUp size={16} className="text-crypto-green" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">{formatCurrency(overview.lucroTotal)}</h3>
                  {overview.percentualLucro > 0 ? (
                    <p className="text-sm text-crypto-green flex items-center">
                      <ArrowUpRight size={14} className="mr-1" />
                      {formatPercentage(overview.percentualLucro)}
                    </p>
                  ) : (
                    <p className="text-sm text-crypto-red flex items-center">
                      <ArrowUpRight size={14} className="mr-1 rotate-180" />
                      {formatPercentage(Math.abs(overview.percentualLucro))}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl">Suas Carteiras</CardTitle>
                <CardDescription>Gerencie seus investimentos em criptomoedas</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/carteiras/nova">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Carteira
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="h-[200px] w-full" />
                  ))}
                </div>
              ) : wallets.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Você ainda não tem carteiras
                  </p>
                  <Button asChild>
                    <Link to="/carteiras/nova">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Carteira
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {wallets.map((wallet) => (
                    <WalletCard key={wallet.id} wallet={wallet} />
                  ))}
                  <div className="pt-2 text-center">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/carteiras">Ver todas as carteiras</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Distribuição</CardTitle>
              <CardDescription>Alocação dos seus investimentos</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-0">
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : chartData.length > 0 ? (
                <div className="h-[300px]">
                  <PieChart 
                    data={chartData}
                  />
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center p-6">
                  <p className="text-muted-foreground text-center mb-4">
                    Adicione criptomoedas às suas carteiras para visualizar a distribuição
                  </p>
                  <Button asChild>
                    <Link to="/carteiras">Gerenciar Carteiras</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-xl">Histórico de Transações</CardTitle>
              <CardDescription>Atividades recentes da sua conta</CardDescription>
            </div>
            <Tabs defaultValue="all" className="w-full md:w-auto mt-2 md:mt-0">
              <TabsList className="grid grid-cols-3 w-full md:w-auto">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="compras">Compras</TabsTrigger>
                <TabsTrigger value="vendas">Vendas</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : transactions.length === 0 ? (
            <div className="text-center py-10">
              <Clock className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-1">Sem transações recentes</h3>
              <p className="text-muted-foreground mb-4">
                As transações que você fizer aparecerão aqui.
              </p>
            </div>
          ) : (
            <TransactionList transactions={transactions} />
          )}
          
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/historico">
                Ver todas as transações
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Dashboard;
