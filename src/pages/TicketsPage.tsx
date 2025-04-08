
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TicketList from '@/components/tickets/TicketList';
import TicketForm from '@/components/tickets/TicketForm';
import { Ticket } from '@/types';
import { addTicket, deleteTicket, getTickets, updateTicket } from '@/services/ticket';
import { debugLog } from '@/lib/debugUtils';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

const TicketsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Utilizzo di React Query per gestire lo stato e il caricamento
  const { data: tickets = [], isLoading, error, refetch } = useQuery({
    queryKey: ['tickets'],
    queryFn: getTickets,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Errore",
        description: "Errore nel caricamento dei biglietti.",
        variant: "destructive",
      });
      debugLog('Error fetching tickets', error);
    }
  }, [error, toast]);

  // Mutation per aggiungere un biglietto
  const addTicketMutation = useMutation({
    mutationFn: (newTicket: Omit<Ticket, 'id'>) => addTicket(newTicket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Biglietto Aggiunto",
        description: "Il biglietto è stato aggiunto con successo.",
      });
    },
    onError: (error) => {
      debugLog('Error adding ticket', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiunta del biglietto.",
        variant: "destructive",
      });
    }
  });

  // Mutation per aggiornare un biglietto
  const updateTicketMutation = useMutation({
    mutationFn: (updatedTicket: Ticket) => updateTicket(updatedTicket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({
        title: "Biglietto Aggiornato",
        description: "Il biglietto è stato aggiornato con successo.",
      });
    },
    onError: (error) => {
      debugLog('Error updating ticket', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento del biglietto.",
        variant: "destructive",
      });
    }
  });

  // Mutation per eliminare un biglietto
  const deleteTicketMutation = useMutation({
    mutationFn: (id: string) => deleteTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast({
        title: "Biglietto Eliminato",
        description: "Il biglietto è stato eliminato con successo.",
      });
    },
    onError: (error) => {
      debugLog('Error deleting ticket', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione del biglietto.",
        variant: "destructive",
      });
    }
  });

  const handleAddTicket = useCallback((newTicket: Omit<Ticket, 'id'>) => {
    addTicketMutation.mutate(newTicket);
  }, [addTicketMutation]);

  const handleUpdateTicket = useCallback((updatedTicket: Ticket) => {
    updateTicketMutation.mutate(updatedTicket);
  }, [updateTicketMutation]);

  const handleDeleteTicket = useCallback((id: string) => {
    deleteTicketMutation.mutate(id);
  }, [deleteTicketMutation]);

  // Controlla se qualsiasi operazione è in corso
  const isProcessing = isLoading || addTicketMutation.isPending || 
                      updateTicketMutation.isPending || deleteTicketMutation.isPending;

  return (
    <div className="animate-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestione Biglietti</h1>
          <p className="text-muted-foreground">
            Inserisci e gestisci i tuoi biglietti per eventi
          </p>
        </div>
        <Button
          className="mt-4 md:mt-0"
          onClick={() => setIsAddDialogOpen(true)}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Elaborazione...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuovo Biglietto
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Elenco Biglietti</CardTitle>
          <CardDescription>
            Visualizza e gestisci tutti i biglietti registrati
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TicketList 
            tickets={tickets}
            onUpdateTicket={handleUpdateTicket}
            onDeleteTicket={handleDeleteTicket}
            isLoading={isProcessing}
          />
        </CardContent>
      </Card>

      {/* Dialog per aggiungere un nuovo biglietto */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        if (!isProcessing) setIsAddDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Aggiungi Nuovo Biglietto</DialogTitle>
          </DialogHeader>
          <TicketForm
            onSubmit={handleAddTicket}
            onCancel={() => !isProcessing && setIsAddDialogOpen(false)}
            isLoading={addTicketMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketsPage;
