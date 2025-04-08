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

    // Attempt to fetch the page content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
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

    // Try various selectors for price
    // Main price selector - most Viagogo pages have an element with price class
    let price = $('[class*="price"]').first().text().trim();
    console.log(`First attempt price: "${price}"`);

    // If not found, try other common selectors
    if (!price) {
      price = $('[class*="Price"]').first().text().trim();
      console.log(`Second attempt price: "${price}"`);
    }

    if (!price) {
      price = $('[data-price]').first().attr('data-price') || '';
      console.log(`Third attempt price: "${price}"`);
    }

    // Look for euro symbol + digits pattern in the HTML
    if (!price) {
      const priceMatch = html.match(/€\s*(\d+(?:[,.]\d+)?)/);
      if (priceMatch && priceMatch[0]) {
        price = priceMatch[0];
        console.log(`Regex attempt price: "${price}"`);
      }
    }

    // Clean up the price format
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
