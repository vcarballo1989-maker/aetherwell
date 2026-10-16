/**
 * @fileoverview Paso 1 del Embudo de Pago (`cart`):
 * Carrito, validación de stock y cálculo de Upsells, Order Bumps y Descuentos por volumen/cupón.
 */

import { loadCatalog, findProduct } from '../catalog/catalogService.js';

export const VALID_PROMO_CODES = {
  WELCOME10: { code: 'WELCOME10', discountPct: 10, freeShipping: false },
  VIP15: { code: 'VIP15', discountPct: 15, freeShipping: false },
  FREESHIP: { code: 'FREESHIP', discountPct: 0, freeShipping: true }
};

/**
 * Construye y valida el carrito de compras (Paso 1).
 * @param {object} params
 * @param {Array<{productId: string, quantity: number, isUpsell?: boolean}>} params.items
 * @param {string} [params.promoCode]
 * @param {boolean} [params.includeVipOrderBump=false]
 * @param {Array<any>} [params.customCatalog]
 */
export function buildAndValidateCart({
  items = [],
  promoCode = null,
  includeVipOrderBump = false,
  customCatalog = null
} = {}) {
  const catalog = customCatalog || loadCatalog().products;

  if (!Array.isArray(items) || items.length === 0) {
    return {
      valid: false,
      step: 'cart',
      errorCode: 'EMPTY_CART',
      errorMessage: 'El carrito no puede estar vacío.',
      items: []
    };
  }

  const lineItems = [];
  let rawSubtotal = 0;
  let bundleDiscountTotal = 0;
  let upsellDiscountTotal = 0;
  let supplierCostTotal = 0;

  for (const rawItem of items) {
    const quantity = Number(rawItem?.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return {
        valid: false,
        step: 'cart',
        errorCode: 'INVALID_QUANTITY',
        errorMessage: `Cantidad inválida (${rawItem?.quantity}) para el producto ${rawItem?.productId}.`,
        items: []
      };
    }

    if (quantity > 50) {
      return {
        valid: false,
        step: 'cart',
        errorCode: 'MAX_QUANTITY_EXCEEDED',
        errorMessage: `La cantidad solicitada (${quantity}) supera el límite máximo por orden (50).`,
        items: []
      };
    }

    const product = findProduct(rawItem.productId, catalog);
    if (!product) {
      return {
        valid: false,
        step: 'cart',
        errorCode: 'PRODUCT_NOT_FOUND',
        errorMessage: `El producto "${rawItem.productId}" no existe en el catálogo activo.`,
        items: []
      };
    }

    if (product.stock < quantity) {
      return {
        valid: false,
        step: 'cart',
        errorCode: 'INSUFFICIENT_STOCK',
        errorMessage: `Stock insuficiente para "${product.title}". Disponible: ${product.stock}, solicitado: ${quantity}.`,
        items: []
      };
    }

    const lineGross = +(product.price * quantity).toFixed(2);
    rawSubtotal = +(rawSubtotal + lineGross).toFixed(2);

    // Cálculo de descuento por volumen (Bundle Offers)
    let appliedBundleDiscountPct = 0;
    if (Array.isArray(product.bundleOffers) && product.bundleOffers.length > 0) {
      for (const offer of product.bundleOffers) {
        if (quantity >= offer.minQty && offer.discountPct > appliedBundleDiscountPct) {
          appliedBundleDiscountPct = offer.discountPct;
        }
      }
    }

    const lineBundleDiscount = +((lineGross * appliedBundleDiscountPct) / 100).toFixed(2);
    bundleDiscountTotal = +(bundleDiscountTotal + lineBundleDiscount).toFixed(2);

    // Cálculo de descuento Upsell one-click
    let lineUpsellDiscount = 0;
    if (rawItem.isUpsell && product.isUpsellEligible && product.upsellDiscountPct > 0) {
      const baseAfterBundle = lineGross - lineBundleDiscount;
      lineUpsellDiscount = +((baseAfterBundle * product.upsellDiscountPct) / 100).toFixed(2);
      upsellDiscountTotal = +(upsellDiscountTotal + lineUpsellDiscount).toFixed(2);
    }

    const lineNet = +(lineGross - lineBundleDiscount - lineUpsellDiscount).toFixed(2);
    const unitSupplierCost = +(
      (product.supplierCost || 0) + (product.shippingSupplierCost || 0)
    ).toFixed(2);
    const lineSupplierCost = +(unitSupplierCost * quantity).toFixed(2);
    supplierCostTotal = +(supplierCostTotal + lineSupplierCost).toFixed(2);

    lineItems.push({
      productId: product.id,
      sku: product.sku,
      title: product.title,
      supplier: product.supplier,
      supplierProductId: product.supplierProductId,
      quantity,
      unitPrice: product.price,
      lineGross,
      appliedBundleDiscountPct,
      lineBundleDiscount,
      isUpsell: Boolean(rawItem.isUpsell),
      lineUpsellDiscount,
      lineNet,
      unitSupplierCost,
      lineSupplierCost
    });
  }

  // Order Bump opcional: Garantía VIP
  if (includeVipOrderBump) {
    const vipProduct =
      findProduct('prod_warranty_vip_03', catalog) || {
        id: 'prod_warranty_vip_03',
        sku: 'AG-VIP-PROTECTION',
        title: 'Garantía de Reemplazo Instantáneo VIP 2 Años + Envío Prioritario Asegurado',
        supplier: 'AntigravityInternal',
        supplierProductId: 'ag_vip_001',
        price: 9.99,
        supplierCost: 0,
        shippingSupplierCost: 0
      };

    const alreadyInCart = lineItems.some((i) => i.productId === vipProduct.id);
    if (!alreadyInCart) {
      rawSubtotal = +(rawSubtotal + vipProduct.price).toFixed(2);
      lineItems.push({
        productId: vipProduct.id,
        sku: vipProduct.sku,
        title: vipProduct.title,
        supplier: vipProduct.supplier,
        supplierProductId: vipProduct.supplierProductId,
        quantity: 1,
        unitPrice: vipProduct.price,
        lineGross: vipProduct.price,
        appliedBundleDiscountPct: 0,
        lineBundleDiscount: 0,
        isUpsell: true,
        isOrderBump: true,
        lineUpsellDiscount: 0,
        lineNet: vipProduct.price,
        unitSupplierCost: 0,
        lineSupplierCost: 0
      });
    }
  }

  // Validación de código promocional
  let promoDiscountAmount = 0;
  let appliedPromo = null;
  if (promoCode) {
    const normalizedCode = String(promoCode).trim().toUpperCase();
    const promo = VALID_PROMO_CODES[normalizedCode];
    if (!promo) {
      return {
        valid: false,
        step: 'cart',
        errorCode: 'INVALID_PROMO_CODE',
        errorMessage: `El cupón promocional "${promoCode}" no es válido o ha expirado.`,
        items: lineItems
      };
    }
    appliedPromo = promo;
    const subtotalAfterBundleAndUpsell = +(
      rawSubtotal -
      bundleDiscountTotal -
      upsellDiscountTotal
    ).toFixed(2);
    promoDiscountAmount = +(
      (subtotalAfterBundleAndUpsell * promo.discountPct) /
      100
    ).toFixed(2);
  }

  const totalDiscount = +(
    bundleDiscountTotal +
    upsellDiscountTotal +
    promoDiscountAmount
  ).toFixed(2);

  const subtotalAfterDiscounts = Math.max(
    0,
    +(rawSubtotal - totalDiscount).toFixed(2)
  );

  // Recomendación dinámica de Upsell si aún no hay upsells en el carrito
  const recommendedUpsells = catalog
    .filter(
      (p) =>
        p.isUpsellEligible &&
        !lineItems.some((item) => item.productId === p.id)
    )
    .slice(0, 2)
    .map((p) => ({
      productId: p.id,
      title: p.title,
      regularPrice: p.price,
      upsellDiscountPct: p.upsellDiscountPct,
      upsellPrice: +(p.price * (1 - (p.upsellDiscountPct || 0) / 100)).toFixed(2)
    }));

  return {
    valid: true,
    step: 'cart',
    cartId: `cart_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    items: lineItems,
    totalQuantity: lineItems.reduce((acc, i) => acc + i.quantity, 0),
    rawSubtotal,
    bundleDiscountTotal,
    upsellDiscountTotal,
    promoDiscountAmount,
    appliedPromoCode: appliedPromo ? appliedPromo.code : null,
    freeShippingUnlockedByPromo: Boolean(appliedPromo?.freeShipping),
    totalDiscount,
    subtotalAfterDiscounts,
    supplierCostTotal,
    recommendedUpsells
  };
}
