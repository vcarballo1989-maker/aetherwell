/**
 * @fileoverview Paso 5 del Embudo de Pago (`order_fulfillment`):
 * Confirmación de orden, validación criptográfica de webhook de liquidación (Stripe/Shopify),
 * disparo automático de orden a API de proveedor (Zendrop/AliExpress) y asiento contable en Ledger.
 */

import crypto from 'node:crypto';
import { DEFAULT_CONFIG } from '../config/env.js';
import { signWebhookPayload } from './step4_payment_intent.js';

/**
 * Simula el disparo de cumplimiento de dropshipping hacia la API de Zendrop / AliExpress.
 * @param {object} params
 * @param {string} params.orderId
 * @param {object} params.cart
 * @param {object} params.customer
 * @param {string} params.shippingMethod
 */
export function dispatchSupplierFulfillment({ orderId, cart, customer, shippingMethod }) {
  const supplierOrders = cart.items
    .filter((item) => item.supplier !== 'AntigravityInternal')
    .map((item) => ({
      fulfillmentId: `zd_ful_${crypto.randomBytes(5).toString('hex')}`,
      supplier: item.supplier || 'Zendrop',
      supplierProductId: item.supplierProductId,
      sku: item.sku,
      quantity: item.quantity,
      unitSupplierCost: item.unitSupplierCost,
      lineSupplierCost: item.lineSupplierCost,
      carrier: shippingMethod === 'express' ? 'Zendrop VIP Express Air' : 'Zendrop Direct Line',
      trackingNumber: `ZD${Math.floor(100000000 + Math.random() * 900000000)}US`,
      status: 'dispatched_to_supplier'
    }));

  return {
    dispatched: true,
    orderId,
    destinationCountry: customer.shippingAddress.countryCode,
    supplierOrdersCount: supplierOrders.length,
    supplierOrders,
    dispatchedAt: new Date().toISOString()
  };
}

/**
 * Procesa el webhook de liquidación de pago, confirma el pedido, dispara el fulfillment a Zendrop/AliExpress
 * y registra el ingreso liquidado en el libro contable (Paso 5).
 *
 * @param {object} params
 * @param {object} params.cart Resultado validado del Paso 1
 * @param {object} params.customerValidation Resultado validado del Paso 2
 * @param {object} params.shippingTax Resultado validado del Paso 3
 * @param {object} params.paymentIntent Resultado validado del Paso 4
 * @param {object} params.webhookEvent Evento recibido del webhook de Stripe/Shopify
 * @param {string} params.webhookEvent.type Tipo de evento ('payment_intent.succeeded' | 'checkout.session.completed' | 'charge.dispute.created')
 * @param {string} params.webhookEvent.paymentIntentId ID del intento de pago
 * @param {string} [params.webhookSignature] Firma HMAC recibida en cabecera `Stripe-Signature`
 * @param {string} [params.webhookSecret] Secreto del webhook para verificar firma
 * @param {import('../finance/ledger.js').FinancialLedger} [params.ledger] Instancia del libro contable
 * @param {boolean} [params.deductSupplierCostOnSettlement=true] Si se descuenta el coste de proveedor al liquidar en el ledger
 */
