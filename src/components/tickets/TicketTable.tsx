
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
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evento</TableHead>
            <TableHead>Data Evento</TableHead>
            <TableHead>Quantità</TableHead>
            <TableHead>Incasso Previsto</TableHead>
            <TableHead>Costo Totale</TableHead>
            <TableHead>Profitto</TableHead>
            <TableHead>Margine</TableHead>
            <TableHead className="text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
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
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TicketTable;
