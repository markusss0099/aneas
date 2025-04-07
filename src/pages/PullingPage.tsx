
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
import { PlusCircle, ArrowUpRight } from 'lucide-react';
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

const PullingPage = () => {
  const [services, setServices] = useState<Service[]>(getServices());
  const [isAddingService, setIsAddingService] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const refreshServices = useCallback(() => {
    setServices(getServices());
  }, []);
  
  const handleAddService = useCallback((serviceData: Omit<Service, 'id'>) => {
    setIsLoading(true);
    
    // Simula un breve ritardo per mostrare il caricamento
    setTimeout(() => {
      try {
        addService(serviceData);
        refreshServices();
        setIsAddingService(false);
        
        toast({
          title: "Servizio aggiunto",
          description: `Il servizio "${serviceData.name}" è stato aggiunto con successo.`,
        });
      } catch (error) {
        console.error("Errore nell'aggiungere il servizio:", error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore nell'aggiungere il servizio.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, [refreshServices, toast]);
  
  const handleUpdateService = useCallback((updatedService: Service) => {
    try {
      updateService(updatedService);
      refreshServices();
      
      toast({
        title: "Servizio aggiornato",
        description: `Il servizio "${updatedService.name}" è stato aggiornato con successo.`,
      });
    } catch (error) {
      console.error("Errore nell'aggiornare il servizio:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nell'aggiornare il servizio.",
        variant: "destructive",
      });
    }
  }, [refreshServices, toast]);
  
  const handleDeleteService = useCallback((id: string) => {
    try {
      deleteService(id);
      refreshServices();
      
      toast({
        title: "Servizio eliminato",
        description: "Il servizio è stato eliminato con successo.",
      });
    } catch (error) {
      console.error("Errore nell'eliminare il servizio:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nell'eliminare il servizio.",
        variant: "destructive",
      });
    }
  }, [refreshServices, toast]);
  
  const totalRevenue = getTotalServiceRevenue();
  
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
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuovo Servizio
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
              {formatCurrency(totalRevenue)}
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
      />
      
      {/* Dialog per aggiungere un nuovo servizio */}
      <Dialog open={isAddingService} onOpenChange={(open) => !isLoading && setIsAddingService(open)}>
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
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PullingPage;
