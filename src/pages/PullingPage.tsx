
import React, { useState, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ArrowUpRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Service } from '@/types';
import { 
  getServices, 
  addService, 
  updateService, 
  deleteService,
  getTotalServiceRevenue
} from '@/services/serviceService';
import ServiceForm from '@/components/services/ServiceForm';
import ServiceList from '@/components/services/ServiceList';
import { formatCurrency } from '@/lib/utils';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { debugLog } from '@/lib/debugUtils';

const PullingPage = () => {
  const [isAddingService, setIsAddingService] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Utilizzo di React Query per gestire lo stato e il caricamento
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });

  const { data: totalRevenue = 0, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['serviceRevenue'],
    queryFn: getTotalServiceRevenue,
  });
  
  // Mutation per aggiungere un servizio
  const addServiceMutation = useMutation({
    mutationFn: (serviceData: Omit<Service, 'id'>) => addService(serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['serviceRevenue'] });
      setIsAddingService(false);
      
      toast({
        title: "Servizio aggiunto",
        description: "Il servizio è stato aggiunto con successo.",
      });
    },
    onError: (error) => {
      debugLog("Errore nell'aggiungere il servizio:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nell'aggiungere il servizio.",
        variant: "destructive",
      });
    }
  });
  
  // Mutation per aggiornare un servizio
  const updateServiceMutation = useMutation({
    mutationFn: (updatedService: Service) => updateService(updatedService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['serviceRevenue'] });
      
      toast({
        title: "Servizio aggiornato",
        description: "Il servizio è stato aggiornato con successo.",
      });
    },
    onError: (error) => {
      debugLog("Errore nell'aggiornare il servizio:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nell'aggiornare il servizio.",
        variant: "destructive",
      });
    }
  });
  
  // Mutation per eliminare un servizio
  const deleteServiceMutation = useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['serviceRevenue'] });
      
      toast({
        title: "Servizio eliminato",
        description: "Il servizio è stato eliminato con successo.",
      });
    },
    onError: (error) => {
      debugLog("Errore nell'eliminare il servizio:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nell'eliminare il servizio.",
        variant: "destructive",
      });
    }
  });
  
  const handleAddService = useCallback((serviceData: Omit<Service, 'id'>) => {
    addServiceMutation.mutate(serviceData);
  }, [addServiceMutation]);
  
  const handleUpdateService = useCallback((updatedService: Service) => {
    updateServiceMutation.mutate(updatedService);
  }, [updateServiceMutation]);
  
  const handleDeleteService = useCallback((id: string) => {
    deleteServiceMutation.mutate(id);
  }, [deleteServiceMutation]);
  
  // Controlla se qualsiasi operazione è in corso
  const isProcessing = isLoading || isLoadingRevenue || 
                       addServiceMutation.isPending || 
                       updateServiceMutation.isPending || 
                       deleteServiceMutation.isPending;
  
  return (
    <div className="animate-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Pulling</h1>
          <p className="text-muted-foreground">
            Gestione dei servizi e relativi guadagni
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0" 
          onClick={() => setIsAddingService(true)}
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
              Nuovo Servizio
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Totale Servizi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Servizi registrati
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ricavi Totali
            </CardTitle>
            <div className="rounded-full p-1 text-success">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingRevenue ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                formatCurrency(totalRevenue)
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Guadagni da tutti i servizi
            </p>
          </CardContent>
        </Card>
      </div>
      
      <ServiceList 
        services={services}
        onDelete={handleDeleteService}
        onUpdate={handleUpdateService}
        isLoading={isProcessing}
      />
      
      {/* Dialog per aggiungere un nuovo servizio */}
      <Dialog open={isAddingService} onOpenChange={(open) => !isProcessing && setIsAddingService(open)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Aggiungi Nuovo Servizio</DialogTitle>
            <DialogDescription>
              Inserisci i dettagli del nuovo servizio e il relativo guadagno.
            </DialogDescription>
          </DialogHeader>
          <ServiceForm 
            onSubmit={handleAddService} 
            onCancel={() => setIsAddingService(false)}
            isLoading={addServiceMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PullingPage;
