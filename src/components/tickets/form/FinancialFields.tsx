
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ticketFormSchema } from './ticketFormSchema';

type FormData = z.infer<typeof ticketFormSchema>;

interface FinancialFieldsProps {
  form: UseFormReturn<FormData>;
}

const FinancialFields = ({ form }: FinancialFieldsProps) => {
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
  );
};

export default FinancialFields;
