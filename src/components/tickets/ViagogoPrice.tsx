
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ViagogoPriceProps {
  link?: string;
}

const ViagogoPrice: React.FC<ViagogoPriceProps> = ({ link }) => {
  // Funzione per generare un prezzo simulato basato sul link
  const generatePriceFromLink = (url: string): string => {
    if (!url) return '€0';
    
    // Usa una logica semplice basata sui caratteri del link per generare un prezzo simulato
    // Questo garantisce che lo stesso link generi sempre lo stesso prezzo
    let sum = 0;
    for (let i = 0; i < url.length; i++) {
      sum += url.charCodeAt(i);
    }
    
    // Genera un prezzo tra €50 e €250 (approssimativo)
    const price = 50 + (sum % 200);
    return `€${price}`;
  };

  if (!link) return <span className="text-gray-400">-</span>;
  
  // Genera il prezzo basato sul link
  const price = generatePriceFromLink(link);
  
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
