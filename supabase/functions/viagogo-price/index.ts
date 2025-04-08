
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

    // Use a proxy service or direct fetch with appropriate headers
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,it;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://www.google.com/',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      console.error(`Failed to fetch page: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ error: `Errore nel recupero della pagina: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const html = await response.text();
    console.log(`Page fetched, parsing HTML (length: ${html.length})`);

    // Parse the HTML content using cheerio
    const $ = cheerio.load(html);

    // Find prices using various selectors, focusing on patterns with "each"
    let price = null;
    
    // Method 1: Look for elements containing "each" text
    $("*:contains('each')").each((i, el) => {
      if (price) return; // Already found
      const text = $(el).text();
      const priceMatch = text.match(/€\s*(\d+(?:[,.]\d+)?)\s*each/i) || 
                         text.match(/(\d+(?:[,.]\d+)?)\s*€\s*each/i) ||
                         text.match(/(\d+(?:[,.]\d+)?)\s*EUR\s*each/i);
      
      if (priceMatch) {
        console.log(`Found price with "each" pattern: "${priceMatch[0]}"`);
        price = priceMatch[0].replace(/each/i, '').trim();
      }
    });

    // Method 2: Try various common price selectors
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
        '.event-price'
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

    // Method 3: Use regex to search for price patterns in the entire HTML
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

    // Method 4: Look for JSON data in script tags
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
                               scriptContent.match(/\{[^{]*"Price"[^}]*\}/gi);
            
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

    return new Response(
      JSON.stringify({ 
        price: price || null,
        success: !!price 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: `Errore nel processare la richiesta: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
