
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';

interface ServiceHeaderProps {
  onAddClick: () => void;
  isProcessing: boolean;
}

const ServiceHeader = ({ onAddClick, isProcessing }: ServiceHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Pulling</h1>
        <p className="text-muted-foreground">
          Gestione dei servizi e relativi guadagni
        </p>
      </div>
      <Button 
        className="mt-4 md:mt-0" 
        onClick={onAddClick}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Elaborazione...
          </>
        ) : (
          <>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuovo Servizio
          </>
        )}
      </Button>
    </div>
  );
};

export default ServiceHeader;
