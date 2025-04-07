
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TicketList from '@/components/tickets/TicketList';
import TicketForm from '@/components/tickets/TicketForm';
import { Ticket } from '@/types';
import { addTicket, deleteTicket, getTickets, updateTicket } from '@/services/ticketService';
import { debugLog } from '@/lib/debugUtils';
import { useToast } from '@/hooks/use-toast';

const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    refreshTickets();
  }, []);

  const refreshTickets = () => {
    const loadedTickets = getTickets();
    setTickets(loadedTickets);
    debugLog('Tickets refreshed in TicketsPage', loadedTickets);
  };

  const handleAddTicket = (newTicket: Omit<Ticket, 'id'>) => {
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
    }
  };

  const handleUpdateTicket = (updatedTicket: Ticket) => {
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
    }
  };

  const handleDeleteTicket = (id: string) => {
    try {
      deleteTicket(id);
      refreshTickets();
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
    }
  };

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
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuovo Biglietto
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
          />
        </CardContent>
      </Card>

      {/* Dialog per aggiungere un nuovo biglietto */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Aggiungi Nuovo Biglietto</DialogTitle>
          </DialogHeader>
          <TicketForm
            onSubmit={handleAddTicket}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketsPage;
