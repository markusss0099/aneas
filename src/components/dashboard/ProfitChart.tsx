
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { CashflowByPeriod } from '@/types';

interface ProfitChartProps {
  data: CashflowByPeriod[];
}

const ProfitChart = ({ data }: ProfitChartProps) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Profitto nel Tempo</CardTitle>
        <CardDescription>
          Andamento del profitto mensile
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorServiceRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`€${value}`, '']}
              labelFormatter={(value) => `Periodo: ${value}`}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="profit" 
              stroke="#06b6d4" 
              fillOpacity={1} 
              fill="url(#colorProfit)" 
              name="Profitto Biglietti"
            />
            <Area 
              type="monotone" 
              dataKey="serviceRevenue" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorServiceRevenue)" 
              name="Ricavi Servizi"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default React.memo(ProfitChart);
