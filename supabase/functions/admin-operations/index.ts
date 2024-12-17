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
        
        try {
          // First, delete user licenses
          const { error: licenseError } = await supabase
            .from('user_licenses')
            .delete()
            .eq('profile_id', userId)

          if (licenseError) {
            console.error('Error deleting user license:', licenseError)
            throw licenseError
          }

          // Then, delete payment receipts
          const { error: receiptError } = await supabase
            .from('payment_receipts')
            .delete()
            .eq('profile_id', userId)

          if (receiptError) {
            console.error('Error deleting payment receipts:', receiptError)
            throw receiptError
          }

          // Delete the profile
          const { error: profileError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId)

          if (profileError) {
            console.error('Error deleting profile:', profileError)
            throw profileError
          }

          // Finally delete the auth user
          const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)
          
          if (deleteError) {
            console.error('Error deleting user:', deleteError)
            throw deleteError
          }

          console.log('Successfully deleted user and related records')
          
          return new Response(
            JSON.stringify({ success: true }), 
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (error) {
          console.error('Error in delete process:', error)
          throw error
        }

      case 'resetPassword':
        console.log('Starting password reset for email:', userId)
        try {
          const { error: resetError } = await supabase.auth.admin.generateLink({
            type: 'recovery',
            email: userId,
          })

          if (resetError) {
            console.error('Error generating reset link:', resetError)
            throw resetError
          }

          console.log('Successfully generated password reset link')
          
          return new Response(
            JSON.stringify({ success: true }), 
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (error) {
          console.error('Error in password reset:', error)
          throw error
        }

      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Error in admin-operations:', error)
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})