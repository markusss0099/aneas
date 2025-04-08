
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';

export const FormAdditionalFields = () => {
  const form = useFormContext();

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
