
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FinancialSummary } from '@/types';

interface ProfitAnalysisChartProps {
  summary: FinancialSummary;
}

const ProfitAnalysisChart = ({ summary }: ProfitAnalysisChartProps) => {
  // Dati per il grafico a torta del profitto vs investimento
  const profitData = [
    { name: 'Investimento', value: summary.totalInvested },
    { name: 'Profitto', value: Math.max(0, summary.totalProfit) }, // Mostra solo il profitto positivo
  ];

  // Colori per i grafici
  const COLORS = ['#10b981', '#f59e0b'];

  // Funzione per formattare i dati nei tooltip dei grafici
  const formatPieChartTooltip = (value: number, name: string) => [
    `€${value.toFixed(2)}`, name
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investimento vs Profitto</CardTitle>
        <CardDescription>
          Rapporto tra investimento e profitto atteso
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        {profitData.some(item => item.value > 0) ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={profitData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {profitData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatPieChartTooltip} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-muted-foreground">Nessun dato disponibile</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfitAnalysisChart;
