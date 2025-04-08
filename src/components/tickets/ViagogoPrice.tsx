
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { debugLog } from '@/lib/debugUtils';

interface ViagogoPriceProps {
  link?: string;
}

const ViagogoPrice: React.FC<ViagogoPriceProps> = ({ link }) => {
  const [price, setPrice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!link) return;
    
    setIsLoading(true);
    
    // Function to extract price from Viagogo URL
    const extractPriceFromLink = (url: string): string | null => {
      try {
        // Common pattern in Viagogo URLs where price appears before "each"
        const pricePattern = /€(\d+(?:\.\d+)?)\s*each/i;
        const match = url.match(pricePattern);
        
        if (match && match[1]) {
          debugLog('Extracted price from Viagogo link:', match[1]);
          return `€${match[1]}`;
        }
        
        // If we can't find a price with the pattern, return a default message
        debugLog('Could not extract price from Viagogo link:', url);
        return null;
      } catch (error) {
        debugLog('Error extracting price from Viagogo link:', error);
        return null;
      }
    };
    
    // Extract the price from the link
    const extractedPrice = extractPriceFromLink(link);
    setPrice(extractedPrice);
    setIsLoading(false);
  }, [link]);

  if (!link) return <span className="text-gray-400">-</span>;
  
  if (isLoading) {
    return (
      <div className="flex items-center">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span>Caricamento...</span>
      </div>
    );
  }
  
  return (
    <div>
      {price ? (
        <span className="font-medium text-green-600">{price}</span>
      ) : (
        <span className="text-yellow-600">Prezzo non trovato</span>
      )}
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
