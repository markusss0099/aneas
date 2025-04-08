
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Ticket } from '@/types';
import TicketForm from './TicketForm';

interface EditTicketDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  ticket: Ticket | null;
  onSubmit: (data: Ticket) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const EditTicketDialog = ({
  isOpen,
  setIsOpen,
  ticket,
  onSubmit,
  onCancel,
  isLoading
}: EditTicketDialogProps) => {
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!isLoading) setIsOpen(open);
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifica Biglietto</DialogTitle>
        </DialogHeader>
        {ticket && (
          <TicketForm
            initialData={ticket}
            onSubmit={onSubmit}
            onCancel={onCancel}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditTicketDialog;
