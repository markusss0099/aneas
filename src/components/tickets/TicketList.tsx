
import React, { useState } from 'react';
import { Ticket } from '@/types';
import { useTicketActions } from '@/hooks/useTicketActions';
import TicketSearch from './TicketSearch';
import TicketTable from './TicketTable';
import EditTicketDialog from './EditTicketDialog';
import DeleteTicketDialog from './DeleteTicketDialog';
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
    isProcessing
  } = useTicketActions();

  // Combined loading state
  const isProcessingAll = isLoading || isProcessing;

  // Filter tickets based on search term
  const filteredTickets = tickets.filter(ticket => 
    ticket.eventName.toLowerCase().includes(search.toLowerCase())
  );

  // Handle edit submission by calling the parent's update function
  const handleSubmitEdit = (data: Ticket) => {
    if (editingTicket) {
      const updatedTicket = { ...data, id: editingTicket.id };
      updateTicketHandler(updatedTicket);
      // Call the parent's update function
      onUpdateTicket(updatedTicket);
    }
  };

  // Handle delete confirmation by calling the parent's delete function
  const confirmDelete = () => {
    if (deletingTicketId) {
      deleteTicketHandler();
      // Call the parent's delete function
      onDeleteTicket(deletingTicketId);
    }
  };

  debugLog('TicketList rendering', { ticketsCount: tickets.length, filteredCount: filteredTickets.length });

  return (
    <>
      <TicketSearch 
        search={search} 
        setSearch={setSearch} 
        isLoading={isProcessingAll} 
      />

      <TicketTable 
        tickets={tickets}
        filteredTickets={filteredTickets}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isProcessingAll}
      />

      <EditTicketDialog 
        isOpen={isEditDialogOpen}
        setIsOpen={(open) => !isProcessingAll && !open && handleEditCancel()}
        ticket={editingTicket}
        onSubmit={handleSubmitEdit}
        onCancel={handleEditCancel}
        isLoading={isProcessingAll}
      />

      <DeleteTicketDialog 
        isOpen={isDeleteDialogOpen}
        setIsOpen={(open) => !isProcessingAll && !open && handleDeleteCancel()}
        onConfirm={confirmDelete}
        onCancel={handleDeleteCancel}
        isLoading={isProcessingAll}
      />
    </>
  );
};

export default TicketList;
