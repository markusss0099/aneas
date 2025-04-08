
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ticketFormSchema } from './ticketFormSchema';

type FormData = z.infer<typeof ticketFormSchema>;

interface AdditionalInfoFieldsProps {
  form: UseFormReturn<FormData>;
}

const AdditionalInfoFields = ({ form }: AdditionalInfoFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="viagogoLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Link Viagogo</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://www.viagogo.it/..." 
                {...field} 
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Inserisci il link alla pagina Viagogo con i dettagli del biglietto
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

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
    </>
  );
};

export default AdditionalInfoFields;
