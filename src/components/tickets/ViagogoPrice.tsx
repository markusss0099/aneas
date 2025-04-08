
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ViagogoPriceProps {
  link?: string;
}

const ViagogoPrice: React.FC<ViagogoPriceProps> = ({ link }) => {
  const [price, setPrice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      if (!link) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.functions.invoke('viagogo-price', {
          body: { url: link }
        });
        
        if (error) {
          console.error('Error invoking viagogo-price function:', error);
          setError('Impossibile ottenere il prezzo');
        } else if (data.error) {
          console.error('Error from viagogo-price function:', data.error);
          setError(data.error);
        } else if (data.price) {
          setPrice(data.price);
        }
      } catch (err) {
        console.error('Exception invoking viagogo-price function:', err);
        setError('Errore durante il recupero del prezzo');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (link) {
      fetchPrice();
    }
  }, [link]);

  if (!link) return <span className="text-gray-400">-</span>;
  
  return (
    <div className="flex items-center gap-2">
      {isLoading ? (
        <div className="flex items-center text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Caricamento...
        </div>
      ) : price ? (
        <span className="text-sm font-medium">{price}</span>
      ) : error ? (
        <span className="text-xs text-muted-foreground">{error}</span>
      ) : null}
      
      <Button 
        variant="outline" 
        size="sm"
        className="h-8 px-2 text-xs"
        asChild
      >
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          View
        </a>
      </Button>
    </div>
  );
};

export default ViagogoPrice;
