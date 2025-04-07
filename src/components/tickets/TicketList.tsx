
import React, { useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MoreHorizontal, 
  PenLine, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search,
  Loader2
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  calculateTicketProfit, 
  calculateTicketMargin, 
  calculateTicketTotalCost,
  calculateTicketTotalRevenue
} from '@/services/ticketService';
import { Ticket } from '@/types';
import { formatCurrency, formatDate, formatQuantity } from '@/lib/utils';
import TicketForm from './TicketForm';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { debugLog } from '@/lib/debugUtils';

interface TicketListProps {
  tickets: Ticket[];
  onUpdateTicket: (ticket: Ticket) => void;
  onDeleteTicket: (id: string) => void;
  isLoading?: boolean;
}

const TicketList = ({ 
  tickets, 
  onUpdateTicket, 
  onDeleteTicket, 
  isLoading = false 
}: TicketListProps) => {
  const [search, setSearch] = useState('');
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  // Combined loading state
  const isProcessing = isLoading || localLoading;

  const filteredTickets = tickets.filter(ticket => 
    ticket.eventName.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = useCallback((ticket: Ticket) => {
    if (isProcessing) return;
    setEditingTicket(ticket);
    setIsEditDialogOpen(true);
    debugLog('Editing ticket', ticket);
  }, [isProcessing]);

  const handleDelete = useCallback((id: string) => {
    if (isProcessing) return;
    setDeletingTicketId(id);
    setIsDeleteDialogOpen(true);
    debugLog('Deleting ticket', { id });
  }, [isProcessing]);

  const handleEditCancel = useCallback(() => {
    if (isProcessing) return;
    setEditingTicket(null);
    setIsEditDialogOpen(false);
  }, [isProcessing]);

  const handleDeleteCancel = useCallback(() => {
    if (isProcessing) return;
    setDeletingTicketId(null);
    setIsDeleteDialogOpen(false);
  }, [isProcessing]);

  const confirmDelete = useCallback(() => {
    if (!deletingTicketId || isProcessing) return;
    
    setLocalLoading(true);
    try {
      onDeleteTicket(deletingTicketId);
      // Clean up local state
      setDeletingTicketId(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      debugLog('Error in TicketList confirmDelete', error);
    } finally {
      // Delay setting loading to false to ensure UI updates properly
      setTimeout(() => {
        setLocalLoading(false);
      }, 100);
    }
  }, [deletingTicketId, isProcessing, onDeleteTicket]);

  const handleSubmitEdit = useCallback((data: Ticket) => {
    if (!editingTicket || isProcessing) return;
    
    setLocalLoading(true);
    try {
      onUpdateTicket({ ...data, id: editingTicket.id });
      // Clean up local state
      setEditingTicket(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      debugLog('Error in TicketList handleSubmitEdit', error);
    } finally {
      // Delay setting loading to false to ensure UI updates properly
      setTimeout(() => {
        setLocalLoading(false);
      }, 100);
    }
  }, [editingTicket, isProcessing, onUpdateTicket]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca biglietti..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
            disabled={isProcessing}
          />
        </div>
        {isProcessing && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Elaborazione in corso...
          </div>
        )}
      </div>

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
                  {isProcessing 
                    ? 'Caricamento biglietti...' 
                    : 'Nessun biglietto trovato.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredTickets.map((ticket) => {
                const profit = calculateTicketProfit(ticket);
                const margin = calculateTicketMargin(ticket);
                const totalCost = calculateTicketTotalCost(ticket);
                const totalRevenue = calculateTicketTotalRevenue(ticket);
                
                return (
                  <TableRow key={ticket.id}>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={isProcessing}>
                            {isProcessing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                            <span className="sr-only">Apri menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleEdit(ticket)}
                            disabled={isProcessing}
                          >
                            <PenLine className="mr-2 h-4 w-4" />
                            Modifica
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(ticket.id)}
                            className="text-destructive focus:text-destructive"
                            disabled={isProcessing}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Elimina
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal di modifica biglietto */}
      <Dialog 
        open={isEditDialogOpen} 
        onOpenChange={(open) => {
          if (!isProcessing) setIsEditDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifica Biglietto</DialogTitle>
          </DialogHeader>
          {editingTicket && (
            <TicketForm
              initialData={editingTicket}
              onSubmit={handleSubmitEdit}
              onCancel={handleEditCancel}
              isLoading={isProcessing}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Alert dialog per conferma eliminazione */}
      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={(open) => {
          if (!isProcessing) setIsDeleteDialogOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro di voler eliminare questo biglietto?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. Tutti i dati relativi a questo biglietto verranno eliminati permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={handleDeleteCancel}
              disabled={isProcessing}
            >
              Annulla
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminazione...
                </>
              ) : (
                'Elimina'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TicketList;
