import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ error: "URL mancante o non valido" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching Viagogo page: ${url}`);

    // Look for price directly in the URL first (as a fallback method)
    let priceFromUrl = null;
    
    try {
      const viagogoUrl = new URL(url);
      const urlString = viagogoUrl.toString();
      
      // Look for price patterns in the URL
      const priceUrlPatterns = [
        /€\s*(\d+(?:[,.]\d+)?)/i,
        /(\d+(?:[,.]\d+)?)\s*€/i,
        /(\d+(?:[,.]\d+)?)\s*EUR/i,
        /price[=\/-](\d+(?:[,.]\d+)?)/i,
        /cost[=\/-](\d+(?:[,.]\d+)?)/i,
        /prezzo[=\/-](\d+(?:[,.]\d+)?)/i
      ];
      
      for (const pattern of priceUrlPatterns) {
        const match = urlString.match(pattern);
        if (match && match[1]) {
          priceFromUrl = match[0].includes('€') ? match[0].trim() : `€${match[1].trim()}`;
          console.log(`Extracted price from URL: ${priceFromUrl}`);
          break;
        }
      }
    } catch (urlError) {
      console.log(`Error extracting price from URL: ${urlError.message}`);
    }

    // Try to fetch and parse the page content
    try {
      // Use a proxy service or direct fetch with appropriate headers that mimic a browser
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Language': 'en-US,en;q=0.9,it;q=0.8',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Sec-Ch-Ua': '"Google Chrome";v="123", "Not;A=Brand";v="8"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1',
          'Referer': 'https://www.google.com/',
        },
        redirect: 'follow',
      });

      if (!response.ok) {
        console.error(`Failed to fetch page: ${response.status} ${response.statusText}`);
        throw new Error(`Errore nel recupero della pagina: ${response.status}`);
      }

      const html = await response.text();
      console.log(`Page fetched, parsing HTML (length: ${html.length})`);

      // Check if we have a "Continue" button or similar, which would indicate the consent screen
      if (html.includes('gdpr-banner') || 
          html.includes('consent') || 
          html.includes('cookie-banner') || 
          html.includes('continue-button')) {
        
        console.log('Detected consent/continue screen, looking for secondary indicators');
        
        // Even if we're on a consent screen, check for price data that might be in the DOM but hidden
        const $ = cheerio.load(html);
        let hiddenPrice = null;
        
        // Look for hidden price elements in script tags or data attributes
        $('script').each((i, el) => {
          const content = $(el).html() || '';
          if (content.includes('price') || content.includes('cost') || content.includes('amount')) {
            const priceMatches = content.match(/(['"])price\1\s*:\s*(['"])([^'"]+)\2/i) ||
                                content.match(/price\s*:\s*(['"])([^'"]+)\1/i) ||
                                content.match(/['"]price['"]\s*:\s*(\d+(?:\.\d+)?)/i);
            
            if (priceMatches && priceMatches.length > 2) {
              const potentialPrice = priceMatches[priceMatches.length - 1];
              hiddenPrice = potentialPrice.includes('€') ? potentialPrice : `€${potentialPrice}`;
              console.log(`Found potential price in script: ${hiddenPrice}`);
            }
          }
        });
        
        if (hiddenPrice) {
          return new Response(
            JSON.stringify({ 
              price: hiddenPrice,
              success: true,
              note: "Price extracted from hidden data on consent screen"
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Fallback to URL-extracted price if we're on a consent screen
        if (priceFromUrl) {
          return new Response(
            JSON.stringify({ 
              price: priceFromUrl,
              success: true,
              note: "Price extracted from URL (consent screen detected)"
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify({ 
            error: "Rilevato popup di consenso, impossibile accedere direttamente al prezzo",
            needsConsent: true
          }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Parse the HTML content using cheerio
      const $ = cheerio.load(html);

      // Find prices using various selectors, focusing on patterns with "each"
      let price = null;
      
      // Method 1: Look for elements containing "each" text
      $("*:contains('each')").each((i, el) => {
        if (price) return; // Already found
        const text = $(el).text().trim();
        
        // Look for patterns like "€50 each" or "50€ each" or "50 EUR each"
        const priceMatch = text.match(/€\s*(\d+(?:[,.]\d+)?)\s*each/i) || 
                         text.match(/(\d+(?:[,.]\d+)?)\s*€\s*each/i) ||
                         text.match(/(\d+(?:[,.]\d+)?)\s*EUR\s*each/i);
        
        if (priceMatch) {
          console.log(`Found price with "each" pattern: "${text}" => "${priceMatch[0]}"`);
          price = priceMatch[0].replace(/each/i, '').trim();
        }
      });

      // Method 2: Look specifically at parent elements of "each" text for better context
      if (!price) {
        console.log('Trying with parent contexts of "each"');
        $("*:contains('each')").each((i, el) => {
          if (price) return; // Already found
          
          // Check in the parent elements for price patterns
          let parent = $(el).parent();
          for (let depth = 0; depth < 3 && parent.length && !price; depth++) {
            const parentText = parent.text().trim();
            
            const priceMatches = parentText.match(/€\s*(\d+(?:[,.]\d+)?)/g) || 
                               parentText.match(/(\d+(?:[,.]\d+)?)\s*€/g) ||
                               parentText.match(/(\d+(?:[,.]\d+)?)\s*EUR/gi);
            
            if (priceMatches && priceMatches.length > 0) {
              price = priceMatches[0].trim();
              console.log(`Found price in parent context: "${parentText}" => "${price}"`);
              break;
            }
            
            parent = parent.parent();
          }
        });
      }

      // Method 3: Try various common price selectors
      if (!price) {
        const selectors = [
          '[class*="price"]', 
          '[class*="Price"]',
          '[data-price]',
          '[class*="cost"]',
          '[class*="Cost"]',
          '[class*="amount"]',
          '[class*="Amount"]',
          '.listing-price',
          '.ticket-price',
          '.event-price',
          // Add more specific selectors based on Viagogo's structure
          '.event-detail-module__prices',
          '.offer-price',
          '.viagogo-price',
          '[data-testid*="price"]',
          '[data-qa*="price"]',
          'span.currency-value',
          'div.ticket-pricing',
          'div.current-bid-price'
        ];
        
        for (const selector of selectors) {
          const elements = $(selector);
          if (elements.length > 0) {
            console.log(`Found ${elements.length} elements with selector "${selector}"`);
            elements.each((i, el) => {
              if (price) return; // Already found
              
              let elementText = $(el).text().trim();
              // If the element has data-price attribute, use that instead
              const dataPrice = $(el).attr('data-price');
              if (dataPrice) {
                elementText = dataPrice;
              }
              
              if (elementText) {
                console.log(`Element text: "${elementText}"`);
                // Look for price patterns
                const priceMatches = elementText.match(/€\s*(\d+(?:[,.]\d+)?)/g) || 
                                  elementText.match(/(\d+(?:[,.]\d+)?)\s*€/g) ||
                                  elementText.match(/(\d+(?:[,.]\d+)?)\s*EUR/gi);
                
                if (priceMatches && priceMatches.length > 0) {
                  price = priceMatches[0].trim();
                  console.log(`Extracted price from element: "${price}"`);
                }
              }
            });
          }
        }
      }

      // Method 4: Use regex to search for price patterns in the entire HTML
      if (!price) {
        // Look for price patterns in the entire HTML
        const htmlPricePatterns = [
          /€\s*(\d+(?:[,.]\d+)?)\s*each/gi,
          /(\d+(?:[,.]\d+)?)\s*€\s*each/gi,
          /€\s*(\d+(?:[,.]\d+)?)/gi,
          /(\d+(?:[,.]\d+)?)\s*€/gi,
          /(\d+(?:[,.]\d+)?)\s*EUR/gi
        ];
        
        for (const pattern of htmlPricePatterns) {
          const matches = html.match(pattern);
          if (matches && matches.length > 0) {
            price = matches[0].replace(/each/gi, '').trim();
            console.log(`HTML regex found price: "${price}"`);
            break;
          }
        }
      }

      // Method 5: Look for JSON data in script tags
      if (!price) {
        $('script').each((i, el) => {
          if (price) return; // Already found
          
          const scriptContent = $(el).html() || '';
          if (scriptContent.includes('"price"') || 
              scriptContent.includes('"Price"') || 
              scriptContent.includes('price:') || 
              scriptContent.includes('Price:')) {
            
            try {
              // Try to extract JSON data
              const jsonMatches = scriptContent.match(/\{[^{]*"price"[^}]*\}/gi) || 
                               scriptContent.match(/\{[^{]*"Price"[^}]*\}/gi) ||
                               scriptContent.match(/\{[^{]*price:[^}]*\}/gi);
              
              if (jsonMatches && jsonMatches.length > 0) {
                try {
                  const jsonData = JSON.parse(jsonMatches[0]);
                  if (jsonData.price) {
                    price = typeof jsonData.price === 'number' ? `€${jsonData.price}` : jsonData.price;
                    console.log(`Extracted price from JSON: "${price}"`);
                  }
                } catch (e) {
                  console.log(`Failed to parse JSON: ${e.message}`);
                }
              }
            } catch (e) {
              console.log(`Error processing script tag: ${e.message}`);
            }
          }
        });
      }

      // Clean up the price format if found
      if (price) {
        // Remove any non-price characters, keeping only €, digits, and decimal separators
        price = price.replace(/[^\d€,.]/g, '').trim();
        
        // Ensure price starts with €
        if (!price.includes('€')) {
          price = '€' + price;
        }
      }

      console.log(`Final extracted price: "${price}"`);

      // If we couldn't find a price in the HTML but had one from the URL, use that
      if (!price && priceFromUrl) {
        price = priceFromUrl;
        console.log(`Using price from URL as fallback: ${price}`);
      }

      return new Response(
        JSON.stringify({ 
          price: price || null,
          success: !!price 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (fetchError) {
      console.error("Error fetching/parsing page:", fetchError);
      
      // If web scraping failed but we have a URL-extracted price, return that
      if (priceFromUrl) {
        return new Response(
          JSON.stringify({ 
            price: priceFromUrl,
            success: true,
            note: "Web scraping failed, using price from URL"
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `Errore nel recupero/analisi della pagina: ${fetchError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: `Errore nel processare la richiesta: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
