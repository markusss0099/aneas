
import React from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TicketRow from './TicketRow';
import { Ticket } from '@/types';
import { Loader2 } from 'lucide-react';

interface TicketTableProps {
  tickets: Ticket[];
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  isMobile?: boolean;
}

const TicketTable = ({ tickets, onEdit, onDelete, isLoading, isMobile = false }: TicketTableProps) => {
  if (isLoading && tickets.length === 0) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nessun biglietto trovato.
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={isMobile ? "px-2 py-2" : ""}>Evento</TableHead>
            <TableHead className={isMobile ? "px-2 py-2" : ""}>Data</TableHead>
            {!isMobile && <TableHead>Quantità</TableHead>}
            {!isMobile && <TableHead>Ricavi</TableHead>}
            {!isMobile && <TableHead>Costi</TableHead>}
            <TableHead className={isMobile ? "px-2 py-2" : ""}>Profitto</TableHead>
            {!isMobile && <TableHead>Margine</TableHead>}
            {!isMobile && <TableHead>Viagogo</TableHead>}
            <TableHead className={`text-right ${isMobile ? "px-2 py-2" : ""}`}>Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              onEdit={onEdit}
              onDelete={onDelete}
              isLoading={isLoading}
              isMobile={isMobile}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TicketTable;
