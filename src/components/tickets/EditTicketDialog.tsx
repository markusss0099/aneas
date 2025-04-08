
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Ticket } from '@/types';
import TicketForm from './TicketForm';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  // Se non c'è un biglietto da modificare, non mostriamo nulla
  if (!ticket) {
    return null;
  }

  if (isMobile) {
    return (
      <Drawer 
        open={isOpen} 
        onOpenChange={(open) => {
          if (!isLoading) setIsOpen(open);
        }}
      >
        <DrawerContent className="px-4 pb-6 pt-2 max-h-[85vh]">
          <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
          <h3 className="font-semibold text-lg pt-2 pb-4">Modifica Biglietto</h3>
          <ScrollArea className="h-[calc(80vh-80px)] pr-4">
            <TicketForm
              initialData={ticket}
              onSubmit={onSubmit}
              onCancel={onCancel}
              isLoading={isLoading}
            />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

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
        <TicketForm
          initialData={ticket}
          onSubmit={onSubmit}
          onCancel={onCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditTicketDialog;
