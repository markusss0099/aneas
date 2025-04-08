
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
    isLoading: localLoading,
    editingTicket,
    deletingTicketId,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleEdit,
    handleDelete,
    handleEditCancel,
    handleDeleteCancel,
    updateTicketHandler,
    deleteTicketHandler
  } = useTicketActions();

  // Combined loading state
  const isProcessing = isLoading || localLoading;

  // Filter tickets based on search term
  const filteredTickets = tickets.filter(ticket => 
    ticket.eventName.toLowerCase().includes(search.toLowerCase())
  );

  // Handle edit submission by calling the parent's update function
  const handleSubmitEdit = (data: Ticket) => {
    updateTicketHandler(data);
    // Call the parent's update function
    if (editingTicket) {
      onUpdateTicket({ ...data, id: editingTicket.id });
    }
  };

  // Handle delete confirmation by calling the parent's delete function
  const confirmDelete = () => {
    deleteTicketHandler();
    // Call the parent's delete function
    if (deletingTicketId) {
      onDeleteTicket(deletingTicketId);
    }
  };

  debugLog('TicketList rendering', { ticketsCount: tickets.length, filteredCount: filteredTickets.length });

  return (
    <>
      <TicketSearch 
        search={search} 
        setSearch={setSearch} 
        isLoading={isProcessing} 
      />

      <TicketTable 
        tickets={tickets}
        filteredTickets={filteredTickets}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isProcessing}
      />

      <EditTicketDialog 
        isOpen={isEditDialogOpen}
        setIsOpen={(open) => !isProcessing && !open && handleEditCancel()}
        ticket={editingTicket}
        onSubmit={handleSubmitEdit}
        onCancel={handleEditCancel}
        isLoading={isProcessing}
      />

      <DeleteTicketDialog 
        isOpen={isDeleteDialogOpen}
        setIsOpen={(open) => !isProcessing && !open && handleDeleteCancel()}
        onConfirm={confirmDelete}
        onCancel={handleDeleteCancel}
        isLoading={isProcessing}
      />
    </>
  );
};

export default TicketList;
