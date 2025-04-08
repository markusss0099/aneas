
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  onCancel: () => void;
  isLoading: boolean;
  isEditing: boolean;
}

export const FormActions = ({ onCancel, isLoading, isEditing }: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
        Annulla
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? 'Aggiornamento...' : 'Aggiunta...'}
          </>
        ) : (
          isEditing ? 'Aggiorna Biglietto' : 'Aggiungi Biglietto'
        )}
      </Button>
    </div>
  );
};
