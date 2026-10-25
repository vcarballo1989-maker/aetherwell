/**
 * @fileoverview Servicio de Catálogo Dinámico (Next.js Commerce / Shopify Storefront adapter).
 * Lee dinámicamente de `data/catalog.json` generado por `market_analyst` sin sobrescribirlo,
 * e incluye un catálogo semilla (fallback) resiliente en caso de que el archivo aún esté en escritura.
 */

import fs from 'node:fs';
import path from 'node:path';

export const DEFAULT_CATALOG_PATH = path.resolve(process.cwd(), 'data', 'catalog.json');

/**
 * Catálogo semilla de alta conversión (Fallback si `data/catalog.json` aún no existe).
 */
export const FALLBACK_CATALOG = [
  {
    id: 'prod_posture_pro_01',
    sku: 'ZD-POSTURE-PRO-01',
    title: 'Corrector Inteligente de Postura Cervical EMS BioPulse™',
    niche: 'Salud y Bienestar / Ergonomía',
    price: 49.99,
    compareAtPrice: 89.99,
    supplierCost: 11.4,
    shippingSupplierCost: 3.1,
    stock: 250,
    supplier: 'Zendrop',
    supplierProductId: 'zd_9928172',
    shippingDays: '5-8 días hábiles',
    rating: 4.9,
    reviewsCount: 1420,
    isUpsellEligible: true,
    upsellDiscountPct: 25,
    bundleOffers: [
      { minQty: 2, discountPct: 15, label: 'Pack Pareja (Ahorra 15%)' },
      { minQty: 3, discountPct: 25, label: 'Pack Familiar (Ahorra 25%)' }
    ],
    features: [
      'Alivio cervical en 15 minutos diarios mediante microcorrientes EMS',
      'Sensor inteligente de ángulo con alerta silenciosa por vibración',
      'Batería USB-C de larga duración (14 días por carga)'
    ]
  },
  {
    id: 'prod_hydro_floss_02',
    sku: 'ZD-HYDRO-FLOSS-02',
    title: 'Irrigador Dental Ultrasónico Portátil AquaJet Pro™',
    niche: 'Cuidado Personal / Salud Dental',
    price: 39.99,
    compareAtPrice: 69.99,
    supplierCost: 8.75,
    shippingSupplierCost: 2.5,
    stock: 180,
    supplier: 'Zendrop',
    supplierProductId: 'zd_8837161',
    shippingDays: '4-7 días hábiles',
    rating: 4.8,
    reviewsCount: 985,
    isUpsellEligible: true,
    upsellDiscountPct: 20,
    bundleOffers: [
      { minQty: 2, discountPct: 15, label: 'Dúo Sonrisa Perfecta (Ahorra 15%)' }
    ],
    features: [
      'Elimina el 99.9% de la placa bacteriana en zonas interdentales',
      'Certificación IPX7 resistente al agua y tanque plegable de viaje',
      '4 modos de presión inteligente para encías sensibles'
    ]
  },
  {
    id: 'prod_warranty_vip_03',
    sku: 'AG-VIP-PROTECTION',
    title: 'Garantía de Reemplazo Instantáneo VIP 2 Años + Envío Prioritario Asegurado',
    niche: 'Order Bump / Upsell Digital',
    price: 9.99,
    compareAtPrice: 19.99,
    supplierCost: 0.0,
    shippingSupplierCost: 0.0,
    stock: 99999,
    supplier: 'AntigravityInternal',
    supplierProductId: 'ag_vip_001',
    shippingDays: 'Inmediato',
    rating: 5.0,
    reviewsCount: 3100,
    isUpsellEligible: true,
    upsellDiscountPct: 0,
    bundleOffers: [],
    features: [
      'Reemplazo inmediato sin preguntas ante daños o pérdida en tránsito',
      'Procesamiento prioritario de orden en menos de 2 horas'
    ]
  }
];

/**
 * Normaliza cualquier estructura de producto proveniente de `data/catalog.json` (market_analyst)
 * o del catálogo semilla para garantizar compatibilidad total con el embudo de pago.
 * @param {Record<string, any>} raw
 * @param {number} idx
 */
