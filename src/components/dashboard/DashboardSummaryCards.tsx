
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Ticket, BarChart3, CreditCard, AlertCircle, ArrowUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { FinancialSummary } from '@/types';

interface DashboardSummaryCardsProps {
  summary: FinancialSummary;
}

const DashboardSummaryCards = ({ summary }: DashboardSummaryCardsProps) => {
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
      title: 'Biglietti Non Venduti',
      value: summary.zeroRevenueTickets,
      icon: <AlertCircle className="h-4 w-4 text-amber-500" />,
      description: `Investimento in sospeso: ${formatCurrency(summary.zeroRevenueInvestment)}`,
      status: 'warning',
    },
    {
      title: 'Profitto Effettivo',
      value: formatCurrency(summary.actualProfit),
      icon: <ArrowUpRight className="h-4 w-4 text-success" />,
      description: 'Solo da biglietti venduti',
      status: 'positive',
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <div className={cn(
              "rounded-full p-1",
              card.status === 'positive' && "text-success",
              card.status === 'negative' && "text-destructive", 
              card.status === 'warning' && "text-amber-500"
            )}>
              {card.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              card.status === 'positive' && "text-success",
              card.status === 'negative' && "text-destructive",
              card.status === 'warning' && "text-amber-500"
            )}>
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default React.memo(DashboardSummaryCards);
