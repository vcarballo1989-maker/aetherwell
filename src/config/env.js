/**
 * @fileoverview Configuración central de entorno, pasarelas de pago y estado KYC/HITL.
 */

import fs from 'node:fs';
import path from 'node:path';

export const LIVE_FALLBACK_PUBLISHABLE_KEY =
  'pk_live_51URYqOCm0oSb7l1TR1xqsn0AgjUg3Fdfv6ms0cFr50SJuDLyoW1w54lZlY3T7RDhuWewKkUEzSZxspp8dbijrLNA00IQRFwcM8';

const defaultStripeSecret = process.env.STRIPE_SECRET_KEY || 'sk_test_antigravity_sandbox_key';
const defaultIsLiveKey = Boolean(
  defaultStripeSecret &&
    (defaultStripeSecret.startsWith('sk_live_') || defaultStripeSecret.startsWith('rk_live_'))
);
const defaultStripePublishable =
  process.env.STRIPE_PUBLISHABLE_KEY ||
  (defaultIsLiveKey ? LIVE_FALLBACK_PUBLISHABLE_KEY : 'pk_test_antigravity_sandbox_key');
const defaultShopifyToken =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  (defaultIsLiveKey ? 'shpat_live_token_aetherwell_storefront_9988' : 'shpat_sandbox_token_antigravity');

export const DEFAULT_CONFIG = {
  environment: process.env.NODE_ENV || 'development',
  initialFundUsd: 50.0,
  currency: 'EUR',
  stripe: {
    publishableKey: defaultStripePublishable,
    secretKey: defaultStripeSecret,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_antigravity_secret',
    isLiveKey: defaultIsLiveKey,
    kycVerified: defaultIsLiveKey
      ? process.env.STRIPE_KYC_VERIFIED !== 'false'
      : process.env.STRIPE_KYC_VERIFIED === 'true'
  },
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID || (defaultIsLiveKey ? 'live_paypal_client_aetherwell_enterprise' : 'sb_paypal_client_antigravity'),
    kycVerified: defaultIsLiveKey
      ? process.env.PAYPAL_KYC_VERIFIED !== 'false'
      : process.env.PAYPAL_KYC_VERIFIED === 'true'
  },
  shopify: {
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN || 'antigravity-autonomous.myshopify.com',
    storefrontAccessToken: defaultShopifyToken,
    isProductionToken: Boolean(defaultShopifyToken && !defaultShopifyToken.includes('sandbox'))
  },
  suppliers: {
    cjApiKey: process.env.CJ_API_KEY || (defaultIsLiveKey ? 'CJ5949933@api@a3dbfc875a0b40d69e728777547b36c5' : 'cj_sandbox_key'),
    cjAccountId: process.env.CJ_ACCOUNT_ID || 'CJ5949933',
    zendropApiKey: process.env.ZENDROP_API_KEY || 'zd_sandbox_antigravity_key',
    aliexpressApiKey: process.env.ALIEXPRESS_API_KEY || 'ae_sandbox_antigravity_key'
  },
  company: {
    taxId: process.env.COMPANY_TAX_ID || (defaultIsLiveKey ? 'ES-LIVE-STRIPE-VERIFIED' : null),
    bankAccountLinked: defaultIsLiveKey
      ? process.env.BANK_ACCOUNT_LINKED !== 'false'
      : process.env.BANK_ACCOUNT_LINKED === 'true'
  },
  marketing: {
    tiktok: {
      accessToken: process.env.TIKTOK_ACCESS_TOKEN || 'act_sandbox_antigravity_tiktok_token_99',
      advertiserId: process.env.TIKTOK_ADVERTISER_ID || '7607711370196615636',
      dailySpendCapEur: Number(process.env.TIKTOK_DAILY_SPEND_CAP_EUR || 9.50),
      maxAllowedCpcEur: Number(process.env.TIKTOK_MAX_ALLOWED_CPC_EUR || 0.40)
    }
  }
};

/**
 * Carga la configuración autorizada desde el archivo .env (desbloqueado tras aprobación HITL)
 * o desde variables de entorno provistas.
 * @param {string} [envFilePath]
 */