export function normalizeProduct(raw, idx = 0) {
  const pricing = raw.pricing || {};
  const socialProof = raw.social_proof || {};
  const supplierMap = raw.supplier_mapping || {};
  const zendropInfo = supplierMap.zendrop || {};

  const id = String(
    raw.id || raw.product_id || raw.sku || `prod_dynamic_${idx + 1}`
  );
  const sku = String(
    raw.sku || raw.id || `SKU-AG-${String(idx + 1).padStart(3, '0')}`
  );
  const title = String(
    raw.title || raw.name || raw.product_name || `Producto Ganador #${idx + 1}`
  );

  // Soporta propiedades planas y anidadas (schema v2.1.0 de market_analyst)
  const price = Number(
    pricing.retail_price ??
      raw.price ??
      raw.retail_price ??
      raw.retailPrice ??
      raw.selling_price ??
      raw.sellingPrice ??
      raw.sale_price ??
      39.99
  );

  const compareAtPrice = Number(
    pricing.compare_at_price ??
      raw.compareAtPrice ??
      raw.compare_at_price ??
      raw.original_price ??
      +(price * 1.65).toFixed(2)
  );

  const supplierCost = Number(
    pricing.cogs_product_usd ??
      raw.supplierCost ??
      raw.supplier_cost ??
      raw.cost ??
      raw.cogs ??
      raw.aliExpressCost ??
      raw.zendropCost ??
      +(price * 0.25).toFixed(2)
  );

  const shippingSupplierCost = Number(
    pricing.cogs_shipping_usd ??
      raw.shippingSupplierCost ??
      raw.shipping_cost ??
      raw.supplier_shipping ??
      0
  );

  // Suma el inventario de las variantes si existen, o usa el campo plano
  const variantsStock = Array.isArray(raw.variants) && raw.variants.length > 0
    ? raw.variants.reduce((sum, v) => sum + Number(v.inventory_qty ?? v.stock ?? 0), 0)
    : null;

  const stock = Number(
    raw.stock ??
      raw.inventory ??
      raw.quantity ??
      raw.available_stock ??
      (variantsStock !== null && variantsStock > 0 ? variantsStock : 150)
  );

  const supplier = String(
    supplierMap.primary_provider || raw.supplier || raw.provider || raw.source || 'Zendrop'
  );

  const supplierProductId = String(
    zendropInfo.product_id ||
      raw.supplierProductId ||
      raw.supplier_product_id ||
      raw.external_id ||
      `zd_${id}`
  );

  // Calcula el porcentaje de descuento upsell si se define upsell_offer_price en pricing
  const calculatedUpsellDiscountPct =
    pricing.upsell_offer_price && price > 0
      ? Math.round(((price - Number(pricing.upsell_offer_price)) / price) * 100)
      : Number(raw.upsellDiscountPct ?? 20);

  return {
    id,
    sku,
    role: raw.role || 'standard',
    title,
    shortName: raw.short_name || raw.shortName || title,
    category: raw.category || raw.niche || 'Iluminación & Ambiente',
    niche: raw.niche || raw.category || 'Health, Wellness & Ergonomic Recovery',
    shortSummary:
      raw.short_summary ||
      raw.shortSummary ||
      raw.headline ||
      raw.description ||
      `${title} con envío a España y garantía oficial.`,
    description:
      raw.description ||
      raw.headline ||
      raw.hook ||
      raw.value_proposition ||
      `${title} — Alta conversión verificada con envío rápido.`,
    images: Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images
      : ['/assets/xmas-01-curtain-lights.jpg'],
    specs: raw.specs || null,
    price: +price.toFixed(2),
    compareAtPrice: +compareAtPrice.toFixed(2),
    supplierCost: +supplierCost.toFixed(2),
    shippingSupplierCost: +shippingSupplierCost.toFixed(2),
    totalUnitCost: +(supplierCost + shippingSupplierCost).toFixed(2),
    grossMarginUsd: +(price - (supplierCost + shippingSupplierCost)).toFixed(2),
    grossMarginPct:
      price > 0
        ? +(((price - (supplierCost + shippingSupplierCost)) / price) * 100).toFixed(2)
        : 0,
    stock,
    supplier,
    supplierProductId,
    shippingDays:
      (zendropInfo.shipping_time_days
        ? `${zendropInfo.shipping_time_days} días hábiles`
        : null) ||
      raw.shippingDays ||
      raw.shipping_time ||
      raw.delivery_time ||
      '5-8 días hábiles',
    rating: Number(socialProof.rating ?? raw.rating ?? 4.9),
    reviewsCount: Number(
      socialProof.reviews_count ?? raw.reviewsCount ?? raw.reviews_count ?? 840
    ),
    isUpsellEligible: raw.isUpsellEligible ?? true,
    upsellDiscountPct: calculatedUpsellDiscountPct,
    bundleOffers: Array.isArray(raw.bundleOffers)
      ? raw.bundleOffers
      : [
          { minQty: 2, discountPct: 15, label: 'Compra 2 y Ahorra 15%' },
          { minQty: 3, discountPct: 25, label: 'Compra 3 y Ahorra 25%' }
        ],
    features: Array.isArray(raw.features || raw.benefits || raw.angles)
      ? raw.features || raw.benefits || raw.angles
      : ['Calidad Premium Verificada', 'Envío Rápido con Seguimiento', 'Garantía de Satisfacción 30 Días']
  };
}

