import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

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
        console.log('Starting user deletion process for userId:', userId)
        
        // First, get the user's profile ID
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError)
          throw profileError
        }

        // Update payment receipts to remove references
        const { error: updateError } = await supabase
          .from('payment_receipts')
          .update({ 
            user_id: null,
            status: 'deleted'
          })
          .eq('profile_id', profileData.id)

        if (updateError) {
          console.error('Error updating payment receipts:', updateError)
          throw updateError
        }

        console.log('Successfully updated payment receipts')

        // Then delete the user
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)
        if (deleteError) {
          console.error('Error deleting user:', deleteError)
          throw deleteError
        }

        console.log('Successfully deleted user')

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
    console.error('Error in admin-operations:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})