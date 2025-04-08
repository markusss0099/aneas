
import React from 'react';
import { Service } from '@/types';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import ServiceForm from './ServiceForm';

interface ServiceEditDialogProps {
  service: Service | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Service, 'id'>) => void;
  onCancel: () => void;
  isProcessing: boolean;
}

const ServiceEditDialog = ({ 
  service, 
  onOpenChange, 
  onSubmit, 
  onCancel, 
  isProcessing 
}: ServiceEditDialogProps) => {
  if (!service) return null;
  
  return (
    <AlertDialog open={!!service} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Modifica Servizio</AlertDialogTitle>
          <AlertDialogDescription>
            Aggiorna i dettagli del servizio
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ServiceForm
          initialData={service}
          onSubmit={onSubmit}
          onCancel={onCancel}
          isLoading={isProcessing}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ServiceEditDialog;
