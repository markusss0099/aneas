
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
import { Badge } from '@/components/ui/badge';
import { Ticket } from '@/types';
import { formatCurrency, formatDate, formatQuantity } from '@/lib/utils';
import { calculateTicketTotalCost, calculateTicketTotalRevenue, calculateTicketProfit, calculateTicketMargin } from '@/services/ticket';

interface RecentEventsTabProps {
  tickets: Ticket[];
}

const RecentEventsTab = ({ tickets }: RecentEventsTabProps) => {
  // Ordina i biglietti per data evento (più recenti per primi)
  const sortedTickets = [...tickets].sort((a, b) => b.eventDate.getTime() - a.eventDate.getTime());
  
  // Prendi solo i 5 biglietti più recenti
  const recentTickets = sortedTickets.slice(0, 5);

  return (
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
                const margin = calculateTicketMargin(ticket);
                
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
  );
};

export default RecentEventsTab;
