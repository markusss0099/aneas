
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { ticketFormSchema } from './ticketFormSchema';

type FormData = z.infer<typeof ticketFormSchema>;

interface BasicInfoFieldsProps {
  form: UseFormReturn<FormData>;
}

const BasicInfoFields = ({ form }: BasicInfoFieldsProps) => {
  return (
    <>
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
    </>
  );
};

export default BasicInfoFields;
