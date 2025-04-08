import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { 
  getCashflowByPeriod, 
  getFinancialSummary, 
  getTickets, 
  calculateTicketTotalCost,
  calculateTicketTotalRevenue,
  calculateTicketProfit
} from '@/services/ticket';
import { formatCurrency, formatDate, formatQuantity } from '@/lib/utils';
import { Period } from '@/types';
import ServiceSummarySection from '@/components/summary/ServiceSummarySection';

const SummaryPage = () => {
  const [period, setPeriod] = useState<Period>('month');
  const tickets = getTickets();
  const summary = getFinancialSummary();
  const cashflowData = getCashflowByPeriod(period);

  // Dati per il grafico a torta dei costi
  const costData = [
    { name: 'Prezzo Biglietti', value: tickets.reduce((sum, t) => sum + (t.ticketPrice * t.quantity), 0) },
    { name: 'Costi Aggiuntivi', value: tickets.reduce((sum, t) => sum + (t.additionalCosts * t.quantity), 0) },
  ];

  // Dati per il grafico a torta del profitto vs investimento
  const profitData = [
    { name: 'Investimento', value: summary.totalInvested },
    { name: 'Profitto', value: Math.max(0, summary.totalProfit) }, // Mostra solo il profitto positivo
  ];

  // Colori per i grafici
  const COLORS = ['#1e3a8a', '#06b6d4', '#10b981', '#f59e0b'];

  // Mostra solo gli ultimi 5 periodi per il cashflow
  const recentCashflow = [...cashflowData].reverse().slice(0, 5).reverse();

  // Ordina i biglietti per data evento (più recenti per primi)
  const sortedTickets = [...tickets].sort((a, b) => b.eventDate.getTime() - a.eventDate.getTime());
  
  // Prendi solo i 5 biglietti più recenti
  const recentTickets = sortedTickets.slice(0, 5);

  // Funzione per formattare i dati nei tooltip dei grafici
  const formatPieChartTooltip = (value: number, name: string) => [
    `€${value.toFixed(2)}`, name
  ];

  return (
    <div className="animate-in space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Sommario</h1>
        <p className="text-muted-foreground">
          Panoramica generale delle finanze e degli eventi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Totale Biglietti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalTickets}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Biglietti registrati
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Investimento Totale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalInvested)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Costo di tutti i biglietti
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Ricavi Previsti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Totale entrate attese
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Profitto Netto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {summary.totalProfit >= 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-success" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-destructive" />
              )}
              <span className={`text-2xl font-bold ${
                summary.totalProfit >= 0 ? 'text-success' : 'text-destructive'
              }`}>
                {formatCurrency(summary.totalProfit)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Margine: {summary.profitMargin.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Totale Servizi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalServices}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Servizi registrati
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Ricavi Servizi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4 text-success" />
              <span className="text-2xl font-bold text-success">
                {formatCurrency(summary.totalServiceRevenue)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Guadagni da servizi
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <Cell key={`cell-${index}`} fill={COLORS[index + 2 % COLORS.length]} />
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
      </div>

      <Tabs defaultValue="recent-tickets">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent-tickets">Eventi Recenti</TabsTrigger>
          <TabsTrigger value="services">Servizi Pulling</TabsTrigger>
          <TabsTrigger value="cashflow">Cashflow Recente</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent-tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eventi Recenti</CardTitle>
              <CardDescription>
                Gli ultimi eventi aggiunti al sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evento</TableHead>
                    <TableHead>Data Evento</TableHead>
                    <TableHead>Quantità</TableHead>
                    <TableHead>Pagamento Previsto</TableHead>
                    <TableHead>Costo Totale</TableHead>
                    <TableHead>Ricavo Totale</TableHead>
                    <TableHead>Profitto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Nessun evento recente trovato.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentTickets.map((ticket) => {
                      const totalCost = calculateTicketTotalCost(ticket);
                      const totalRevenue = calculateTicketTotalRevenue(ticket);
                      const profit = calculateTicketProfit(ticket);
                      
                      return (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">
                            {ticket.eventName}
                          </TableCell>
                          <TableCell>{formatDate(ticket.eventDate)}</TableCell>
                          <TableCell>{formatQuantity(ticket.quantity)}</TableCell>
                          <TableCell>{formatDate(ticket.expectedPaymentDate)}</TableCell>
                          <TableCell>{formatCurrency(totalCost)}</TableCell>
                          <TableCell>{formatCurrency(totalRevenue)}</TableCell>
                          <TableCell>
                            <Badge variant={profit >= 0 ? "outline" : "destructive"}>
                              {formatCurrency(profit)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services" className="space-y-4">
          <ServiceSummarySection />
        </TabsContent>
        
        <TabsContent value="cashflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cashflow Recente</CardTitle>
              <CardDescription>
                Andamento recente dei flussi finanziari
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Periodo</TableHead>
                    <TableHead>Investimento</TableHead>
                    <TableHead>Ricavi Biglietti</TableHead>
                    <TableHead>Ricavi Servizi</TableHead>
                    <TableHead>Profitto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCashflow.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Nessun dato di cashflow disponibile.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentCashflow.map((flow, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{flow.period}</TableCell>
                        <TableCell>{formatCurrency(flow.invested)}</TableCell>
                        <TableCell>{formatCurrency(flow.revenue)}</TableCell>
                        <TableCell>{formatCurrency(flow.serviceRevenue)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {flow.profit >= 0 ? (
                              <ArrowUpRight className="mr-1 h-4 w-4 text-success" />
                            ) : (
                              <ArrowDownRight className="mr-1 h-4 w-4 text-destructive" />
                            )}
                            <span className={flow.profit >= 0 ? 'text-success' : 'text-destructive'}>
                              {formatCurrency(flow.profit)}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SummaryPage;
