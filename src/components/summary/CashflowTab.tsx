
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CashflowByPeriod } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CashflowTabProps {
  cashflowData: CashflowByPeriod[];
}

const CashflowTab = ({ cashflowData }: CashflowTabProps) => {
  // Mostra solo gli ultimi 5 periodi per il cashflow
  const recentCashflow = [...cashflowData].reverse().slice(0, 5).reverse();

  return (
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
  );
};

export default CashflowTab;
