
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ServiceForm from '@/components/services/ServiceForm';
import { Service } from '@/types';

interface ServiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (serviceData: Omit<Service, 'id'>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ServiceDialog = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  onCancel, 
  isLoading 
}: ServiceDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Aggiungi Nuovo Servizio</DialogTitle>
          <DialogDescription>
            Inserisci i dettagli del nuovo servizio e il relativo guadagno.
          </DialogDescription>
        </DialogHeader>
        <ServiceForm 
          onSubmit={onSubmit} 
          onCancel={onCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDialog;
