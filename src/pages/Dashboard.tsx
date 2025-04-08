
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Ticket, BarChart3, CreditCard, PlusCircle, ArrowUp } from 'lucide-react';
import { getFinancialSummary, getCashflowByPeriod } from '@/services/ticket';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import DebugPanel from '@/components/debug/DebugPanel';
import { isDebugEnabled } from '@/lib/debugUtils';
import ServiceSummary from '@/components/dashboard/ServiceSummary';

const Dashboard = () => {
  const navigate = useNavigate();
  const summary = getFinancialSummary();
  const monthlyCashflow = getCashflowByPeriod('month');
  const debugMode = isDebugEnabled();
  
  const summaryCards = [
    {
      title: 'Totale Biglietti',
      value: summary.totalTickets,
      icon: <Ticket className="h-4 w-4" />,
      description: 'Biglietti registrati',
    },
    {
      title: 'Investimento',
      value: formatCurrency(summary.totalInvested),
      icon: <CreditCard className="h-4 w-4" />,
      description: 'Totale speso',
    },
    {
      title: 'Ricavi Attesi',
      value: formatCurrency(summary.totalRevenue),
      description: 'Entrate previste',
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      title: 'Profitto',
      value: formatCurrency(summary.totalProfit),
      description: `Margine: ${summary.profitMargin.toFixed(2)}%`,
      icon: summary.totalProfit >= 0 
        ? <ArrowUpRight className="h-4 w-4 text-success" /> 
        : <ArrowDownRight className="h-4 w-4 text-destructive" />,
      status: summary.totalProfit >= 0 ? 'positive' : 'negative',
    },
    {
      title: 'Servizi Pulling',
      value: summary.totalServices,
      icon: <ArrowUp className="h-4 w-4" />,
      description: 'Servizi registrati',
    },
    {
      title: 'Ricavi Pulling',
      value: formatCurrency(summary.totalServiceRevenue),
      icon: <ArrowUpRight className="h-4 w-4 text-success" />,
      description: 'Ricavi dai servizi',
      status: 'positive',
    },
  ];

  return (
    <div className="animate-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Panoramica della gestione dei flussi finanziari</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <Button 
            onClick={() => navigate('/tickets')}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuovo Biglietto
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/pulling')}
          >
            <ArrowUp className="mr-2 h-4 w-4" />
            Nuovo Servizio
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={cn(
                "rounded-full p-1",
                card.status === 'positive' && "text-success",
                card.status === 'negative' && "text-destructive"
              )}>
                {card.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                data={monthlyCashflow}
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

        <ServiceSummary />
      </div>
      
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
              data={monthlyCashflow}
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
      
      {/* Add the DebugPanel component */}
      <DebugPanel />
    </div>
  );
};

export default Dashboard;
