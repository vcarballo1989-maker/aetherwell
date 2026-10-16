/**
 * @fileoverview Motor de Renderizado SSR Ultrarrápido (Next.js Commerce Architecture Pattern)
 * Optimizado para Core Web Vitals (LCP < 0.8s, CLS 0) y máxima tasa de conversión (CRO).
 */

export function renderHighConvertingStorefront(catalogData, kycStatus) {
  const { products, metadata, source } = catalogData;
  const heroProduct = products[0];

  const productCardsHtml = products
    .map(
      (p) => `
      <article class="product-card" data-product-id="${p.id}">
        <div class="badge-discount">AHORRA ${Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)}% HOY</div>
        <h3>${p.title}</h3>
        <p class="niche-tag">${p.niche} • Prov: ${p.supplier}</p>
        <p class="rating">★★★★★ (${p.rating}) • ${p.reviewsCount} reseñas verificadas</p>
        <div class="price-box">
          <span class="price-current">$${p.price.toFixed(2)} USD</span>
          <span class="price-compare">$${p.compareAtPrice.toFixed(2)} USD</span>
        </div>
        <ul class="features-list">
          ${(p.features || []).map((f) => `<li>✓ ${f}</li>`).join('')}
        </ul>
        <div class="stock-pill">🔥 Quedan ${p.stock} unidades en almacén exprés (${p.shippingDays})</div>
      </article>`
    )
    .join('\n');

  const threshold = metadata?.freeShippingThresholdUsd ?? 45.0;
  const brandName = metadata?.brandName || 'AetherWell™';
  const tagline =
    metadata?.tagline || 'Alivio Cervical Clínico y Descanso Profundo en 10 Minutos al Día';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${brandName} | ${heroProduct?.title || 'Antigravity Commerce'} — Tienda Oficial</title>
  <style>
    :root { --bg: #0b0f19; --card: #131b2e; --accent: #10b981; --text: #f8fafc; --muted: #94a3b8; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    body { background: var(--bg); color: var(--text); line-height: 1.5; }
    .urgency-bar { background: linear-gradient(90deg, #059669, #10b981); color: #fff; text-align: center; padding: 8px 16px; font-weight: 700; font-size: 0.9rem; }
    .container { max-width: 1120px; margin: 0 auto; padding: 32px 20px; }
    .hero { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 40px; padding: 32px; background: var(--card); border-radius: 16px; border: 1px solid #1e293b; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
    .product-card { background: var(--card); padding: 24px; border-radius: 14px; border: 1px solid #1e293b; position: relative; }
    .badge-discount { display: inline-block; background: #ef4444; color: #fff; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 999px; margin-bottom: 12px; }
    .price-current { font-size: 1.6rem; font-weight: 800; color: var(--accent); margin-right: 10px; }
    .price-compare { font-size: 1rem; text-decoration: line-through; color: var(--muted); }
    .features-list { list-style: none; margin: 16px 0; color: #cbd5e1; font-size: 0.92rem; }
    .stock-pill { font-size: 0.82rem; color: #fbbf24; font-weight: 600; margin-top: 12px; }
    .kyc-banner { margin-top: 32px; padding: 16px; border-radius: 10px; background: #1e293b; border-left: 4px solid #f59e0b; font-size: 0.85rem; color: #fde68a; }
  </style>
</head>
<body>
  <div class="urgency-bar">⚡ ENVÍO EXPRÉS GRATIS EN PEDIDOS SUPERIORES A $${threshold.toFixed(2)} USD • GARANTÍA CLÍNICA DE 30 DÍAS ⚡</div>
  <main class="container">
    <section class="hero">
      <h1>${brandName} — ${tagline}</h1>
      <p>Producto Estrella: <strong>${heroProduct?.title || 'OrthoCloud™ Pro'}</strong> • Nicho Activo: <strong>${metadata?.niche || 'Health, Wellness & Ergonomic Recovery'}</strong> (Fuente: <code>${source}</code>)</p>
    </section>
    <section class="grid">
      ${productCardsHtml}
    </section>
    <div class="kyc-banner">
      <strong>Estado Pasarela Checkout:</strong> ${kycStatus.message}
    </div>
  </main>
</body>
</html>`;
}
