
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import AssetList from "@/components/Portfolio/AssetList";
import SellAssetForm from "@/components/Forms/SellAssetForm";
import PieChart from "@/components/Charts/PieChart";
import LineChart from "@/components/Charts/LineChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, Plus } from "lucide-react";
import { formatCurrency, formatPercentage, getColorForPercentage } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import api, { Asset, Wallet } from "@/services/api";

const WalletDetailsPage = () => {
  const { walletId } = useParams<{ walletId: string }>();
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [pieChartData, setPieChartData] = useState<{ name: string; value: number }[]>([]);
  const [lineChartData, setLineChartData] = useState<Record<string, any>[]>([]);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!walletId) return;

      try {
        const [walletData, pieData, lineData] = await Promise.all([
          api.getWallet(walletId),
          api.getWalletPieChart(walletId),
          api.getWalletPerformanceChart(walletId),
        ]);

        if (walletData) {
          setWallet(walletData);

          // Format pie chart data
          setPieChartData(
            pieData.labels.map((label, index) => ({
              name: label,
              value: pieData.data[index],
            }))
          );

          // Format line chart data
          setLineChartData(
            lineData.labels.map((month, index) => ({
              month,
              aporte: lineData.datasets[0].data[index],
              saldo: lineData.datasets[1].data[index],
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching wallet details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [walletId]);

  const handleSellAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setSellDialogOpen(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/carteiras">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar para carteiras
            </Link>
          </Button>
          <Skeleton className="h-8 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[100px]" />
          ))}
        </div>

        <Skeleton className="h-[400px] mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </Layout>
    );
  }

  if (!wallet) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold mb-2">Carteira não encontrada</h2>
          <p className="text-muted-foreground mb-6">
            A carteira que você está procurando não existe ou foi removida
          </p>
          <Button asChild>
            <Link to="/carteiras">Ver todas as carteiras</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/carteiras">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar para carteiras
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-2">{wallet.nome}</h1>
        <p className="text-muted-foreground">
          Detalhes e ativos da sua carteira
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Saldo Total</p>
            <h3 className="text-2xl font-bold">{formatCurrency(wallet.saldoTotal)}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Aporte Total</p>
            <h3 className="text-2xl font-bold">{formatCurrency(wallet.aporteTotal)}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Lucro/Prejuízo</p>
            <h3 className={cn("text-2xl font-bold", getColorForPercentage(wallet.lucro))}>
              {wallet.lucro > 0 ? "+" : ""}{formatCurrency(wallet.lucro)} 
              <span className="text-sm ml-1">
                ({wallet.percentualLucro > 0 ? "+" : ""}{formatPercentage(wallet.percentualLucro)})
              </span>
            </h3>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Ativos</CardTitle>
          <Button asChild>
            <Link to={`/carteiras/${walletId}/adicionar`}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Ativo
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <AssetList 
            assets={wallet.ativos} 
            onSellAsset={handleSellAsset}
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="charts">
        <TabsList className="mb-4">
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pieChartData.length > 0 ? (
              <PieChart 
                title="Distribuição de Ativos" 
                data={pieChartData}
              />
            ) : (
              <Card className="flex flex-col justify-center items-center p-6">
                <p className="text-muted-foreground text-center mb-4">
                  Adicione criptomoedas à sua carteira para visualizar a distribuição
                </p>
                <Button asChild>
                  <Link to={`/carteiras/${walletId}/adicionar`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Ativo
                  </Link>
                </Button>
              </Card>
            )}
            
            <LineChart 
              title="Evolução de Aporte e Saldo" 
              data={lineChartData}
              dataKeys={[
                { dataKey: 'aporte', color: '#9b87f5', name: 'Aporte' },
                { dataKey: 'saldo', color: '#00e4ca', name: 'Saldo' }
              ]}
              xAxisDataKey="month"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Carteira</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ID da Carteira</p>
                    <p className="font-medium">{wallet.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{wallet.nome}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Número de Ativos</p>
                  <p className="font-medium">{wallet.ativos.length}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Rentabilidade</p>
                  <p className={cn("font-medium", getColorForPercentage(wallet.percentualLucro))}>
                    {wallet.percentualLucro > 0 ? "+" : ""}{formatPercentage(wallet.percentualLucro)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
        <DialogContent>
          {selectedAsset && (
            <SellAssetForm
              asset={selectedAsset}
              onCancel={() => setSellDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default WalletDetailsPage;
