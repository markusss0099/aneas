
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';

export const FormFinancialFields = () => {
  const form = useFormContext();

  return (
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
            <FormDescription>
              Prezzo per singolo biglietto
            </FormDescription>
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
            <FormDescription>
              Costi aggiuntivi per singolo biglietto
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="expectedRevenue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ricavi Attesi Totali (€)</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" min="0" {...field} />
            </FormControl>
            <FormDescription>
              Ricavo totale atteso (non per biglietto)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
