/**
 * @fileoverview Paso 3 del Embudo de Pago (`shipping_tax`):
 * Cálculo de impuestos regionales (Sales Tax / IVA / VAT) y tarifas de envío (Zendrop Express / VIP).
 */

import { loadCatalog } from '../catalog/catalogService.js';

export const FREE_SHIPPING_THRESHOLD_USD = 45.0;

export const SHIPPING_RATES_BY_ZONE = {
  US: { standard: 4.99, express: 9.99, etaStandard: '5-8 días hábiles', etaExpress: '3-5 días hábiles' },
  CA: { standard: 6.99, express: 12.99, etaStandard: '6-9 días hábiles', etaExpress: '4-6 días hábiles' },
  ES: { standard: 4.99, express: 9.99, etaStandard: '5-7 días hábiles', etaExpress: '3-5 días hábiles' },
  GB: { standard: 5.49, express: 10.99, etaStandard: '5-8 días hábiles', etaExpress: '3-5 días hábiles' },
  MX: { standard: 5.99, express: 11.99, etaStandard: '6-10 días hábiles', etaExpress: '4-6 días hábiles' },
  CO: { standard: 6.99, express: 13.99, etaStandard: '7-11 días hábiles', etaExpress: '5-7 días hábiles' },
  CL: { standard: 6.99, express: 13.99, etaStandard: '7-11 días hábiles', etaExpress: '5-7 días hábiles' },
  AR: { standard: 7.49, express: 14.99, etaStandard: '8-12 días hábiles', etaExpress: '5-8 días hábiles' }
};

export const US_STATE_TAX_RATES = {
  CA: 0.0825,
  NY: 0.08875,
  TX: 0.0625,
  FL: 0.06,
  WA: 0.065,
  IL: 0.0625,
  OR: 0.0,
  DE: 0.0,
  MT: 0.0,
  NH: 0.0,
  DEFAULT: 0.06
};

export const COUNTRY_TAX_RATES = {
  ES: 0.21, // IVA España 21%
  GB: 0.2,  // UK VAT 20%
  MX: 0.16, // IVA México 16%
  CA: 0.13, // GST/HST promedio
  CO: 0.19, // IVA Colombia 19%
  CL: 0.19, // IVA Chile 19%
  AR: 0.21  // IVA Argentina 21%
};

/**
 * Calcula las tarifas de envío e impuestos aplicables sobre un carrito validado y un cliente validado (Paso 3).
 * @param {object} params
 * @param {object} params.cart Resultado de buildAndValidateCart (Paso 1)
 * @param {object} params.customerValidation Resultado de validateCustomerAndAddress (Paso 2)
 * @param {'standard'|'express'} [params.shippingMethod='standard']
 * @param {number} [params.freeShippingThresholdUsd] Umbral opcional de envío gratis (por defecto lee de data/catalog.json: $45.00 USD)
 */
export function calculateShippingAndTax({
  cart,
  customerValidation,
  shippingMethod = 'standard',
  freeShippingThresholdUsd
} = {}) {
  if (!cart || !cart.valid) {
    return {
      valid: false,
      step: 'shipping_tax',
      errorCode: 'INVALID_CART_STATE',
      errorMessage: 'Se requiere un carrito validado antes de calcular impuestos y envío.'
    };
  }

  if (!customerValidation || !customerValidation.valid || !customerValidation.customer) {
    return {
      valid: false,
      step: 'shipping_tax',
      errorCode: 'INVALID_CUSTOMER_STATE',
      errorMessage: 'Se requiere una dirección de cliente validada antes de calcular impuestos y envío.'
    };
  }

  if (shippingMethod !== 'standard' && shippingMethod !== 'express') {
    return {
      valid: false,
      step: 'shipping_tax',
      errorCode: 'INVALID_SHIPPING_METHOD',
      errorMessage: `Método de envío "${shippingMethod}" no soportado. Use "standard" o "express".`
    };
  }

  const dynamicThreshold = Number(
    freeShippingThresholdUsd ??
      loadCatalog().metadata?.freeShippingThresholdUsd ??
      FREE_SHIPPING_THRESHOLD_USD
  );

  const { countryCode, state } = customerValidation.customer.shippingAddress;
  const zoneRates = SHIPPING_RATES_BY_ZONE[countryCode] || SHIPPING_RATES_BY_ZONE.US;

  const subtotalAfterDiscounts = cart.subtotalAfterDiscounts;
  const qualifiesForFreeStandardShipping =
    subtotalAfterDiscounts >= dynamicThreshold ||
    Boolean(cart.freeShippingUnlockedByPromo);

  let shippingCost = 0;
  if (shippingMethod === 'standard') {
    shippingCost = qualifiesForFreeStandardShipping ? 0.0 : zoneRates.standard;
  } else {
    // Express recibe un descuento del coste estándar si califica para envío gratis
    shippingCost = qualifiesForFreeStandardShipping
      ? +(zoneRates.express - zoneRates.standard).toFixed(2)
      : zoneRates.express;
  }

  // Cálculo de tasa impositiva (Sales Tax / IVA / VAT)
  let taxRate = 0;
  let taxType = 'Sales Tax';

  if (countryCode === 'US') {
    const stateUpper = String(state || '').toUpperCase();
    taxRate =
      stateUpper in US_STATE_TAX_RATES
        ? US_STATE_TAX_RATES[stateUpper]
        : US_STATE_TAX_RATES.DEFAULT;
    taxType = `US State Tax (${stateUpper || 'STD'})`;
  } else {
    taxRate = COUNTRY_TAX_RATES[countryCode] ?? 0.1;
    taxType = `VAT / IVA (${countryCode})`;
  }

  const taxableBase = +(subtotalAfterDiscounts + shippingCost).toFixed(2);
  const taxAmount = +(taxableBase * taxRate).toFixed(2);
  const grandTotal = +(subtotalAfterDiscounts + shippingCost + taxAmount).toFixed(2);

  // Margen estimado antes de pasarela
  const estimatedGrossMarginBeforeGateway = +(
    subtotalAfterDiscounts +
    shippingCost -
    cart.supplierCostTotal
  ).toFixed(2);

  return {
    valid: true,
    step: 'shipping_tax',
    currency: 'USD',
    shippingMethod,
    estimatedDelivery:
      shippingMethod === 'express' ? zoneRates.etaExpress : zoneRates.etaStandard,
    qualifiesForFreeStandardShipping,
    freeShippingThresholdUsd: dynamicThreshold,
    amountNeededForFreeShippingUsd: qualifiesForFreeStandardShipping
      ? 0
      : +(dynamicThreshold - subtotalAfterDiscounts).toFixed(2),
    breakdown: {
      rawSubtotal: cart.rawSubtotal,
      totalDiscount: cart.totalDiscount,
      subtotalAfterDiscounts,
      shippingCost,
      taxRatePct: +(taxRate * 100).toFixed(3),
      taxType,
      taxAmount,
      grandTotal,
      supplierCostTotal: cart.supplierCostTotal,
      estimatedGrossMarginBeforeGateway
    }
  };
}
