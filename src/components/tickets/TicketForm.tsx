
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, addDays } from 'date-fns';
import { it } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Ticket } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
});

type FormData = z.infer<typeof formSchema>;

interface TicketFormProps {
  onSubmit: (data: Omit<Ticket, 'id'>) => void;
  initialData?: Ticket;
  onCancel: () => void;
  isLoading?: boolean;
}

const TicketForm = ({ onSubmit, initialData, onCancel, isLoading = false }: TicketFormProps) => {
  const { toast } = useToast();
  
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
    toast({
      title: initialData ? 'Biglietto aggiornato' : 'Biglietto aggiunto',
      description: `Il biglietto è stato ${initialData ? 'aggiornato' : 'aggiunto'} con successo.`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="eventName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Evento</FormLabel>
              <FormControl>
                <Input placeholder="Inserisci il nome dell'evento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantità Biglietti</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  step="1" 
                  placeholder="Numero di biglietti" 
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    field.onChange(value < 1 ? 1 : value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="purchaseDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data di Acquisto</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy", { locale: it })
                        ) : (
                          <span>Seleziona una data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                      locale={it}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data dell'Evento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy", { locale: it })
                        ) : (
                          <span>Seleziona una data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                      locale={it}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expectedPaymentDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data Prevista Incasso (7 giorni dopo l'evento)</FormLabel>
                <FormControl>
                  <div className={cn(
                    "flex h-10 pl-3 items-center border rounded-md bg-muted/50",
                    "text-sm"
                  )}>
                    {field.value ? (
                      format(field.value, "dd/MM/yyyy", { locale: it })
                    ) : (
                      <span className="text-muted-foreground">Data calcolata automaticamente</span>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="ticketPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prezzo Biglietto (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalCosts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Costi Aggiuntivi (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expectedRevenue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ricavi Attesi (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea placeholder="Note aggiuntive (opzionale)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Annulla
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? 'Aggiornamento...' : 'Aggiunta...'}
              </>
            ) : (
              initialData ? 'Aggiorna Biglietto' : 'Aggiungi Biglietto'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TicketForm;
