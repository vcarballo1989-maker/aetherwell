/**
 * @fileoverview Suite exhaustiva de pruebas unitarias para CADA PASO del embudo de pago (Pasos 1 a 5)
 * y catálogo dinámico (`data/catalog.json` + fallback seed).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { loadCatalog, normalizeProduct, FALLBACK_CATALOG } from '../src/catalog/catalogService.js';
import { buildAndValidateCart } from '../src/checkout/step1_cart.js';
import { validateCustomerAndAddress } from '../src/checkout/step2_customer.js';
import { calculateShippingAndTax } from '../src/checkout/step3_shipping_tax.js';
import { createPaymentIntentSession, signWebhookPayload } from '../src/checkout/step4_payment_intent.js';
import { confirmOrderAndFulfill } from '../src/checkout/step5_order_fulfillment.js';
import { executeFullCheckoutFunnel } from '../src/checkout/funnel.js';
import { FinancialLedger } from '../src/finance/ledger.js';

const TEST_CATALOG = FALLBACK_CATALOG.map((p, i) => normalizeProduct(p, i));

const VALID_CUSTOMER_US = {
  email: 'alex.rivera@example.com',
  fullName: 'Alex Rivera',
  phone: '+1 305 555 0192',
  shippingAddress: {
    addressLine1: '742 Evergreen Terrace',
    addressLine2: 'Apt 4B',
    city: 'Miami',
    state: 'FL',
    postalCode: '33101',
    countryCode: 'US'
  }
};

describe('Catálogo Dinámico (market_analyst integration & fallback)', () => {
  it('Carga dinámicamente data/catalog.json si existe o usa el fallback semilla normalizado', () => {
    const catalogData = loadCatalog();
    assert.ok(Array.isArray(catalogData.products));
    assert.ok(catalogData.products.length > 0);
    const first = catalogData.products[0];
    assert.ok(typeof first.id === 'string');
    assert.ok(typeof first.price === 'number' && first.price > 0);
    assert.ok(typeof first.stock === 'number' && first.stock > 0);
  });

  it('Normaliza esquemas heterogéneos de productos provenientes de market_analyst', () => {
    const customRaw = {
      product_id: 'zd_custom_99',
      product_name: 'Masajeador Capilar LED Infrarrojo',
      retail_price: 59.99,
      supplier_cost: 12.5,
      shipping_cost: 2.5,
      inventory: 95
    };
    const norm = normalizeProduct(customRaw, 0);
    assert.equal(norm.id, 'zd_custom_99');
    assert.equal(norm.title, 'Masajeador Capilar LED Infrarrojo');
    assert.equal(norm.price, 59.99);
    assert.equal(norm.totalUnitCost, 15.0);
    assert.equal(norm.grossMarginUsd, 44.99);
    assert.equal(norm.stock, 95);
  });

  it('Procesa los productos reales de data/catalog.json (AetherWell Navidad) de principio a fin', () => {
    const liveCatalog = loadCatalog();
    const hero = liveCatalog.products[0];
    assert.ok(hero.price > 0);
    assert.ok(hero.totalUnitCost > 0);

    const ledger = new FinancialLedger();
    const res = executeFullCheckoutFunnel({
      items: [{ productId: hero.id, quantity: 1 }],
      includeVipOrderBump: true,
      customerInput: VALID_CUSTOMER_US,
      shippingMethod: 'standard',
      ledger
    });
    assert.equal(res.completed, true);
    assert.equal(res.steps.orderFulfillment.orderStatus, 'PAID_AND_FULFILLED');
  });
});

describe('PASO 1: Carrito, Validación de Stock y Cálculo de Upsells/Descuentos (cart)', () => {
  it('Rechaza un carrito vacío', () => {
    const res = buildAndValidateCart({ items: [], customCatalog: TEST_CATALOG });
    assert.equal(res.valid, false);
    assert.equal(res.errorCode, 'EMPTY_CART');
  });

  it('Rechaza cantidades no enteras, negativas o cero', () => {
    const res = buildAndValidateCart({
      items: [{ productId: 'prod_posture_pro_01', quantity: 0 }],
      customCatalog: TEST_CATALOG
    });
    assert.equal(res.valid, false);
    assert.equal(res.errorCode, 'INVALID_QUANTITY');
  });

  it('Rechaza productos inexistentes en el catálogo', () => {
    const res = buildAndValidateCart({
      items: [{ productId: 'non_existent_sku_999', quantity: 1 }],
      customCatalog: TEST_CATALOG
    });
    assert.equal(res.valid, false);
    assert.equal(res.errorCode, 'PRODUCT_NOT_FOUND');
  });

  it('Rechaza pedidos que superen el stock disponible', () => {
    const lowStockCatalog = [
      normalizeProduct({ id: 'prod_low', title: 'Edición Limitada', price: 29.99, stock: 3 }, 0)
    ];
    const res = buildAndValidateCart({
      items: [{ productId: 'prod_low', quantity: 4 }],
      customCatalog: lowStockCatalog
    });
    assert.equal(res.valid, false);
    assert.equal(res.errorCode, 'INSUFFICIENT_STOCK');
  });

  it('Calcula correctamente descuentos por volumen (Bundle), Upsells, Order Bump VIP y cupones', () => {
    // 2 unidades de prod_posture_pro_01 ($49.99 * 2 = $99.98, 15% bundle discount = $15.00)
    // + 1 unidad de prod_hydro_floss_02 como Upsell ($39.99 con 20% upsell discount = $8.00)
    // + Order Bump VIP ($9.99)
    // + Cupón WELCOME10 (10% adicional)
    const res = buildAndValidateCart({
      items: [
        { productId: 'prod_posture_pro_01', quantity: 2 },
        { productId: 'prod_hydro_floss_02', quantity: 1, isUpsell: true }
      ],
      includeVipOrderBump: true,
      promoCode: 'WELCOME10',
      customCatalog: TEST_CATALOG
    });

    assert.equal(res.valid, true);
    assert.equal(res.totalQuantity, 4);
    assert.equal(res.rawSubtotal, 149.96); // 99.98 + 39.99 + 9.99
    assert.equal(res.bundleDiscountTotal, 15.0);
    assert.equal(res.upsellDiscountTotal, 8.0);
    assert.equal(res.appliedPromoCode, 'WELCOME10');
    assert.ok(res.promoDiscountAmount > 0);
    assert.ok(res.subtotalAfterDiscounts < res.rawSubtotal);
    assert.ok(res.supplierCostTotal > 0);
  });

  it('Rechaza un código promocional inválido', () => {
    const res = buildAndValidateCart({
      items: [{ productId: 'prod_posture_pro_01', quantity: 1 }],
      promoCode: 'FAKECODE99',
      customCatalog: TEST_CATALOG
    });
    assert.equal(res.valid, false);
    assert.equal(res.errorCode, 'INVALID_PROMO_CODE');
  });
});

describe('PASO 2: Validación de Datos de Cliente y Dirección de Envío (customer_validation)', () => {
  it('Valida exitosamente un cliente y dirección internacional correcta', () => {
    const res = validateCustomerAndAddress(VALID_CUSTOMER_US);
    assert.equal(res.valid, true);
    assert.equal(res.customer.firstName, 'Alex');
    assert.equal(res.customer.lastName, 'Rivera');
    assert.equal(res.customer.shippingAddress.countryCode, 'US');
  });

  it('Bloquea correos inválidos o de dominios temporales (anti-fraude)', () => {
    const badEmail = validateCustomerAndAddress({
      ...VALID_CUSTOMER_US,
      email: 'bot@tempmail.com'
    });
    assert.equal(badEmail.valid, false);
    assert.equal(badEmail.errorCode, 'DISPOSABLE_EMAIL_BLOCKED');
  });

  it('Rechaza apartados postales (PO Box) y códigos postales incompatibles con el país', () => {
    const poBox = validateCustomerAndAddress({
      ...VALID_CUSTOMER_US,
      shippingAddress: {
        ...VALID_CUSTOMER_US.shippingAddress,
        addressLine1: 'P.O. Box 12345'
      }
    });
    assert.equal(poBox.valid, false);
    assert.equal(poBox.errorCode, 'PO_BOX_NOT_SUPPORTED');

    const badZip = validateCustomerAndAddress({
      ...VALID_CUSTOMER_US,
      shippingAddress: {
        ...VALID_CUSTOMER_US.shippingAddress,
        postalCode: 'ABCDE'
      }
    });
    assert.equal(badZip.valid, false);
    assert.equal(badZip.errorCode, 'INVALID_POSTAL_CODE');
  });
});

describe('PASO 3: Cálculo de Impuestos y Tarifas de Envío (shipping_tax)', () => {
  const validCustomer = validateCustomerAndAddress(VALID_CUSTOMER_US);

  it('Aplica tarifa de envío estándar ($4.99) cuando el pedido es menor al umbral de $45.00 USD ($39.99) y calcula Sales Tax estatal (FL 6%)', () => {
    const cart = buildAndValidateCart({
      items: [{ productId: 'prod_hydro_floss_02', quantity: 1 }], // $39.99 < $45.00
      customCatalog: TEST_CATALOG
    });

    const res = calculateShippingAndTax({
      cart,
      customerValidation: validCustomer,
      shippingMethod: 'standard'
    });

    assert.equal(res.valid, true);
    assert.equal(res.freeShippingThresholdUsd, 45.0);
    assert.equal(res.qualifiesForFreeStandardShipping, false);
    assert.equal(res.amountNeededForFreeShippingUsd, 5.01);
    assert.equal(res.breakdown.shippingCost, 4.99);
    assert.equal(res.breakdown.taxRatePct, 6);
    assert.equal(res.breakdown.taxAmount, 2.7); // (39.99 + 4.99) * 0.06 = 2.6988 -> 2.70
    assert.equal(res.breakdown.grandTotal, 47.68);
  });

  it('Desbloquea envío estándar GRATIS al superar el umbral de $45.00 USD (Combo Cortina LED $29.99 + Proyector Nieve $19.99 = $49.98)', () => {
    const liveCatalog = loadCatalog().products;
    const cart = buildAndValidateCart({
      items: [
        { productId: 'prod_xmas_curtain_001', quantity: 1 },
        { productId: 'prod_xmas_projector_002', quantity: 1, isUpsell: true }
      ],
      customCatalog: liveCatalog
    });

    assert.equal(cart.valid, true);
    assert.equal(cart.subtotalAfterDiscounts, 49.98); // $29.99 + $19.99 (20% off $24.99)

    const res = calculateShippingAndTax({
      cart,
      customerValidation: validCustomer,
      shippingMethod: 'standard'
    });

    assert.equal(res.valid, true);
    assert.equal(res.freeShippingThresholdUsd, 45.0);
    assert.equal(res.qualifiesForFreeStandardShipping, true);
    assert.equal(res.breakdown.shippingCost, 0);
  });

  it('Calcula correctamente IVA Europeo (España 21%)', () => {
    const cart = buildAndValidateCart({
      items: [{ productId: 'prod_posture_pro_01', quantity: 1 }],
      customCatalog: TEST_CATALOG
    });
    const esCustomer = validateCustomerAndAddress({
      email: 'maria.gomez@example.es',
      fullName: 'María Gómez',
      phone: '+34 600 123 456',
      shippingAddress: {
        addressLine1: 'Calle Serrano 45',
        city: 'Madrid',
        state: 'Madrid',
        postalCode: '28001',
        countryCode: 'ES'
      }
    });

    const res = calculateShippingAndTax({
      cart,
      customerValidation: esCustomer,
      shippingMethod: 'standard'
    });

    assert.equal(res.valid, true);
    assert.equal(res.breakdown.taxRatePct, 21);
    assert.ok(res.breakdown.taxAmount > 10);
  });
});

describe('PASO 4: Creación de Sesión / Intento de Pago con Stripe/Shopify (payment_intent)', () => {
  const cart = buildAndValidateCart({
    items: [{ productId: 'prod_posture_pro_01', quantity: 1 }],
    customCatalog: TEST_CATALOG
  });
  const customer = validateCustomerAndAddress(VALID_CUSTOMER_US);
  const shippingTax = calculateShippingAndTax({ cart, customerValidation: customer });

  it('Genera correctamente PaymentIntent y sesión de Shopify en modo sandbox', () => {
    const ledger = new FinancialLedger();
    const res = createPaymentIntentSession({
      cart,
      customerValidation: customer,
      shippingTax,
      executionMode: 'sandbox',
      ledger
    });

    assert.equal(res.valid, true);
    assert.ok(res.paymentIntentId.startsWith('pi_sandbox_'));
    assert.ok(res.shopifyCheckoutId.startsWith('gid://shopify/Checkout/'));
    assert.equal(res.amountUsd, shippingTax.breakdown.grandTotal);
  });

  it('Dispara ACTIVADOR 1 (KYC / Banca) al intentar cobrar en modo live sin credenciales reales', () => {
    const ledger = new FinancialLedger();
    const res = createPaymentIntentSession({
      cart,
      customerValidation: customer,
      shippingTax,
      executionMode: 'live',
      ledger
    });

    assert.equal(res.valid, false);
    assert.equal(res.hitlTriggered, true);
    assert.equal(res.hitlCode, 'ACTIVATOR_1_KYC_BANKING');
    assert.equal(ledger.hitlAlerts.length, 1);
  });

  it('Dispara ACTIVADOR 2 (Riesgo Financiero) cuando Stripe Radar detecta fraude grave (>= 85)', () => {
    const ledger = new FinancialLedger();
    const res = createPaymentIntentSession({
      cart,
      customerValidation: customer,
      shippingTax,
      fraudRiskScore: 92,
      ledger
    });

    assert.equal(res.valid, false);
    assert.equal(res.hitlTriggered, true);
    assert.equal(res.hitlCode, 'ACTIVATOR_2_FINANCIAL_RISK');
    assert.equal(ledger.hitlAlerts[0].code, 'ACTIVATOR_2_FINANCIAL_RISK');
  });

  it('Dispara ACTIVADOR 3 (Baneos de Plataforma) si la clave API de la tienda está suspendida', () => {
    const ledger = new FinancialLedger();
    const res = createPaymentIntentSession({
      cart,
      customerValidation: customer,
      shippingTax,
      platformApiStatus: 'account_suspended',
      ledger
    });

    assert.equal(res.valid, false);
    assert.equal(res.hitlTriggered, true);
    assert.equal(res.hitlCode, 'ACTIVATOR_3_PLATFORM_BAN');
  });
});

describe('PASO 5: Confirmación de Orden, Webhook de Liquidación y Disparo a Zendrop (order_fulfillment)', () => {
  const cart = buildAndValidateCart({
    items: [{ productId: 'prod_posture_pro_01', quantity: 1 }],
    customCatalog: TEST_CATALOG
  });
  const customer = validateCustomerAndAddress(VALID_CUSTOMER_US);
  const shippingTax = calculateShippingAndTax({ cart, customerValidation: customer });
  const paymentIntent = createPaymentIntentSession({
    cart,
    customerValidation: customer,
    shippingTax
  });

  it('Rechaza webhooks con firma criptográfica adulterada', () => {
    const webhookEvent = {
      type: 'payment_intent.succeeded',
      paymentIntentId: paymentIntent.paymentIntentId
    };
    const res = confirmOrderAndFulfill({
      cart,
      customerValidation: customer,
      shippingTax,
      paymentIntent,
      webhookEvent,
      webhookSignature: 'firma_falsa_12345'
    });

    assert.equal(res.valid, false);
    assert.equal(res.errorCode, 'INVALID_WEBHOOK_SIGNATURE');
  });

  it('Confirma el pedido, dispara orden a Zendrop y registra ingreso liquidado en el Ledger', () => {
    const ledger = new FinancialLedger();
    const webhookEvent = {
      type: 'payment_intent.succeeded',
      paymentIntentId: paymentIntent.paymentIntentId
    };
    const signature = signWebhookPayload(JSON.stringify(webhookEvent));

    const res = confirmOrderAndFulfill({
      cart,
      customerValidation: customer,
      shippingTax,
      paymentIntent,
      webhookEvent,
      webhookSignature: signature,
      ledger
    });

    assert.equal(res.valid, true);
    assert.equal(res.orderStatus, 'PAID_AND_FULFILLED');
    assert.equal(res.fulfillment.dispatched, true);
    assert.equal(res.fulfillment.supplierOrdersCount, 1);
    assert.ok(res.fulfillment.supplierOrders[0].trackingNumber.startsWith('ZD'));
    assert.equal(ledger.settledRevenues.length, 1);
    assert.ok(res.financialSettlement.netSettledRevenueUsd > 0);
  });

  it('Dispara ACTIVADOR 2 (Riesgo Financiero) si llega un webhook de disputa/contracargo (charge.dispute.created)', () => {
    const ledger = new FinancialLedger();
    const disputeEvent = {
      type: 'charge.dispute.created',
      paymentIntentId: paymentIntent.paymentIntentId
    };
    const signature = signWebhookPayload(JSON.stringify(disputeEvent));

    const res = confirmOrderAndFulfill({
      cart,
      customerValidation: customer,
      shippingTax,
      paymentIntent,
      webhookEvent: disputeEvent,
      webhookSignature: signature,
      ledger
    });

    assert.equal(res.valid, false);
    assert.equal(res.hitlTriggered, true);
    assert.equal(res.hitlCode, 'ACTIVATOR_2_FINANCIAL_RISK');
  });

  it('Ejecuta el orquestador completo (Pasos 1 a 5) de principio a fin sin errores', () => {
    const ledger = new FinancialLedger();
    const full = executeFullCheckoutFunnel({
      items: [{ productId: 'prod_posture_pro_01', quantity: 2 }],
      includeVipOrderBump: true,
      customerInput: VALID_CUSTOMER_US,
      shippingMethod: 'express',
      ledger,
      customCatalog: TEST_CATALOG
    });

    assert.equal(full.completed, true);
    assert.equal(full.steps.orderFulfillment.orderStatus, 'PAID_AND_FULFILLED');
    assert.equal(ledger.calculateMetrics().verifiedSalesCount, 1);
  });
});
