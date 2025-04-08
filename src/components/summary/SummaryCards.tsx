
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { FinancialSummary } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface SummaryCardsProps {
  summary: FinancialSummary;
}

const SummaryCards = ({ summary }: SummaryCardsProps) => {
  return (
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
  );
};

export default SummaryCards;
