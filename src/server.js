/**
 * @fileoverview Servidor HTTP de E-Commerce (Next.js Commerce API Routes + Storefront SSR).
 */

import http from 'node:http';
import { loadCatalog } from './catalog/catalogService.js';
import { evaluateKycReadiness } from './config/env.js';
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

export function createCommerceServer(ledger = new FinancialLedger()) {
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
      if (req.method === 'GET' && url.pathname === '/') {
        const catalogData = loadCatalog();
        const kycStatus = evaluateKycReadiness();
        const html = renderHighConvertingStorefront(catalogData, kycStatus);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(html);
      }

      if (req.method === 'GET' && url.pathname === '/api/catalog') {
        return sendJson(200, loadCatalog());
      }

      if (req.method === 'GET' && url.pathname === '/api/finance/audit') {
        return sendJson(200, {
          audit: ledger.run24hAudit(),
          kycStatus: ledger.checkActivator1KycBanking()
        });
      }

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

      if (req.method === 'POST' && url.pathname === '/api/checkout/full-funnel') {
        const body = await parseBody();
        const result = executeFullCheckoutFunnel({ ...body, ledger });
        return sendJson(result.completed ? 200 : 400, result);
      }

      return sendJson(404, { error: 'Endpoint no encontrado' });
    } catch (err) {
      return sendJson(500, { error: err.message });
    }
  });

  return server;
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
  const port = Number(process.env.PORT || 3000);
  const server = createCommerceServer();
  server.listen(port, () => {
    console.log(`[Antigravity Commerce] Servidor activo en http://localhost:${port}`);
  });
}