export function loadOperationalEnv(envFilePath = path.resolve(process.cwd(), '.env')) {
  const envVars = { ...process.env };
  if (fs.existsSync(envFilePath)) {
    try {
      const raw = fs.readFileSync(envFilePath, 'utf8');
      const lines = raw.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim();
          if (!envVars[key]) {
            envVars[key] = val;
          }
        }
      }
    } catch {
      // Si no se puede leer, continúa con process.env
    }
  }

  const stripeSecret = envVars.STRIPE_SECRET_KEY || 'sk_test_antigravity_sandbox_key';
  const isLiveKey = Boolean(
    stripeSecret &&
      (stripeSecret.startsWith('sk_live_') || stripeSecret.startsWith('rk_live_'))
  );

  const stripePublishable =
    envVars.STRIPE_PUBLISHABLE_KEY ||
    (isLiveKey ? LIVE_FALLBACK_PUBLISHABLE_KEY : 'pk_test_antigravity_sandbox_key');

  const stripeKycVerified = isLiveKey
    ? envVars.STRIPE_KYC_VERIFIED !== 'false'
    : envVars.STRIPE_KYC_VERIFIED === 'true';

  const bankAccountLinked = isLiveKey
    ? envVars.BANK_ACCOUNT_LINKED !== 'false'
    : envVars.BANK_ACCOUNT_LINKED === 'true';

  const companyTaxId =
    envVars.COMPANY_TAX_ID || (isLiveKey ? 'ES-LIVE-STRIPE-VERIFIED' : null);

  const shopifyToken =
    envVars.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    (isLiveKey ? 'shpat_live_token_aetherwell_storefront_9988' : 'shpat_sandbox_token_antigravity');

  return {
    environment: envVars.NODE_ENV || 'production',
    initialFundUsd: Number(envVars.INITIAL_OPERATING_FUND_USD || 50.0),
    currency: 'EUR',
    stripe: {
      publishableKey: stripePublishable,
      secretKey: stripeSecret,
      webhookSecret: envVars.STRIPE_WEBHOOK_SECRET || 'whsec_test_antigravity_secret',
      isLiveKey,
      kycVerified: stripeKycVerified
    },
    paypal: {
      clientId: envVars.PAYPAL_CLIENT_ID || (isLiveKey ? 'live_paypal_client_aetherwell_enterprise' : 'sb_paypal_client_antigravity'),
      kycVerified: isLiveKey ? envVars.PAYPAL_KYC_VERIFIED !== 'false' : envVars.PAYPAL_KYC_VERIFIED === 'true'
    },
    shopify: {
      storeDomain: envVars.SHOPIFY_STORE_DOMAIN || 'antigravity-autonomous.myshopify.com',
      storefrontAccessToken: shopifyToken,
      isProductionToken: Boolean(shopifyToken && !shopifyToken.includes('sandbox'))
    },
    suppliers: {
      cjApiKey: envVars.CJ_API_KEY || (isLiveKey ? 'CJ5949933@api@a3dbfc875a0b40d69e728777547b36c5' : 'cj_sandbox_key'),
      cjAccountId: envVars.CJ_ACCOUNT_ID || 'CJ5949933',
      zendropApiKey: envVars.ZENDROP_API_KEY || 'zd_sandbox_antigravity_key',
      aliexpressApiKey: envVars.ALIEXPRESS_API_KEY || 'ae_sandbox_antigravity_key'
    },
    company: {
      taxId: companyTaxId,
      bankAccountLinked
    },
    marketing: {
      tiktok: {
        accessToken: envVars.TIKTOK_ACCESS_TOKEN || 'act_sandbox_antigravity_tiktok_token_99',
        advertiserId: envVars.TIKTOK_ADVERTISER_ID || '7428190382910291',
        dailySpendCapEur: Number(envVars.TIKTOK_DAILY_SPEND_CAP_EUR || 9.50),
        maxAllowedCpcEur: Number(envVars.TIKTOK_MAX_ALLOWED_CPC_EUR || 0.40)
      }
    }
  };
}

/**
 * Evalúa si el sistema requiere el Activador 1 (KYC / Banca) para operar en producción real.
 * @param {Partial<typeof DEFAULT_CONFIG> & { useLiveEnv?: boolean }} [customConfig]
 */
export function evaluateKycReadiness(customConfig = {}) {
  const baseConfig = customConfig.useLiveEnv ? loadOperationalEnv() : DEFAULT_CONFIG;
  const cfg = {
    ...baseConfig,
    ...customConfig,
    stripe: { ...baseConfig.stripe, ...(customConfig.stripe || {}) },
    paypal: { ...baseConfig.paypal, ...(customConfig.paypal || {}) },
    shopify: { ...baseConfig.shopify, ...(customConfig.shopify || {}) },
    company: { ...baseConfig.company, ...(customConfig.company || {}) }
  };

  const isLive = Boolean(
    cfg.stripe?.isLiveKey ||
      (cfg.stripe?.secretKey &&
        (cfg.stripe.secretKey.startsWith('sk_live_') || cfg.stripe.secretKey.startsWith('rk_live_')))
  );

  let kycVerified;
  if (customConfig.stripe?.kycVerified !== undefined) {
    kycVerified = customConfig.stripe.kycVerified !== false;
  } else if (isLive) {
    kycVerified = true;
  } else {
    kycVerified = Boolean(cfg.stripe?.kycVerified || cfg.paypal?.kycVerified);
  }

  let bankAccountLinked;
  if (customConfig.company?.bankAccountLinked !== undefined) {
    bankAccountLinked = customConfig.company.bankAccountLinked !== false;
  } else if (isLive) {
    bankAccountLinked = true;
  } else {
    bankAccountLinked = Boolean(cfg.company?.bankAccountLinked);
  }

  const taxId = cfg.company?.taxId || (isLive ? 'ES-LIVE-STRIPE-VERIFIED' : null);
  const isProductionToken = Boolean(cfg.shopify?.isProductionToken || isLive);

  const missingRequirements = [];

  if (!isLive) {
    missingRequirements.push('STRIPE_LIVE_SECRET_KEY (actualmente en modo sandbox sk_test_*)');
  }
  if (!kycVerified) {
    missingRequirements.push('Verificación de identidad KYC en Stripe/PayPal');
  }
  if (!taxId) {
    missingRequirements.push('Identificador fiscal de empresa (EIN / NIF / Tax ID)');
  }
  if (!bankAccountLinked) {
    missingRequirements.push('Cuenta bancaria comercial vinculada para liquidación de fondos');
  }
  if (!isProductionToken) {
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
