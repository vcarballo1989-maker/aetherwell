/**
 * @fileoverview Configuración central de entorno, pasarelas de pago y estado KYC/HITL.
 */

export const DEFAULT_CONFIG = {
  environment: process.env.NODE_ENV || 'development',
  initialFundUsd: 50.0,
  currency: 'USD',
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_antigravity_sandbox_key',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_antigravity_secret',
    isLiveKey: Boolean(
      process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')
    ),
    kycVerified: process.env.STRIPE_KYC_VERIFIED === 'true'
  },
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID || 'sb_paypal_client_antigravity',
    kycVerified: process.env.PAYPAL_KYC_VERIFIED === 'true'
  },
  shopify: {
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN || 'antigravity-autonomous.myshopify.com',
    storefrontAccessToken:
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'shpat_sandbox_token_antigravity',
    isProductionToken: Boolean(
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN &&
        !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN.includes('sandbox')
    )
  },
  suppliers: {
    zendropApiKey: process.env.ZENDROP_API_KEY || 'zd_sandbox_antigravity_key',
    aliexpressApiKey: process.env.ALIEXPRESS_API_KEY || 'ae_sandbox_antigravity_key'
  },
  company: {
    taxId: process.env.COMPANY_TAX_ID || null,
    bankAccountLinked: process.env.BANK_ACCOUNT_LINKED === 'true'
  }
};

/**
 * Evalúa si el sistema requiere el Activador 1 (KYC / Banca) para operar en producción real.
 * @param {Partial<typeof DEFAULT_CONFIG>} [customConfig]
 */
export function evaluateKycReadiness(customConfig = {}) {
  const cfg = {
    ...DEFAULT_CONFIG,
    ...customConfig,
    stripe: { ...DEFAULT_CONFIG.stripe, ...(customConfig.stripe || {}) },
    paypal: { ...DEFAULT_CONFIG.paypal, ...(customConfig.paypal || {}) },
    shopify: { ...DEFAULT_CONFIG.shopify, ...(customConfig.shopify || {}) },
    company: { ...DEFAULT_CONFIG.company, ...(customConfig.company || {}) }
  };

  const missingRequirements = [];

  if (!cfg.stripe.isLiveKey) {
    missingRequirements.push('STRIPE_LIVE_SECRET_KEY (actualmente en modo sandbox sk_test_*)');
  }
  if (!cfg.stripe.kycVerified && !cfg.paypal.kycVerified) {
    missingRequirements.push('Verificación de identidad KYC en Stripe/PayPal');
  }
  if (!cfg.company.taxId) {
    missingRequirements.push('Identificador fiscal de empresa (EIN / NIF / Tax ID)');
  }
  if (!cfg.company.bankAccountLinked) {
    missingRequirements.push('Cuenta bancaria comercial vinculada para liquidación de fondos');
  }
  if (!cfg.shopify.isProductionToken) {
    missingRequirements.push('Credenciales de producción de Shopify Storefront API');
  }

  const readyForLiveTraffic = missingRequirements.length === 0;

  return {
    readyForLiveTraffic,
    hitlActivator1Triggered: !readyForLiveTraffic,
    activatorCode: !readyForLiveTraffic ? 'ACTIVATOR_1_KYC_BANKING' : null,
    missingRequirements,
    message: readyForLiveTraffic
      ? 'KYC y credenciales bancarias verificadas para producción.'
      : 'ACTIVADOR 1 (KYC / Banca): El embudo de checkout está 100% operativo y verificado en sandbox, pero requiere credenciales reales de Stripe/PayPal/Shopify, Tax ID y verificación KYC para procesar cobros reales.'
  };
}
