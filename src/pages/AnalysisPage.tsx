
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { getCashflowByPeriod, getFinancialSummary } from '@/services/ticketService';
import { CashflowByPeriod, Period } from '@/types';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 border rounded-md shadow-lg">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center">
            <div
              className="w-3 h-3 mr-1 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span>{`${item.name}: €${item.value.toFixed(2)}`}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const AnalysisPage = () => {
  const [period, setPeriod] = useState<Period>('month');
  const cashflowData = getCashflowByPeriod(period);
  const summary = getFinancialSummary();

  // Calcoliamo il cashflow cumulativo
  const cumulativeData = cashflowData.reduce((acc: CashflowByPeriod[], current) => {
    const prevCumulative = acc.length > 0 ? acc[acc.length - 1] : { invested: 0, revenue: 0, profit: 0 };
    
    const newCumulative = {
      period: current.period,
      invested: prevCumulative.invested + current.invested,
      revenue: prevCumulative.revenue + current.revenue,
      profit: prevCumulative.profit + current.profit,
    };
    
    return [...acc, newCumulative];
  }, [] as CashflowByPeriod[]);

  return (
    <div className="animate-in space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Analisi Finanziaria</h1>
        <p className="text-muted-foreground">
          Analisi dettagliata del flusso di cassa e statistiche finanziarie
        </p>
      </div>

      <Tabs defaultValue="month" onValueChange={(value) => setPeriod(value as Period)}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="week">Settimanale</TabsTrigger>
          <TabsTrigger value="month">Mensile</TabsTrigger>
          <TabsTrigger value="quarter">Trimestrale</TabsTrigger>
          <TabsTrigger value="year">Annuale</TabsTrigger>
        </TabsList>

        {['week', 'month', 'quarter', 'year'].map((p) => (
          <TabsContent key={p} value={p} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Flusso di Cassa per Periodo</CardTitle>
                  <CardDescription>
                    Investimenti e ricavi per ogni periodo
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={cashflowData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="invested" name="Investimenti" fill="#1e3a8a" />
                      <Bar dataKey="revenue" name="Ricavi" fill="#06b6d4" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Andamento Profitto</CardTitle>
                  <CardDescription>
                    Profitto netto per ogni periodo
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={cashflowData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        name="Profitto"
                        stroke="#10b981"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Cashflow Cumulativo</CardTitle>
                <CardDescription>
                  Andamento cumulativo degli investimenti, ricavi e profitti
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={cumulativeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="invested"
                      name="Investimenti Cumulativi"
                      stackId="1"
                      stroke="#1e3a8a"
                      fill="#1e3a8a"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Ricavi Cumulativi"
                      stackId="2"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      name="Profitto Cumulativo"
                      stackId="3"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Investimento Totale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    €{summary.totalInvested.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Totale investito fino ad oggi
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ricavi Previsti
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    €{summary.totalRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Totale ricavi attesi
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Profitto Netto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${
                    summary.totalProfit >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    €{summary.totalProfit.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Margine: {summary.profitMargin.toFixed(2)}%
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AnalysisPage;
