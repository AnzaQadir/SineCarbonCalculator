import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import sgMail from 'https://esm.sh/@sendgrid/mail@7.7.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY')

    if (!supabaseUrl || !supabaseServiceRoleKey || !sendgridApiKey) {
      throw new Error('Missing required environment variables')
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Parse the request body to get user data
    const { user } = await req.json()

    if (!user || !user.email) {
      throw new Error('Invalid user data received')
    }

    // Count all rows in users table to determine queue number
    const { count, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Error counting users:', countError)
      throw new Error('Failed to count users')
    }

    const queueNumber = count || 0

    // Extract firstName from user metadata
    const firstName = user.user_metadata?.name || 'Friend'

    // Configure SendGrid
    sgMail.setApiKey(sendgridApiKey)

    // Prepare email data
    const msg = {
      to: user.email,
      from: 'noreply@yourdomain.com', // Replace with your verified sender
      templateId: 'd-XXXXX', // Replace with your actual SendGrid template ID
      dynamicTemplateData: {
        firstName: firstName,
        queueNumber: queueNumber
      }
    }

    // Send email
    const [response] = await sgMail.send(msg)

    console.log('Welcome email sent successfully:', {
      email: user.email,
      firstName: firstName,
      queueNumber: queueNumber,
      statusCode: response.statusCode
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Welcome email sent successfully',
        queueNumber: queueNumber
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in welcome-email function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
}) 