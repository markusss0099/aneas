
import { useState, useCallback } from 'react';
import { Ticket } from '@/types';
import { updateTicket, deleteTicket } from '@/services/ticket';
import { useToast } from '@/hooks/use-toast';
import { debugLog } from '@/lib/debugUtils';

export const useTicketActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEdit = useCallback((ticket: Ticket) => {
    if (isLoading) return;
    setEditingTicket(ticket);
    setIsEditDialogOpen(true);
    debugLog('Editing ticket', ticket);
  }, [isLoading]);

  const handleDelete = useCallback((id: string) => {
    if (isLoading) return;
    setDeletingTicketId(id);
    setIsDeleteDialogOpen(true);
    debugLog('Deleting ticket', { id });
  }, [isLoading]);

  const handleEditCancel = useCallback(() => {
    if (isLoading) return;
    setEditingTicket(null);
    setIsEditDialogOpen(false);
  }, [isLoading]);

  const handleDeleteCancel = useCallback(() => {
    if (isLoading) return;
    setDeletingTicketId(null);
    setIsDeleteDialogOpen(false);
  }, [isLoading]);

  const updateTicketHandler = useCallback(async (data: Ticket) => {
    if (!editingTicket || isLoading) return;
    
    setIsLoading(true);
    try {
      await updateTicket({ ...data, id: editingTicket.id });
      // Clean up local state
      setEditingTicket(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Biglietto aggiornato",
        description: "Il biglietto è stato aggiornato con successo."
      });
    } catch (error) {
      debugLog('Error in updateTicketHandler', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento del biglietto.",
        variant: "destructive"
      });
    } finally {
      // Delay setting loading to false to ensure UI updates properly
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  }, [editingTicket, isLoading, toast]);

  const deleteTicketHandler = useCallback(async () => {
    if (!deletingTicketId || isLoading) return;
    
    setIsLoading(true);
    try {
      await deleteTicket(deletingTicketId);
      // Clean up local state
      setDeletingTicketId(null);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Biglietto eliminato",
        description: "Il biglietto è stato eliminato con successo."
      });
    } catch (error) {
      debugLog('Error in deleteTicketHandler', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione del biglietto.",
        variant: "destructive"
      });
    } finally {
      // Delay setting loading to false to ensure UI updates properly
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  }, [deletingTicketId, isLoading, toast]);

  return {
    isLoading,
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
  };
};
