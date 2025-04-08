
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

const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const refreshTickets = useCallback(() => {
    try {
      const loadedTickets = getTickets();
      setTickets(loadedTickets);
      debugLog('Tickets refreshed in TicketsPage', loadedTickets);
    } catch (error) {
      debugLog('Error refreshing tickets', error);
      toast({
        title: "Errore",
        description: "Errore nel caricamento dei biglietti.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    refreshTickets();
  }, [refreshTickets]);

  const handleAddTicket = useCallback((newTicket: Omit<Ticket, 'id'>) => {
    setIsLoading(true);
    
    // Simuliamo un breve ritardo come nella pagina Pulling
    setTimeout(() => {
      try {
        addTicket(newTicket);
        refreshTickets();
        setIsAddDialogOpen(false);
        toast({
          title: "Biglietto Aggiunto",
          description: `Biglietto per "${newTicket.eventName}" aggiunto con successo.`,
        });
      } catch (error) {
        debugLog('Error adding ticket', error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante l'aggiunta del biglietto.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, [refreshTickets, toast]);

  const handleUpdateTicket = useCallback((updatedTicket: Ticket) => {
    setIsLoading(true);
    
    // Simuliamo un breve ritardo come nella pagina Pulling
    setTimeout(() => {
      try {
        updateTicket(updatedTicket);
        refreshTickets();
        toast({
          title: "Biglietto Aggiornato",
          description: `Biglietto per "${updatedTicket.eventName}" aggiornato con successo.`,
        });
      } catch (error) {
        debugLog('Error updating ticket', error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante l'aggiornamento del biglietto.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, [refreshTickets, toast]);

  const handleDeleteTicket = useCallback((id: string) => {
    setIsLoading(true);
    
    // Simuliamo un breve ritardo come nella pagina Pulling
    setTimeout(() => {
      try {
        deleteTicket(id);
        // Aggiorniamo lo stato direttamente per evitare problemi di race condition
        setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== id));
        toast({
          title: "Biglietto Eliminato",
          description: "Il biglietto è stato eliminato con successo.",
        });
      } catch (error) {
        debugLog('Error deleting ticket', error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante l'eliminazione del biglietto.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, [toast]);

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
          disabled={isLoading}
        >
          {isLoading ? (
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
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Dialog per aggiungere un nuovo biglietto */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        if (!isLoading) setIsAddDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Aggiungi Nuovo Biglietto</DialogTitle>
          </DialogHeader>
          <TicketForm
            onSubmit={handleAddTicket}
            onCancel={() => !isLoading && setIsAddDialogOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketsPage;
