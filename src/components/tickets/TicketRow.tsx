
import React from 'react';
import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from '@/components/ui/table';
import { PenLine, Trash2, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { Ticket } from '@/types';
import { formatCurrency, formatDate, formatQuantity } from '@/lib/utils';
import { 
  calculateTicketProfit, 
  calculateTicketMargin, 
  calculateTicketTotalCost,
  calculateTicketTotalRevenue
} from '@/services/ticket';

interface TicketRowProps {
  ticket: Ticket;
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const TicketRow = ({ ticket, onEdit, onDelete, isLoading }: TicketRowProps) => {
  const profit = calculateTicketProfit(ticket);
  const margin = calculateTicketMargin(ticket);
  const totalCost = calculateTicketTotalCost(ticket);
  const totalRevenue = calculateTicketTotalRevenue(ticket);

  return (
    <TableRow>
      <TableCell className="font-medium">{ticket.eventName}</TableCell>
      <TableCell>{formatDate(ticket.eventDate)}</TableCell>
      <TableCell>{formatQuantity(ticket.quantity)}</TableCell>
      <TableCell>{formatCurrency(totalRevenue)}</TableCell>
      <TableCell>{formatCurrency(totalCost)}</TableCell>
      <TableCell>
        <div className="flex items-center">
          {profit >= 0 ? (
            <ArrowUpRight className="mr-1 h-4 w-4 text-success" />
          ) : (
            <ArrowDownRight className="mr-1 h-4 w-4 text-destructive" />
          )}
          {formatCurrency(profit)}
        </div>
      </TableCell>
      <TableCell>
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          margin >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
        }`}>
          {margin.toFixed(2)}%
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(ticket)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PenLine className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-destructive"
            onClick={() => onDelete(ticket.id)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TicketRow;
