import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createWiseQuote, createWisePaymentLink } from './wise-service.ts';
import { WisePaymentData } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received Wise payment request');
    
    if (!req.body) {
      console.error('No request body provided');
      return new Response(
        JSON.stringify({ error: 'Request body is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const body: WisePaymentData = await req.json();
    console.log('Request body:', body);

    const { userId } = body;
    const amount = 50; // Fixed amount for lifetime access

    if (!userId) {
      console.error('Missing user_id in request');
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify Wise API credentials
    const wiseApiKey = Deno.env.get('WISE_API_KEY');
    const wiseProfileId = Deno.env.get('WISE_PROFILE_ID');

    if (!wiseApiKey || !wiseProfileId) {
      console.error('Missing Wise API configuration');
      return new Response(
        JSON.stringify({ error: 'Payment service configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create quote
    console.log('Creating Wise quote for amount:', amount);
    try {
      const quote = await createWiseQuote(amount);
      console.log('Wise quote created:', quote);

      // Create payment link
      console.log('Creating Wise payment link');
      const paymentUrl = await createWisePaymentLink(quote.id, userId);
      console.log('Wise payment link created:', paymentUrl);

      return new Response(
        JSON.stringify({ paymentUrl }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (error) {
      console.error('Wise API error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Payment service error',
          details: error.message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error('Error in handle-wise function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});