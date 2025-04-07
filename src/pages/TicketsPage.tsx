
import React, { useState } from 'react';
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

const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>(getTickets());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const refreshTickets = () => {
    setTickets(getTickets());
  };

  const handleAddTicket = (newTicket: Omit<Ticket, 'id'>) => {
    addTicket(newTicket);
    refreshTickets();
    setIsAddDialogOpen(false);
  };

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    updateTicket(updatedTicket);
    refreshTickets();
  };

  const handleDeleteTicket = (id: string) => {
    deleteTicket(id);
    refreshTickets();
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
