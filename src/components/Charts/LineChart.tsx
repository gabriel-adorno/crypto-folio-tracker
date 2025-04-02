
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/formatters";

interface LineChartProps {
  title: string;
  data: Array<Record<string, any>>;
  dataKeys: Array<{
    dataKey: string;
    color: string;
    name: string;
  }>;
  xAxisDataKey: string;
}

const LineChart = ({ title, data, dataKeys, xAxisDataKey }: LineChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey={xAxisDataKey} />
              <YAxis tickFormatter={(value) => formatCurrency(value).split(',')[0]} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Valor']} 
                contentStyle={{ backgroundColor: 'rgba(30, 40, 51, 0.8)', border: 'none', borderRadius: '8px' }}
              />
              <Legend />
              {dataKeys.map((dataKey) => (
                <Line
                  key={dataKey.dataKey}
                  type="monotone"
                  dataKey={dataKey.dataKey}
                  stroke={dataKey.color}
                  name={dataKey.name}
                  activeDot={{ r: 8 }}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LineChart;
