
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Service } from '@/types';
import { addService, updateService, deleteService } from '@/services/serviceService';
import { debugLog } from '@/lib/debugUtils';

export const useServiceActions = () => {
  const [isAddingService, setIsAddingService] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Mutation for adding a service
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
  
  // Mutation for updating a service
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
  
  // Mutation for deleting a service - ensure the id is always a string
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
  
  // Ensure id is always a string when calling deleteService
  const handleDeleteService = useCallback((id: string) => {
    deleteServiceMutation.mutate(id);
  }, [deleteServiceMutation]);
  
  return {
    isAddingService,
    setIsAddingService,
    addServiceMutation,
    updateServiceMutation,
    deleteServiceMutation,
    handleAddService,
    handleUpdateService,
    handleDeleteService,
    isProcessing: addServiceMutation.isPending || 
                  updateServiceMutation.isPending || 
                  deleteServiceMutation.isPending
  };
};
