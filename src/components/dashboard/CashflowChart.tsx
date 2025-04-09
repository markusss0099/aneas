
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { CashflowByPeriod } from '@/types';

interface CashflowChartProps {
  data: CashflowByPeriod[];
}

const CashflowChart = ({ data }: CashflowChartProps) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Cashflow Mensile</CardTitle>
        <CardDescription>
          Andamento mensile di investimenti e ricavi
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`€${value}`, '']}
              labelFormatter={(value) => `Periodo: ${value}`}
            />
            <Legend />
            <Bar dataKey="invested" fill="#1e3a8a" name="Investimento" />
            <Bar dataKey="revenue" fill="#06b6d4" name="Ricavi Biglietti" />
            <Bar dataKey="serviceRevenue" fill="#10b981" name="Ricavi Servizi" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default React.memo(CashflowChart);
