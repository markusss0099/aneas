
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormButtonsProps {
  onCancel: () => void;
  isLoading: boolean;
  isEditing: boolean;
}

const FormButtons = ({ onCancel, isLoading, isEditing }: FormButtonsProps) => {
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

export default FormButtons;
