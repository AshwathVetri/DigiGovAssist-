// Supabase Edge Function: create-razorpay-order
// Serves POST requests to create Razorpay Orders using server-side secret
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const keyId = Deno.env.get("RAZORPAY_KEY_ID") || "";
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET") || "";

    const { amount, currency = "INR", applicationId, serviceId, citizenName } = await req.json();

    if (!amount || !applicationId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: amount, applicationId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Convert amount in INR to Paise
    const amountInPaise = Math.round(Number(amount) * 100);

    // If live credentials are provided in Supabase secrets, invoke official Razorpay Orders API
    if (keyId && keySecret) {
      const basicAuth = btoa(`${keyId}:${keySecret}`);
      const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: currency,
          receipt: applicationId,
          notes: {
            application_id: applicationId,
            service_id: serviceId || "government_service",
            citizen_name: citizenName || "Citizen",
            portal: "DigiGovAssist",
          },
        }),
      });

      if (!rzpResponse.ok) {
        const errText = await rzpResponse.text();
        console.error("Razorpay API order error:", errText);
        return new Response(
          JSON.stringify({ error: "Failed to create Razorpay order", details: errText }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const orderData = await rzpResponse.json();
      return new Response(
        JSON.stringify({
          success: true,
          orderId: orderData.id,
          amount: orderData.amount / 100,
          currency: orderData.currency,
          keyId: keyId,
          isTestMode: true,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback: Prototype Simulated Test Order (when keys not yet provisioned in environment)
    const simulatedOrderId = `order_test_${Date.now()}`;
    return new Response(
      JSON.stringify({
        success: true,
        orderId: simulatedOrderId,
        amount: Number(amount),
        currency: currency,
        keyId: keyId || "rzp_test_digigov_demo",
        isTestMode: true,
        isSimulated: true,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