export function confirmOrderAndFulfill({
  cart,
  customerValidation,
  shippingTax,
  paymentIntent,
  webhookEvent,
  webhookSignature = null,
  webhookSecret = DEFAULT_CONFIG.stripe.webhookSecret,
  ledger = null,
  deductSupplierCostOnSettlement = true
} = {}) {
  if (!cart?.valid || !customerValidation?.valid || !shippingTax?.valid || !paymentIntent?.valid) {
    return {
      valid: false,
      step: 'order_fulfillment',
      errorCode: 'INVALID_FUNNEL_STATE',
      errorMessage: 'No se puede confirmar una orden sin haber completado los pasos 1 a 4.'
    };
  }

  if (!webhookEvent || !webhookEvent.type) {
    return {
      valid: false,
      step: 'order_fulfillment',
      errorCode: 'MISSING_WEBHOOK_EVENT',
      errorMessage: 'Se requiere un evento de webhook de pasarela para liquidar la orden.'
    };
  }

  // Verificación criptográfica de firma del webhook
  const serializedPayload = JSON.stringify(webhookEvent);
  const expectedSignature = signWebhookPayload(serializedPayload, webhookSecret);
  if (!webhookSignature || webhookSignature !== expectedSignature) {
    return {
      valid: false,
      step: 'order_fulfillment',
      errorCode: 'INVALID_WEBHOOK_SIGNATURE',
      errorMessage: 'Firma criptográfica del webhook inválida. Posible intento de falsificación.'
    };
  }

  // Verificar coincidencia del PaymentIntent ID
  if (webhookEvent.paymentIntentId !== paymentIntent.paymentIntentId) {
    return {
      valid: false,
      step: 'order_fulfillment',
      errorCode: 'PAYMENT_INTENT_MISMATCH',
      errorMessage: 'El ID de intento de pago del webhook no coincide con la sesión activa.'
    };
  }

  const orderId = `ORD-AG-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const grandTotal = shippingTax.breakdown.grandTotal;

  // Caso especial: Disputa / Contracargo de alto riesgo -> Activador 2 HITL
  if (webhookEvent.type === 'charge.dispute.created') {
    const hitl2 = ledger
      ? ledger.checkActivator2FinancialRisk({
          type: 'chargeback_dispute',
          orderId,
          amountUsd: grandTotal,
          riskScore: 99
        })
      : {
          triggered: true,
          alert: {
            code: 'ACTIVATOR_2_FINANCIAL_RISK',
            reason: `Disputa/contracargo abierto en orden ${orderId}`
          }
        };

    return {
      valid: false,
      step: 'order_fulfillment',
      orderId,
      errorCode: 'CHARGEBACK_DISPUTE_TRIGGERED',
      errorMessage: hitl2.alert?.reason,
      hitlTriggered: true,
      hitlCode: 'ACTIVATOR_2_FINANCIAL_RISK',
      hitlAlert: hitl2.alert
    };
  }

  const supportedSuccessEvents = new Set([
    'payment_intent.succeeded',
    'checkout.session.completed'
  ]);
  if (!supportedSuccessEvents.has(webhookEvent.type)) {
    return {
      valid: false,
      step: 'order_fulfillment',
      errorCode: 'UNHANDLED_WEBHOOK_EVENT',
      errorMessage: `El evento "${webhookEvent.type}" no corresponde a una liquidación exitosa.`
    };
  }

  // Cálculo de comisión de Stripe (2.9% + $0.30 USD) y coste de proveedor Zendrop
  const gatewayFee = +(grandTotal * 0.029 + 0.3).toFixed(2);
  const supplierCost = cart.supplierCostTotal;
  const settledAmount = deductSupplierCostOnSettlement
    ? Math.max(0, +(grandTotal - gatewayFee - supplierCost).toFixed(2))
    : Math.max(0, +(grandTotal - gatewayFee).toFixed(2));

  // Disparo automático a la API de Zendrop / AliExpress
  const fulfillment = dispatchSupplierFulfillment({
    orderId,
    cart,
    customer: customerValidation.customer,
    shippingMethod: shippingTax.shippingMethod
  });

  // Registro contable en el Ledger Financiero
  let ledgerEntry = null;
  if (ledger) {
    ledgerEntry = ledger.recordSettledRevenue({
      orderId,
      grossAmount: grandTotal,
      supplierCost,
      gatewayFee,
      settledAmount
    });
  }

  return {
    valid: true,
    step: 'order_fulfillment',
    orderId,
    orderStatus: 'PAID_AND_FULFILLED',
    paymentIntentId: paymentIntent.paymentIntentId,
    shopifyCheckoutId: paymentIntent.shopifyCheckoutId,
    customerEmail: customerValidation.customer.email,
    financialSettlement: {
      grossOrderTotalUsd: grandTotal,
      gatewayFeeUsd: gatewayFee,
      supplierCogsUsd: supplierCost,
      netSettledRevenueUsd: settledAmount
    },
    fulfillment,
    ledgerEntry,
    confirmedAt: new Date().toISOString()
  };
}
