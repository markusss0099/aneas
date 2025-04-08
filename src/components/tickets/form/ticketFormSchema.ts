
import * as z from 'zod';

export const ticketFormSchema = z.object({
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

export type TicketFormData = z.infer<typeof ticketFormSchema>;
