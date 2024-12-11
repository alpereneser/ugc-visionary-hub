import { createClient } from '@supabase/supabase-js'
import { serve } from 'https://deno.fresh.dev/std@v9.6.1/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, userId } = await req.json()

    switch (action) {
      case 'deleteUser':
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)
        if (deleteError) throw deleteError
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'resetPassword':
        const { error: resetError } = await supabase.auth.admin.generateLink({
          type: 'recovery',
          email: userId, // We'll pass email instead of userId for password reset
        })
        if (resetError) throw resetError
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})