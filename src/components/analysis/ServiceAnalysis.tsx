
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Period } from '@/types';
import { getServiceRevenueByPeriod } from '@/services/serviceService';
import { Loader2 } from 'lucide-react';

interface ServiceAnalysisProps {
  period: Period;
}

const ServiceAnalysis = ({ period }: ServiceAnalysisProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const revenueByPeriod = await getServiceRevenueByPeriod(period);
        
        // Converte l'oggetto in un array per il grafico
        const dataArray = Object.entries(revenueByPeriod).map(([period, revenue]) => ({
          period,
          revenue,
        }));
        
        // Ordina i dati per periodo
        const sortedArray = [...dataArray].sort((a, b) => a.period.localeCompare(b.period));
        setChartData(sortedArray);
      } catch (error) {
        console.error('Error fetching service revenue by period:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [period]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analisi Ricavi Servizi</CardTitle>
        <CardDescription>
          Guadagni dai servizi per periodo
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Caricamento dati...</span>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
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
