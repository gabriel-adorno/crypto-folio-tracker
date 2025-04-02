
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import PieChart from "@/components/Charts/PieChart";
import LineChart from "@/components/Charts/LineChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/api";

const ReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [generalPieData, setGeneralPieData] = useState<{name: string; value: number}[]>([]);
  const [generalLineData, setGeneralLineData] = useState<Record<string, any>[]>([]);
  
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const [pieData, lineData] = await Promise.all([
          api.getGeneralPieChart(),
          api.getGeneralPerformanceChart(),
        ]);
        
        // Format pie chart data
        setGeneralPieData(
          pieData.labels.map((label, index) => ({
            name: label,
            value: pieData.data[index],
          }))
        );
        
        // Format line chart data
        setGeneralLineData(
          lineData.labels.map((month, index) => ({
            month,
            aporte: lineData.datasets[0].data[index],
            saldo: lineData.datasets[1].data[index],
          }))
        );
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, []);
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Relatórios</h1>
        <p className="text-muted-foreground">
          Análises e gráficos da sua carteira de investimentos
        </p>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-[400px]" />
              <Skeleton className="h-[400px]" />
            </div>
          ) : generalPieData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PieChart
                title="Distribuição de Carteiras"
                data={generalPieData}
              />
              <Card>
                <CardHeader>
                  <CardTitle>Composição do Portfólio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generalPieData.map((item) => (
                      <div key={item.name} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{
                              backgroundColor:
                                item.name === "Carteira Principal" ? "#00e4ca" :
                                item.name === "DeFi" ? "#9b87f5" : "#ff9332",
                            }}
                          />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value.toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">
                Adicione criptomoedas às suas carteiras para visualizar os relatórios
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="performance">
          {loading ? (
            <Skeleton className="h-[500px]" />
          ) : generalLineData.length > 0 ? (
            <LineChart
              title="Evolução de Aporte e Saldo"
              data={generalLineData}
              dataKeys={[
                { dataKey: 'aporte', color: '#9b87f5', name: 'Aporte Total' },
                { dataKey: 'saldo', color: '#00e4ca', name: 'Saldo Total' }
              ]}
              xAxisDataKey="month"
            />
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">
                Adicione criptomoedas às suas carteiras para visualizar os relatórios de performance
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default ReportsPage;
