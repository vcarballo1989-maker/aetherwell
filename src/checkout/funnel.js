/**
 * @fileoverview Orquestador de Embudo de Pago Completo (Pasos 1 a 5).
 */

import { buildAndValidateCart } from './step1_cart.js';
import { validateCustomerAndAddress } from './step2_customer.js';
import { calculateShippingAndTax } from './step3_shipping_tax.js';
import { createPaymentIntentSession, signWebhookPayload } from './step4_payment_intent.js';
import { confirmOrderAndFulfill } from './step5_order_fulfillment.js';

/**
 * Ejecuta de extremo a extremo los 5 pasos del embudo de pago (End-to-End Checkout Pipeline).
 */
export function executeFullCheckoutFunnel({
  items,
  promoCode = null,
  includeVipOrderBump = false,
  customerInput,
  shippingMethod = 'standard',
  gateway = 'stripe',
  executionMode = 'sandbox',
  fraudRiskScore = 10,
  platformApiStatus = 'active',
  ledger = null,
  customCatalog = null,
  customEnvConfig = null
}) {
  // Paso 1: Carrito
  const step1 = buildAndValidateCart({
    items,
    promoCode,
    includeVipOrderBump,
    customCatalog
  });
  if (!step1.valid) {
    return { completed: false, failedAtStep: 1, stepName: 'cart', error: step1 };
  }

  // Paso 2: Validación de Cliente y Dirección
  const step2 = validateCustomerAndAddress(customerInput);
  if (!step2.valid) {
    return { completed: false, failedAtStep: 2, stepName: 'customer_validation', error: step2 };
  }

  // Paso 3: Impuestos y Envío
  const step3 = calculateShippingAndTax({
    cart: step1,
    customerValidation: step2,
    shippingMethod
  });
  if (!step3.valid) {
    return { completed: false, failedAtStep: 3, stepName: 'shipping_tax', error: step3 };
  }

  // Paso 4: Intento de Pago (Stripe/Shopify)
  const envConfig = customEnvConfig || ledger?.envConfig;
  const step4 = createPaymentIntentSession({
    cart: step1,
    customerValidation: step2,
    shippingTax: step3,
    gateway,
    executionMode,
    fraudRiskScore,
    platformApiStatus,
    ledger,
    customEnvConfig: envConfig
  });
  if (!step4.valid) {
    return { completed: false, failedAtStep: 4, stepName: 'payment_intent', error: step4 };
  }

  // Paso 5: Confirmación de Orden, Webhook de Liquidación y Fulfillment Zendrop
  const webhookEvent = {
    type: 'payment_intent.succeeded',
    paymentIntentId: step4.paymentIntentId,
    amountUsd: step3.breakdown.grandTotal
  };
  const webhookSecret = envConfig?.stripe?.webhookSecret;
  const webhookSignature = signWebhookPayload(JSON.stringify(webhookEvent), webhookSecret);

  const step5 = confirmOrderAndFulfill({
    cart: step1,
    customerValidation: step2,
    shippingTax: step3,
    paymentIntent: step4,
    webhookEvent,
    webhookSignature,
    webhookSecret,
    ledger
  });
  if (!step5.valid) {
    return { completed: false, failedAtStep: 5, stepName: 'order_fulfillment', error: step5 };
  }

  return {
    completed: true,
    steps: {
      cart: step1,
      customerValidation: step2,
      shippingTax: step3,
      paymentIntent: step4,
      orderFulfillment: step5
    }
  };
}

export {
  buildAndValidateCart,
  validateCustomerAndAddress,
  calculateShippingAndTax,
  createPaymentIntentSession,
  signWebhookPayload,
  confirmOrderAndFulfill
};
