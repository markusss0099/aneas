
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Ticket } from '@/types';
import { addTicket, updateTicket, deleteTicket } from '@/services/ticket';
import { debugLog } from '@/lib/debugUtils';

export const useTicketActions = () => {
  const [isAddingTicket, setIsAddingTicket] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Mutation for adding a ticket
  const addTicketMutation = useMutation({
    mutationFn: (ticketData: Omit<Ticket, 'id'>) => {
      debugLog('Starting ticket addition', ticketData);
      return addTicket(ticketData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setIsAddingTicket(false);
      
      toast({
        title: "Biglietto aggiunto",
        description: "Il biglietto è stato aggiunto con successo.",
      });
    },
    onError: (error: any) => {
      debugLog("Errore nell'aggiungere il biglietto:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nell'aggiungere il biglietto.",
        variant: "destructive",
      });
    }
  });
  
  // Mutation for updating a ticket
  const updateTicketMutation = useMutation({
    mutationFn: (updatedTicket: Ticket) => {
      debugLog('Starting ticket update', updatedTicket);
      return updateTicket(updatedTicket);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setEditingTicket(null);
      setIsEditDialogOpen(false);
      
      toast({
        title: "Biglietto aggiornato",
        description: "Il biglietto è stato aggiornato con successo.",
      });
    },
    onError: (error: any) => {
      debugLog("Errore nell'aggiornare il biglietto:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nell'aggiornare il biglietto.",
        variant: "destructive",
      });
    }
  });
  
  // Mutation for deleting a ticket
  const deleteTicketMutation = useMutation({
    mutationFn: (id: string) => {
      debugLog('Starting ticket deletion', { id });
      return deleteTicket(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setDeletingTicketId(null);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Biglietto eliminato",
        description: "Il biglietto è stato eliminato con successo.",
      });
    },
    onError: (error: any) => {
      debugLog("Errore nell'eliminare il biglietto:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nell'eliminare il biglietto.",
        variant: "destructive",
      });
    }
  });
  
  const handleEdit = useCallback((ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsEditDialogOpen(true);
  }, []);
  
  const handleDelete = useCallback((id: string) => {
    setDeletingTicketId(id);
    setIsDeleteDialogOpen(true);
  }, []);
  
  const handleEditCancel = useCallback(() => {
    setEditingTicket(null);
    setIsEditDialogOpen(false);
  }, []);
  
  const handleDeleteCancel = useCallback(() => {
    setDeletingTicketId(null);
    setIsDeleteDialogOpen(false);
  }, []);
  
  const handleAddTicket = useCallback((ticketData: Omit<Ticket, 'id'>) => {
    debugLog('Handling add ticket', ticketData);
    addTicketMutation.mutate(ticketData);
  }, [addTicketMutation]);
  
  const handleUpdateTicket = useCallback((updatedTicket: Ticket) => {
    debugLog('Handling update ticket', updatedTicket);
    updateTicketMutation.mutate(updatedTicket);
  }, [updateTicketMutation]);
  
  const handleDeleteTicket = useCallback((id: string) => {
    debugLog('Handling delete ticket', { id });
    deleteTicketMutation.mutate(id);
  }, [deleteTicketMutation]);
  
  const updateTicketHandler = useCallback((ticket: Ticket) => {
    if (editingTicket) {
      handleUpdateTicket(ticket);
    }
  }, [editingTicket, handleUpdateTicket]);
  
  const deleteTicketHandler = useCallback(() => {
    if (deletingTicketId) {
      handleDeleteTicket(deletingTicketId);
    }
  }, [deletingTicketId, handleDeleteTicket]);
  
  return {
    isAddingTicket,
    setIsAddingTicket,
    editingTicket,
    deletingTicketId,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleEdit,
    handleDelete,
    handleEditCancel,
    handleDeleteCancel,
    addTicketMutation,
    updateTicketMutation,
    deleteTicketMutation,
    handleAddTicket,
    handleUpdateTicket,
    handleDeleteTicket,
    updateTicketHandler,
    deleteTicketHandler,
    isProcessing: addTicketMutation.isPending || 
                  updateTicketMutation.isPending || 
                  deleteTicketMutation.isPending
  };
};
