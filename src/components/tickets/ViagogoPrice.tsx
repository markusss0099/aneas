
import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';
import { debugLog } from '@/lib/debugUtils';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface ViagogoPriceProps {
  link?: string;
}

const ViagogoPrice: React.FC<ViagogoPriceProps> = ({ link }) => {
  const [price, setPrice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConsentRequired, setIsConsentRequired] = useState(false);
  const { toast } = useToast();

  const fetchViagogoPriceFromPage = async (url: string) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setErrorMessage(null);
      setIsConsentRequired(false);
      
      // Create a URL object to ensure we're working with a proper URL
      const viagogoUrl = new URL(url);
      
      // Try to use the Edge Function to fetch and parse the page
      try {
        debugLog('Calling viagogo-price Edge Function with URL:', url);
        const { data, error, status } = await supabase.functions.invoke('viagogo-price', {
          body: { url }
        });
        
        if (error) {
          debugLog('Edge Function error:', error);
          throw new Error(`Edge Function error: ${error.message}`);
        }
        
        // Check if the response indicates a consent popup is present
        if (data?.needsConsent || (status === 422)) {
          setIsConsentRequired(true);
          setErrorMessage("È necessario accettare il consenso sul sito Viagogo");
          throw new Error("Popup di consenso rilevato, visita il sito per accettarlo");
        }
        
        if (data && data.price) {
          debugLog('Extracted price from Edge Function:', data.price);
          setPrice(data.price);
          setIsLoading(false);
          return;
        } else {
          debugLog('Edge Function did not return a price, falling back to URL parsing');
          throw new Error('Prezzo non trovato nella pagina');
        }
      } catch (functionError) {
        debugLog('Error calling viagogo-price Edge Function:', functionError);
        
        // Check if we already determined consent is required
        if (isConsentRequired) throw functionError;
        
        // Continue with fallback method
        
        // Fallback: Extract price from URL or parts of the URL
        const pricePattern = /€(\d+(?:[,.]\d+)?)/i;
        const urlString = viagogoUrl.toString();
        const match = urlString.match(pricePattern);
        
        if (match && match[1]) {
          debugLog('Extracted price from Viagogo URL:', match[1]);
          setPrice(`€${match[1]}`);
        } else {
          // Look for keywords in the URL pathname and search params
          const urlParts = [
            viagogoUrl.pathname,
            viagogoUrl.search,
            viagogoUrl.hash
          ].join(' ');
          
          const priceKeywords = urlParts.match(/prezzo[=\/-](\d+(?:[,.]\d+)?)/i) || 
                               urlParts.match(/price[=\/-](\d+(?:[,.]\d+)?)/i) ||
                               urlParts.match(/cost[=\/-](\d+(?:[,.]\d+)?)/i);
          
          if (priceKeywords && priceKeywords[1]) {
            setPrice(`€${priceKeywords[1]}`);
          } else {
            throw new Error('Impossibile estrarre il prezzo dal link');
          }
        }
      }
    } catch (error: any) {
      debugLog('Error extracting price from Viagogo:', error);
      setIsError(true);
      setErrorMessage(error.message || 'Impossibile estrarre il prezzo');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRetry = () => {
    if (link) {
      toast({
        title: "Ritentativo in corso",
        description: "Stiamo provando nuovamente a recuperare il prezzo da Viagogo",
      });
      fetchViagogoPriceFromPage(link);
    }
  };
  
  const handleOpenLink = () => {
    if (link && typeof window !== 'undefined') {
      window.open(link, "_blank");
      // Set a timeout to retry after they might have accepted the consent
      setTimeout(() => {
        if (isConsentRequired && link) {
          handleRetry();
        }
      }, 30000); // 30 seconds
    }
  };
  
  useEffect(() => {
    if (!link) return;
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
    <div className="flex items-center gap-2">
      {price ? (
        <span className="font-medium text-green-600">{price}</span>
      ) : (
        <div className="flex items-center">
          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
          <span className="text-yellow-600 mr-2">
            {isConsentRequired 
              ? "Richiede consenso" 
              : (errorMessage || "Impossibile estrarre il prezzo")}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full" 
                  onClick={handleRetry}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Riprova a recuperare il prezzo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      <Button 
        variant="link" 
        className="p-0 h-auto text-xs text-blue-500 hover:underline"
        onClick={handleOpenLink}
      >
        <span className="mr-1">Vedi</span>
        <ExternalLink className="h-3 w-3 inline" />
      </Button>
    </div>
  );
};

export default ViagogoPrice;
