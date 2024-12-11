import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createWiseQuote, createWisePaymentLink } from './wise-service.ts';
import { WisePaymentData } from './types.ts';

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
    console.log('Received Wise payment request');
    
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

    // Create quote
    console.log('Creating Wise quote for amount:', amount);
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
    console.error('Error in handle-wise function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Payment initialization failed',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});