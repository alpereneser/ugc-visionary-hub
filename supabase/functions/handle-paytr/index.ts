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
    const { user_id } = await req.json()

    if (!user_id) {
      throw new Error('User ID is required')
    }

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user details
    const { data: userData, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('email, full_name')
      .eq('id', user_id)
      .single()

    if (userError || !userData) {
      console.error('Error fetching user data:', userError)
      throw new Error('User not found')
    }

    // Generate a unique payment ID
    const merchantOid = `${user_id}-${Date.now()}`
    
    // PayTR requires amount in cents (1 USD = 100 cents)
    const amount = 5000 // $50.00

    // Get user's IP address from request headers
    const userIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '1.2.3.4'

    // Get the origin, defaulting to tracefluence.com
    const origin = req.headers.get('origin') || 'https://tracefluence.com'
    console.log('Request origin:', origin)

    // Prepare payment data
    const paytrData = {
      merchant_id: Deno.env.get('PAYTR_MERCHANT_ID'),
      merchant_oid: merchantOid,
      email: userData.email,
      payment_amount: amount,
      currency: "USD",
      user_name: userData.full_name,
      merchant_ok_url: `${origin}/home`,
      merchant_fail_url: `${origin}/home`,
      user_basket: JSON.stringify([["Lifetime Access", "1", amount]]),
      user_ip: userIp,
      debug_on: 0, // Set to 0 for production
      test_mode: 0, // Set to 0 for production
      no_installment: 0,
      max_installment: 0
    }

    console.log('PayTR request data:', {
      ...paytrData,
      merchant_id: '***hidden***', // Hide sensitive data in logs
    })

    // Generate hash string
    const hashStr = `${Deno.env.get('PAYTR_MERCHANT_ID')}${paytrData.merchant_oid}${paytrData.payment_amount}${paytrData.merchant_ok_url}${paytrData.merchant_fail_url}${paytrData.email}${Deno.env.get('PAYTR_MERCHANT_SALT')}`
    const hash = new TextEncoder().encode(hashStr)
    const hashBuffer = await crypto.subtle.digest('SHA-256', hash)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Add token to payment data
    paytrData.paytr_token = hashHex

    // Make request to PayTR API
    const paytrResponse = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      body: new URLSearchParams(paytrData),
    })

    const paytrResult = await paytrResponse.json()
    console.log('PayTR API response:', paytrResult)

    if (paytrResult.status === 'success') {
      return new Response(
        JSON.stringify({
          paymentUrl: `https://www.paytr.com/odeme/guvenli/${paytrResult.token}`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else {
      throw new Error(paytrResult.reason || 'Payment initialization failed')
    }
  } catch (error) {
    console.error('Error in handle-paytr function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})