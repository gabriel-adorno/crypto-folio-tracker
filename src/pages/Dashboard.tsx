
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import StatCard from "@/components/Dashboard/StatCard";
import WalletCard from "@/components/Portfolio/WalletCard";
import TransactionList from "@/components/History/TransactionList";
import { Button } from "@/components/ui/button";
import { CardTitle, Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, DollarSign, TrendingUp, BarChart3, Plus } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import api, { HistoryItem, Wallet as WalletType } from "@/services/api";
import PieChart from "@/components/Charts/PieChart";

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
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral da sua carteira de criptomoedas
        </p>
      </div>

      <div className="grid-stats mb-6">
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
            <StatCard
              title="Saldo em Reais"
              value={formatCurrency(overview.saldoReais)}
              icon={<DollarSign size={24} />}
            />
            <StatCard
              title="Saldo em Criptomoedas"
              value={formatCurrency(overview.saldoCarteiras)}
              icon={<Wallet size={24} />}
              trend={{
                value: formatPercentage(overview.percentualLucro),
                positive: overview.percentualLucro > 0,
              }}
            />
            <StatCard
              title="Aporte Total"
              value={formatCurrency(overview.aporteTotal)}
              icon={<BarChart3 size={24} />}
            />
            <StatCard
              title="Lucro Total"
              value={formatCurrency(overview.lucroTotal)}
              icon={<TrendingUp size={24} />}
              trend={{
                value: formatPercentage(overview.percentualLucro),
                positive: overview.percentualLucro > 0,
              }}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Suas Carteiras</CardTitle>
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
          {loading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : chartData.length > 0 ? (
            <PieChart 
              title="Distribuição de Carteiras" 
              data={chartData}
            />
          ) : (
            <Card className="h-full flex flex-col justify-center items-center p-6">
              <p className="text-muted-foreground text-center mb-4">
                Adicione criptomoedas às suas carteiras para visualizar a distribuição
              </p>
              <Button asChild>
                <Link to="/carteiras">Gerenciar Carteiras</Link>
              </Button>
            </Card>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Transações Recentes</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/historico">Ver todas</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <TransactionList transactions={transactions} />
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Dashboard;
