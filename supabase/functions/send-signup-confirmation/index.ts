import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignupEmailRequest {
  email: string;
  confirmationUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmationUrl }: SignupEmailRequest = await req.json();

    console.log('Sending signup confirmation email to:', email);

    const emailResponse = await resend.emails.send({
      from: "Jenga Biz Africa <support@jengabiz.africa>",
      to: [email],
      subject: "Welcome to Jenga Biz Africa - Confirm Your Email",
      html: `
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
      `,
    });

    console.log("Signup confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, messageId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending signup confirmation email:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.response?.body || 'Unknown error'
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);