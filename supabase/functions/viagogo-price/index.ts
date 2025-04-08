
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Browser-like headers to avoid being blocked
const browserHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Referer': 'https://www.google.com/',
  'DNT': '1',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Cache-Control': 'max-age=0',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url || !url.includes('viagogo')) {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing Viagogo URL' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching URL: ${url}`);
    
    // Fetch the page content
    const response = await fetch(url, { headers: browserHeaders });
    const html = await response.text();
    
    // Check if we hit a consent page
    if (html.includes('consent') && (html.includes('Continue to site') || html.includes('I agree'))) {
      console.log('Detected consent page, special handling needed');
      return new Response(
        JSON.stringify({ error: 'Consent page detected, open the link directly' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Load the HTML into cheerio
    const $ = cheerio.load(html);
    
    // Array to store all found prices
    const prices: number[] = [];
    
    // Multiple selectors and methods to extract prices
    // Method 1: Look for price elements with various selectors
    const priceSelectors = [
      '.event-ticket__price', // Common price selector
      '[data-tid="ticket-price"]', // Data attribute specific to tickets
      '.price', // Generic price class
      '.price-amount', // Another common price class
      'span:contains("€")', // Any span with euro symbol
      'div:contains("€")', // Any div with euro symbol
      'span:contains("each")', // Find by "each" text which often follows prices
      '.ticket-price', // Another common class
    ];
    
    // Try each selector
    for (const selector of priceSelectors) {
      $(selector).each((i, el) => {
        // Get the text content
        const text = $(el).text().trim();
        console.log(`Found potential price text: ${text}`);
        
        // Extract price using regex - looking for patterns like €123,45 or €123.45
        const priceMatch = text.match(/€\s?(\d+[,.]\d+|\d+)/);
        if (priceMatch) {
          // Convert to number, handling both comma and period as decimal separators
          let priceStr = priceMatch[1].replace(',', '.');
          const price = parseFloat(priceStr);
          if (!isNaN(price)) {
            console.log(`Extracted valid price: €${price}`);
            prices.push(price);
          }
        }
      });
    }
    
    // Method 2: Look for elements with "each" and extract preceding price
    $('*:contains("each")').each((i, el) => {
      const text = $(el).text().trim();
      console.log(`Found "each" text: ${text}`);
      
      // Try to find price before "each"
      const eachPriceMatch = text.match(/€\s?(\d+[,.]\d+|\d+).*each/i);
      if (eachPriceMatch) {
        let priceStr = eachPriceMatch[1].replace(',', '.');
        const price = parseFloat(priceStr);
        if (!isNaN(price)) {
          console.log(`Extracted "each" price: €${price}`);
          prices.push(price);
        }
      }
    });
    
    // Method 3: Try to find structured data in script tags
    $('script[type="application/ld+json"]').each((i, el) => {
      try {
        const jsonData = JSON.parse($(el).html() || '{}');
        if (jsonData.offers && jsonData.offers.price) {
          const price = parseFloat(jsonData.offers.price);
          if (!isNaN(price)) {
            console.log(`Found structured data price: €${price}`);
            prices.push(price);
          }
        }
      } catch (e) {
        console.log('Error parsing JSON-LD:', e);
      }
    });
    
    console.log(`All extracted prices: ${JSON.stringify(prices)}`);
    
    // If we found prices, return the lowest one
    if (prices.length > 0) {
      const lowestPrice = Math.min(...prices);
      console.log(`Returning lowest price: €${lowestPrice}`);
      return new Response(
        JSON.stringify({ price: `€${lowestPrice.toFixed(2)}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If no prices found, return an error
    console.log('No prices found on the page');
    return new Response(
      JSON.stringify({ error: 'Impossibile estrarre il prezzo' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: `Error: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
