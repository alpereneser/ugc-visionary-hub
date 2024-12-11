import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

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
    // Parse request body
    let body;
    try {
      body = await req.json()
      console.log('Received request body:', body)
    } catch (e) {
      console.error('Error parsing request body:', e)
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

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

    // Fetch user data
    const { data: userData, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('email, full_name')
      .eq('id', user_id)
      .single()

    if (userError || !userData) {
      console.error('Error fetching user data:', userError)
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('User data retrieved:', userData)

    // Prepare PayTR parameters
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

    const merchantOid = `${user_id}-${Date.now()}`
    const amount = 5000 // $50.00
    const userIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '1.2.3.4'
    const origin = req.headers.get('origin') || 'https://tracefluence.com'
    
    console.log('Request details:', {
      merchantId,
      merchantOid,
      userEmail: userData.email,
      userName: userData.full_name,
      amount,
      userIp,
      origin
    })

    // Prepare payment data
    const paymentData = {
      merchant_id: merchantId,
      merchant_oid: merchantOid,
      email: userData.email,
      payment_amount: amount,
      currency: "USD",
      user_name: userData.full_name,
      merchant_ok_url: `${origin}/home`,
      merchant_fail_url: `${origin}/home`,
      user_basket: JSON.stringify([["Lifetime Access", "1", amount]]),
      user_ip: userIp,
      debug_on: 0,
      test_mode: 0,
      no_installment: 0,
      max_installment: 0,
      lang: 'en'
    }

    // Generate hash string
    const hashStr = `${merchantId}${merchantOid}${amount}${paymentData.merchant_ok_url}${paymentData.merchant_fail_url}${userData.email}${merchantSalt}`
    const hash = new TextEncoder().encode(hashStr)
    const hashBuffer = await crypto.subtle.digest('SHA-256', hash)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Create URLSearchParams
    const params = new URLSearchParams()
    Object.entries(paymentData).forEach(([key, value]) => {
      params.append(key, value.toString())
    })
    params.append('paytr_token', hashHex)

    console.log('Sending request to PayTR with params:', Object.fromEntries(params))

    // Make request to PayTR API
    const paytrResponse = await fetch('https://www.paytr.com/odeme/api/get-token', {
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
          details: errorText,
          status: paytrResponse.status
        }),
        { 
          status: paytrResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

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

    console.log('PayTR API parsed response:', paytrResult)

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