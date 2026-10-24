/**
 * @fileoverview Storefront Especial Navidad y Regalos Virales 2026 — AetherWell™ Holiday & Gift Edition (España).
 * Precios en Euros (€) con IVA 21% incluido, checkout oficial Stripe en EUR,
 * 10 artículos de decoración luminosa y regalos navideños con fotografías reales y fichas técnicas de 5 puntos.
 * CERO referencias internas de proveedor en la vista del cliente.
 */

export function renderHighConvertingStorefront(catalogData = {}, kycStatus = {}, ledger = null, operationalEnv = null) {
  const { metadata = {} } = catalogData;
  const brandName = metadata.brandName || 'AetherWell™';
  const threshold = 45.0;

  const heroPrice = 29.99;
  const projectorUpsellPrice = 19.99;
  const duoPrice = +(heroPrice + projectorUpsellPrice).toFixed(2); // 49.98
  const bundlePrice = 59.99;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${brandName} Navidad España | Decoración Luminosa Mágica y Regalos Virales de Navidad 2026</title>
  <meta name="description" content="Descubre la colección Especial Navidad y Reyes 2026 de AetherWell™ España: Cortina LED de Anillos Mágicos 3D, Proyectores de Nieve y Galaxia, Esferas de Cristal K9 3D y Regalos Únicos con Envío Rápido a toda España." />
  <meta name="keywords" content="decoracion navidad luces led españa, cortina led navidad anillos 3d, regalos originales navidad reyes, proyector copos de nieve led, esfera cristal 3d, AetherWell Navidad" />
  <meta name="robots" content="index, follow" />

  <!-- Open Graph -->
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="${brandName} Holiday & Gift Edition España" />
  <meta property="og:title" content="Especial Navidad y Regalos 2026 — Iluminación Mágica y Regalos Únicos" />
  <meta property="og:description" content="Hasta 50% DTO. Hoy + Envío Gratis a toda España en pedidos superiores a 45 €. Garantía de devolución ampliada hasta después de Reyes." />
  <meta property="og:image" content="/assets/xmas-01-curtain-lights.jpg" />
  <meta property="product:price:amount" content="${heroPrice.toFixed(2)}" />
  <meta property="product:price:currency" content="EUR" />

  <style>
    :root {
      --bg: #fdfbf7;
      --surface: #ffffff;
      --surface-subtle: #fef2f2;
      --border: #e5e7eb;
      --border-focus: #b91c1c;
      --text: #111827;
      --text-muted: #4b5563;
      --text-dim: #9ca3af;
      --primary: #b91c1c;
      --primary-hover: #991b1b;
      --primary-subtle: #fef2f2;
      --primary-border: #fecaca;
      --forest: #065f46;
      --forest-subtle: #ecfdf5;
      --gold: #d97706;
      --gold-light: #fef3c7;
      --blue-trust: #1d4ed8;
      --danger: #dc2626;
      --success: #059669;
      --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.06);
      --shadow-md: 0 4px 12px -1px rgba(185, 28, 28, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      --shadow-lg: 0 12px 24px -4px rgba(15, 23, 42, 0.1);
      --shadow-xl: 0 20px 30px -6px rgba(15, 23, 42, 0.14);
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: var(--bg); color: var(--text); line-height: 1.55; -webkit-font-smoothing: antialiased; }
    a { color: inherit; text-decoration: none; }

    /* 1. Top Festive Announcement Bar */
    .top-bar {
      background: linear-gradient(90deg, #7f1d1d 0%, #b91c1c 50%, #065f46 100%);
      color: #ffffff;
      text-align: center;
      padding: 10px 16px;
      font-size: 0.88rem;
      font-weight: 700;
      letter-spacing: 0.01em;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 10px rgba(0,0,0,0.18);
    }
    .top-bar span.badge {
      background: #f59e0b;
      color: #111827;
      padding: 3px 10px;
      border-radius: 999px;
      margin-right: 8px;
      font-size: 0.76rem;
      font-weight: 900;
      text-transform: uppercase;
    }

    /* 2. Sticky Header Navbar */
    .navbar {
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(12px);
      border-bottom: 2px solid #fee2e2;
      position: sticky;
      top: 40px;
      z-index: 90;
    }
    .navbar-container {
      max-width: 1260px;
      margin: 0 auto;
      padding: 14px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.45rem;
      font-weight: 900;
      letter-spacing: -0.03em;
      color: #991b1b;
    }
    .brand-subtitle {
      font-size: 0.78rem;
      font-weight: 700;
      color: #065f46;
      border-left: 2px solid #d1fae5;
      padding-left: 10px;
      display: none;
    }
    @media (min-width: 768px) {
      .brand-subtitle { display: block; }
    }
    .nav-links {
      display: none;
      gap: 22px;
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-muted);
    }
    @media (min-width: 960px) {
      .nav-links { display: flex; }
    }
    .nav-links a:hover { color: var(--primary); }
    .trust-pill {
      background: var(--forest-subtle);
      border: 1px solid #a7f3d0;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 800;
      color: var(--forest);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Container */
    .container {
      max-width: 1260px;
      margin: 0 auto;
      padding: 24px 20px 80px;
    }

    #stripe-status-banner {
      display: none;
      margin-bottom: 24px;
      padding: 18px 24px;
      border-radius: var(--radius-md);
      font-weight: 700;
      font-size: 0.95rem;
      line-height: 1.5;
      box-shadow: var(--shadow-md);
    }

    /* Hero Banner Intro */
    .holiday-hero-banner {
      background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 55%, #064e3b 100%);
      color: #ffffff;
      border-radius: var(--radius-lg);
      padding: 28px 32px;
      margin-bottom: 32px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      box-shadow: var(--shadow-lg);
      border: 2px solid rgba(251, 191, 36, 0.4);
    }
    .holiday-hero-banner h2 {
      font-size: 1.65rem;
      font-weight: 900;
      margin-bottom: 6px;
      letter-spacing: -0.02em;
    }
    .holiday-hero-banner p {
      color: #fef3c7;
      font-size: 0.96rem;
      max-width: 720px;
    }
    .holiday-hero-cta {
      background: #fbbf24;
      color: #111827;
      font-weight: 900;
      padding: 12px 22px;
      border-radius: 999px;
      font-size: 0.92rem;
      box-shadow: 0 4px 14px rgba(0,0,0,0.25);
      white-space: nowrap;
    }

    /* 3. Product Hero Layout (2 Columns) */
    .product-hero-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 36px;
      align-items: start;
    }
    @media (min-width: 960px) {
      .product-hero-layout {
        grid-template-columns: 1.05fr 1fr;
        gap: 44px;
      }
    }

    .gallery-container {
      position: sticky;
      top: 105px;
    }
    .main-viewer {
      background: var(--surface);
      border: 2px solid #fecaca;
      border-radius: var(--radius-lg);
      padding: 24px;
      aspect-ratio: 1 / 0.94;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-md);
      position: relative;
      overflow: hidden;
    }
    .gallery-badge {
      position: absolute;
      top: 14px;
      left: 14px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: var(--primary);
      font-size: 0.74rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 5px 12px;
      border-radius: 999px;
    }
    .gallery-discount-badge {
      position: absolute;
      top: 14px;
      right: 14px;
      background: #dc2626;
      color: #ffffff;
      font-size: 0.8rem;
      font-weight: 900;
      padding: 5px 12px;
      border-radius: 999px;
    }
    .viewer-svg-stage {
      width: 100%;
      height: 310px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 18px 0 10px;
    }
    .viewer-caption {
      font-size: 0.86rem;
      font-weight: 700;
      color: var(--text-muted);
      text-align: center;
      background: #f9fafb;
      padding: 8px 16px;
      border-radius: 999px;
      border: 1px solid var(--border);
    }

    .thumbnails-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-top: 14px;
    }
    .thumb-btn {
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 10px 6px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      font-weight: 800;
      color: var(--text-muted);
      transition: all 0.2s ease;
    }
    .thumb-btn:hover {
      border-color: #fca5a5;
      color: var(--text);
    }
    .thumb-btn.active {
      border-color: var(--primary);
      background: var(--primary-subtle);
      color: var(--primary);
      box-shadow: var(--shadow-sm);
    }
    .thumb-btn img {
      width: 48px;
      height: 48px;
      object-fit: cover;
      border-radius: 6px;
    }

    .gallery-trust-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 16px;
    }
    .trust-card-mini {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--text);
    }

    /* Right Column: Buy Box */
    .buy-box {
      background: var(--surface);
      border: 2px solid #fee2e2;
      border-radius: var(--radius-lg);
      padding: 30px;
      box-shadow: var(--shadow-lg);
    }
    .rating-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }
    .stars { color: #f59e0b; font-size: 1.05rem; letter-spacing: 1px; }
    .reviews-text { font-size: 0.86rem; font-weight: 700; color: var(--text-muted); }
    .verified-pill {
      background: var(--forest-subtle);
      color: var(--forest);
      border: 1px solid #a7f3d0;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 0.74rem;
      font-weight: 800;
    }
    .product-title {
      font-size: 1.75rem;
      font-weight: 900;
      line-height: 1.22;
      color: var(--text);
      margin-bottom: 12px;
    }
    .product-subtitle {
      font-size: 0.95rem;
      color: var(--text-muted);
      margin-bottom: 18px;
    }
    .price-box {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 18px;
      padding: 14px 18px;
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: var(--radius-md);
    }
    .price-current {
      font-size: 2rem;
      font-weight: 900;
      color: var(--primary);
    }
    .price-compare {
      font-size: 1.15rem;
      color: var(--text-dim);
      text-decoration: line-through;
      font-weight: 700;
    }
    .savings-badge {
      background: var(--primary);
      color: #ffffff;
      font-size: 0.78rem;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 999px;
    }

    .urgency-box {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: var(--radius-sm);
      padding: 12px 16px;
      margin-bottom: 18px;
      font-size: 0.85rem;
    }
    .urgency-line {
      font-weight: 800;
      color: #991b1b;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    .delivery-line {
      color: #065f46;
      font-weight: 700;
    }

    .shipping-bar-wrapper {
      background: #f8fafc;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 12px 16px;
      margin-bottom: 20px;
    }
    .shipping-bar-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      font-weight: 800;
      margin-bottom: 6px;
    }
    .shipping-progress-bg {
      height: 8px;
      background: #e2e8f0;
      border-radius: 999px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .shipping-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #b91c1c, #059669);
      border-radius: 999px;
      transition: width 0.3s ease;
    }
    .shipping-msg {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .tier-selector-title {
      font-size: 0.9rem;
      font-weight: 800;
      margin-bottom: 10px;
      color: var(--text);
    }
    .tier-card {
      border: 2px solid var(--border);
      border-radius: var(--radius-md);
      padding: 14px 16px;
      margin-bottom: 12px;
      cursor: pointer;
      position: relative;
      transition: all 0.2s ease;
      background: #ffffff;
    }
    .tier-card:hover { border-color: #fca5a5; }
    .tier-card.selected {
      border-color: var(--primary);
      background: #fff5f5;
      box-shadow: var(--shadow-sm);
    }
    .tier-badge-ribbon {
      display: inline-block;
      background: var(--primary);
      color: #ffffff;
      font-size: 0.7rem;
      font-weight: 900;
      padding: 2px 10px;
      border-radius: 999px;
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    .tier-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    .tier-left {
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    .tier-radio {
      margin-top: 4px;
      accent-color: var(--primary);
      width: 18px;
      height: 18px;
    }
    .tier-name {
      font-weight: 800;
      font-size: 0.95rem;
      color: var(--text);
    }
    .tier-desc {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .tier-pricing {
      text-align: right;
      white-space: nowrap;
    }
    .tier-price-main {
      display: block;
      font-size: 1.1rem;
      font-weight: 900;
      color: var(--primary);
    }
    .tier-price-compare {
      font-size: 0.8rem;
      color: var(--text-dim);
      text-decoration: line-through;
    }

    .btn-buy-now {
      width: 100%;
      background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
      color: #ffffff;
      border: none;
      border-radius: var(--radius-md);
      padding: 18px 24px;
      font-size: 1.05rem;
      font-weight: 900;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 10px 20px -5px rgba(185, 28, 28, 0.45);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      margin-top: 14px;
    }
    .btn-buy-now:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 24px -5px rgba(185, 28, 28, 0.55);
    }
    .btn-buy-now svg {
      width: 22px;
      height: 22px;
      fill: currentColor;
    }

    .payment-trust-bar {
      margin-top: 16px;
      text-align: center;
    }
    .payment-icons {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 6px;
      margin-bottom: 8px;
    }
    .payment-pill {
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.74rem;
      font-weight: 700;
      color: #374151;
    }
    .guarantee-note {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--forest);
    }

    /* Section Spacing & Headers */
    .section-spacing {
      margin-top: 72px;
    }
    .section-header {
      text-align: center;
      max-width: 820px;
      margin: 0 auto 36px;
    }
    .section-tag {
      display: inline-block;
      background: #fef2f2;
      color: var(--primary);
      border: 1px solid #fecaca;
      font-size: 0.76rem;
      font-weight: 900;
      padding: 4px 14px;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 10px;
    }
    .section-title {
      font-size: 2rem;
      font-weight: 900;
      color: var(--text);
      line-height: 1.22;
      margin-bottom: 12px;
    }
    .section-desc {
      font-size: 1rem;
      color: var(--text-muted);
    }

    /* Catalog Cards Grid */
    .catalog-item-card {
      background: #ffffff;
      border: 2px solid #e5e7eb;
      border-radius: var(--radius-lg);
      padding: 28px;
      box-shadow: var(--shadow-md);
      transition: border-color 0.2s ease;
    }
    .catalog-item-card:hover {
      border-color: #fca5a5;
    }
    .catalog-item-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border);
    }
    .catalog-category-pill {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
      font-size: 0.74rem;
      font-weight: 900;
      padding: 4px 12px;
      border-radius: 999px;
      text-transform: uppercase;
    }
    .catalog-item-body {
      display: grid;
      grid-template-columns: 1fr;
      gap: 28px;
      align-items: start;
    }
    @media (min-width: 860px) {
      .catalog-item-body {
        grid-template-columns: 380px 1fr;
      }
    }
    .catalog-photos-pair {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .catalog-photos-pair img {
      width: 100%;
      height: 190px;
      object-fit: contain;
      background: #f9fafb;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 6px;
    }
    .spec-list-5 {
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-size: 0.92rem;
      color: #1f2937;
    }
    .spec-list-5 div {
      background: #f9fafb;
      border-left: 4px solid var(--primary);
      padding: 10px 14px;
      border-radius: 0 8px 8px 0;
    }
    .spec-list-5 strong {
      color: #991b1b;
    }
    .btn-catalog-buy {
      background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
      color: #ffffff;
      border: none;
      padding: 13px 22px;
      border-radius: 10px;
      font-weight: 900;
      font-size: 0.94rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(185, 28, 28, 0.3);
      transition: transform 0.15s ease;
    }
    .btn-catalog-buy:hover {
      transform: translateY(-1px);
    }

    /* Benefits & Reviews */
    .cards-grid-3 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
      gap: 22px;
    }
    .benefit-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 24px;
      box-shadow: var(--shadow-sm);
    }
    .benefit-card h3 {
      font-size: 1.12rem;
      font-weight: 900;
      margin-bottom: 8px;
      color: var(--text);
    }
    .benefit-card p {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .reviews-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .review-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 22px;
      box-shadow: var(--shadow-sm);
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .review-author { font-weight: 900; font-size: 0.95rem; }
    .review-role { font-size: 0.78rem; color: var(--text-muted); }
    .review-text { font-size: 0.9rem; color: #374151; }

    /* FAQ */
    .faq-container {
      max-width: 820px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .faq-item {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    .faq-question {
      padding: 18px 22px;
      font-weight: 800;
      font-size: 0.98rem;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .faq-answer {
      display: none;
      padding: 0 22px 18px;
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    .faq-item.active .faq-answer { display: block; }

    /* Footer */
    .footer {
      background: #0f172a;
      color: #94a3b8;
      padding: 60px 20px 30px;
      margin-top: 80px;
      font-size: 0.88rem;
    }
    .footer-container {
      max-width: 1260px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 36px;
    }
    .footer-logo {
      font-size: 1.35rem;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 10px;
    }
    .footer-col h4 {
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 800;
      margin-bottom: 14px;
    }
    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .footer-links a { color: #94a3b8; cursor: pointer; }
    .footer-links a:hover { color: #fbbf24; }
    .footer-bottom {
      max-width: 1260px;
      margin: 40px auto 0;
      padding-top: 24px;
      border-top: 1px solid #1e293b;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 12px;
      font-size: 0.8rem;
      color: #64748b;
    }

    /* Modals & Cookie Banner */
    .modal-overlay {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(4px);
      z-index: 1000;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .modal-card {
      background: #ffffff;
      border-radius: var(--radius-lg);
      max-width: 720px;
      width: 100%;
      max-height: 85vh;
      overflow-y: auto;
      padding: 36px;
      box-shadow: var(--shadow-xl);
      position: relative;
    }
    .modal-close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      background: #f1f5f9;
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 999px;
      font-size: 1.2rem;
      font-weight: 800;
      cursor: pointer;
    }
    .modal-title { font-size: 1.4rem; font-weight: 900; margin-bottom: 16px; }
    .modal-body { font-size: 0.92rem; color: #334155; line-height: 1.7; }
    .modal-body h4 { margin: 16px 0 6px; color: #0f172a; }

    #cookie-banner {
      display: none;
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      max-width: 620px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 18px 24px;
      box-shadow: var(--shadow-xl);
      z-index: 990;
      font-size: 0.86rem;
    }
    .cookie-content {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .btn-accept-cookies {
      background: var(--primary);
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      border-radius: var(--radius-sm);
      font-weight: 800;
      cursor: pointer;
    }

    .mobile-sticky-bar {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      background: #ffffff;
      border-top: 1px solid var(--border);
      padding: 12px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 -4px 12px rgba(0,0,0,0.06);
      z-index: 80;
    }
    @media (min-width: 960px) {
      .mobile-sticky-bar { display: none; }
    }
    .mobile-price-now { font-size: 1.2rem; font-weight: 900; color: var(--primary); }
    .mobile-shipping-hint { font-size: 0.72rem; color: var(--forest); font-weight: 700; display: block; }
    .btn-mobile-buy {
      background: var(--primary);
      color: #ffffff;
      border: none;
      padding: 12px 20px;
      border-radius: var(--radius-sm);
      font-weight: 900;
      font-size: 0.92rem;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <!-- 1. Top Festive Announcement Bar -->
  <div class="top-bar">
    <span class="badge">🎄 ESPECIAL NAVIDAD Y REYES 2026</span>
    HASTA 50% DTO. HOY + ENVÍO GRATIS A TODA ESPAÑA EN PEDIDOS &gt; 45,00 € (IVA 21% Incluido) — Cambio y Devolución Ampliados hasta después de Reyes
  </div>

  <!-- 2. Sticky Navbar -->
  <header class="navbar">
    <div class="navbar-container">
      <div class="brand-group">
        <a href="/" class="brand-logo">
          <span>🎄 ${brandName}</span>
        </a>
        <span class="brand-subtitle">Holiday &amp; Gift Edition España · Decoración Luminosa y Regalos</span>
      </div>

      <nav class="nav-links">
        <a href="#compra">Oferta Estrella Navidad</a>
        <a href="#ficha-cortina">Ficha Técnica Cortina 3D</a>
        <a href="#catalogo-navidad">Catálogo Completo (10 Regalos)</a>
        <a href="#opiniones">Opiniones (1.640)</a>
        <a href="#faq">Envíos y Garantía Reyes</a>
      </nav>

      <div class="nav-badges">
        <div class="trust-pill">
          <span>🎁</span> Entrega Asegurada para Navidad y Reyes
        </div>
      </div>
    </div>
  </header>

  <main class="container">

    <!-- Stripe Checkout Live Notification Banner -->
    <div id="stripe-status-banner"></div>

    <!-- Festive Welcome Banner -->
    <div class="holiday-hero-banner">
      <div>
        <h2>✨ Colección Oficial de Iluminación Mágica y Regalos de Navidad 2026</h2>
        <p>
          Seleccionamos los 10 artículos de decoración luminosa y regalos navideños más buscados en España. Con fotografías reales, materiales detallados, enchufe europeo y pago seguro en Euros.
        </p>
      </div>
      <a href="#catalogo-navidad" class="holiday-hero-cta">🎁 Ver los 10 Regalos de Navidad ↓</a>
    </div>

    <!-- 3. Product Hero Section (2 Columns) -->
    <section class="product-hero-layout" id="compra">

      <!-- Left Column: Interactive Gallery of Hero Product #1 -->
      <div class="gallery-container">
        <div class="main-viewer" id="main-viewer-card">
          <div class="gallery-badge" id="viewer-badge">DECORACIÓN ESTRELLA · SALÓN Y VENTANA ILUMINADOS</div>
          <div class="gallery-discount-badge">-50% DTO</div>

          <div class="viewer-svg-stage" id="viewer-svg-stage">
            <img src="/assets/xmas-01-curtain-lights.jpg" alt="Cortina LED Navideña de Anillos Mágicos 3D" style="max-width:100%; max-height:300px; object-fit:contain; border-radius:12px;" />
          </div>

          <div class="viewer-caption" id="viewer-caption">
            Cortina LED de 3 metros × 0,5 m con 10 anillos luminosos, 120 LEDs blanco cálido y 5 modelos de figuras 3D
          </div>
        </div>

        <!-- 4 Clickable Photo Thumbnails -->
        <div class="thumbnails-row">
          <button class="thumb-btn active" onclick="switchGalleryTab(0)">
            <img src="/assets/xmas-01-curtain-lights.jpg" alt="Vista Salón" />
            <span>1. Vista Salón</span>
          </button>
          <button class="thumb-btn" onclick="switchGalleryTab(1)">
            <img src="/assets/xmas-01-curtain-lights-2.jpg" alt="Figuras 3D" />
            <span>2. Figuras 3D</span>
          </button>
          <button class="thumb-btn" onclick="switchGalleryTab(2)">
            <img src="/assets/xmas-01-curtain-lights-3.jpg" alt="Medidas 3x0,5m" />
            <span>3. Medidas 3×0,5m</span>
          </button>
          <button class="thumb-btn" onclick="switchGalleryTab(3)">
            <img src="/assets/xmas-01-curtain-lights-4.jpg" alt="Enchufe Europeo" />
            <span>4. Enchufe UE</span>
          </button>
        </div>

        <!-- Trust Badges Under Gallery -->
        <div class="gallery-trust-grid">
          <div class="trust-card-mini">
            <span>🔌</span>
            <span>Enchufe Europeo 220V Directo</span>
          </div>
          <div class="trust-card-mini">
            <span>💡</span>
            <span>120 LEDs Blanco Cálido Seguros (Fríos al Tacto)</span>
          </div>
          <div class="trust-card-mini">
            <span>🎄</span>
            <span>Garantía Especial hasta después de Reyes</span>
          </div>
          <div class="trust-card-mini">
            <span>🔒</span>
            <span>Pago Seguro Cifrado Stripe SSL en Euros</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Buy Box -->
      <div class="buy-box">
        <div class="rating-row">
          <span class="stars">★★★★★</span>
          <span class="reviews-text">4.95/5 (1.640 hogares en España)</span>
          <span class="verified-pill">✓ Éxito de Ventas Navidad</span>
        </div>

        <h1 class="product-title">Cortina LED Navideña de Anillos Mágicos 3D (3×0,5m · 120 LEDs · Enchufe Europeo)</h1>
        <p class="product-subtitle">
          Transforma al instante cualquier ventana, cristalera, cabecero o pared del salón con <strong>10 aros colgantes iluminados</strong> y <strong>10 muñecos navideños 3D iluminados desde arriba</strong> (Papá Noel, Reno, Muñeco de Nieve, Árbol de Navidad y Gorro). Lista para enchufar y disfrutar.
        </p>

        <!-- Pricing Section -->
        <div class="price-box">
          <span class="price-current" id="box-price-current">49,98 €</span>
          <span class="price-compare" id="box-price-compare">109,98 €</span>
          <span class="savings-badge" id="box-savings-badge">Ahorras 60 € + Envío Gratis</span>
        </div>

        <!-- Stock and Delivery Notification -->
        <div class="urgency-box">
          <div class="urgency-line">
            <span>🔥</span>
            <span>Alta demanda por campaña de Navidad — Unidades listas para envío prioritario a España</span>
          </div>
          <div class="delivery-line" id="delivery-estimate-text">
            🚚 Entrega estimada en España: Correos Express / CTT en 7-10 días laborables
          </div>
        </div>

        <!-- Interactive Free Shipping Bar -->
        <div class="shipping-bar-wrapper">
          <div class="shipping-bar-labels">
            <span id="shipping-bar-status-label">Progreso hacia Envío Gratis España</span>
            <span id="shipping-bar-amount-label" style="color: var(--forest);">49,98 € / 45,00 €</span>
          </div>
          <div class="shipping-progress-bg">
            <div id="shipping-progress-fill" class="shipping-progress-fill" style="width: 100%;"></div>
          </div>
          <div class="shipping-msg" id="shipping-bar-msg">
            🎉 <strong>¡ENHORABUENA!</strong> Has desbloqueado el <strong>ENVÍO RÁPIDO GRATIS A TODA ESPAÑA (0,00 €)</strong>.
          </div>
        </div>

        <!-- Tiered Pack Selector -->
        <div class="tier-selector-title">Elige tu Opción de Decoración Navideña (IVA 21% Incluido):</div>

        <!-- Option 1: 1x Cortina LED -->
        <div class="tier-card" id="tier-card-1" onclick="selectTier(1)">
          <div class="tier-header">
            <div class="tier-left">
              <input type="radio" name="pack_tier" id="radio-tier-1" class="tier-radio" />
              <div>
                <div class="tier-name">1× Cortina LED Navideña Anillos Mágicos 3D (3×0,5m)</div>
                <div class="tier-desc">Incluye 10 anillos luminosos + 10 figuras navideñas 3D + Enchufe Europeo (+ 4,99 € envío)</div>
              </div>
            </div>
            <div class="tier-pricing">
              <span class="tier-price-main">29,99 €</span>
              <span class="tier-price-compare">59,99 €</span>
            </div>
          </div>
        </div>

        <!-- Option 2: Pack Decoración Total (Cortina + Proyector Nieve) -->
        <div class="tier-card selected" id="tier-card-2" onclick="selectTier(2)">
          <div class="tier-badge-ribbon">⭐ MÁS ELEGIDO EN ESPAÑA (ENVÍO GRATIS INCLUIDO)</div>
          <div class="tier-header">
            <div class="tier-left">
              <input type="radio" name="pack_tier" id="radio-tier-2" class="tier-radio" checked />
              <div>
                <div class="tier-name">Pack Decoración Total (Cortina LED 3D + Proyector Nieve 360°)</div>
                <div class="tier-desc">Añade el Proyector LED Rotatorio de 16 Figuras y Copos de Nieve por solo 19,99 € • <strong>¡ENVÍO GRATIS!</strong></div>
              </div>
            </div>
            <div class="tier-pricing">
              <span class="tier-price-main">49,98 €</span>
              <span class="tier-price-compare">109,98 €</span>
            </div>
          </div>
        </div>

        <!-- Option 3: Pack Mágico Navidad 3 en 1 -->
        <div class="tier-card" id="tier-card-3" onclick="selectTier(3)">
          <div class="tier-badge-ribbon">🏆 PACK MÁGICO 3 EN 1 · DECORACIÓN + REGALO ESTRELLA</div>
          <div class="tier-header">
            <div class="tier-left">
              <input type="radio" name="pack_tier" id="radio-tier-3" class="tier-radio" />
              <div>
                <div class="tier-name">Pack Mágico 3 en 1 (Cortina LED 3D + Proyector Nieve + Esfera Cristal 3D)</div>
                <div class="tier-desc">Incluye además la Esfera de Cristal K9 3D con Base de Madera LED • <strong>¡ENVÍO PRIORITARIO GRATIS!</strong></div>
              </div>
            </div>
            <div class="tier-pricing">
              <span class="tier-price-main">59,99 €</span>
              <span class="tier-price-compare">159,97 €</span>
            </div>
          </div>
        </div>

        <!-- Main Checkout Button -->
        <button class="btn-buy-now" id="btn-stripe-checkout" onclick="redirectToStripeCheckout()">
          <svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
          <span id="btn-buy-label">🎄 FINALIZAR PEDIDO NAVIDEÑO — PAGAR EN EUROS</span>
        </button>

        <!-- Payment Trust Bar -->
        <div class="payment-trust-bar">
          <div class="payment-icons">
            <span class="payment-pill">💳 Tarjetas Débito / Crédito (BBVA, Santander, CaixaBank...)</span>
            <span class="payment-pill"> Apple Pay</span>
            <span class="payment-pill">G Pay Google</span>
            <span class="payment-pill">Stripe 256-Bit SSL</span>
          </div>
          <div class="guarantee-note">
            <span>🛡️</span> Garantía de Satisfacción Navideña • Devolución sencilla hasta el 15 de enero
          </div>
        </div>

      </div>

    </section>

    <!-- 4. Ficha Técnica Detallada del Producto Estrella #1 (Cortina LED 3D) -->
    <section class="section-spacing" id="ficha-cortina">
      <div class="section-header">
        <span class="section-tag">DETALLES REALES AL MILÍMETRO</span>
        <h2 class="section-title">Todo lo que necesitas saber de la Cortina LED de Anillos Mágicos 3D</h2>
        <p class="section-desc">
          Respondemos con total claridad a las 5 preguntas clave para que sepas exactamente cómo es, cuánto mide, de qué está hecha y qué incluye tu paquete.
        </p>
      </div>

      <div class="cards-grid-3">
        <div class="benefit-card" style="border-top: 4px solid var(--primary);">
          <h3>1. ¿Qué es exactamente?</h3>
          <p>
            Es una cortina decorativa navideña compuesta por un cable principal horizontal del que cuelgan <strong>10 tiras verticales a dos alturas alternas</strong>. En el extremo de cada tira cuelga un <strong>anillo transparente iluminado con una figura navideña 3D en su interior</strong> que brilla con luz blanco cálido.
          </p>
        </div>

        <div class="benefit-card" style="border-top: 4px solid var(--forest);">
          <h3>2. ¿Cómo es y qué medidas tiene?</h3>
          <p>
            Cubre <strong>3 metros de ancho total × 0,5 metros de caída vertical</strong> (más 70 cm de cable de alimentación hasta el enchufe). Cada anillo circular mide <strong>10 cm de diámetro</strong> y las figuras navideñas interiores miden <strong>5,5 cm de alto</strong>. Peso total ligero de 330 gramos.
          </p>
        </div>

        <div class="benefit-card" style="border-top: 4px solid var(--gold);">
          <h3>3. ¿De qué está hecha? (Materiales)</h3>
          <p>
            Cableado de hilo de cobre flexible recubierto de <strong>PVC transparente aislante e impermeable IP44</strong>. Los anillos son de policarbonato cristalino difusor de luz y los 10 muñecos 3D están moldeados en resina acrílica policromada de alta durabilidad.
          </p>
        </div>

        <div class="benefit-card" style="border-top: 4px solid var(--blue-trust);">
          <h3>4. ¿Qué lleva en la caja?</h3>
          <p>
            • <strong>1× Cortina LED de 3×0,5 metros con 10 anillos luminosos</strong>.<br/>
            • <strong>10× Figuras navideñas 3D</strong> con enganche (2 Papá Noel, 2 Renos, 2 Muñecos de Nieve, 2 Árboles de Navidad y 2 Gorros navideños).<br/>
            • <strong>Enchufe europeo 220V integrado</strong> + conector hembra trasero.
          </p>
        </div>

        <div class="benefit-card" style="border-top: 4px solid #7c3aed; grid-column: span 2;">
          <h3>5. ¿Qué funciones tiene y cómo se instala?</h3>
          <p>
            Cuenta con <strong>120 perlas LED de luz blanco cálido de bajo consumo</strong> (no se calientan aunque estén encendidas toda la noche junto a cortinas de tela). Incorpora un <strong>conector hembra trasero (<em>Tail Plug</em>)</strong> que te permite enchufar una segunda cortina seguida si tienes un ventanal de 6 metros. Se cuelga en 2 minutos en la barra de la cortina, con ganchos adhesivos o bridas e incluye los ganchos superiores listos para colgar cada figura.
          </p>
        </div>
      </div>
    </section>

    <!-- 5. CATÁLOGO COMPLETO DE LOS 10 ARTÍCULOS VIRALES DE NAVIDAD 2026 -->
    <section class="section-spacing" id="catalogo-navidad">
      <div class="section-header">
        <span class="section-tag">CATÁLOGO OFICIAL NAVIDAD Y REYES 2026</span>
        <h2 class="section-title">Los 10 Artículos de Decoración y Regalo Más Buscados de esta Navidad</h2>
        <p class="section-desc">
          Explora nuestra selección completa de 10 productos reales. Cada artículo muestra sus fotografías reales y responde a las 5 preguntas esenciales (¿Qué es?, ¿Cómo es?, ¿De qué está hecho?, ¿Qué lleva en la caja? y ¿Qué funciones tiene?). Puedes comprar cualquiera de ellos individualmente con un clic.
        </p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 32px;">

        <!-- ARTÍCULO 1: CORTINA LED NAVIDEÑA DE ANILLOS MÁGICOS 3D -->
        <div class="catalog-item-card">
          <div class="catalog-item-header">
            <div>
              <span class="catalog-category-pill">🎄 #1 DECORACIÓN DE VENTANAS Y SALÓN · MÁS VENDIDO</span>
              <h3 style="font-size: 1.4rem; font-weight: 900; margin-top: 6px;">1. Cortina LED Navideña de Anillos Mágicos 3D (3×0,5m · 120 LEDs · Enchufe Europeo)</h3>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--primary);">29,99 € <span style="font-size: 0.95rem; color: var(--text-dim); text-decoration: line-through;">59,99 €</span></div>
              <div style="font-size: 0.78rem; color: var(--forest); font-weight: 700;">IVA 21% Incluido · En Stock España</div>
            </div>
          </div>
          <div class="catalog-item-body">
            <div class="catalog-photos-pair">
              <img src="/assets/xmas-01-curtain-lights.jpg" alt="Cortina LED Navideña Anillos Mágicos 3D" />
              <img src="/assets/xmas-01-curtain-lights-2.jpg" alt="Figuras Navideñas 3D Iluminadas" />
              <img src="/assets/xmas-01-curtain-lights-3.jpg" alt="Dimensiones Cortina LED 3x0,5m" />
              <img src="/assets/xmas-01-curtain-lights-4.jpg" alt="Detalle Enchufe Europeo y Conector" />
            </div>
            <div class="spec-list-5">
              <div><strong>1. ¿Qué es?:</strong> Una cortina luminosa navideña con 10 aros colgantes iluminados desde el interior y 10 figuras 3D de Navidad suspendidas en el centro de cada aro.</div>
              <div><strong>2. ¿Cómo es y qué medidas tiene?:</strong> Mide <strong>3 metros de ancho × 0,5 metros de caída</strong> (más 70 cm de cable al enchufe). Incluye 10 anillos de 10 cm de diámetro y figuras de 5,5 cm.</div>
              <div><strong>3. ¿De qué está hecha?:</strong> Hilo de cobre revestido en PVC transparente impermeable IP44, aros difusores de policarbonato y muñecos 3D en resina acrílica.</div>
              <div><strong>4. ¿Qué lleva en la caja?:</strong> 1× Cortina de 10 anillos con 120 LEDs, 10× Figuras navideñas 3D (Papá Noel, Reno, Muñeco de Nieve, Árbol y Gorro) y enchufe europeo 220V.</div>
              <div><strong>5. ¿Qué funciones tiene?:</strong> Iluminación blanco cálido acogedora fría al tacto (segura para niños, mascotas y cortinas) con conector hembra trasero para empalmar varias cortinas seguidas.</div>
              <div style="background: transparent; border: none; padding: 6px 0 0; display: flex; flex-wrap: wrap; gap: 12px;">
                <button class="btn-catalog-buy" onclick="buySingleCatalogProduct('prod_xmas_curtain_001', 29.99, this)">
                  🎄 Comprar Ahora — 29,99 €
                </button>
                <a href="#compra" onclick="selectTier(2)" style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 12px 18px; border-radius: 10px; font-weight: 800; font-size: 0.88rem;">
                  ⭐ Llevar en Pack con Envío Gratis (49,98 €)
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- ARTÍCULO 2: PROYECTOR LED ROTATORIO 360° DE COPOS DE NIEVE Y 16 FIGURAS -->
        <div class="catalog-item-card">
          <div class="catalog-item-header">
            <div>
              <span class="catalog-category-pill">❄️ #2 PROYECCIÓN ANIMADA EN PAREDES Y TECHOS</span>
              <h3 style="font-size: 1.4rem; font-weight: 900; margin-top: 6px;">2. Proyector LED Rotatorio 360° de Copos de Nieve y 16 Figuras Navideñas (Enchufe Europeo)</h3>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--primary);">24,99 € <span style="font-size: 0.95rem; color: var(--text-dim); text-decoration: line-through;">49,99 €</span></div>
              <div style="font-size: 0.78rem; color: var(--forest); font-weight: 700;">19,99 € en Pack · IVA 21% Incluido</div>
            </div>
          </div>
          <div class="catalog-item-body">
            <div class="catalog-photos-pair">
              <img src="/assets/xmas-02-snowflake-projector.jpg" alt="Proyector LED Rotatorio 16 Figuras Navideñas" style="height: 260px;" />
              <img src="/assets/xmas-02-snowflake-projector-2.jpg" alt="Proyector Navideño con Soporte 360" style="height: 260px;" />
            </div>
            <div class="spec-list-5">
              <div><strong>1. ¿Qué es?:</strong> Un foco proyector LED automático que llena paredes, techos o fachadas con una lluvia en movimiento de copos de nieve y 16 figuras navideñas a todo color.</div>
              <div><strong>2. ¿Cómo es y qué medidas tiene?:</strong> Cuerpo cilíndrico compacto en negro mate de <strong>11 cm × 12 cm</strong> con soporte basculante orientable 360° y base circular estable.</div>
              <div><strong>3. ¿De qué está hecho?:</strong> Carcasa de ABS de alta resistencia térmica, lentes ópticas multicapa de alta transparencia y motor silencioso de rotación continua.</div>
              <div><strong>4. ¿Qué lleva en la caja?:</strong> 1× Proyector LED Rotatorio de 16 patrones navideños integrado, 1× Soporte de fijación 360° y cable con enchufe europeo 220V directo.</div>
              <div><strong>5. ¿Qué funciones tiene?:</strong> Rotación automática de 16 diseños (Papá Noel, Renos, Muñecos de Nieve, Árboles, Copos de Nieve, Campanas...) cubriendo de 5 a 15 m² sin configuración complicada: enchufar y listo.</div>
              <div style="background: transparent; border: none; padding: 6px 0 0;">
                <button class="btn-catalog-buy" onclick="buySingleCatalogProduct('prod_xmas_projector_002', 24.99, this)">
                  ❄️ Comprar Proyector Navideño — 24,99 €
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ARTÍCULO 3: ESFERA DE CRISTAL K9 3D GRABADA CON LÁSER + BASE DE MADERA LED -->
        <div class="catalog-item-card">
          <div class="catalog-item-header">
            <div>
              <span class="catalog-category-pill">🔮 #3 REGALO EMOCIONAL ESTRELLA · PAREJA Y FAMILIA</span>
              <h3 style="font-size: 1.4rem; font-weight: 900; margin-top: 6px;">3. Esfera de Cristal K9 3D Grabada con Láser + Base de Madera Maciza LED USB</h3>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--primary);">24,99 € <span style="font-size: 0.95rem; color: var(--text-dim); text-decoration: line-through;">49,99 €</span></div>
              <div style="font-size: 0.78rem; color: var(--forest); font-weight: 700;">IVA 21% Incluido · Regalo Premium</div>
            </div>
          </div>
          <div class="catalog-item-body">
            <div class="catalog-photos-pair">
              <img src="/assets/xmas-03-crystal-ball-3d.jpg" alt="Esfera de Cristal K9 3D con Base de Madera LED" style="height: 260px;" />
              <img src="/assets/xmas-03-crystal-ball-3d-2.jpg" alt="Detalle Esfera Cristal Grabado Láser 3D" style="height: 260px;" />
            </div>
            <div class="spec-list-5">
              <div><strong>1. ¿Qué es?:</strong> Una lámpara decorativa y joya de colección formada por una bola de cristal macizo tallada por dentro en 3D con láser, iluminada desde abajo por un pedestal de madera natural.</div>
              <div><strong>2. ¿Cómo es y qué medidas tiene?:</strong> Esfera de cristal de <strong>6 cm de diámetro</strong> sobre una base cilíndrica de madera de <strong>6 cm × 2 cm</strong> (altura total del conjunto: 8 cm; peso sólido de 350 g).</div>
              <div><strong>3. ¿De qué está hecha?:</strong> <strong>Cristal óptico K9 100% puro</strong> (sin burbujas ni imperfecciones, no es plástico) y base de <strong>madera maciza de haya natural</strong> pulida a mano.</div>
              <div><strong>4. ¿Qué lleva en la caja?:</strong> 1× Esfera de Cristal K9 grabada en 3D, 1× Base de madera de haya con LED integrado y cable de alimentación USB con interruptor.</div>
              <div><strong>5. ¿Qué funciones tiene?:</strong> Al encender la base, la luz cálida (3000K) atraviesa el grabado láser 3D interior proyectando un halo mágico en el techo y funcionando como lámpara de mesita de noche relajante.</div>
              <div style="background: transparent; border: none; padding: 6px 0 0;">
                <button class="btn-catalog-buy" onclick="buySingleCatalogProduct('prod_xmas_crystal_003', 24.99, this)">
                  🎁 Comprar Esfera de Cristal 3D — 24,99 €
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ARTÍCULO 4: ÁRBOL DE NAVIDAD LED ESPIRAL DE MESA EN HIERRO FORJADO DORADO -->
        <div class="catalog-item-card">
          <div class="catalog-item-header">
            <div>
              <span class="catalog-category-pill">🌟 #4 CENTRO DE MESA Y RECIBIDOR DE LUJO</span>
              <h3 style="font-size: 1.4rem; font-weight: 900; margin-top: 6px;">4. Árbol de Navidad LED Espiral de Mesa en Hierro Forjado Dorado con Estrella</h3>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--primary);">29,99 € <span style="font-size: 0.95rem; color: var(--text-dim); text-decoration: line-through;">54,99 €</span></div>
              <div style="font-size: 0.78rem; color: var(--forest); font-weight: 700;">IVA 21% Incluido · Sin Cables a la Vista</div>
            </div>
          </div>
          <div class="catalog-item-body">
            <div class="catalog-photos-pair">
              <img src="/assets/xmas-04-spiral-tree-lamp.jpg" alt="Árbol de Navidad LED Espiral Dorado" style="height: 260px;" />
              <img src="/assets/xmas-04-spiral-tree-lamp-2.jpg" alt="Árbol LED de Mesa Iluminado" style="height: 260px;" />
            </div>
            <div class="spec-list-5">
              <div><strong>1. ¿Qué es?:</strong> Una lámpara-escultura con forma de árbol de Navidad en espiral dorada coronada por una estrella luminosa, pensada para vestir la mesa de Nochebuena, aparadores o escritorios.</div>
              <div><strong>2. ¿Cómo es y qué medidas tiene?:</strong> Mide <strong>29 cm de altura × 13 cm de diámetro en la base</strong>, con estructura helicoidal abierta adornada con cuentas nacaradas y micro-LEDs dorados.</div>
              <div><strong>3. ¿De qué está hecho?:</strong> Estructura de <strong>hierro forjado con baño dorado antioxidante</strong>, estrella difusora superior y filamento de cobre con LEDs blanco cálido.</div>
              <div><strong>4. ¿Qué lleva en la caja?:</strong> 1× Árbol de Navidad LED Espiral de Hierro Forjado Dorado completo en caja protegida (funciona con 3 pilas AAA estándar para no depender de enchufes).</div>
              <div><strong>5. ¿Qué funciones tiene?:</strong> Iluminación inalámbrica limpia (sin cables encima del mantel de Navidad) con interruptor oculto bajo la base y encendido instantáneo de luz dorada cálida.</div>
              <div style="background: transparent; border: none; padding: 6px 0 0;">
                <button class="btn-catalog-buy" onclick="buySingleCatalogProduct('prod_xmas_tree_004', 29.99, this)">
                  🌟 Comprar Árbol LED Espiral Dorado — 29,99 €
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ARTÍCULO 5: LÁMPARA ACRÍLICA 3D "MERRY CHRISTMAS" DE LUZ CÁLIDA -->
        <div class="catalog-item-card">
          <div class="catalog-item-header">
            <div>
              <span class="catalog-category-pill">🎅 #5 DETALLE NAVIDEÑO Y AMIGO INVISIBLE</span>
              <h3 style="font-size: 1.4rem; font-weight: 900; margin-top: 6px;">5. Lámpara Acrílica 3D "Merry Christmas" de Luz Cálida LED</h3>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--primary);">19,99 € <span style="font-size: 0.95rem; color: var(--text-dim); text-decoration: line-through;">39,99 €</span></div>
              <div style="font-size: 0.78rem; color: var(--forest); font-weight: 700;">IVA 21% Incluido · Alimentación Dual</div>
            </div>
          </div>
          <div class="catalog-item-body">
            <div class="catalog-photos-pair">
              <img src="/assets/xmas-05-acrylic-3d-lamp.jpg" alt="Lámpara Acrílica 3D Merry Christmas" style="height: 260px;" />
              <img src="/assets/xmas-05-acrylic-3d-lamp-2.jpg" alt="Detalle Lámpara Acrílica Navideña" style="height: 260px;" />
            </div>
            <div class="spec-list-5">
              <div><strong>1. ¿Qué es?:</strong> Una lámpara de noche con efecto holograma 3D grabado en placa acrílica con motivos de árbol de Navidad, trineo de Papá Noel y felicitación <em>"Merry Christmas"</em>.</div>
              <div><strong>2. ¿Cómo es y qué medidas tiene?:</strong> Mide <strong>20 cm de altura total × 15 cm de ancho</strong>, encajada sobre una base circular blanca minimalista de 8,5 cm × 4 cm.</div>
              <div><strong>3. ¿De qué está hecha?:</strong> Panel superior en <strong>acrílico óptico PMMA grabado por láser</strong> de alta nitidez y base inferior en polímero ABS resistente.</div>
              <div><strong>4. ¿Qué lleva en la caja?:</strong> 1× Placa acrílica grabada 3D (con película protectora retirable), 1× Base luminosa LED y 1× Cable de alimentación USB.</div>
              <div><strong>5. ¿Qué funciones tiene?:</strong> Emite una luz cálida suave sin parpadeos (segura para habitaciones infantiles) y permite usarse tanto enchufada por USB como sin cables mediante 3 pilas AAA.</div>
              <div style="background: transparent; border: none; padding: 6px 0 0;">
                <button class="btn-catalog-buy" onclick="buySingleCatalogProduct('prod_xmas_acrylic_005', 19.99, this)">
                  🎅 Comprar Lámpara Acrílica 3D — 19,99 €
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ARTÍCULO 6: DIFUSOR DE AROMAS Y HUMIDIFICADOR EFECTO LLAMA DE CHIMENEA -->
        <div class="catalog-item-card">
          <div class="catalog-item-header">
            <div>
              <span class="catalog-category-pill">🔥 #6 AMBIENTE DE HOGAR Y AROMATERAPIA DE INVIERNO</span>
              <h3 style="font-size: 1.4rem; font-weight: 900; margin-top: 6px;">6. Difusor de Aromas y Humidificador Ultrasónico Efecto Llama de Chimenea 7 Colores</h3>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--primary);">29,99 € <span style="font-size: 0.95rem; color: var(--text-dim); text-decoration: line-through;">59,99 €</span></div>
              <div style="font-size: 0.78rem; color: var(--forest); font-weight: 700;">IVA 21% Incluido · Vapor Frío Seguro</div>
            </div>
          </div>
          <div class="catalog-item-body">
            <div class="catalog-photos-pair">
              <img src="/assets/xmas-06-flame-diffuser.jpg" alt="Difusor de Aromas Efecto Llama de Chimenea" style="height: 260px;" />
              <img src="/assets/xmas-06-flame-diffuser-2.jpg" alt="Difusor Efecto Llama 7 Colores" style="height: 260px;" />
            </div>
            <div class="spec-list-5">
              <div><strong>1. ¿Qué es?:</strong> Un humidificador ultrasónico y difusor de aceites esenciales que combina vapor frío con iluminación LED para crear el efecto visual exacto de una chimenea encendida.</div>
              <div><strong>2. ¿Cómo es y qué medidas tiene?:</strong> Diseño rectangular elegante en negro mate de <strong>17 cm de largo × 10,1 cm de alto × 7,5 cm de fondo</strong> con depósito de agua de <strong>180 ml</strong>.</div>
              <div><strong>3. ¿De qué está hecho?:</strong> Exterior en ABS mate antihuellas e interior del tanque en <strong>polipropileno PP de grado alimentario resistente a aceites esenciales puros</strong> (canela, pino, naranja, lavanda...).</div>
              <div><strong>4. ¿Qué lleva en la caja?:</strong> 1× Difusor Ultrasónico Efecto Llama, 1× Cable de alimentación USB Tipo C y 1× Manual de instrucciones en español/inglés.</div>
              <div><strong>5. ¿Qué funciones tiene?:</strong> Simulación de llama ardiente (vapor 100% frío al tacto), selector de <strong>7 colores de llama</strong>, funcionamiento silencioso (&lt;25 dB) y chip de auto-apagado cuando detecta que se acaba el agua.</div>
              <div style="background: transparent; border: none; padding: 6px 0 0;">
                <button class="btn-catalog-buy" onclick="buySingleCatalogProduct('prod_xmas_diffuser_006', 29.99, this)">
                  🔥 Comprar Difusor Efecto Chimenea — 29,99 €
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ARTÍCULO 7: BUFANDA TÉRMICA CALEFACTABLE USB CON 3 TEMPERATURAS -->
        <div class="catalog-item-card">
          <div class="catalog-item-header">
            <div>
              <span class="catalog-category-pill">🧣 #7 REGALO PRÁCTICO PARA PADRES, PAREJA Y ABUELOS</span>
              <h3 style="font-size: 1.4rem; font-weight: 900; margin-top: 6px;">7. Bufanda Térmica Calefactable USB con 3 Temperaturas (42°C / 48°C / 55°C) Lavable</h3>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--primary);">24,99 € <span style="font-size: 0.95rem; color: var(--text-dim); text-decoration: line-through;">49,99 €</span></div>
              <div style="font-size: 0.78rem; color: var(--forest); font-weight: 700;">IVA 21% Incluido · Unisex y Lavable</div>
            </div>
          </div>
          <div class="catalog-item-body">
            <div class="catalog-photos-pair">
              <img src="/assets/xmas-07-heated-scarf-2.jpg" alt="Bufanda Térmica Calefactable USB" style="height: 260px;" />
              <img src="/assets/xmas-07-heated-scarf.jpg" alt="Detalle 3 Niveles de Temperatura Bufanda" style="height: 260px;" />
            </div>
            <div class="spec-list-5">
              <div><strong>1. ¿Qué es?:</strong> Una bufanda de invierno unisex ultrasuave con un panel calefactor invisible en la zona de la nuca que se calienta en 5 segundos al conectarla a cualquier pequeña batería portátil USB.</div>
              <div><strong>2. ¿Cómo es y qué medidas tiene?:</strong> Mide <strong>80 cm de largo × 10 cm de ancho</strong> con ojal de cruce fácil, bolsillo oculto con cremallera y botón bordado con indicador LED de temperatura.</div>
              <div><strong>3. ¿De qué está hecha?:</strong> Exterior en <strong>tejido polar/cachemir hipoalergénico de tacto aterciopelado</strong>, relleno de algodón térmico transpirable y resistencia interna flexible de <strong>fibra de carbono</strong>.</div>
              <div><strong>4. ¿Qué lleva en la caja?:</strong> 1× Bufanda Térmica Calefactable con cable USB integrado en el bolsillo oculto con cremallera (compatible con cualquier Powerbank USB universal de 5V).</div>
              <div><strong>5. ¿Qué funciones tiene?:</strong> <strong>3 niveles de calor</strong> con un botón: 🔴 Rojo (55°C calor intenso), ⚪ Blanco (48°C calor medio) y 🔵 Azul (42°C calor suave). Además es <strong>100% lavable en agua</strong> gracias a su conector USB sellado.</div>
              <div style="background: transparent; border: none; padding: 6px 0 0;">
                <button class="btn-catalog-buy" onclick="buySingleCatalogProduct('prod_xmas_scarf_007', 24.99, this)">
                  🧣 Comprar Bufanda Calefactable — 24,99 €
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ARTÍCULO 8: MINICÁMARA DIGITAL INFANTIL 4K HD CON ZOOM 16X -->
        <div class="catalog-item-card">
          <div class="catalog-item-header">
            <div>
              <span class="catalog-category-pill">📸 #8 REGALO ESTRELLA DE PAPÁ NOEL Y REYES PARA NIÑOS</span>
              <h3 style="font-size: 1.4rem; font-weight: 900; margin-top: 6px;">8. Minicámara Digital Infantil 4K HD con Zoom 16x y Pantalla IPS 2.4"</h3>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--primary);">34,99 € <span style="font-size: 0.95rem; color: var(--text-dim); text-decoration: line-through;">69,99 €</span></div>
              <div style="font-size: 0.78rem; color: var(--forest); font-weight: 700;">IVA 21% Incluido · Batería Recargable USB-C</div>
            </div>
          </div>
          <div class="catalog-item-body">
            <div class="catalog-photos-pair">
              <img src="/assets/xmas-08-kids-camera.jpg" alt="Minicámara Digital Infantil 4K HD" style="height: 260px;" />
              <img src="/assets/xmas-08-kids-camera-2.jpg" alt="Pantalla IPS 2.4 Minicámara Digital" style="height: 260px;" />
            </div>
            <div class="spec-list-5">
              <div><strong>1. ¿Qué es?:</strong> Una cámara fotográfica y de vídeo digital compacta de verdad, diseñada para que niños y jóvenes capturen sus recuerdos de Navidad sin usar el teléfono móvil de los padres.</div>
              <div><strong>2. ¿Cómo es y qué medidas tiene?:</strong> Tamaño de bolsillo ergonómico de <strong>9,7 cm × 6,2 cm × 2,3 cm</strong> y solo 113 gramos de peso, con gran pantalla trasera a color de <strong>2.4 pulgadas IPS</strong>.</div>
              <div><strong>3. ¿De qué está hecha?:</strong> Chasis de policarbonato ABS resistente a impactos cotidianos, lente óptica multicapa con flash LED frontal y pantalla con protección antifatiga visual.</div>
              <div><strong>4. ¿Qué lleva en la caja?:</strong> 1× Cámara Digital Compacta 4K HD, 1× Batería de litio recargable integrada, 1× Cable de carga y datos USB-C, 1× Correa de muñeca anticaídas y 1× Manual.</div>
              <div><strong>5. ¿Qué funciones tiene?:</strong> Fotografías de hasta 48 MP, grabación de vídeo HD con micrófono, <strong>Zoom digital 16x</strong>, temporizador para selfies grupales, detector de sonrisas, flash LED y ranura para tarjeta MicroSD.</div>
              <div style="background: transparent; border: none; padding: 6px 0 0;">
                <button class="btn-catalog-buy" onclick="buySingleCatalogProduct('prod_xmas_camera_008', 34.99, this)">
                  📸 Comprar Minicámara Digital 4K — 34,99 €
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ARTÍCULO 9: PROYECTOR LED DE GALAXIA, NEBULOSA BOREAL Y ESTRELLAS 360° UFO -->
        <div class="catalog-item-card">
          <div class="catalog-item-header">
            <div>
              <span class="catalog-category-pill">🌌 #9 VIRAL EN TIKTOK · DORMITORIOS Y JÓVENES</span>
              <h3 style="font-size: 1.4rem; font-weight: 900; margin-top: 6px;">9. Proyector LED de Galaxia, Nebulosa Boreal y Estrellas 360° UFO</h3>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--primary);">29,99 € <span style="font-size: 0.95rem; color: var(--text-dim); text-decoration: line-through;">59,99 €</span></div>
              <div style="font-size: 0.78rem; color: var(--forest); font-weight: 700;">IVA 21% Incluido · 14 Modos de Galaxia</div>
            </div>
          </div>
          <div class="catalog-item-body">
            <div class="catalog-photos-pair">
              <img src="/assets/xmas-09-star-projector.jpg" alt="Proyector LED de Galaxia y Nebulosa 360" style="height: 260px;" />
              <img src="/assets/xmas-09-star-projector-2.jpg" alt="Efecto Cielo Estrellado Proyector UFO" style="height: 260px;" />
            </div>
            <div class="spec-list-5">
              <div><strong>1. ¿Qué es?:</strong> Un proyector planetario doméstico que transforma por completo el techo y las paredes de cualquier habitación en un cielo nocturno con auroras boreales en movimiento y miles de estrellas.</div>
              <div><strong>2. ¿Cómo es y qué medidas tiene?:</strong> Diseño futurista tipo cápsula UFO de <strong>15,5 cm × 15,5 cm × 8 cm</strong> sobre soporte orientable que permite proyectar tanto hacia el techo como hacia la pared.</div>
              <div><strong>3. ¿De qué está hecho?:</strong> Cuerpo en ABS + PC ignífugo de alta calidad con domo óptico facetado de gran angular y proyector estelar de precisión.</div>
              <div><strong>4. ¿Qué lleva en la caja?:</strong> 1× Proyector de Galaxia y Estrellas 360°, 1× Soporte de orientación, 1× Cable de alimentación USB y 1× Guía de uso.</div>
              <div><strong>5. ¿Qué funciones tiene?:</strong> <strong>14 combinaciones de colores de nebulosa RGBW</strong> (azul, rojo, verde, blanco y mezclas), estrellas con modo fijo o respiración, ajuste de velocidad de giro y temporizador de apagado automático.</div>
              <div style="background: transparent; border: none; padding: 6px 0 0;">
                <button class="btn-catalog-buy" onclick="buySingleCatalogProduct('prod_xmas_galaxy_009', 29.99, this)">
                  🌌 Comprar Proyector de Galaxia 360° — 29,99 €
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ARTÍCULO 10: GORRO NAVIDEÑO ANIMADO INTERACTIVO CON OREJAS MÓVILES Y LUCES LED -->
        <div class="catalog-item-card">
          <div class="catalog-item-header">
            <div>
              <span class="catalog-category-pill">🎉 #10 EL REY DE LA NOCHEBUENA · NIÑOS Y ADULTOS</span>
              <h3 style="font-size: 1.4rem; font-weight: 900; margin-top: 6px;">10. Gorro Navideño Animado Interactivo con Orejas Móviles por Airbag y Luces LED 7 Colores</h3>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--primary);">19,99 € <span style="font-size: 0.95rem; color: var(--text-dim); text-decoration: line-through;">34,99 €</span></div>
              <div style="font-size: 0.78rem; color: var(--forest); font-weight: 700;">IVA 21% Incluido · Risas Aseguradas</div>
            </div>
          </div>
          <div class="catalog-item-body">
            <div class="catalog-photos-pair">
              <img src="/assets/xmas-10-santa-hat.jpg" alt="Gorro Navideño con Orejas Móviles y Luces LED" style="height: 260px;" />
              <img src="/assets/xmas-10-santa-hat-2.jpg" alt="Detalle Airbag Patitas y Luces LED Gorro" style="height: 260px;" />
            </div>
            <div class="spec-list-5">
              <div><strong>1. ¿Qué es?:</strong> Un gorro de Papá Noel de peluche interactivo con luces LED multicolor en el que <strong>las orejas/cuernos saltan y bailan hacia arriba cada vez que aprietas sus patitas colgantes</strong>.</div>
              <div><strong>2. ¿Cómo es y qué medidas tiene?:</strong> Mide <strong>58 cm de largo total (incluyendo las dos patas colgantes) × 28 cm de ancho</strong>, talla adaptable válida tanto para niños como para adultos.</div>
              <div><strong>3. ¿De qué está hecho?:</strong> Felpa de microfibra hipoalergénica extrasuave y esponjosa, conductos neumáticos internos de silicona con bombas de aire (airbag) en las puntas y tira LED interior.</div>
              <div><strong>4. ¿Qué lleva en la caja?:</strong> 1× Gorro Navideño Animado con sistema de airbag en ambas patitas y circuito de luces LED con pilas de botón ya instaladas (listo para encender).</div>
              <div><strong>5. ¿Qué funciones tiene?:</strong> Movimiento mecánico independiente de cada oreja al apretar la patita izquierda o derecha + interruptor LED con <strong>3 modos de iluminación</strong> (parpadeo rápido de fiesta, parpadeo lento y luz fija).</div>
              <div style="background: transparent; border: none; padding: 6px 0 0;">
                <button class="btn-catalog-buy" onclick="buySingleCatalogProduct('prod_xmas_hat_010', 19.99, this)">
                  🎉 Comprar Gorro Navideño Animado LED — 19,99 €
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- 6. Wall of Verified Reviews -->
    <section class="section-spacing" id="opiniones">
      <div class="section-header">
        <span class="section-tag">OPINIONES VERIFICADAS EN ESPAÑA</span>
        <h2 class="section-title">Hogares y Familias que ya han adelantado sus compras de Navidad</h2>
        <p class="section-desc">
          Más de 1.600 clientes satisfechos con nuestra colección de iluminación navideña e ideas de regalo.
        </p>
      </div>

      <div class="reviews-grid">
        <div class="review-card">
          <div class="review-header">
            <div>
              <div class="review-author">Laura G.</div>
              <div class="review-role">Madrid · Pack Decoración Total</div>
            </div>
            <span class="verified-pill">✓ Compra Verificada</span>
          </div>
          <div class="stars">★★★★★</div>
          <p class="review-text" style="margin-top: 8px;">
            "Pusimos la Cortina LED de anillos 3D en el ventanal del salón y se ve preciosa tanto desde dentro como desde la calle. Los muñequitos dentro de cada aro dan una luz súper cálida y trae enchufe español directo."
          </p>
        </div>

        <div class="review-card">
          <div class="review-header">
            <div>
              <div class="review-author">Javier M.</div>
              <div class="review-role">Valencia · Pack Mágico 3 en 1</div>
            </div>
            <span class="verified-pill">✓ Compra Verificada</span>
          </div>
          <div class="stars">★★★★★</div>
          <p class="review-text" style="margin-top: 8px;">
            "Cogí el Pack 3 en 1 para decorar el piso y aprovechar la esfera de cristal 3D como regalo para mi pareja. La bola pesa de verdad, es cristal macizo y con la base de madera encendida queda espectacular."
          </p>
        </div>

        <div class="review-card">
          <div class="review-header">
            <div>
              <div class="review-author">Carmen R.</div>
              <div class="review-role">Sevilla · Minicámara + Gorro LED</div>
            </div>
            <span class="verified-pill">✓ Compra Verificada</span>
          </div>
          <div class="stars">★★★★★</div>
          <p class="review-text" style="margin-top: 8px;">
            "Me encanta que en la web expliquen exactamente qué lleva la caja, cuánto mide y de qué está hecho cada producto. Compré la minicámara para mi sobrino por Reyes y el gorro que mueve las orejas para Nochebuena."
          </p>
        </div>
      </div>
    </section>

    <!-- 7. FAQ Accordion -->
    <section class="section-spacing" id="faq">
      <div class="section-header">
        <span class="section-tag">COMPRA CON TOTAL CONFIANZA</span>
        <h2 class="section-title">Preguntas Frecuentes — Campaña Navidad y Reyes</h2>
      </div>

      <div class="faq-container">
        <div class="faq-item active">
          <div class="faq-question" onclick="toggleFaq(this)">
            <span>¿Las luces y proyectores vienen con enchufe europeo para España?</span>
            <span>▼</span>
          </div>
          <div class="faq-answer">
            Sí. Tanto la Cortina LED de Anillos Mágicos 3D como el Proyector Rotatorio 360° incluyen enchufe europeo estándar (220V) válido para cualquier enchufe de España sin necesidad de adaptadores. El resto de lámparas y accesorios funcionan por USB universal o pilas según se detalla en su ficha.
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question" onclick="toggleFaq(this)">
            <span>¿Cuánto tarda el envío a España y cómo hago el seguimiento?</span>
            <span>▼</span>
          </div>
          <div class="faq-answer">
            Todos los pedidos se preparan en 24-48 horas laborables y se entregan mediante mensajería con código de seguimiento (Correos Express / CTT Express) en un plazo habitual de 7 a 10 días laborables. En pedidos superiores a 45,00 € el envío es totalmente GRATIS.
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question" onclick="toggleFaq(this)">
            <span>¿Qué pasa si es para un regalo de Navidad o Reyes y quiero cambiarlo?</span>
            <span>▼</span>
          </div>
          <div class="faq-answer">
            Durante toda la campaña navideña ampliamos nuestra garantía de devolución y cambio hasta el <strong>15 de enero</strong>, para que puedas comprar tus regalos de Papá Noel, Amigo Invisible y Reyes Magos con total tranquilidad.
          </div>
        </div>
      </div>
    </section>

  </main>

  <!-- 8. Legal Footer -->
  <footer class="footer">
    <div class="footer-container">
      <div>
        <div class="footer-logo">🎄 ${brandName} España</div>
        <p style="color: #cbd5e1; line-height: 1.6; max-width: 420px;">
          Edición Especial Navidad y Regalos 2026. Iluminación decorativa de bajo consumo y regalos originales seleccionados con envío a toda España.
        </p>
      </div>

      <div class="footer-col">
        <h4>Marco Legal España &amp; UE</h4>
        <ul class="footer-links">
          <li><a onclick="openLegalModal('envios')">Política de Envíos (España &amp; UE)</a></li>
          <li><a onclick="openLegalModal('devoluciones')">Garantía Especial Navidad y Reyes</a></li>
          <li><a onclick="openLegalModal('privacidad')">Protección de Datos (RGPD &amp; LOPDGDD)</a></li>
          <li><a onclick="openLegalModal('terminos')">Términos y Condiciones (LSSI-CE)</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Atención al Cliente</h4>
        <p><strong>Email:</strong> <a href="mailto:soporte@aetherwell.com" style="color: #fbbf24;">soporte@aetherwell.com</a></p>
        <p style="margin-top: 6px;"><strong>Horario:</strong> Lunes a Domingo, 24/7</p>
        <p style="margin-top: 6px; font-size: 0.8rem; color: #64748b;">Pagos en Euros (€) con IVA 21% incluido · Pasarela Oficial Stripe PCI-DSS Nivel 1</p>
      </div>
    </div>

    <div class="footer-bottom">
      <div>© ${new Date().getFullYear()} ${brandName} España. Todos los derechos reservados. Precios con IVA 21% incluido.</div>
      <div>🔒 Conexión Cifrada SSL 256-Bit · 🇪🇺 Cumplimiento RGPD &amp; LSSI-CE</div>
    </div>
  </footer>

  <!-- 9. Legal Modals -->
  <div class="modal-overlay" id="legal-modal-overlay" onclick="closeLegalModal(event)">
    <div class="modal-card">
      <button class="modal-close-btn" onclick="closeLegalModal()">✕</button>
      <div id="modal-content-slot"></div>
    </div>
  </div>

  <!-- 10. GDPR Cookie Banner -->
  <div id="cookie-banner">
    <div class="cookie-content">
      <div>
        🍪 <strong>Privacidad y Cookies:</strong> Utilizamos cookies técnicas necesarias para procesar pagos seguros en euros mediante Stripe según la normativa española (LSSI-CE).
      </div>
      <button class="btn-accept-cookies" onclick="acceptCookies()">Aceptar y Continuar</button>
    </div>
  </div>

  <!-- Mobile Sticky Bar -->
  <div class="mobile-sticky-bar">
    <div>
      <span class="mobile-price-now" id="mobile-price-val">49,98 €</span>
      <span class="mobile-shipping-hint">Envío Gratis a toda España</span>
    </div>
    <button class="btn-mobile-buy" onclick="redirectToStripeCheckout()">🎄 PAGAR EN EUROS</button>
  </div>

  <script>
    const THRESHOLD = ${threshold};
    const HERO_PRICE = ${heroPrice};
    const PROJECTOR_UPSELL_PRICE = ${projectorUpsellPrice};
    const DUO_PRICE = ${duoPrice};
    const BUNDLE_PRICE = ${bundlePrice};

    let selectedTier = 2; // Por defecto: Pack Decoración Total (49,98 € con Envío Gratis)

    const GALLERY_SLIDES = [
      {
        badge: "DECORACIÓN ESTRELLA · SALÓN Y VENTANA ILUMINADOS",
        caption: "Cortina LED de 3 metros × 0,5 m con 10 anillos luminosos, 120 LEDs blanco cálido y 5 modelos de figuras 3D",
        content: '<img src="/assets/xmas-01-curtain-lights.jpg" alt="Cortina LED Navideña de Anillos Mágicos 3D" style="max-width:100%; max-height:300px; object-fit:contain; border-radius:12px;" />'
      },
      {
        badge: "DETALLE EN PRIMER PLANO · 5 MODELOS DE FIGURAS 3D",
        caption: "Incluye Papá Noel, Reno, Muñeco de Nieve, Árbol de Navidad y Gorro iluminados por un haz cálido superior",
        content: '<img src="/assets/xmas-01-curtain-lights-2.jpg" alt="Detalle Figuras Navideñas 3D en Anillos LED" style="max-width:100%; max-height:300px; object-fit:contain; border-radius:12px;" />'
      },
      {
        badge: "MEDIDAS REALES · COBERTURA DE 3 METROS DE ANCHO",
        caption: "300 cm de ancho × 50 cm de caída · Anillos de 10 cm de diámetro · Figuras de 5,5 cm · Cable al enchufe de 70 cm",
        content: '<img src="/assets/xmas-01-curtain-lights-3.jpg" alt="Dimensiones Cortina LED 3x0,5 metros" style="max-width:100%; max-height:300px; object-fit:contain; border-radius:12px;" />'
      },
      {
        badge: "INSTALACIÓN EN 2 MINUTOS · ENCHUFE EUROPEO + EMPALME",
        caption: "Enchufe europeo 220V directo + conector trasero para unir varias cortinas + ganchos fáciles para las figuras",
        content: '<img src="/assets/xmas-01-curtain-lights-4.jpg" alt="Enchufe Europeo y Ganchos de Instalación" style="max-width:100%; max-height:300px; object-fit:contain; border-radius:12px;" />'
      }
    ];

    function switchGalleryTab(index) {
      const slide = GALLERY_SLIDES[index];
      if (!slide) return;
      document.getElementById('viewer-badge').textContent = slide.badge;
      document.getElementById('viewer-caption').textContent = slide.caption;
      document.getElementById('viewer-svg-stage').innerHTML = slide.content;

      const buttons = document.querySelectorAll('.thumb-btn');
      buttons.forEach((btn, i) => {
        btn.className = (i === index) ? 'thumb-btn active' : 'thumb-btn';
      });
    }

    function selectTier(tierNum) {
      selectedTier = tierNum;

      document.getElementById('tier-card-1').className = (tierNum === 1) ? 'tier-card selected' : 'tier-card';
      document.getElementById('tier-card-2').className = (tierNum === 2) ? 'tier-card selected' : 'tier-card';
      document.getElementById('tier-card-3').className = (tierNum === 3) ? 'tier-card selected' : 'tier-card';

      document.getElementById('radio-tier-1').checked = (tierNum === 1);
      document.getElementById('radio-tier-2').checked = (tierNum === 2);
      document.getElementById('radio-tier-3').checked = (tierNum === 3);

      const priceCur = document.getElementById('box-price-current');
      const priceCmp = document.getElementById('box-price-compare');
      const savings = document.getElementById('box-savings-badge');
      const mobileVal = document.getElementById('mobile-price-val');
      const fill = document.getElementById('shipping-progress-fill');
      const msg = document.getElementById('shipping-bar-msg');
      const amtLabel = document.getElementById('shipping-bar-amount-label');

      if (tierNum === 1) {
        priceCur.textContent = '29,99 €';
        priceCmp.textContent = '59,99 €';
        savings.textContent = 'Ahorras 50%';
        mobileVal.textContent = '29,99 €';
        amtLabel.textContent = '29,99 € / 45,00 €';
        fill.style.width = '66.6%';
        msg.innerHTML = '⚠️ <strong>¡Te faltan 15,01 €</strong> para desbloquear el <strong>ENVÍO GRATIS A ESPAÑA</strong>! Elige el Pack Decoración Total superior y ahorra los gastos de envío:';
      } else if (tierNum === 2) {
        priceCur.textContent = '49,98 €';
        priceCmp.textContent = '109,98 €';
        savings.textContent = 'Ahorras 60 € + Envío Gratis';
        mobileVal.textContent = '49,98 €';
        amtLabel.textContent = '49,98 € / 45,00 €';
        fill.style.width = '100%';
        msg.innerHTML = '🎉 <strong>¡ENHORABUENA!</strong> Has desbloqueado el <strong>ENVÍO RÁPIDO GRATIS A TODA ESPAÑA (0,00 €)</strong>.';
      } else if (tierNum === 3) {
        priceCur.textContent = '59,99 €';
        priceCmp.textContent = '159,97 €';
        savings.textContent = 'Ahorras 100 € + Envío Gratis';
        mobileVal.textContent = '59,99 €';
        amtLabel.textContent = '59,99 € / 45,00 €';
        fill.style.width = '100%';
        msg.innerHTML = '🏆 <strong>¡PACK MÁGICO 3 EN 1 SELECCIONADO!</strong> Envío Prioritario Gratis a toda España incluido.';
      }
    }

    async function redirectToStripeCheckout() {
      const btn = document.getElementById('btn-stripe-checkout');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '⏳ Conectando con Stripe Checkout Seguro en Euros...';

      const items = [];
      if (selectedTier === 3) {
        items.push({ productId: 'prod_xmas_bundle_all', quantity: 1, unitPriceOverride: BUNDLE_PRICE });
      } else if (selectedTier === 2) {
        items.push({ productId: 'prod_xmas_curtain_001', quantity: 1, unitPriceOverride: HERO_PRICE });
        items.push({ productId: 'prod_xmas_projector_002', quantity: 1, isUpsell: true, unitPriceOverride: PROJECTOR_UPSELL_PRICE });
      } else {
        items.push({ productId: 'prod_xmas_curtain_001', quantity: 1, unitPriceOverride: HERO_PRICE });
      }

      try {
        const response = await fetch('/api/checkout/stripe-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            origin: window.location.origin
          })
        });

        const data = await response.json();
        if (response.ok && data.url) {
          btn.innerHTML = '🚀 Redirigiendo a Stripe Seguro (BBVA / Tarjetas)...';
          window.location.href = data.url;
        } else {
          alert('Error al inicializar la pasarela de Stripe: ' + (data.error || 'Por favor inténtelo nuevamente.'));
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      } catch (err) {
        alert('Error de conexión con la pasarela de pago: ' + err.message);
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    }

    async function buySingleCatalogProduct(productId, unitPrice, btnEl) {
      const originalText = btnEl.innerHTML;
      btnEl.disabled = true;
      btnEl.innerHTML = '⏳ Abriendo Stripe Checkout Seguro...';
      try {
        const response = await fetch('/api/checkout/stripe-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: [{ productId, quantity: 1, unitPriceOverride: unitPrice }],
            origin: window.location.origin
          })
        });
        const data = await response.json();
        if (response.ok && data.url) {
          btnEl.innerHTML = '🚀 Redirigiendo a Stripe...';
          window.location.href = data.url;
        } else {
          alert('Error al inicializar la pasarela de Stripe: ' + (data.error || 'Por favor inténtelo nuevamente.'));
          btnEl.disabled = false;
          btnEl.innerHTML = originalText;
        }
      } catch (err) {
        alert('Error de conexión con la pasarela de pago: ' + err.message);
        btnEl.disabled = false;
        btnEl.innerHTML = originalText;
      }
    }

    function toggleFaq(el) {
      const item = el.parentElement;
      item.classList.toggle('active');
    }

    const LEGAL_TEXTS = {
      envios: \`
        <h3 class="modal-title">Política de Envíos y Entregas — Especial Navidad (España & UE)</h3>
        <div class="modal-body">
          <p>En <strong>AetherWell™ España</strong> garantizamos un servicio de entrega rápido, seguro y con seguimiento para tus compras y regalos de Navidad.</p>
          <h4>1. Ámbito de Envío</h4>
          <p>Realizamos envíos a toda España (Península y Baleares) y países de la Unión Europea (Portugal, Francia, Italia, Alemania).</p>
          <h4>2. Plazos de Preparación y Entrega</h4>
          <p>Los pedidos se preparan en <strong>24 a 48 horas laborables</strong>. El plazo habitual de entrega mediante mensajería (Correos Express / CTT Express) es de <strong>7 a 10 días laborables</strong>.</p>
          <h4>3. Gastos de Envío e Impuestos</h4>
          <p>Envío <strong>GRATIS</strong> en pedidos superiores a 45,00 € (4,99 € en pedidos inferiores). Todos los precios incluyen el <strong>21% de IVA</strong>.</p>
        </div>
      \`,
      devoluciones: \`
        <h3 class="modal-title">Garantía Especial de Navidad y Reyes</h3>
        <div class="modal-body">
          <p>Ampliamos el plazo de cambio y devolución de todos los pedidos navideños hasta el <strong>15 de enero</strong>, superando ampliamente los 14 días legales de desistimiento (LGDCU).</p>
          <h4>Procedimiento Sencillo</h4>
          <p>Escribe a <code>soporte@aetherwell.com</code> indicando tu pedido y gestionaremos el cambio o reembolso íntegro en el mismo método de pago de Stripe en 3-5 días laborables.</p>
        </div>
      \`,
      privacidad: \`
        <h3 class="modal-title">Política de Privacidad y Protección de Datos (RGPD & LOPDGDD)</h3>
        <div class="modal-body">
          <p>En cumplimiento del RGPD (UE 2016/679) y la LOPDGDD 3/2018, tus datos se emplean exclusivamente para procesar y entregar tu pedido y emitir tu factura con IVA. Los pagos se procesan directamente en <strong>Stripe Payments Europe, Ltd.</strong> bajo cifrado PCI-DSS Nivel 1.</p>
        </div>
      \`,
      terminos: \`
        <h3 class="modal-title">Términos y Condiciones de Contratación (LSSI-CE)</h3>
        <div class="modal-body">
          <p>Todas las compras se liquidan en <strong>Euros (€)</strong> con IVA 21% incluido a través de Stripe (Tarjetas Visa, MasterCard, Apple Pay y Google Pay) conforme a la legislación española.</p>
        </div>
      \`
    };

    function openLegalModal(type) {
      const overlay = document.getElementById('legal-modal-overlay');
      const slot = document.getElementById('modal-content-slot');
      slot.innerHTML = LEGAL_TEXTS[type] || '<p>Contenido no disponible.</p>';
      overlay.style.display = 'flex';
    }

    function closeLegalModal(e) {
      if (!e || e.target.id === 'legal-modal-overlay' || e.target.className === 'modal-close-btn') {
        document.getElementById('legal-modal-overlay').style.display = 'none';
      }
    }

    function checkCookies() {
      if (!localStorage.getItem('aetherwell_cookies_accepted')) {
        document.getElementById('cookie-banner').style.display = 'block';
      }
    }

    function acceptCookies() {
      localStorage.setItem('aetherwell_cookies_accepted', 'true');
      document.getElementById('cookie-banner').style.display = 'none';
    }

    function setupDeliveryDate() {
      const now = new Date();
      const start = new Date(now);
      const end = new Date(now);
      start.setDate(now.getDate() + 7);
      end.setDate(now.getDate() + 10);

      const options = { month: 'long', day: 'numeric' };
      const startStr = start.toLocaleDateString('es-ES', options);
      const endStr = end.toLocaleDateString('es-ES', options);

      const textEl = document.getElementById('delivery-estimate-text');
      if (textEl) {
        textEl.textContent = '🚚 Entrega estimada en España: ' + startStr + ' - ' + endStr + ' (Correos Express / CTT)';
      }
    }

    function checkReturnStatus() {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment_status');
      const sessionId = urlParams.get('session_id');
      const banner = document.getElementById('stripe-status-banner');

      if (banner && paymentStatus === 'success') {
        banner.style.display = 'block';
        banner.style.background = '#ecfdf5';
        banner.style.border = '2px solid #10b981';
        banner.style.color = '#065f46';
        banner.innerHTML = '🎉 <strong>¡PEDIDO NAVIDEÑO CONFIRMADO CON ÉXITO!</strong> Tu orden ha sido recibida y está en preparación prioritaria para España.' + (sessionId ? '<br><span style="font-size:0.82rem; font-family:monospace; color:#047857;">Referencia de Pago: ' + sessionId + '</span>' : '');
        banner.scrollIntoView({ behavior: 'smooth' });
      } else if (banner && paymentStatus === 'cancelled') {
        banner.style.display = 'block';
        banner.style.background = '#fef2f2';
        banner.style.border = '2px solid #ef4444';
        banner.style.color = '#991b1b';
        banner.innerHTML = '⚠️ <strong>PAGO NO COMPLETADO:</strong> Puedes finalizar tu compra navideña con un clic cuando lo desees.';
        banner.scrollIntoView({ behavior: 'smooth' });
      }
    }

    switchGalleryTab(0);
    selectTier(2);
    setupDeliveryDate();
    checkCookies();
    checkReturnStatus();
  </script>
</body>
</html>`;
}