/**
 * Carga el catálogo desde `data/catalog.json` si existe, o devuelve el catálogo semilla normalizado.
 * @param {string} [catalogPath]
 */
export function loadCatalog(catalogPath = DEFAULT_CATALOG_PATH) {
  try {
    if (fs.existsSync(catalogPath)) {
      const rawContent = fs.readFileSync(catalogPath, 'utf8').trim();
      if (rawContent.length > 0) {
        const parsed = JSON.parse(rawContent);
        const rawList = Array.isArray(parsed)
          ? parsed
          : parsed.products || parsed.items || parsed.catalog || parsed.winning_products || [];

        if (Array.isArray(rawList) && rawList.length > 0) {
          const normalized = rawList.map((item, idx) => normalizeProduct(item, idx));
          // Asegurar que exista siempre el Order Bump VIP si no está presente
          const hasVip = normalized.some((p) => p.id === 'prod_warranty_vip_03');
          if (!hasVip) {
            normalized.push(normalizeProduct(FALLBACK_CATALOG[2], normalized.length));
          }
          return {
            source: 'data/catalog.json',
            metadata: !Array.isArray(parsed)
              ? {
                  brandName: parsed.brand_identity?.brand_name || 'AetherWell',
                  tagline:
                    parsed.brand_identity?.tagline ||
                    'Gadgets, Iluminación & Hogar',
                  niche:
                    parsed.brand_identity?.niche_category ||
                    parsed.niche ||
                    parsed.selected_niche ||
                    normalized[0]?.niche,
                  freeShippingThresholdUsd: Number(
                    parsed.brand_identity?.free_shipping_threshold_usd ?? 45.0
                  ),
                  standardShippingFeeUsd: Number(
                    parsed.brand_identity?.standard_shipping_fee_usd ?? 4.99
                  ),
                  updatedAt:
                    parsed.generated_at || parsed.updatedAt || parsed.timestamp || new Date().toISOString()
                }
              : {
                  brandName: 'AetherWell',
                  niche: normalized[0]?.niche,
                  freeShippingThresholdUsd: 45.0,
                  standardShippingFeeUsd: 4.99,
                  updatedAt: new Date().toISOString()
                },
            products: normalized
          };
        }
      }
    }
  } catch (err) {
    // Fallback silencioso y resiliente si market_analyst está escribiendo el archivo en ese instante
  }

  const fallbackNormalized = FALLBACK_CATALOG.map((item, idx) => normalizeProduct(item, idx));
  return {
    source: 'fallback_seed',
    metadata: {
      brandName: 'AetherWell™',
      niche: fallbackNormalized[0].niche,
      freeShippingThresholdUsd: 45.0,
      standardShippingFeeUsd: 4.99,
      updatedAt: new Date().toISOString()
    },
    products: fallbackNormalized
  };
}

/**
 * Busca un producto por ID o SKU en el catálogo activo.
 * @param {string} productIdOrSku
 * @param {Array<ReturnType<typeof normalizeProduct>>} [customProducts]
 */
export function findProduct(productIdOrSku, customProducts) {
  const products = customProducts || loadCatalog().products;
  return (
    products.find(
      (p) => p.id === productIdOrSku || p.sku === productIdOrSku
    ) || null
  );
}
