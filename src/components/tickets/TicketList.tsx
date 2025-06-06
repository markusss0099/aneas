
import React, { useState } from 'react';
import { Ticket } from '@/types';
import { useTicketActions } from '@/hooks/useTicketActions';
import TicketSearch from './TicketSearch';
import TicketTable from './TicketTable';
import EditTicketDialog from './EditTicketDialog';
import DeleteTicketDialog from './DeleteTicketDialog';
import { debugLog } from '@/lib/debugUtils';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const {
    editingTicket,
    deletingTicketId,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleEdit,
    handleDelete,
    handleEditCancel,
    handleDeleteCancel,
    updateTicketHandler,
    deleteTicketHandler,
    isProcessing,
    resetStates
  } = useTicketActions();

  // Combined loading state
  const isProcessingAll = isLoading || isProcessing;

  // Filter tickets based on search term
  const filteredTickets = tickets.filter(ticket => 
    ticket.eventName.toLowerCase().includes(search.toLowerCase())
  );

  // Handle edit submission by calling the parent's update function
  const handleSubmitEdit = (data: Ticket) => {
    try {
      if (editingTicket) {
        const updatedTicket = { ...data, id: editingTicket.id };
        updateTicketHandler(updatedTicket);
        // Call the parent's update function
        onUpdateTicket(updatedTicket);
      }
    } catch (error) {
      debugLog('Error handling ticket edit submission', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nell'aggiornare il biglietto.",
        variant: "destructive",
      });
    }
  };

  // Handle delete confirmation by calling the parent's delete function
  const confirmDelete = () => {
    try {
      if (deletingTicketId) {
        deleteTicketHandler();
        // Call the parent's delete function
        onDeleteTicket(deletingTicketId);
      }
    } catch (error) {
      debugLog('Error handling ticket deletion', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nell'eliminare il biglietto.",
        variant: "destructive",
      });
    }
  };

  // Handle dialog open changes with proper state management
  const handleEditDialogChange = (open: boolean) => {
    if (!open && !isProcessingAll) {
      handleEditCancel();
      resetStates();
    }
  };

  const handleDeleteDialogChange = (open: boolean) => {
    if (!open && !isProcessingAll) {
      handleDeleteCancel();
      resetStates();
    }
  };

  debugLog('TicketList rendering', { ticketsCount: tickets.length, filteredCount: filteredTickets.length });

  return (
    <>
      <TicketSearch 
        search={search} 
        setSearch={setSearch} 
        isLoading={isProcessingAll}
        isMobile={isMobile}
      />

      <div className={isMobile ? "w-full overflow-auto -mx-0" : ""}>
        <TicketTable 
          tickets={tickets}
          filteredTickets={filteredTickets}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isProcessingAll}
          isMobile={isMobile}
        />
      </div>

      <EditTicketDialog 
        isOpen={isEditDialogOpen}
        setIsOpen={handleEditDialogChange}
        ticket={editingTicket}
        onSubmit={handleSubmitEdit}
        onCancel={handleEditCancel}
        isLoading={isProcessingAll}
      />

      <DeleteTicketDialog 
        isOpen={isDeleteDialogOpen}
        setIsOpen={handleDeleteDialogChange}
        onConfirm={confirmDelete}
        onCancel={handleDeleteCancel}
        isLoading={isProcessingAll}
      />
    </>
  );
};

export default TicketList;
