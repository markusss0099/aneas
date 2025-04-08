
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { debugLog } from '@/lib/debugUtils';
import { supabase } from '@/integrations/supabase/client';

interface ViagogoPriceProps {
  link?: string;
}

const ViagogoPrice: React.FC<ViagogoPriceProps> = ({ link }) => {
  const [price, setPrice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!link) return;
    
    const fetchViagogoPriceFromPage = async (url: string) => {
      try {
        setIsLoading(true);
        setIsError(false);
        
        // Create a URL object to ensure we're working with a proper URL
        const viagogoUrl = new URL(url);
        
        // First try to use the Edge Function to fetch and parse the page
        try {
          debugLog('Calling viagogo-price Edge Function with URL:', url);
          const { data, error } = await supabase.functions.invoke('viagogo-price', {
            body: { url }
          });
          
          if (error) {
            debugLog('Edge Function error:', error);
            throw error;
          }
          
          if (data && data.price) {
            debugLog('Extracted price from Edge Function:', data.price);
            setPrice(data.price);
            setIsLoading(false);
            return;
          } else {
            debugLog('Edge Function did not return a price, falling back to URL parsing');
          }
        } catch (functionError) {
          debugLog('Error calling viagogo-price Edge Function:', functionError);
          // Continue with fallback method
        }
        
        // Fallback: Extract price from URL or parts of the URL
        const pricePattern = /€(\d+(?:\.\d+)?)/i;
        const urlString = viagogoUrl.toString();
        const match = urlString.match(pricePattern);
        
        if (match && match[1]) {
          debugLog('Extracted price from Viagogo URL:', match[1]);
          setPrice(`€${match[1]}`);
        } else {
          // Check if price is in the pathname or search params
          const pathMatch = viagogoUrl.pathname.match(pricePattern);
          if (pathMatch && pathMatch[1]) {
            setPrice(`€${pathMatch[1]}`);
          } else {
            // If we still can't find a price, check for price indicators in the URL
            if (urlString.toLowerCase().includes('prezzo') || 
                urlString.toLowerCase().includes('price') || 
                urlString.toLowerCase().includes('costo')) {
              // Look for nearby numbers
              const nearbyPriceMatch = urlString.match(/(?:prezzo|price|costo)[^\d]*(\d+(?:\.\d+)?)/i);
              if (nearbyPriceMatch && nearbyPriceMatch[1]) {
                setPrice(`€${nearbyPriceMatch[1]}`);
              } else {
                setIsError(true);
              }
            } else {
              setIsError(true);
            }
          }
        }
      } catch (error) {
        debugLog('Error extracting price from Viagogo:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchViagogoPriceFromPage(link);
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
        <span className="text-yellow-600">
          {isError ? "Impossibile estrarre il prezzo" : "Prezzo non trovato"}
        </span>
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
