
import React, { useState } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { getTickets } from '@/services/ticket';
import { useTicketActions } from '@/hooks/useTicketActions';
import { debugLog } from '@/lib/debugUtils';
import { useToast } from '@/hooks/use-toast';

const TicketsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const { 
    handleAddTicket, 
    handleUpdateTicket, 
    handleDeleteTicket,
    isProcessing,
    addTicketMutation
  } = useTicketActions();

  // Utilizzo di React Query per gestire lo stato e il caricamento
  const { data: tickets = [], isLoading, error } = useQuery({
    queryKey: ['tickets'],
    queryFn: getTickets,
  });

  // React to query errors
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Errore",
        description: "Errore nel caricamento dei biglietti.",
        variant: "destructive",
      });
      debugLog('Error fetching tickets', error);
    }
  }, [error, toast]);

  // Combined loading state
  const isPageLoading = isLoading || isProcessing;

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
          disabled={isPageLoading}
        >
          {isPageLoading ? (
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
            isLoading={isPageLoading}
          />
        </CardContent>
      </Card>

      {/* Dialog per aggiungere un nuovo biglietto */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        if (!isPageLoading) setIsAddDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Aggiungi Nuovo Biglietto</DialogTitle>
          </DialogHeader>
          <TicketForm
            onSubmit={handleAddTicket}
            onCancel={() => !isPageLoading && setIsAddDialogOpen(false)}
            isLoading={addTicketMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketsPage;
