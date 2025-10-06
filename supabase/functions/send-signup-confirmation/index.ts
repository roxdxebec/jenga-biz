import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignupEmailRequest {
  email: string;
  confirmationUrl?: string;
  subject?: string;
  text?: string;
  html?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: SignupEmailRequest = await req.json();

    // Log full payload in development to help debugging (best-effort)
    const isDev = (Deno.env.get('ENV') === 'development') || (Deno.env.get('DEV') === 'true');
    if (isDev) {
      try {
        console.log('send-signup-confirmation - incoming payload:', JSON.stringify(body));
      } catch (e) {
        console.log('send-signup-confirmation - incoming payload (unserializable)');
      }
    }

    const email = body.email;
    const confirmationUrl = body.confirmationUrl || '';
    const subject = body.subject || 'Welcome to Jenga Biz Africa - Confirm Your Email';
    const text = body.text || `Please confirm your email by visiting: ${confirmationUrl}`;
    const html = body.html || `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f97316; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Jenga Biz Africa!</h1>
          </div>
          
          <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <h2 style="color: #374151; margin-bottom: 20px;">Confirm Your Email Address</h2>
            
            <p style="color: #6b7280; margin-bottom: 25px; line-height: 1.6;">
              Thank you for joining Jenga Biz Africa! We're excited to help you build your business strategy.
            </p>
            
            <p style="color: #6b7280; margin-bottom: 25px; line-height: 1.6;">
              Please click the button below to confirm your email address and activate your account:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" style="background-color: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Confirm Email Address
              </a>
            </div>
            
            <p style="color: #6b7280; margin-bottom: 20px; line-height: 1.6;">
              If the button doesn't work, you can also copy and paste this link into your browser:
            </p>
            
            <p style="background-color: #f9fafb; padding: 15px; border-radius: 4px; word-break: break-all; font-family: monospace; font-size: 14px; color: #374151;">
              ${confirmationUrl}
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; margin-bottom: 10px;">
              If you didn't create an account with Jenga Biz Africa, you can safely ignore this email.
            </p>
            
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              Best regards,<br>
              The Jenga Biz Africa Team
            </p>
          </div>
        </div>
      `;

    console.log('Inviting user via Supabase Auth invite:', email);

    // Use Supabase Auth's invite endpoint so the project's configured mailer sends the invite.
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || Deno.env.get('VITE_SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('VITE_SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in function environment');
      return new Response(JSON.stringify({ error: 'server_config_missing', message: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in function environment' }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    const inviteUrl = `${supabaseUrl.replace(/\/$/, '')}/auth/v1/invite${confirmationUrl ? `?redirect_to=${encodeURIComponent(confirmationUrl)}` : ''}`;

    const inviteResponse = await fetch(inviteUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'x-api-key': serviceRoleKey,
      },
      body: JSON.stringify({ email }),
    });

    const inviteJson = await inviteResponse.text();
    let inviteBody: any = null;
    try { inviteBody = inviteJson ? JSON.parse(inviteJson) : null; } catch (e) { inviteBody = inviteJson; }

    if (!inviteResponse.ok) {
      console.error('Supabase invite failed:', inviteResponse.status, inviteBody);
      return new Response(JSON.stringify({ success: false, status: inviteResponse.status, details: inviteBody }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    console.log('Supabase invite response:', inviteResponse.status, inviteBody);

    return new Response(JSON.stringify({ success: true, data: inviteBody }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  } catch (error: any) {
    console.error('Error sending signup confirmation email:', error);
    return new Response(
      JSON.stringify({
        error: error?.message || String(error),
        details: error?.response?.body || null,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);