import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders, PAYMENT_AMOUNT, DEFAULT_USER_IP } from './config.ts'
import { generatePayTRToken, makePayTRRequest, getUserData } from './paytr-service.ts'
import { PayTRRequestBody, PayTRPaymentData } from './types.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse request body
    const body: PayTRRequestBody = await req.json()
    console.log('Received request body:', body)

    const { user_id } = body
    if (!user_id) {
      console.error('Missing user_id in request')
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get PayTR credentials
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

    // Get user data
    const userData = await getUserData(supabaseAdmin, user_id)
    console.log('User data retrieved:', userData)

    // Prepare payment data
    const merchantOid = `${user_id}-${Date.now()}`
    const userIp = req.headers.get('x-forwarded-for')?.split(',')[0] || DEFAULT_USER_IP
    const origin = req.headers.get('origin') || 'https://tracefluence.com'

    const paymentData: PayTRPaymentData = {
      merchant_id: merchantId,
      merchant_oid: merchantOid,
      email: userData.email,
      payment_amount: PAYMENT_AMOUNT,
      currency: "USD",
      user_name: userData.full_name,
      merchant_ok_url: `${origin}/home`,
      merchant_fail_url: `${origin}/home`,
      user_basket: JSON.stringify([["Lifetime Access", "1", PAYMENT_AMOUNT]]),
      user_ip: userIp,
      debug_on: 0,
      test_mode: 0,
      no_installment: 0,
      max_installment: 0,
      lang: 'en'
    }

    // Generate hash
    const hashHex = await generatePayTRToken(
      merchantId,
      merchantOid,
      PAYMENT_AMOUNT,
      paymentData.merchant_ok_url,
      paymentData.merchant_fail_url,
      userData.email,
      merchantSalt
    )

    // Create URLSearchParams
    const params = new URLSearchParams()
    Object.entries(paymentData).forEach(([key, value]) => {
      params.append(key, value.toString())
    })
    params.append('paytr_token', hashHex)

    console.log('Sending request to PayTR with params:', Object.fromEntries(params))

    // Make request to PayTR API
    const paytrResponse = await makePayTRRequest(params)
    const responseText = await paytrResponse.text()
    console.log('PayTR API raw response:', responseText)

    let paytrResult;
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

    if (paytrResult.status === 'success') {
      return new Response(
        JSON.stringify({
          paymentUrl: `https://www.paytr.com/odeme/guvenli/${paytrResult.token}`,
          merchantOid: merchantOid
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else {
      return new Response(
        JSON.stringify({ 
          error: 'Payment initialization failed',
          details: paytrResult.reason || 'Unknown error'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }
  } catch (error) {
    console.error('Error in handle-paytr function:', error)
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