
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced browser-like headers to avoid being blocked
const browserHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'en-US,en;q=0.9,it;q=0.8',
  'Referer': 'https://www.google.com/',
  'DNT': '1',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Cache-Control': 'max-age=0',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'cross-site',
  'Sec-Fetch-User': '?1',
  'Pragma': 'no-cache',
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
    
    // Method 1: Direct price selectors - these are most likely to contain the actual lowest price
    const directPriceSelectors = [
      '.lowestPrice', // Common lowest price indicator
      '[data-testid="lowestPrice"]', // Test ID for lowest price
      '[data-testid="ticket-price"]', // Test ID for ticket price
      '[data-testid*="price"]', // Any test ID containing price
      '.price', // Generic price class
      '.ticket-price', // Common ticket price class
      '.listing-price', // Listing price
    ];
    
    for (const selector of directPriceSelectors) {
      $(selector).each((i, el) => {
        const text = $(el).text().trim();
        console.log(`Found direct price text: ${text}`);
        
        // Extract price using regex (both € and £ formats)
        const priceMatches = text.match(/[€£]\s?(\d+[,.]\d+|\d+)/g) || [];
        for (const match of priceMatches) {
          const numericPart = match.replace(/[€£]\s?/, '').replace(',', '.');
          const price = parseFloat(numericPart);
          if (!isNaN(price)) {
            console.log(`Extracted direct price: ${match} -> ${price}`);
            prices.push(price);
          }
        }
      });
    }
    
    // Method 2: Look for "From €X" text which often indicates the lowest price
    $(':contains("From"),:contains("from"),:contains("Da")').each((i, el) => {
      const text = $(el).text().trim();
      if (text.match(/[fF]rom\s+[€£]|[dD]a\s+[€£]/)) {
        console.log(`Found "from" price text: ${text}`);
        
        // Extract price 
        const fromPriceMatch = text.match(/[fF]rom\s+[€£]\s?(\d+[,.]\d+|\d+)|[dD]a\s+[€£]\s?(\d+[,.]\d+|\d+)/);
        if (fromPriceMatch) {
          const priceStr = (fromPriceMatch[1] || fromPriceMatch[2]).replace(',', '.');
          const price = parseFloat(priceStr);
          if (!isNaN(price)) {
            console.log(`Extracted "from" price: ${price}`);
            prices.push(price);
          }
        }
      }
    });
    
    // Method 3: Look for "each" which often accompanies the per-ticket price
    $(':contains("each"),:contains("ciascuno")').each((i, el) => {
      const text = $(el).text().trim();
      console.log(`Found "each" text: ${text}`);
      
      // Extract price using regex
      const eachPriceMatch = text.match(/[€£]\s?(\d+[,.]\d+|\d+)\s+each|[€£]\s?(\d+[,.]\d+|\d+)\s+ciascuno/i);
      if (eachPriceMatch) {
        const priceStr = (eachPriceMatch[1] || eachPriceMatch[2]).replace(',', '.');
        const price = parseFloat(priceStr);
        if (!isNaN(price)) {
          console.log(`Extracted "each" price: ${price}`);
          prices.push(price);
        }
      }
    });
    
    // Method 4: Check for structured pricing data in scripts
    $('script[type="application/ld+json"]').each((i, el) => {
      try {
        const jsonData = JSON.parse($(el).html() || '{}');
        if (jsonData.offers) {
          const offers = Array.isArray(jsonData.offers) ? jsonData.offers : [jsonData.offers];
          for (const offer of offers) {
            if (offer.price) {
              const price = parseFloat(offer.price);
              if (!isNaN(price)) {
                console.log(`Found structured data price: ${price}`);
                prices.push(price);
              }
            }
          }
        }
      } catch (e) {
        console.log('Error parsing JSON-LD:', e);
      }
    });
    
    // Method 5: Generic price extraction from all text content
    const bodyHtml = $.html();
    
    // Look for any text containing currency symbols followed by numbers
    const genericPriceRegex = /[€£]\s?(\d+[,.]\d+|\d+)/g;
    const allPrices = [...bodyHtml.matchAll(genericPriceRegex)];
    
    for (const match of allPrices) {
      const fullMatch = match[0];
      const numericPart = fullMatch.replace(/[€£]\s?/, '').replace(',', '.');
      const price = parseFloat(numericPart);
      if (!isNaN(price)) {
        console.log(`Found generic price: ${fullMatch} -> ${price}`);
        prices.push(price);
      }
    }
    
    // Look specifically for the minimum ticket price
    const minPriceRegex = /Min\s+price[^\d]+([€£]\s?\d+[,.]\d+|[€£]\s?\d+)/i;
    const minPriceMatch = bodyHtml.match(minPriceRegex);
    if (minPriceMatch) {
      const priceText = minPriceMatch[1];
      const numericPart = priceText.replace(/[€£]\s?/, '').replace(',', '.');
      const price = parseFloat(numericPart);
      if (!isNaN(price)) {
        console.log(`Found min price text: ${price}`);
        prices.push(price);
      }
    }
    
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
