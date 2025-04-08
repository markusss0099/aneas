
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { Ticket } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import ViagogoPrice from './ViagogoPrice';

interface TicketRowProps {
  ticket: Ticket;
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  isMobile?: boolean;
}

const TicketRow = ({ ticket, onEdit, onDelete, isLoading, isMobile = false }: TicketRowProps) => {
  // Calculate total cost based on ticketPrice, additionalCosts and quantity
  const totalCost = (ticket.ticketPrice + ticket.additionalCosts) * ticket.quantity;
  const profit = ticket.expectedRevenue - totalCost;
  const margin = ticket.expectedRevenue > 0 
    ? ((profit / ticket.expectedRevenue) * 100).toFixed(1) 
    : '0';

  return (
    <TableRow key={ticket.id}>
      <TableCell className={isMobile ? "px-2 py-2 text-xs font-medium truncate max-w-[90px]" : ""}>
        {ticket.eventName}
      </TableCell>
      <TableCell className={isMobile ? "px-2 py-2 text-xs truncate whitespace-nowrap" : ""}>
        {formatDate(new Date(ticket.eventDate))}
      </TableCell>
      {!isMobile && <TableCell>{ticket.quantity}</TableCell>}
      {!isMobile && <TableCell>{formatCurrency(ticket.expectedRevenue)}</TableCell>}
      {!isMobile && <TableCell>{formatCurrency(totalCost)}</TableCell>}
      <TableCell className={isMobile ? "px-2 py-2 text-xs font-semibold" : ""}>
        <span className={profit > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
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
      {!isMobile && (
        <TableCell>
          <ViagogoPrice link={ticket.viagogoLink} />
        </TableCell>
      )}
      <TableCell className={`text-right ${isMobile ? "px-2 py-1 space-x-1" : ""}`}>
        <div className={`flex justify-end ${isMobile ? "gap-1" : "gap-2"}`}>
          {isMobile && ticket.viagogoLink && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              asChild
            >
              <a 
                href={ticket.viagogoLink} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3" />
                <span className="sr-only">Viagogo</span>
              </a>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(ticket)}
            disabled={isLoading}
            className={isMobile ? "h-7 w-7 p-0" : ""}
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Pencil className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
            )}
            <span className="sr-only">Modifica</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(ticket.id)}
            disabled={isLoading}
            className={isMobile ? "h-7 w-7 p-0" : ""}
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Trash2 className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
            )}
            <span className="sr-only">Elimina</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TicketRow;
