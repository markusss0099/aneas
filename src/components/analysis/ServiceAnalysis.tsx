
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Period } from '@/types';
import { getServiceRevenueByPeriod } from '@/services/serviceService';

interface ServiceAnalysisProps {
  period: Period;
}

const ServiceAnalysis = ({ period }: ServiceAnalysisProps) => {
  const revenueByPeriod = getServiceRevenueByPeriod(period);

  // Converte l'oggetto in un array per il grafico
  const chartData = Object.entries(revenueByPeriod).map(([period, revenue]) => ({
    period,
    revenue,
  }));

  // Ordina i dati per periodo
  const sortedData = [...chartData].sort((a, b) => a.period.localeCompare(b.period));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analisi Ricavi Servizi</CardTitle>
        <CardDescription>
          Guadagni dai servizi per periodo
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {sortedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`€${value}`, 'Ricavo']}
                labelFormatter={(value) => `Periodo: ${value}`}
              />
              <Bar dataKey="revenue" name="Ricavi Servizi" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Nessun dato disponibile per il periodo selezionato
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceAnalysis;
