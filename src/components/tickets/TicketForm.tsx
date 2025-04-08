
import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addDays } from 'date-fns';
import { Form } from '@/components/ui/form';
import { Ticket } from '@/types';
import { FormBasicInfo } from './form/FormBasicInfo';
import { FormDateFields } from './form/FormDateFields';
import { FormFinancialFields } from './form/FormFinancialFields';
import { FormAdditionalFields } from './form/FormAdditionalFields';
import { FormActions } from './form/FormActions';

const formSchema = z.object({
  eventName: z.string().min(3, { message: 'Il nome evento deve contenere almeno 3 caratteri' }),
  quantity: z.coerce.number().int().min(1, { message: 'La quantità deve essere almeno 1' }),
  purchaseDate: z.date({ required_error: 'La data di acquisto è richiesta' }),
  eventDate: z.date({ required_error: 'La data dell\'evento è richiesta' }),
  expectedPaymentDate: z.date({ required_error: 'La data di pagamento prevista è richiesta' }),
  ticketPrice: z.coerce.number().min(0, { message: 'Il prezzo deve essere maggiore o uguale a 0' }),
  additionalCosts: z.coerce.number().min(0, { message: 'I costi aggiuntivi devono essere maggiori o uguali a 0' }),
  expectedRevenue: z.coerce.number().min(0, { message: 'I ricavi attesi devono essere maggiori o uguali a 0' }),
  notes: z.string().optional(),
  viagogoLink: z.string().url({ message: 'Inserisci un link valido' }).optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

interface TicketFormProps {
  onSubmit: (data: Omit<Ticket, 'id'>) => void;
  initialData?: Ticket;
  onCancel: () => void;
  isLoading?: boolean;
}

const TicketForm = ({ onSubmit, initialData, onCancel, isLoading = false }: TicketFormProps) => {
  // Calcola la data di pagamento prevista (7 giorni dopo la data dell'evento)
  const calculateExpectedPaymentDate = (eventDate: Date): Date => {
    return addDays(eventDate, 7);
  };
  
  const defaultValues: FormData = {
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

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  // Aggiorna la data di pagamento prevista quando cambia la data dell'evento
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'eventDate' && value.eventDate) {
        form.setValue('expectedPaymentDate', calculateExpectedPaymentDate(value.eventDate as Date));
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = (data: FormData) => {
    onSubmit(data as Omit<Ticket, 'id'>);
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormBasicInfo />
          <FormDateFields />
          <FormFinancialFields />
          <FormAdditionalFields />
          <FormActions 
            onCancel={onCancel} 
            isLoading={isLoading} 
            isEditing={!!initialData} 
          />
        </form>
      </Form>
    </FormProvider>
  );
};

export default TicketForm;
