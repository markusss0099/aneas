
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export const FormBasicInfo = () => {
  const form = useFormContext();

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
