
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuration
const VIAGOGO_API_BASE_URL = "https://api.viagogo.net/v2";
const VIAGOGO_TOKEN_URL = "https://api.viagogo.net/oauth2/token";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, eventId } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'Missing Viagogo URL' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing Viagogo URL: ${url}`);
    
    // First, we need to get an OAuth token
    // In a production environment, you should use client credentials flow
    // For now, we'll use the client ID and secret from environment variables
    const clientId = Deno.env.get("VIAGOGO_CLIENT_ID");
    const clientSecret = Deno.env.get("VIAGOGO_CLIENT_SECRET");
    
    if (!clientId || !clientSecret) {
      console.error("Missing Viagogo API credentials");
      return new Response(
        JSON.stringify({ error: 'Viagogo API credentials not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Extract event ID from URL if not provided
    let targetEventId = eventId;
    if (!targetEventId && url) {
      // Try to extract event ID from URL
      // Example URL format: https://www.viagogo.com/it/Biglietti-Concerti/Rock-e-Pop/Coldplay-Biglietti/E-150276831
      const eventIdMatch = url.match(/\/E-(\d+)(?:\?|$)/);
      if (eventIdMatch && eventIdMatch[1]) {
        targetEventId = eventIdMatch[1];
        console.log(`Extracted event ID from URL: ${targetEventId}`);
      } else {
        console.log("Could not extract event ID from URL, attempting to fetch page and extract ID");
        // If we can't extract from URL directly, we might need to request the page
        // and parse it for the event ID, but we'll handle that in future updates
        return new Response(
          JSON.stringify({ error: 'Could not determine event ID. Please provide a direct event URL (containing E-XXXXXXX)' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Get access token
    console.log("Requesting OAuth token");
    const tokenResponse = await fetch(VIAGOGO_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'scope': 'read'
      })
    });
    
    if (!tokenResponse.ok) {
      const tokenErrorText = await tokenResponse.text();
      console.error("Error obtaining access token:", tokenErrorText);
      return new Response(
        JSON.stringify({ error: 'Failed to authenticate with Viagogo API' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    if (!accessToken) {
      console.error("No access token in response:", tokenData);
      return new Response(
        JSON.stringify({ error: 'Could not obtain access token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log("Successfully obtained access token");
    
    // Now we can fetch the event details
    const eventUrl = `${VIAGOGO_API_BASE_URL}/events/${targetEventId}`;
    console.log(`Fetching event details from: ${eventUrl}`);
    
    const eventResponse = await fetch(eventUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });
    
    if (!eventResponse.ok) {
      const eventErrorText = await eventResponse.text();
      console.error("Error fetching event details:", eventErrorText);
      return new Response(
        JSON.stringify({ error: 'Failed to retrieve event details from Viagogo API' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const eventData = await eventResponse.json();
    console.log("Received event data:", JSON.stringify(eventData).substring(0, 200) + "...");
    
    // Now let's fetch the listings for this event to get the lowest price
    const listingsUrl = `${VIAGOGO_API_BASE_URL}/events/${targetEventId}/listings`;
    console.log(`Fetching listings from: ${listingsUrl}`);
    
    const listingsResponse = await fetch(listingsUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });
    
    if (!listingsResponse.ok) {
      const listingsErrorText = await listingsResponse.text();
      console.error("Error fetching listings:", listingsErrorText);
      return new Response(
        JSON.stringify({ error: 'Failed to retrieve ticket listings from Viagogo API' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const listingsData = await listingsResponse.json();
    console.log(`Retrieved ${listingsData.items?.length || 0} listings`);
    
    // Process listings to find the lowest price
    if (listingsData.items && listingsData.items.length > 0) {
      // Sort listings by price (ascending)
      const sortedListings = listingsData.items.sort((a, b) => {
        const priceA = a.pricing?.amount?.amount || Infinity;
        const priceB = b.pricing?.amount?.amount || Infinity;
        return priceA - priceB;
      });
      
      const lowestPriceListing = sortedListings[0];
      if (lowestPriceListing && lowestPriceListing.pricing?.amount) {
        const price = lowestPriceListing.pricing.amount.amount;
        const currency = lowestPriceListing.pricing.amount.currency;
        
        console.log(`Lowest price found: ${currency}${price}`);
        
        // Return the price information
        return new Response(
          JSON.stringify({ 
            price: `${currency}${price.toFixed(2)}`,
            eventName: eventData.name || "Unknown Event",
            eventDate: eventData.startTime || null,
            venue: eventData.venue?.name || null,
            url: url
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // If we get here, we couldn't find any listings
    console.log("No listings found with price information");
    return new Response(
      JSON.stringify({ error: 'No ticket listings found for this event' }),
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
