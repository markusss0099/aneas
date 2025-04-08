
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import { Form } from '@/components/ui/form';
import { Ticket } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ticketFormSchema, TicketFormData } from './form/ticketFormSchema';
import BasicInfoFields from './form/BasicInfoFields';
import DateFields from './form/DateFields';
import FinancialFields from './form/FinancialFields';
import AdditionalInfoFields from './form/AdditionalInfoFields';
import FormButtons from './form/FormButtons';

interface TicketFormProps {
  onSubmit: (data: Omit<Ticket, 'id'>) => void;
  initialData?: Ticket;
  onCancel: () => void;
  isLoading?: boolean;
}

const TicketForm = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isLoading = false 
}: TicketFormProps) => {
  const { toast } = useToast();
  
  const calculateExpectedPaymentDate = (eventDate: Date): Date => {
    return addDays(eventDate, 7);
  };
  
  const defaultValues: TicketFormData = {
    eventName: initialData?.eventName || '',
    quantity: initialData?.quantity || 1,
    purchaseDate: initialData?.purchaseDate || new Date(),
    eventDate: initialData?.eventDate || new Date(),
    expectedPaymentDate: initialData?.expectedPaymentDate || calculateExpectedPaymentDate(initialData?.eventDate || new Date()),
    ticketPrice: initialData?.ticketPrice || 0,
    additionalCosts: initialData?.additionalCosts || 0,
    expectedRevenue: initialData?.expectedRevenue || 0,
    notes: initialData?.notes || '',
    viagogoLink: initialData?.viagogoLink || '',
  };

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues,
  });
  
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'eventDate' && value.eventDate) {
        form.setValue('expectedPaymentDate', calculateExpectedPaymentDate(value.eventDate as Date));
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = (data: TicketFormData) => {
    const submissionData = {
      ...data,
      viagogoLink: data.viagogoLink || undefined
    };
    
    onSubmit(submissionData as Omit<Ticket, 'id'>);
    toast({
      title: initialData ? 'Biglietto aggiornato' : 'Biglietto aggiunto',
      description: `Il biglietto è stato ${initialData ? 'aggiornato' : 'aggiunto'} con successo.`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInfoFields form={form} />
        
        <DateFields form={form} />
        
        <FinancialFields form={form} />
        
        <AdditionalInfoFields form={form} />
        
        <FormButtons 
          onCancel={onCancel} 
          isLoading={isLoading} 
          isEditing={!!initialData}
        />
      </form>
    </Form>
  );
};

export default TicketForm;
