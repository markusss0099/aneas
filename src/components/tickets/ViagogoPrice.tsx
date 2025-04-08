
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ViagogoPriceProps {
  link?: string;
}

const ViagogoPrice: React.FC<ViagogoPriceProps> = ({ link }) => {
  const [loading, setLoading] = useState(false);

  // Funzione per simulare il prezzo basato sull'URL
  const simulatePrice = (url?: string): string => {
    if (!url) return '-';
    
    // Crea un prezzo simulato tra 100€ e 250€ basato sull'hash dell'URL
    // Questo garantisce che lo stesso URL produca sempre lo stesso prezzo
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      hash = ((hash << 5) - hash) + url.charCodeAt(i);
      hash = hash & hash; // Converti in integer a 32 bit
    }
    
    // Usa il valore assoluto dell'hash per generare un prezzo tra 100 e 250
    const price = 100 + Math.abs(hash % 150);
    
    return `€${price}`;
  };

  if (!link) return <span className="text-gray-400">-</span>;
  
  // Mostra il prezzo simulato (questo non cambierà a meno che il link non cambi)
  const simulatedPrice = simulatePrice(link);
  
  return (
    <div>
      <span className="font-medium text-green-600">{simulatedPrice}</span>
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
