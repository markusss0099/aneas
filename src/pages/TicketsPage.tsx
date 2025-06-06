
import React, { useState, useEffect } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import TicketList from '@/components/tickets/TicketList';
import TicketForm from '@/components/tickets/TicketForm';
import { useQuery } from '@tanstack/react-query';
import { getTickets } from '@/services/ticket';
import { useTicketActions } from '@/hooks/useTicketActions';
import { debugLog } from '@/lib/debugUtils';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const TicketsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { 
    handleAddTicket, 
    handleUpdateTicket, 
    handleDeleteTicket,
    isProcessing,
    addTicketMutation,
    resetStates
  } = useTicketActions();

  // Utilizzo di React Query per gestire lo stato e il caricamento
  const { data: tickets = [], isLoading, error, refetch } = useQuery({
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

  // Monitor addTicketMutation success to close the dialog
  useEffect(() => {
    if (addTicketMutation.isSuccess) {
      setIsAddDialogOpen(false);
      // Ensure data is refreshed after adding a ticket
      refetch();
    }
  }, [addTicketMutation.isSuccess, refetch]);

  // Combined loading state
  const isPageLoading = isLoading || isProcessing;

  // Handle dialog opening
  const openAddDialog = () => {
    if (!isProcessing) {
      setIsAddDialogOpen(true);
    }
  };

  // Handle dialog closing
  const closeAddDialog = () => {
    // Only close the dialog if we're not in the middle of processing
    if (!addTicketMutation.isPending) {
      setIsAddDialogOpen(false);
      resetStates();
    }
  };

  // Handle dialog state change
  const handleAddDialogOpenChange = (open: boolean) => {
    if (!open && !addTicketMutation.isPending) {
      closeAddDialog();
    } else if (open && !isProcessing) {
      openAddDialog();
    }
  };

  return (
    <div className="animate-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${isMobile ? "mb-1" : ""}`}>
            {isMobile ? "Biglietti" : "Gestione Biglietti"}
          </h1>
          {!isMobile && (
            <p className="text-muted-foreground">
              Inserisci e gestisci i tuoi biglietti per eventi
            </p>
          )}
        </div>
        <Button
          className="mt-3 md:mt-0 w-full md:w-auto"
          onClick={openAddDialog}
          disabled={isPageLoading}
          size={isMobile ? "sm" : "default"}
        >
          {isPageLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isMobile ? "Caricamento..." : "Elaborazione..."}
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              {isMobile ? "Nuovo" : "Nuovo Biglietto"}
            </>
          )}
        </Button>
      </div>

      <Card className={isMobile ? "shadow-sm border-0 shadow-none" : ""}>
        {!isMobile && (
          <CardHeader>
            <CardTitle>Elenco Biglietti</CardTitle>
            <CardDescription>
              Visualizza e gestisci tutti i biglietti registrati
            </CardDescription>
          </CardHeader>
        )}
        <CardContent className={isMobile ? "p-0 sm:p-6" : "p-6"}>
          <TicketList 
            tickets={tickets}
            onUpdateTicket={handleUpdateTicket}
            onDeleteTicket={handleDeleteTicket}
            isLoading={isPageLoading}
          />
        </CardContent>
      </Card>

      {/* Dialog per aggiungere un nuovo biglietto */}
      {isMobile ? (
        <Drawer 
          open={isAddDialogOpen} 
          onOpenChange={handleAddDialogOpenChange}
        >
          <DrawerContent className="px-4 pb-6 pt-2 max-h-[85vh]">
            <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
            <h3 className="font-semibold text-lg pt-2 pb-4">Aggiungi Nuovo Biglietto</h3>
            <ScrollArea className="h-[calc(80vh-80px)] pr-4">
              <TicketForm
                onSubmit={handleAddTicket}
                onCancel={closeAddDialog}
                isLoading={addTicketMutation.isPending}
                key={`add-ticket-form-${isAddDialogOpen}`}
              />
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog 
          open={isAddDialogOpen} 
          onOpenChange={handleAddDialogOpenChange}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Aggiungi Nuovo Biglietto</DialogTitle>
            </DialogHeader>
            <TicketForm
              onSubmit={handleAddTicket}
              onCancel={closeAddDialog}
              isLoading={addTicketMutation.isPending}
              key={`add-ticket-form-${isAddDialogOpen}`}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TicketsPage;
