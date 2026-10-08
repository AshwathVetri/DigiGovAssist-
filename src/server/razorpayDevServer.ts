import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { Plugin, ViteDevServer } from 'vite';

/**
 * Loads backend environment variables from .env on the server only.
 * Razorpay Key Secret is NEVER bundled or sent to the client.
 */
function getBackendEnv() {
  try {
    const envFile = path.resolve(process.cwd(), '.env');
    if (!fs.existsSync(envFile)) return {};
    const content = fs.readFileSync(envFile, 'utf-8');
    const env: Record<string, string> = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        env[key] = val;
      }
    }
    return env;
  } catch {
    return {};
  }
}

/**
 * Vite Dev Server Backend Plugin for Razorpay Test Mode.
 * Emulates the Supabase Edge Functions in local development:
 * - POST /api/payment/create-order
 * - POST /api/payment/verify-signature
 * - GET  /api/payment/status
 */
export function razorpayDevServerPlugin(): Plugin {
  return {
    name: 'razorpay-dev-server-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];

        // 1. GET /api/payment/status
        if (req.method === 'GET' && url === '/api/payment/status') {
          const env = getBackendEnv();
          const keyId = env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || '';
          const keySecret = env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || '';
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              configured: Boolean(keyId && keySecret),
              hasKeyId: Boolean(keyId),
              hasKeySecret: Boolean(keySecret),
              keyIdMasked: keyId ? `${keyId.slice(0, 8)}...` : null,
              testMode: true,
              portal: 'DigiGovAssist Secure Payment Gateway',
            })
          );
          return;
        }

        // 2. POST /api/payment/create-order
        if (req.method === 'POST' && url === '/api/payment/create-order') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const { amount, currency = 'INR', applicationId, serviceId, citizenName } = data;

              if (!amount || !applicationId) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Missing amount or applicationId' }));
                return;
              }

              const env = getBackendEnv();
              const keyId = env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || '';
              const keySecret = env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || '';

              // If live Razorpay Test Keys are configured, make real Razorpay Orders API call
              if (keyId && keySecret && keyId.startsWith('rzp_test_')) {
                const amountInPaise = Math.round(Number(amount) * 100);
                const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

                const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${basicAuth}`,
                  },
                  body: JSON.stringify({
                    amount: amountInPaise,
                    currency,
                    receipt: applicationId.slice(0, 40),
                    notes: {
                      application_id: applicationId,
                      service_id: serviceId || 'government_service',
                      citizen_name: citizenName || 'Arjun Kumar',
                      portal: 'DigiGovAssist',
                      mode: 'TEST_MODE',
                    },
                  }),
                });

                if (rzpResponse.ok) {
                  const rzpData = (await rzpResponse.json()) as any;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(
                    JSON.stringify({
                      success: true,
                      orderId: rzpData.id,
                      amount: rzpData.amount / 100,
                      currency: rzpData.currency,
                      keyId: keyId,
                      isTestMode: true,
                      isLiveCredentials: true,
                    })
                  );
                  return;
                } else {
                  const errorText = await rzpResponse.text();
                  console.warn('Razorpay Live Order API returned error, falling back to simulated order:', errorText);
                }
              }

              // Fallback / Simulated Test Order (works out of the box before user enters keys or for local testing)
              const simulatedOrderId = `order_test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  orderId: simulatedOrderId,
                  amount: Number(amount),
                  currency: currency,
                  keyId: keyId || 'rzp_test_digigov_demo',
                  isTestMode: true,
                  isSimulated: true,
                })
              );
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Server error' }));
            }
          });
          return;
        }

        // 3. POST /api/payment/verify-signature
        if (req.method === 'POST' && url === '/api/payment/verify-signature') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const { orderId, paymentId, signature, isSimulated } = data;

              if (!orderId || !paymentId) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ verified: false, error: 'Missing orderId or paymentId' }));
                return;
              }

              // Simulated Test Order verification
              if (isSimulated || orderId.startsWith('order_test_')) {
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    verified: true,
                    message: 'Payment verified successfully in Razorpay Test Mode (Simulated).',
                    orderId,
                    paymentId,
                    isTestMode: true,
                  })
                );
                return;
              }

              const env = getBackendEnv();
              const keySecret = env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || '';

              if (!keySecret) {
                // If secret is not configured, accept payment with verification flag
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    verified: Boolean(signature),
                    message: 'Payment accepted in Test Mode (Signature present).',
                    orderId,
                    paymentId,
                    isTestMode: true,
                  })
                );
                return;
              }

              // Compute real HMAC SHA-256 with keySecret on backend
              const payload = `${orderId}|${paymentId}`;
              const expectedSignature = crypto
                .createHmac('sha256', keySecret)
                .update(payload)
                .digest('hex');

              const isMatch = expectedSignature === signature;

              res.setHeader('Content-Type', 'application/json');
              if (isMatch) {
                res.end(
                  JSON.stringify({
                    verified: true,
                    message: 'Server HMAC-SHA256 signature verified successfully.',
                    orderId,
                    paymentId,
                    isTestMode: true,
                  })
                );
              } else {
                res.statusCode = 400;
                res.end(
                  JSON.stringify({
                    verified: false,
                    error: 'Razorpay HMAC-SHA256 signature mismatch.',
                  })
                );
              }
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ verified: false, error: err.message || 'Server error' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}
