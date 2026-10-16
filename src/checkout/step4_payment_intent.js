/**
 * @fileoverview Paso 4 del Embudo de Pago (`payment_intent`):
 * Creación de sesión e intento de pago con pasarela Stripe Checkout / Shopify Storefront API,
 * evaluación de fraude (Radar) y verificación de Activadores HITL 1, 2 y 3.
 */

import crypto from 'node:crypto';
import { DEFAULT_CONFIG, evaluateKycReadiness } from '../config/env.js';

/**
 * Genera una firma HMAC-SHA256 simulando el encabezado `Stripe-Signature` para validación en el Paso 5.
 * @param {string} payloadString
 * @param {string} [secret]
 */
export function signWebhookPayload(payloadString, secret = DEFAULT_CONFIG.stripe.webhookSecret) {
  return crypto.createHmac('sha256', secret).update(payloadString).digest('hex');
}

/**
 * Crea un PaymentIntent en Stripe / Checkout Session en Shopify (Paso 4).
 * @param {object} params
 * @param {object} params.cart Resultado validado del Paso 1
 * @param {object} params.customerValidation Resultado validado del Paso 2
 * @param {object} params.shippingTax Resultado validado del Paso 3
 * @param {'stripe'|'shopify_payments'|'paypal'} [params.gateway='stripe']
 * @param {'sandbox'|'live'} [params.executionMode='sandbox']
 * @param {number} [params.fraudRiskScore=12] Score de Stripe Radar (0-100)
 * @param {string} [params.platformApiStatus='active'] Estado de la clave API ('active'|'account_suspended'|'bot_detection_ban')
 * @param {import('../finance/ledger.js').FinancialLedger} [params.ledger] Instancia del libro contable para registrar alertas HITL
 * @param {object} [params.customEnvConfig]
 */
export function createPaymentIntentSession({
  cart,
  customerValidation,
  shippingTax,
  gateway = 'stripe',
  executionMode = 'sandbox',
  fraudRiskScore = 12,
  platformApiStatus = 'active',
  ledger = null,
  customEnvConfig = null
} = {}) {
  if (!cart?.valid || !customerValidation?.valid || !shippingTax?.valid) {
    return {
      valid: false,
      step: 'payment_intent',
      errorCode: 'PRECONDITION_STEPS_INCOMPLETE',
      errorMessage:
        'Los pasos previos (1: Carrito, 2: Cliente, 3: Envío/Impuestos) deben ser válidos antes de crear el intento de pago.'
    };
  }

  const grandTotal = shippingTax.breakdown.grandTotal;
  if (typeof grandTotal !== 'number' || grandTotal <= 0) {
    return {
      valid: false,
      step: 'payment_intent',
      errorCode: 'INVALID_PAYMENT_AMOUNT',
      errorMessage: 'El monto total a cobrar debe ser mayor a $0.00 USD.'
    };
  }

  // 1. Verificar Activador 3: Baneos de Plataforma / Suspensión de API
  if (platformApiStatus !== 'active') {
    const hitl3 = ledger
      ? ledger.checkActivator3PlatformBan({
          platform: gateway === 'shopify_payments' ? 'Shopify' : 'Stripe/Shopify',
          status: platformApiStatus
        })
      : {
          triggered: true,
          alert: {
            code: 'ACTIVATOR_3_PLATFORM_BAN',
            reason: `Clave API suspendida (${platformApiStatus})`
          }
        };

    return {
      valid: false,
      step: 'payment_intent',
      errorCode: 'PLATFORM_API_SUSPENDED',
      errorMessage: hitl3.alert?.reason || 'La clave API de la plataforma ha sido suspendida.',
      hitlTriggered: true,
      hitlCode: 'ACTIVATOR_3_PLATFORM_BAN',
      hitlAlert: hitl3.alert
    };
  }

  // 2. Verificar Activador 2: Riesgo Financiero / Alerta de Fraude Grave en Pasarela
  if (fraudRiskScore >= 85) {
    const hitl2 = ledger
      ? ledger.checkActivator2FinancialRisk({
          type: 'severe_fraud_alert',
          riskScore: fraudRiskScore,
          amountUsd: grandTotal
        })
      : {
          triggered: true,
          alert: {
            code: 'ACTIVATOR_2_FINANCIAL_RISK',
            reason: `Alerta de fraude grave (score: ${fraudRiskScore})`
          }
        };

    return {
      valid: false,
      step: 'payment_intent',
      errorCode: 'HIGH_RISK_FRAUD_BLOCKED',
      errorMessage:
        hitl2.alert?.reason || 'Transacción bloqueada preventivamente por alerta de fraude grave.',
      hitlTriggered: true,
      hitlCode: 'ACTIVATOR_2_FINANCIAL_RISK',
      hitlAlert: hitl2.alert
    };
  }

  // 3. Verificar Activador 1: KYC / Banca cuando se solicita ejecución en vivo (producción real)
  const kycEvaluation = evaluateKycReadiness(customEnvConfig || ledger?.envConfig || {});
  if (executionMode === 'live' && !kycEvaluation.readyForLiveTraffic) {
    const hitl1 = ledger
      ? ledger.checkActivator1KycBanking(customEnvConfig)
      : {
          triggered: true,
          alert: {
            code: 'ACTIVATOR_1_KYC_BANKING',
            reason: kycEvaluation.message,
            metadata: { missingRequirements: kycEvaluation.missingRequirements }
          }
        };

    return {
      valid: false,
      step: 'payment_intent',
      errorCode: 'LIVE_KYC_CREDENTIALS_REQUIRED',
      errorMessage: kycEvaluation.message,
      hitlTriggered: true,
      hitlCode: 'ACTIVATOR_1_KYC_BANKING',
      hitlAlert: hitl1.alert,
      kycEvaluation
    };
  }

  const amountCents = Math.round(grandTotal * 100);
  const paymentIntentId = `pi_${executionMode}_${crypto.randomBytes(8).toString('hex')}`;
  const shopifyCheckoutId = `gid://shopify/Checkout/${crypto.randomBytes(6).toString('hex')}`;
  const idempotencyKey = crypto
    .createHash('sha256')
    .update(`${cart.cartId}:${customerValidation.customer.email}:${amountCents}`)
    .digest('hex');

  const sessionData = {
    paymentIntentId,
    shopifyCheckoutId,
    gateway,
    executionMode,
    currency: 'USD',
    amountUsd: grandTotal,
    amountCents,
    customerEmail: customerValidation.customer.email,
    cartId: cart.cartId
  };

  return {
    valid: true,
    step: 'payment_intent',
    paymentIntentId,
    clientSecret: `${paymentIntentId}_secret_${crypto.randomBytes(6).toString('hex')}`,
    shopifyCheckoutId,
    idempotencyKey,
    gateway,
    executionMode,
    status: 'requires_confirmation',
    amountUsd: grandTotal,
    amountCents,
    currency: 'USD',
    fraudRiskScore,
    kycReadiness: kycEvaluation,
    sessionData
  };
}
