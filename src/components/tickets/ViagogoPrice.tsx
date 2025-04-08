
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ViagogoPriceProps {
  link?: string;
}

const ViagogoPrice: React.FC<ViagogoPriceProps> = ({ link }) => {
  const [price, setPrice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!link) {
      setPrice(null);
      setError(null);
      return;
    }

    const fetchPrice = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Nota: in un'implementazione reale, dovresti utilizzare una API server-side
        // per fare lo scraping del prezzo da Viagogo, poiché le richieste CORS
        // probabilmente falliranno nel client. Qui simuliamo l'estrazione del prezzo.
        
        // Simulazione del recupero del prezzo (per una demo)
        // In un'implementazione reale, questa logica dovrebbe essere sul server
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simula un prezzo estratto da Viagogo
        // In produzione, dovresti estrarre il prezzo reale dalla pagina
        const extractedPrice = '€157';
        
        setPrice(extractedPrice);
      } catch (err) {
        console.error('Error fetching Viagogo price:', err);
        setError('Impossibile recuperare il prezzo');
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [link]);

  if (!link) return <span className="text-gray-400">-</span>;
  
  if (loading) {
    return (
      <div className="flex items-center">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        <span className="text-muted-foreground">Caricamento...</span>
      </div>
    );
  }
  
  if (error) {
    return <span className="text-red-500">{error}</span>;
  }
  
  return (
    <div>
      <span className="font-medium text-green-600">{price}</span>
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="ml-2 text-xs text-blue-500 hover:underline"
      >
        Vedi
      </a>
    </div>
  );
};

export default ViagogoPrice;
