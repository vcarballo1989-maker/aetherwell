/**
 * @fileoverview Servidor HTTP de E-Commerce (Next.js Commerce API Routes + Storefront SSR).
 * Proporciona el storefront interactivo de AetherWell™ y endpoints de health, catálogo y checkout.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { loadCatalog } from './catalog/catalogService.js';
import { loadOperationalEnv, evaluateKycReadiness } from './config/env.js';
import { FinancialLedger } from './finance/ledger.js';
import {
  buildAndValidateCart,
  validateCustomerAndAddress,
  calculateShippingAndTax,
  createPaymentIntentSession,
  confirmOrderAndFulfill,
  executeFullCheckoutFunnel
} from './checkout/funnel.js';
import { renderHighConvertingStorefront } from './storefront/template.js';
import { renderAdminDashboard } from './admin/adminTemplate.js';

export function createCommerceServer(customLedger = null) {
  const envConfig = loadOperationalEnv();
  const ledger = customLedger || new FinancialLedger({ envConfig });

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

    const sendJson = (status, data) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(data, null, 2));
    };

    const parseBody = () =>
      new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            resolve(body ? JSON.parse(body) : {});
          } catch (e) {
            reject(e);
          }
        });
      });

    try {
      // 0. Archivos Estáticos (/assets/*)
      if (req.method === 'GET' && url.pathname.startsWith('/assets/')) {
        const fileName = path.basename(url.pathname);
        const filePath = path.join(process.cwd(), 'public', 'assets', fileName);
        if (fs.existsSync(filePath)) {
          const ext = path.extname(filePath).toLowerCase();
          const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml'
          };
          const contentType = mimeTypes[ext] || 'application/octet-stream';
          const fileStream = fs.createReadStream(filePath);
          res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400'
          });
          return fileStream.pipe(res);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          return res.end('Asset no encontrado');
        }
      }

      // 0.1. Panel Ejecutivo Privado de CEO (/admin)
      if (req.method === 'GET' && url.pathname === '/admin') {
        const currentEnv = loadOperationalEnv();
        const kycStatus = evaluateKycReadiness(currentEnv);
        const secretKey = currentEnv.stripe?.secretKey;

        let stripeBalance = { available: [], pending: [] };
        let stripeSessions = [];

        // Consulta en vivo a la API oficial de Stripe como base de datos inmutable
        if (secretKey && (secretKey.startsWith('sk_live_') || secretKey.startsWith('rk_live_') || secretKey.startsWith('sk_test_'))) {
          try {
            const [balRes, sessRes] = await Promise.all([
              fetch('https://api.stripe.com/v1/balance', {
                headers: { Authorization: `Bearer ${secretKey}` }
              }).catch(() => null),
              fetch('https://api.stripe.com/v1/checkout/sessions?limit=10', {
                headers: { Authorization: `Bearer ${secretKey}` }
              }).catch(() => null)
            ]);

            if (balRes && balRes.ok) {
              stripeBalance = await balRes.json();
            }
            if (sessRes && sessRes.ok) {
              const sessData = await sessRes.json();
              stripeSessions = sessData.data || [];
            }
          } catch (e) {
            console.warn('[Admin Portal] Error consultando API de Stripe:', e.message);
          }
        }

        const audit = ledger.run24hAudit();
        const html = renderAdminDashboard({
          stripeBalance,
          stripeSessions,
          audit,
          kycStatus,
          currentEnv
        });
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(html);
      }

      // 1. Storefront SSR Principal (Home)
      if (req.method === 'GET' && url.pathname === '/') {
        const catalogData = loadCatalog();
        const currentEnv = loadOperationalEnv();
        const kycStatus = evaluateKycReadiness(currentEnv);
        const html = renderHighConvertingStorefront(catalogData, kycStatus, ledger, currentEnv);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(html);
      }

      // 2. Health Check Endpoint (/api/health)
      if (req.method === 'GET' && url.pathname === '/api/health') {
        const currentEnv = loadOperationalEnv();
        const kycStatus = evaluateKycReadiness(currentEnv);
        return sendJson(200, {
          status: 'ok',
          uptime_seconds: process.uptime(),
          timestamp: new Date().toISOString(),
          brand: 'AetherWell™',
          port: Number(process.env.PORT || 3000),
          execution_mode: kycStatus.readyForLiveTraffic ? 'live' : 'sandbox',
          kyc_readiness: {
            readyForLiveTraffic: kycStatus.readyForLiveTraffic,
            message: kycStatus.message
          }
        });
      }

      // 3. Catálogo Dinámico (/api/catalog)
      if (req.method === 'GET' && url.pathname === '/api/catalog') {
        return sendJson(200, loadCatalog());
      }

      // 4. Telemetría y Balance Financiero (/api/finance/audit)
      if (req.method === 'GET' && url.pathname === '/api/finance/audit') {
        return sendJson(200, {
          audit: ledger.run24hAudit(),
          kycStatus: ledger.checkActivator1KycBanking(loadOperationalEnv())
        });
      }

      // 5. Checkout Completo Interactivo (/api/checkout y /api/checkout/full-funnel)
      if (
        req.method === 'POST' &&
        (url.pathname === '/api/checkout' || url.pathname === '/api/checkout/full-funnel')
      ) {
        const body = await parseBody();
        const currentEnv = loadOperationalEnv();
        const result = executeFullCheckoutFunnel({
          items: body.items,
          promoCode: body.promoCode || null,
          includeVipOrderBump: Boolean(body.includeVipOrderBump),
          customerInput: body.customerInput || {
            email: body.email || 'alex.rivera@techsolutions.com',
            fullName: body.fullName || 'Alex Rivera',
            phone: body.phone || '+1 305 555 0192',
            shippingAddress: body.shippingAddress || {
              addressLine1: '742 Brickell Ave',
              city: 'Miami',
              state: 'FL',
              postalCode: '33131',
              countryCode: 'US'
            }
          },
          shippingMethod: body.shippingMethod || 'standard',
          gateway: body.gateway || 'stripe',
          executionMode: body.executionMode || 'live',
          fraudRiskScore: body.fraudRiskScore || 10,
          platformApiStatus: 'active',
          ledger,
          customCatalog: loadCatalog().products,
          customEnvConfig: currentEnv
        });
        return sendJson(result.completed ? 200 : 400, result);
      }

      // 6. Creación de Sesión Real de Stripe Checkout Oficial (/api/checkout/stripe-session)
      if (req.method === 'POST' && url.pathname === '/api/checkout/stripe-session') {
        const body = await parseBody();
        const currentEnv = loadOperationalEnv();
        const secretKey = currentEnv.stripe.secretKey;
        const catalog = loadCatalog().products;

        const baseUrl = body.origin || `http://${req.headers.host || 'localhost:3000'}`;
        const items = Array.isArray(body.items) ? body.items : [];

        const params = new URLSearchParams();
        params.append('mode', 'payment');
        params.append('locale', 'es');
        params.append('success_url', `${baseUrl}/?session_id={CHECKOUT_SESSION_ID}&payment_status=success`);
        params.append('cancel_url', `${baseUrl}/?payment_status=cancelled`);
        params.append('metadata[brand]', 'AetherWell™');
        params.append('metadata[source]', 'aetherwell_dtc_storefront_spain');
        params.append('shipping_address_collection[allowed_countries][0]', 'ES');
        params.append('shipping_address_collection[allowed_countries][1]', 'PT');
        params.append('shipping_address_collection[allowed_countries][2]', 'FR');
        params.append('shipping_address_collection[allowed_countries][3]', 'IT');
        params.append('shipping_address_collection[allowed_countries][4]', 'DE');

        let subtotalCents = 0;
        let lineIdx = 0;

        for (const item of items) {
          const product = catalog.find((p) => p.id === item.productId || p.sku === item.productId);
          if (!product) continue;

          let unitPrice = product.price;
          if (item.unitPriceOverride && Number(item.unitPriceOverride) > 0) {
            unitPrice = Number(item.unitPriceOverride);
          } else if (item.isUpsell && product.upsellDiscountPct > 0) {
            unitPrice = +(product.price * (1 - product.upsellDiscountPct / 100)).toFixed(2);
          }
          const unitCents = Math.round(unitPrice * 100);
          const qty = Number(item.quantity || 1);
          subtotalCents += unitCents * qty;

          params.append(`line_items[${lineIdx}][price_data][currency]`, 'eur');
          params.append(`line_items[${lineIdx}][price_data][unit_amount]`, String(unitCents));
          params.append(`line_items[${lineIdx}][price_data][product_data][name]`, product.title);
          params.append(
            `line_items[${lineIdx}][price_data][product_data][description]`,
            item.isUpsell ? `Oferta Exclusiva AetherWell™ (${product.sku})` : product.description?.slice(0, 100) || `SKU: ${product.sku}`
          );
          params.append(`line_items[${lineIdx}][quantity]`, String(qty));
          lineIdx++;
        }

        // Si el subtotal es menor al umbral (45.00 EUR), añadir tarifa de envío
        if (subtotalCents < 4500) {
          params.append(`line_items[${lineIdx}][price_data][currency]`, 'eur');
          params.append(`line_items[${lineIdx}][price_data][unit_amount]`, '499');
          params.append(`line_items[${lineIdx}][price_data][product_data][name]`, 'Envío Rápido España Asegurado (Correos Express / CTT)');
          params.append(`line_items[${lineIdx}][quantity]`, '1');
        }

        if (body.customerInput?.email) {
          params.append('customer_email', body.customerInput.email);
        }

        const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${secretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });

        const stripeData = await stripeResponse.json();

        if (!stripeResponse.ok) {
          return sendJson(400, {
            error: stripeData.error?.message || 'Error al crear sesión en Stripe',
            stripeDetails: stripeData
          });
        }

        return sendJson(200, {
          success: true,
          sessionId: stripeData.id,
          url: stripeData.url,
          publishableKey: currentEnv.stripe.publishableKey,
          amountTotalEur: +(stripeData.amount_total / 100).toFixed(2),
          currency: stripeData.currency
        });
      }

      // Pasos granulares del embudo (API modular)
      if (req.method === 'POST' && url.pathname === '/api/checkout/cart') {
        const body = await parseBody();
        const result = buildAndValidateCart(body);
        return sendJson(result.valid ? 200 : 400, result);
      }

      if (req.method === 'POST' && url.pathname === '/api/checkout/validate-customer') {
        const body = await parseBody();
        const result = validateCustomerAndAddress(body);
        return sendJson(result.valid ? 200 : 400, result);
      }

      if (req.method === 'POST' && url.pathname === '/api/checkout/shipping-tax') {
        const body = await parseBody();
        const result = calculateShippingAndTax(body);
        return sendJson(result.valid ? 200 : 400, result);
      }

      if (req.method === 'POST' && url.pathname === '/api/checkout/payment-intent') {
        const body = await parseBody();
        const result = createPaymentIntentSession({ ...body, ledger });
        return sendJson(result.valid ? 200 : 400, result);
      }

      if (req.method === 'POST' && url.pathname === '/api/webhooks/stripe') {
        const body = await parseBody();
        const signature = req.headers['stripe-signature'] || body.webhookSignature;
        const result = confirmOrderAndFulfill({
          ...body,
          webhookSignature: signature,
          ledger
        });
        return sendJson(result.valid ? 200 : 400, result);
      }

      return sendJson(404, { error: 'Endpoint no encontrado' });
    } catch (err) {
      return sendJson(500, { error: err.message });
    }
  });

  return server;
}

if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  const port = Number(process.env.PORT || 3000);
  const server = createCommerceServer();
  server.listen(port, '0.0.0.0', () => {
    console.log(`[Antigravity Commerce] Servidor activo en http://0.0.0.0:${port}`);
  });
}
