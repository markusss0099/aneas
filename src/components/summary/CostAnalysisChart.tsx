
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Ticket } from '@/types';

interface CostAnalysisChartProps {
  tickets: Ticket[];
}

const CostAnalysisChart = ({ tickets }: CostAnalysisChartProps) => {
  // Dati per il grafico a torta dei costi
  const costData = [
    { name: 'Prezzo Biglietti', value: tickets.reduce((sum, t) => sum + (t.ticketPrice * t.quantity), 0) },
    { name: 'Costi Aggiuntivi', value: tickets.reduce((sum, t) => sum + (t.additionalCosts * t.quantity), 0) },
  ];

  // Colori per i grafici
  const COLORS = ['#1e3a8a', '#06b6d4'];

  // Funzione per formattare i dati nei tooltip dei grafici
  const formatPieChartTooltip = (value: number, name: string) => [
    `€${value.toFixed(2)}`, name
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuzione Costi</CardTitle>
        <CardDescription>
          Suddivisione dei costi tra biglietti e spese aggiuntive
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        {costData.some(item => item.value > 0) ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={costData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {costData.map((entry, index) => (
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

export default CostAnalysisChart;
