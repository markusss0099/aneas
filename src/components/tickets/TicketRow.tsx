
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { Ticket } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface TicketRowProps {
  ticket: Ticket;
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  isMobile?: boolean;
}

const TicketRow = ({ ticket, onEdit, onDelete, isLoading, isMobile = false }: TicketRowProps) => {
  const profit = ticket.expectedRevenue - ticket.totalCost;
  const margin = ticket.expectedRevenue > 0 
    ? ((profit / ticket.expectedRevenue) * 100).toFixed(1) 
    : '0';

  return (
    <TableRow key={ticket.id}>
      <TableCell className={isMobile ? "px-2 py-2 font-medium truncate max-w-[100px]" : ""}>
        {ticket.eventName}
      </TableCell>
      <TableCell className={isMobile ? "px-2 py-2 truncate whitespace-nowrap" : ""}>
        {formatDate(new Date(ticket.eventDate))}
      </TableCell>
      {!isMobile && <TableCell>{ticket.quantity}</TableCell>}
      {!isMobile && <TableCell>{formatCurrency(ticket.expectedRevenue)}</TableCell>}
      {!isMobile && <TableCell>{formatCurrency(ticket.totalCost)}</TableCell>}
      <TableCell className={isMobile ? "px-2 py-2 font-semibold" : ""}>
        <span className={profit > 0 ? 'text-green-600' : 'text-red-600'}>
          {formatCurrency(profit)}
        </span>
      </TableCell>
      {!isMobile && (
        <TableCell>
          <span className={profit > 0 ? 'text-green-600' : 'text-red-600'}>
            {margin}%
          </span>
        </TableCell>
      )}
      <TableCell className={`text-right ${isMobile ? "px-2 py-2" : ""}`}>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size={isMobile ? "sm" : "icon"}
            onClick={() => onEdit(ticket)}
            disabled={isLoading}
            className={isMobile ? "h-8 w-8 p-0" : ""}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Pencil className="h-4 w-4" />
            )}
            <span className="sr-only">Modifica</span>
          </Button>
          <Button
            variant="outline"
            size={isMobile ? "sm" : "icon"}
            onClick={() => onDelete(ticket.id)}
            disabled={isLoading}
            className={isMobile ? "h-8 w-8 p-0" : ""}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span className="sr-only">Elimina</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TicketRow;
