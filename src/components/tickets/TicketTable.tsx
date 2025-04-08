
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Ticket } from '@/types';
import TicketRow from './TicketRow';
import { useIsMobile } from '@/hooks/use-mobile';

interface TicketTableProps {
  tickets: Ticket[];
  filteredTickets: Ticket[];
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const TicketTable = ({ 
  tickets, 
  filteredTickets, 
  onEdit, 
  onDelete, 
  isLoading 
}: TicketTableProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={isMobile ? "px-2 py-2" : ""}>Evento</TableHead>
            <TableHead className={isMobile ? "px-2 py-2" : ""}>Data Evento</TableHead>
            {!isMobile && <TableHead>Quantità</TableHead>}
            {!isMobile && <TableHead>Incasso Previsto</TableHead>}
            {!isMobile && <TableHead>Costo Totale</TableHead>}
            <TableHead className={isMobile ? "px-2 py-2" : ""}>Profitto</TableHead>
            {!isMobile && <TableHead>Margine</TableHead>}
            <TableHead className={`text-right ${isMobile ? "px-2 py-2" : ""}`}>Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isMobile ? 4 : 8} className="h-24 text-center">
                {isLoading 
                  ? 'Caricamento biglietti...' 
                  : 'Nessun biglietto trovato.'}
              </TableCell>
            </TableRow>
          ) : (
            filteredTickets.map((ticket) => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                onEdit={onEdit}
                onDelete={onDelete}
                isLoading={isLoading}
                isMobile={isMobile}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TicketTable;
