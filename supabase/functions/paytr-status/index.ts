import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { PayTRStatusResponse } from "./types.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { merchant_oid } = await req.json()
    console.log('Checking payment status for order:', merchant_oid)

    if (!merchant_oid) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get PayTR credentials from environment
    const merchantId = Deno.env.get('PAYTR_MERCHANT_ID')
    const merchantKey = Deno.env.get('PAYTR_MERCHANT_KEY')
    const merchantSalt = Deno.env.get('PAYTR_MERCHANT_SALT')

    if (!merchantId || !merchantKey || !merchantSalt) {
      console.error('Missing PayTR credentials')
      return new Response(
        JSON.stringify({ error: 'Payment configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Generate hash string for PayTR token
    const hashStr = `${merchantId}${merchant_oid}${merchantSalt}`
    const hash = new TextEncoder().encode(hashStr)
    const hashBuffer = await crypto.subtle.digest('SHA-256', hash)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Create URLSearchParams for the request
    const params = new URLSearchParams()
    params.append('merchant_id', merchantId)
    params.append('merchant_oid', merchant_oid)
    params.append('paytr_token', hashHex)

    console.log('Sending request to PayTR with params:', Object.fromEntries(params))

    // Make request to PayTR API
    const paytrResponse = await fetch('https://www.paytr.com/odeme/durum-sorgu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    })

    if (!paytrResponse.ok) {
      const errorText = await paytrResponse.text()
      console.error('PayTR API error response:', {
        status: paytrResponse.status,
        statusText: paytrResponse.statusText,
        body: errorText
      })
      return new Response(
        JSON.stringify({ 
          error: 'Payment provider error', 
          details: errorText 
        }),
        { 
          status: paytrResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const responseText = await paytrResponse.text()
    console.log('PayTR API raw response:', responseText)

    let paytrResult: PayTRStatusResponse;
    try {
      paytrResult = JSON.parse(responseText)
    } catch (e) {
      console.error('Error parsing PayTR response:', e, 'Raw response:', responseText)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid response from payment provider',
          details: responseText
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('PayTR API parsed response:', paytrResult)

    if (paytrResult.status === 'success') {
      return new Response(
        JSON.stringify({
          status: paytrResult.status,
          payment_amount: paytrResult.payment_amount,
          payment_total: paytrResult.payment_total,
          payment_date: paytrResult.payment_date,
          currency: paytrResult.currency,
          taksit: paytrResult.taksit,
          kart_marka: paytrResult.kart_marka,
          masked_pan: paytrResult.masked_pan,
          odeme_tipi: paytrResult.odeme_tipi,
          test_mode: paytrResult.test_mode,
          returns: paytrResult.returns,
          reference_no: paytrResult.reference_no
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else {
      return new Response(
        JSON.stringify({ 
          error: paytrResult.err_msg || 'Payment status check failed',
          error_code: paytrResult.err_no,
          details: paytrResult
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }
  } catch (error) {
    console.error('Error in paytr-status function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})