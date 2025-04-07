
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Service } from '@/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

// Schema di validazione
const formSchema = z.object({
  name: z.string().min(2, { message: 'Il nome deve contenere almeno 2 caratteri' }),
  revenue: z.number().min(0, { message: 'Il valore deve essere positivo' }),
  date: z.date(),
  description: z.string().optional(),
});

// Tipo per i dati del form
type FormData = z.infer<typeof formSchema>;

export interface ServiceFormProps {
  onSubmit: (data: Omit<Service, 'id'>) => void;
  initialData?: Service;
  onCancel: () => void;
  isLoading?: boolean;
}

const ServiceForm = ({ onSubmit, initialData, onCancel, isLoading = false }: ServiceFormProps) => {
  const { toast } = useToast();
  
  const defaultValues: FormData = {
    name: initialData?.name || '',
    revenue: initialData?.revenue || 0,
    date: initialData?.date || new Date(),
    description: initialData?.description || '',
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (data: FormData) => {
    // Ensure all required fields are passed as non-optional
    const serviceData: Omit<Service, 'id'> = {
      name: data.name,
      revenue: data.revenue,
      date: data.date,
      description: data.description,
    };
    
    onSubmit(serviceData);
    toast({
      title: initialData ? "Servizio aggiornato" : "Servizio aggiunto",
      description: `${data.name} è stato ${initialData ? 'aggiornato' : 'aggiunto'} con successo.`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome del Servizio</FormLabel>
              <FormControl>
                <Input placeholder="Nome del servizio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="revenue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ricavo (€)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data del Servizio</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP', { locale: it })
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
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrizione opzionale del servizio" 
                  className="resize-y"
                  {...field}
                />
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
              initialData ? 'Aggiorna Servizio' : 'Aggiungi Servizio'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ServiceForm;
