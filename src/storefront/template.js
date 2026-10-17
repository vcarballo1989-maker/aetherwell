/**
 * @fileoverview Storefront DTC de Lujo Clínico y Alta Conversión — AetherWell™.
 * Inspirado en marcas DTC líderes (Casper / Eight Sleep / Therabody).
 * 100% limpio de jerga técnica pública, optimizado para conversión móvil y desktop,
 * con pasarela oficial Stripe Checkout (Apple Pay, Google Pay, Tarjetas),
 * cumplimiento estricto RGPD / LSSI, modales legales interactivos y banner de cookies.
 */

export function renderHighConvertingStorefront(catalogData = {}, kycStatus = {}, ledger = null, operationalEnv = null) {
  const { products = [], metadata = {} } = catalogData;
  const brandName = metadata.brandName || 'AetherWell™';
  const threshold = Number(metadata.freeShippingThresholdUsd || 45.0);

  const heroProd = products.find((p) => p.id === 'prod_hero_orthocloud_001') || products[0] || {};
  const maskProd = products.find((p) => p.id === 'prod_bump_thermosilk_002') || products[1] || {};
  const postureProd = products.find((p) => p.id === 'prod_upsell_posturealign_003') || products[2] || {};
  const bundleProd = products.find((p) => p.id === 'prod_bundle_relief_360_004') || products[3] || {};

  const heroPrice = heroProd.price || 39.99;
  const heroCompare = heroProd.compareAtPrice || 79.99;
  const maskPrice = 14.99;
  const maskCompare = maskProd.compareAtPrice || 29.99;
  const posturePrice = 19.99;
  const postureCompare = postureProd.compareAtPrice || 49.99;
  const bundlePrice = bundleProd.price || 59.99;
  const bundleCompare = bundleProd.compareAtPrice || 159.97;
  const duoPrice = +(heroPrice + maskPrice).toFixed(2); // 54.98

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${brandName} | Camilla de Tracción Cervical 3D — Alivio Clínico en 10 Minutos</title>
  <meta name="description" content="Descomprime tu cuello, elimina migrañas y corrige la postura con OrthoCloud™ Pro de AetherWell™. Garantía de 30 noches de prueba y Envío Rápido Asegurado." />
  <meta name="keywords" content="traccion cervical, almohada ortopedica cervical, alivio dolor cuello, tech neck, descompresion cervical en casa, AetherWell OrthoCloud Pro" />
  <meta name="robots" content="index, follow" />
  
  <!-- Open Graph -->
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="${brandName} Clinical Sleep" />
  <meta property="og:title" content="OrthoCloud™ Pro — Tracción Cervical 3D y Alivio Clínico en 10 Minutos" />
  <meta property="og:description" content="50% DTO. Hoy + Envío Rápido Gratis en pedidos superiores a $45. Garantía de 30 noches." />
  <meta property="og:image" content="/assets/orthocloud-hero.png" />
  <meta property="product:price:amount" content="${heroPrice.toFixed(2)}" />
  <meta property="product:price:currency" content="USD" />

  <style>
    :root {
      --bg: #f8fafc;
      --surface: #ffffff;
      --surface-subtle: #f1f5f9;
      --border: #e2e8f0;
      --border-focus: #0d9488;
      --text: #0f172a;
      --text-muted: #64748b;
      --text-dim: #94a3b8;
      --primary: #0d9488;
      --primary-hover: #0f766e;
      --primary-subtle: #f0fdfa;
      --primary-border: #99f6e4;
      --blue-trust: #2563eb;
      --gold: #f59e0b;
      --danger: #ef4444;
      --success: #10b981;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
      --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: var(--bg); color: var(--text); line-height: 1.5; -webkit-font-smoothing: antialiased; }
    a { color: inherit; text-decoration: none; }

    /* 1. Top Announcement Bar */
    .top-bar {
      background: linear-gradient(90deg, #0d9488 0%, #1e3a8a 100%);
      color: #ffffff;
      text-align: center;
      padding: 10px 16px;
      font-size: 0.88rem;
      font-weight: 700;
      letter-spacing: 0.01em;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    }
    .top-bar span.badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 3px 8px;
      border-radius: 999px;
      margin-right: 6px;
      font-size: 0.76rem;
      text-transform: uppercase;
    }

    /* 2. Sticky Header Navbar */
    .navbar {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 41px;
      z-index: 90;
      transition: all 0.2s ease;
    }
    .navbar-container {
      max-width: 1240px;
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
      color: #0f172a;
    }
    .brand-logo svg {
      width: 28px;
      height: 28px;
      fill: var(--primary);
    }
    .brand-subtitle {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      border-left: 1px solid var(--border);
      padding-left: 10px;
      display: none;
    }
    @media (min-width: 768px) {
      .brand-subtitle { display: block; }
    }
    .nav-links {
      display: none;
      gap: 24px;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-muted);
    }
    @media (min-width: 900px) {
      .nav-links { display: flex; }
    }
    .nav-links a:hover {
      color: var(--primary);
    }
    .nav-badges {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .trust-pill {
      background: var(--surface-subtle);
      border: 1px solid var(--border);
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Container */
    .container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 24px 20px 80px;
    }

    /* URL Banner Return State */
    #stripe-status-banner {
      display: none;
      margin-bottom: 24px;
      padding: 18px 24px;
      border-radius: var(--radius-md);
      font-weight: 700;
      font-size: 0.95rem;
      line-height: 1.5;
      box-shadow: var(--shadow-md);
      animation: fadeIn 0.4s ease;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

    /* 3. Hero Product Layout (2 Columns) */
    .product-hero-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 36px;
      margin-top: 12px;
      align-items: start;
    }
    @media (min-width: 960px) {
      .product-hero-layout {
        grid-template-columns: 1.05fr 1fr;
        gap: 48px;
      }
    }

    /* Left: Interactive Clinical Gallery */
    .gallery-container {
      position: sticky;
      top: 110px;
    }
    .main-viewer {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 28px;
      aspect-ratio: 1 / 0.9;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-md);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .gallery-badge {
      position: absolute;
      top: 16px;
      left: 16px;
      background: rgba(13, 148, 136, 0.1);
      border: 1px solid rgba(13, 148, 136, 0.3);
      color: var(--primary);
      font-size: 0.76rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 5px 12px;
      border-radius: 999px;
    }
    .gallery-discount-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      background: #ef4444;
      color: #ffffff;
      font-size: 0.8rem;
      font-weight: 900;
      padding: 5px 12px;
      border-radius: 999px;
      box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
    }
    .viewer-svg-stage {
      width: 100%;
      height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .viewer-caption {
      margin-top: 14px;
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text-muted);
      text-align: center;
    }

    /* Thumbnails Row */
    .thumbnails-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 16px;
    }
    .thumb-btn {
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: var(--radius-md);
      padding: 10px 8px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .thumb-btn:hover {
      border-color: var(--primary-border);
      background: var(--primary-subtle);
    }
    .thumb-btn.active {
      border-color: var(--primary);
      background: var(--primary-subtle);
      box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
    }
    .thumb-btn svg {
      width: 26px;
      height: 26px;
    }
    .thumb-btn span {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--text);
      line-height: 1.2;
    }

    /* Gallery Trust Badges */
    .gallery-trust-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 24px;
    }
    .trust-card-mini {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 12px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text);
    }
    .trust-card-mini svg {
      width: 20px;
      height: 20px;
      fill: var(--primary);
      flex-shrink: 0;
    }

    /* Right: Buy Box Column */
    .buy-box {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 32px 28px;
      box-shadow: var(--shadow-lg);
    }
    .rating-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      margin-bottom: 10px;
    }
    .stars {
      color: var(--gold);
      font-size: 1.05rem;
      letter-spacing: 2px;
    }
    .reviews-text {
      font-weight: 700;
      color: var(--text);
    }
    .verified-pill {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      font-size: 0.72rem;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 999px;
    }

    .product-title {
      font-size: 1.85rem;
      font-weight: 900;
      line-height: 1.25;
      color: var(--text);
      margin-bottom: 10px;
      letter-spacing: -0.02em;
    }
    .product-subtitle {
      font-size: 0.96rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 20px;
    }

    /* Price Section */
    .price-box {
      display: flex;
      align-items: baseline;
      gap: 12px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 20px;
    }
    .price-current {
      font-size: 2.2rem;
      font-weight: 900;
      color: var(--text);
      letter-spacing: -0.02em;
    }
    .price-compare {
      font-size: 1.15rem;
      color: var(--text-dim);
      text-decoration: line-through;
    }
    .savings-badge {
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #047857;
      font-size: 0.82rem;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 6px;
    }

    /* Stock Urgency & Delivery */
    .urgency-box {
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: var(--radius-sm);
      padding: 12px 16px;
      margin-bottom: 22px;
      font-size: 0.88rem;
      color: #92400e;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .urgency-line {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
    }
    .delivery-line {
      font-size: 0.82rem;
      color: #78350f;
    }

    /* Interactive Free Shipping Bar */
    .shipping-bar-wrapper {
      background: var(--surface-subtle);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 16px 18px;
      margin-bottom: 24px;
    }
    .shipping-bar-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.86rem;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .shipping-progress-bg {
      background: #cbd5e1;
      height: 10px;
      border-radius: 999px;
      overflow: hidden;
    }
    .shipping-progress-fill {
      background: linear-gradient(90deg, #0d9488, #10b981);
      height: 100%;
      width: 88.8%;
      border-radius: 999px;
      transition: width 0.4s ease, background 0.4s ease;
    }
    .shipping-msg {
      font-size: 0.82rem;
      margin-top: 8px;
      color: var(--text-muted);
    }

    /* Tiered Pack Selector */
    .tier-selector-title {
      font-size: 0.95rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
      margin-bottom: 12px;
    }
    .tier-card {
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: var(--radius-md);
      padding: 16px 18px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }
    .tier-card:hover {
      border-color: var(--primary-border);
      background: var(--primary-subtle);
    }
    .tier-card.selected {
      border-color: var(--primary);
      background: var(--primary-subtle);
      box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
    }
    .tier-badge-ribbon {
      position: absolute;
      top: -10px;
      right: 18px;
      background: linear-gradient(90deg, #0d9488, #2563eb);
      color: #ffffff;
      font-size: 0.72rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 3px 10px;
      border-radius: 999px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }
    .tier-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .tier-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .tier-radio {
      width: 20px;
      height: 20px;
      accent-color: var(--primary);
      cursor: pointer;
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
      margin-left: 32px;
    }
    .tier-pricing {
      text-align: right;
    }
    .tier-price-main {
      font-weight: 900;
      font-size: 1.15rem;
      color: var(--text);
    }
    .tier-price-compare {
      font-size: 0.78rem;
      color: var(--text-dim);
      text-decoration: line-through;
      display: block;
    }

    /* Primary Purchase Button */
    .btn-buy-now {
      width: 100%;
      background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
      color: #ffffff;
      border: none;
      border-radius: var(--radius-md);
      padding: 20px 24px;
      font-size: 1.15rem;
      font-weight: 900;
      letter-spacing: 0.02em;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      box-shadow: 0 6px 20px rgba(13, 148, 136, 0.35);
      transition: all 0.25s ease;
      margin-top: 20px;
      margin-bottom: 16px;
    }
    .btn-buy-now:hover {
      background: linear-gradient(135deg, #0f766e 0%, #115e59 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(13, 148, 136, 0.45);
    }
    .btn-buy-now:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
    .btn-buy-now svg {
      width: 22px;
      height: 22px;
      fill: currentColor;
    }

    /* Trust Payments Bar Below Button */
    .payment-trust-bar {
      text-align: center;
      margin-top: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .payment-icons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      color: #475569;
      font-size: 0.76rem;
      font-weight: 700;
      flex-wrap: wrap;
    }
    .payment-pill {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.72rem;
      font-weight: 800;
    }
    .guarantee-note {
      font-size: 0.8rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* 4. Section: Why Neck Pain Happens */
    .section-spacing {
      margin-top: 80px;
    }
    .section-header {
      text-align: center;
      max-width: 760px;
      margin: 0 auto 40px;
    }
    .section-tag {
      color: var(--primary);
      font-size: 0.82rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 8px;
      display: block;
    }
    .section-title {
      font-size: 2.1rem;
      font-weight: 900;
      letter-spacing: -0.02em;
      line-height: 1.25;
      color: var(--text);
    }
    .section-desc {
      font-size: 1.05rem;
      color: var(--text-muted);
      margin-top: 12px;
      line-height: 1.6;
    }

    .cards-grid-3 {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }
    @media (min-width: 800px) {
      .cards-grid-3 { grid-template-columns: repeat(3, 1fr); }
    }
    .benefit-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 32px 26px;
      box-shadow: var(--shadow-sm);
      transition: all 0.2s ease;
    }
    .benefit-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-4px);
    }
    .benefit-icon-box {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: var(--primary-subtle);
      border: 1px solid var(--primary-border);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      color: var(--primary);
    }
    .benefit-icon-box svg {
      width: 26px;
      height: 26px;
    }
    .benefit-card h3 {
      font-size: 1.2rem;
      font-weight: 800;
      margin-bottom: 10px;
      color: var(--text);
    }
    .benefit-card p {
      font-size: 0.92rem;
      color: var(--text-muted);
      line-height: 1.6;
    }

    /* 5. Us vs Them Comparison Table */
    .comparison-wrapper {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      overflow-x: auto;
      margin-top: 30px;
    }
    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.92rem;
    }
    .comparison-table th, .comparison-table td {
      padding: 18px 22px;
      border-bottom: 1px solid var(--border);
    }
    .comparison-table th {
      background: #f8fafc;
      font-weight: 800;
      color: var(--text);
    }
    .comparison-table th.highlight, .comparison-table td.highlight {
      background: #f0fdfa;
      color: #0f766e;
      font-weight: 800;
    }
    .comparison-table tr:last-child td {
      border-bottom: none;
    }

    /* 6. Wall of Verified Reviews */
    .reviews-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      margin-top: 30px;
    }
    @media (min-width: 768px) {
      .reviews-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 1024px) {
      .reviews-grid { grid-template-columns: repeat(3, 1fr); }
    }
    .review-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 24px;
      box-shadow: var(--shadow-sm);
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .review-author {
      font-weight: 800;
      font-size: 0.95rem;
      color: var(--text);
    }
    .review-role {
      font-size: 0.78rem;
      color: var(--text-muted);
    }
    .review-text {
      font-size: 0.9rem;
      color: var(--text);
      line-height: 1.6;
    }

    /* 7. FAQ Accordion */
    .faq-container {
      max-width: 820px;
      margin: 30px auto 0;
    }
    .faq-item {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      margin-bottom: 12px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }
    .faq-question {
      padding: 20px 24px;
      font-weight: 800;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
    }
    .faq-question:hover {
      color: var(--primary);
    }
    .faq-arrow {
      transition: transform 0.25s ease;
      color: var(--text-dim);
    }
    .faq-item.active .faq-arrow {
      transform: rotate(180deg);
      color: var(--primary);
    }
    .faq-answer {
      display: none;
      padding: 0 24px 22px;
      font-size: 0.92rem;
      color: var(--text-muted);
      line-height: 1.6;
      border-top: 1px solid transparent;
    }
    .faq-item.active .faq-answer {
      display: block;
    }

    /* 8. Professional Legal Footer */
    .footer {
      background: #0f172a;
      color: #94a3b8;
      padding: 60px 20px 30px;
      margin-top: 80px;
      font-size: 0.88rem;
    }
    .footer-container {
      max-width: 1240px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr;
      gap: 36px;
    }
    @media (min-width: 768px) {
      .footer-container { grid-template-columns: 1.5fr 1fr 1fr; }
    }
    .footer-logo {
      font-size: 1.35rem;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 10px;
    }
    .footer-disclaimer {
      font-size: 0.8rem;
      line-height: 1.5;
      color: #64748b;
      margin-top: 14px;
    }
    .footer-col h4 {
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 800;
      margin-bottom: 16px;
    }
    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .footer-links a {
      color: #94a3b8;
      transition: color 0.2s ease;
      cursor: pointer;
    }
    .footer-links a:hover {
      color: #38bdf8;
    }
    .footer-bottom {
      max-width: 1240px;
      margin: 40px auto 0;
      padding-top: 24px;
      border-top: 1px solid #1e293b;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      font-size: 0.8rem;
      color: #64748b;
      text-align: center;
    }
    @media (min-width: 768px) {
      .footer-bottom {
        flex-direction: row;
        justify-content: space-between;
      }
    }

    /* 9. Legal Modals */
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
      color: var(--text);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-title {
      font-size: 1.4rem;
      font-weight: 900;
      color: var(--text);
      margin-bottom: 18px;
    }
    .modal-body {
      font-size: 0.92rem;
      color: #334155;
      line-height: 1.7;
    }
    .modal-body h4 {
      font-size: 1rem;
      font-weight: 800;
      color: #0f172a;
      margin: 18px 0 6px;
    }

    /* 10. GDPR Cookie Banner */
    #cookie-banner {
      display: none;
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 18px 24px;
      box-shadow: var(--shadow-xl);
      z-index: 990;
      font-size: 0.88rem;
      color: var(--text);
    }
    .cookie-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    @media (min-width: 540px) {
      .cookie-content {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }
    .btn-accept-cookies {
      background: var(--primary);
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      border-radius: var(--radius-sm);
      font-weight: 800;
      cursor: pointer;
      white-space: nowrap;
    }

    /* Mobile Sticky Buy Button Bar */
    .mobile-sticky-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
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
    .mobile-price-group {
      display: flex;
      flex-direction: column;
    }
    .mobile-price-now {
      font-size: 1.15rem;
      font-weight: 900;
      color: var(--text);
    }
    .mobile-shipping-hint {
      font-size: 0.72rem;
      color: var(--success);
      font-weight: 700;
    }
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

  <!-- 1. Top Announcement Bar -->
  <div class="top-bar">
    <span class="badge">✨ OFERTA LIMITADA</span>
    50% DTO. HOY + ENVÍO PRIORITARIO GRATIS EN PEDIDOS &gt; $${threshold.toFixed(2)} USD — Garantía de 30 Noches de Prueba
  </div>

  <!-- 2. Sticky Navbar -->
  <header class="navbar">
    <div class="navbar-container">
      <div class="brand-group">
        <a href="/" class="brand-logo">
          <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          <span>${brandName}</span>
        </a>
        <span class="brand-subtitle">Clinical Sleep & Cervical Recovery</span>
      </div>

      <nav class="nav-links">
        <a href="#beneficios">Beneficios Clínicos</a>
        <a href="#como-funciona">Cómo Funciona</a>
        <a href="#comparativa">Comparativa</a>
        <a href="#opiniones">Opiniones (1.428)</a>
        <a href="#faq">Preguntas Frecuentes</a>
      </nav>

      <div class="nav-badges">
        <div class="trust-pill">
          <span>🟢</span> Envío Prioritario 24-48h
        </div>
      </div>
    </div>
  </header>

  <main class="container">

    <!-- Stripe Checkout Live Notification Banner -->
    <div id="stripe-status-banner"></div>

    <!-- 3. Product Hero Section (2 Columns) -->
    <section class="product-hero-layout" id="compra">

      <!-- Left Column: Interactive Clinical Gallery -->
      <div class="gallery-container">
        <div class="main-viewer" id="main-viewer-card">
          <div class="gallery-badge" id="viewer-badge">VISTA 1 DE 4 · ORTOPÉDICA 3D</div>
          <div class="gallery-discount-badge">-50% DTO</div>

          <div class="viewer-svg-stage" id="viewer-svg-stage">
            <!-- SVG dinámico inyectado por JS -->
          </div>

          <div class="viewer-caption" id="viewer-caption">
            Curva de tracción biomecánica de 26° con 8 nodos de acupresión suboccipital
          </div>
        </div>

        <!-- 4 Clickable Thumbnails -->
        <div class="thumbnails-row">
          <button class="thumb-btn active" onclick="switchGalleryTab(0)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span>1. OrthoCloud™ 4K</span>
          </button>
          <button class="thumb-btn" onclick="switchGalleryTab(1)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span>2. ThermoSilk™</span>
          </button>
          <button class="thumb-btn" onclick="switchGalleryTab(2)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            <span>3. PostureAlign™</span>
          </button>
          <button class="thumb-btn" onclick="switchGalleryTab(3)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/></svg>
            <span>4. Tracción 26°</span>
          </button>
        </div>

        <!-- Trust Badges Under Gallery -->
        <div class="gallery-trust-grid">
          <div class="trust-card-mini">
            <svg viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/></svg>
            <span>Diseñado con Fisioterapeutas</span>
          </div>
          <div class="trust-card-mini">
            <svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            <span>Espuma Certificada CertiPUR-US®</span>
          </div>
          <div class="trust-card-mini">
            <svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>
            <span>30 Noches de Prueba en Casa</span>
          </div>
          <div class="trust-card-mini">
            <svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            <span>Pago Seguro Cifrado Stripe SSL</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Buy Box -->
      <div class="buy-box">
        <div class="rating-row">
          <span class="stars">★★★★★</span>
          <span class="reviews-text">4.9/5 (1.428 reseñas)</span>
          <span class="verified-pill">✓ Clínicamente Verificado</span>
        </div>

        <h1 class="product-title">OrthoCloud™ Pro — Camilla de Tracción Cervical 3D</h1>
        <p class="product-subtitle">
          Restaura la curvatura biomecánica de 26° de tu cuello, libera nervios suboccipitales pinzados y elimina migrañas y rigidez en solo 10 minutos al día en casa.
        </p>

        <!-- Pricing Section -->
        <div class="price-box">
          <span class="price-current" id="box-price-current">$${duoPrice.toFixed(2)} USD</span>
          <span class="price-compare" id="box-price-compare">$109.98 USD</span>
          <span class="savings-badge" id="box-savings-badge">Ahorras 50%</span>
        </div>

        <!-- Stock and Delivery Notification -->
        <div class="urgency-box">
          <div class="urgency-line">
            <span>🔥</span>
            <span>En stock — Quedan 9 unidades con despacho prioritario hoy</span>
          </div>
          <div class="delivery-line" id="delivery-estimate-text">
            🚚 Entrega estimada con seguimiento express en 7-10 días hábiles
          </div>
        </div>

        <!-- Interactive Free Shipping Bar -->
        <div class="shipping-bar-wrapper">
          <div class="shipping-bar-labels">
            <span id="shipping-bar-status-label">Progreso hacia Envío Gratis</span>
            <span id="shipping-bar-amount-label" style="color: var(--primary);">$${duoPrice.toFixed(2)} / $${threshold.toFixed(2)} USD</span>
          </div>
          <div class="shipping-progress-bg">
            <div id="shipping-progress-fill" class="shipping-progress-fill" style="width: 100%;"></div>
          </div>
          <div class="shipping-msg" id="shipping-bar-msg">
            🎉 <strong>¡ENHORABUENA!</strong> Has desbloqueado el <strong>ENVÍO RÁPIDO ASEGURADO ($0.00 USD)</strong>.
          </div>
        </div>

        <!-- Tiered Pack Selector -->
        <div class="tier-selector-title">Selecciona tu Paquete Clínico:</div>

        <!-- Option 1: 1x Solo Almohada -->
        <div class="tier-card" id="tier-card-1" onclick="selectTier(1)">
          <div class="tier-header">
            <div class="tier-left">
              <input type="radio" name="pack_tier" id="radio-tier-1" class="tier-radio" />
              <div>
                <div class="tier-name">1x Almohada Cervical OrthoCloud™ Pro</div>
                <div class="tier-desc">Tratamiento de tracción cervical individual</div>
              </div>
            </div>
            <div class="tier-pricing">
              <span class="tier-price-main">$${heroPrice.toFixed(2)}</span>
              <span class="tier-price-compare">$${heroCompare.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <!-- Option 2: Duo Hero + Mask (Pre-selected - Most Popular) -->
        <div class="tier-card selected" id="tier-card-2" onclick="selectTier(2)">
          <div class="tier-badge-ribbon">⭐ MÁS ELEGIDO (78% DE CLIENTES)</div>
          <div class="tier-header">
            <div class="tier-left">
              <input type="radio" name="pack_tier" id="radio-tier-2" class="tier-radio" checked />
              <div>
                <div class="tier-name">Pack Alivio Total (OrthoCloud™ + ThermoSilk™)</div>
                <div class="tier-desc">Incluye Antifaz de Migrañas Frío/Calor • <strong>¡ENVÍO GRATIS!</strong></div>
              </div>
            </div>
            <div class="tier-pricing">
              <span class="tier-price-main">$${duoPrice.toFixed(2)}</span>
              <span class="tier-price-compare">$109.98</span>
            </div>
          </div>
        </div>

        <!-- Option 3: Full 360 Pack -->
        <div class="tier-card" id="tier-card-3" onclick="selectTier(3)">
          <div class="tier-badge-ribbon">🏆 PACK CLÍNICO 360° · AHORRA $100</div>
          <div class="tier-header">
            <div class="tier-left">
              <input type="radio" name="pack_tier" id="radio-tier-3" class="tier-radio" />
              <div>
                <div class="tier-name">Pack Clínico 360° (Almohada + Antifaz + Sensor)</div>
                <div class="tier-desc">Rehabilitación 24/7 con Corrector PostureAlign™ • <strong>¡ENVÍO VIP!</strong></div>
              </div>
            </div>
            <div class="tier-pricing">
              <span class="tier-price-main">$${bundlePrice.toFixed(2)}</span>
              <span class="tier-price-compare">$${bundleCompare.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <!-- Single Magnetic Purchase Button -->
        <button class="btn-buy-now" id="btn-stripe-checkout" onclick="redirectToStripeCheckout()">
          <svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
          <span id="btn-buy-label">🔒 FINALIZAR COMPRA SEGURA — PAGAR AHORA</span>
        </button>

        <!-- Payment Trust Bar -->
        <div class="payment-trust-bar">
          <div class="payment-icons">
            <span class="payment-pill">💳 Tarjetas Débito / Crédito</span>
            <span class="payment-pill"> Apple Pay</span>
            <span class="payment-pill">G Pay Google</span>
            <span class="payment-pill">Stripe 256-Bit SSL</span>
          </div>
          <div class="guarantee-note">
            <span>🛡️</span> Garantía de 30 Noches de Prueba sin riesgo • Devolución 100% sencilla
          </div>
        </div>

      </div>

    </section>

    <!-- 4. Section: Why Neck Pain Happens (Clinical Mechanism) -->
    <section class="section-spacing" id="beneficios">
      <div class="section-header">
        <span class="section-tag">CIENCIA BIOMECÁNICA</span>
        <h2 class="section-title">¿Por qué despiertas con dolor de cuello y migrañas?</h2>
        <p class="section-desc">
          Al inclinar la cabeza 45° frente a pantallas o dormir sin soporte adecuado, tus vértebras cervicales soportan hasta 22 kg de presión continua. Esto aplasta tus discos y pinza los nervios suboccipitales.
        </p>
      </div>

      <div class="cards-grid-3">
        <div class="benefit-card">
          <div class="benefit-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h3>Tracción Cervical de 26°</h3>
          <p>
            Utiliza la gravedad y el propio peso de tu cabeza para estirar suavemente las vértebras C1 a C7, rehidratando discos comprimidos en solo 10 minutos.
          </p>
        </div>

        <div class="benefit-card">
          <div class="benefit-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><circle cx="5" cy="5" r="2"/></svg>
          </div>
          <h3>8 Nodos de Acupresión 3D</h3>
          <p>
            Ubicados milimétricamente en los puntos suboccipitales <em>Fengchi (GB20)</em> para desactivar los nudos musculares causantes de cefaleas tensionales y rigidez.
          </p>
        </div>

        <div class="benefit-card">
          <div class="benefit-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
          </div>
          <h3>Espuma Médica 65D CertiPUR</h3>
          <p>
            A diferencia de las imitaciones de plástico duro que lastiman tus vértebras, nuestra espuma de memoria auto-moldeable acuna tu nuca con firmeza terapéutica.
          </p>
        </div>
      </div>
    </section>

    <!-- 5. Us vs Them Comparison Table -->
    <section class="section-spacing" id="comparativa">
      <div class="section-header">
        <span class="section-tag">EVALUACIÓN COMPARATIVA</span>
        <h2 class="section-title">AetherWell™ frente a métodos tradicionales</h2>
        <p class="section-desc">
          Descubre por qué más de 1.400 pacientes han sustituido visitas recurrentes al fisioterapeuta por OrthoCloud™ Pro.
        </p>
      </div>

      <div class="comparison-wrapper">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Característica Clínica</th>
              <th class="highlight">AetherWell™ OrthoCloud Pro 🏆</th>
              <th>Almohadas Genéricas</th>
              <th>Clínica Quiropráctica</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Curva de tracción de 26° biomecánica</strong></td>
              <td class="highlight">✅ Sí (En 8-10 min/día)</td>
              <td>❌ No (Se hunden)</td>
              <td>✅ Sí (En camilla)</td>
            </tr>
            <tr>
              <td><strong>8 Nodos de acupresión suboccipital</strong></td>
              <td class="highlight">✅ Integrados en espuma 65D</td>
              <td>❌ Sin acupresión</td>
              <td>✅ Manual con masajista</td>
            </tr>
            <tr>
              <td><strong>Doble modo de tracción (Suave / Intenso)</strong></td>
              <td class="highlight">✅ Reversible en C y V</td>
              <td>❌ Fijo sin ajuste</td>
              <td>✅ Manual</td>
            </tr>
            <tr>
              <td><strong>Espuma CertiPUR-US® sin toxicidad</strong></td>
              <td class="highlight">✅ 100% hipoalergénica</td>
              <td>⚠️ Relleno sintético barato</td>
              <td>N/A</td>
            </tr>
            <tr>
              <td><strong>Coste de inversión</strong></td>
              <td class="highlight"><strong>$39.99 USD (Pago único)</strong></td>
              <td>$25 - $40 USD</td>
              <td>$350+ USD / mes</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 6. Wall of Verified Reviews -->
    <section class="section-spacing" id="opiniones">
      <div class="section-header">
        <span class="section-tag">TESTIMONIOS REALES</span>
        <h2 class="section-title">Lo que dicen quienes ya recuperaron su cuello</h2>
        <p class="section-desc">
          Opiniones 100% verificadas de clientes que superaron la rigidez de oficina y las migrañas.
        </p>
      </div>

      <div class="reviews-grid">
        <div class="review-card">
          <div class="review-header">
            <div>
              <div class="review-author">Carlos M.</div>
              <div class="review-role">Ingeniero de Software · Madrid, España</div>
            </div>
            <span class="verified-pill">✓ Compra Verificada</span>
          </div>
          <div class="stars">★★★★★</div>
          <p class="review-text" style="margin-top: 8px;">
            "Paso más de 9 horas al día programando. Tenía una tensión insoportable en la nuca. Me tumbé en el OrthoCloud Pro y en 4 minutos sentí cómo se abría mi cuello. Llevo 3 semanas usándolo con el antifaz ThermoSilk y no he vuelto a tomar analgésicos."
          </p>
        </div>

        <div class="review-card">
          <div class="review-header">
            <div>
              <div class="review-author">Dra. Elena R.</div>
              <div class="review-role">Odontóloga · Barcelona, España</div>
            </div>
            <span class="verified-pill">✓ Compra Verificada</span>
          </div>
          <div class="stars">★★★★★</div>
          <p class="review-text" style="margin-top: 8px;">
            "Por mi profesión trabajo inclinada hacia adelante todo el día. Mi fisioterapeuta me recomendó tracción cervical pasiva en casa. La densidad de la espuma de AetherWell es perfecta: no es plástico duro como otros productos, sostiene el cráneo sin doler."
          </p>
        </div>

        <div class="review-card">
          <div class="review-header">
            <div>
              <div class="review-author">Sofía L.</div>
              <div class="review-role">Diseñadora Digital · Valencia, España</div>
            </div>
            <span class="verified-pill">✓ Compra Verificada</span>
          </div>
          <div class="stars">★★★★★</div>
          <p class="review-text" style="margin-top: 8px;">
            "Noté en fotos de perfil que mi cuello se veía adelantado por el móvil. Empecé con 10 minutos al día mientras escucho un podcast y el cambio en mi postura y en mis migrañas ha sido total. ¡Totalmente recomendada!"
          </p>
        </div>

        <div class="review-card">
          <div class="review-header">
            <div>
              <div class="review-author">David K.</div>
              <div class="review-role">Product Manager · Miami, FL</div>
            </div>
            <span class="verified-pill">✓ Compra Verificada</span>
          </div>
          <div class="stars">★★★★★</div>
          <p class="review-text" style="margin-top: 8px;">
            "Compré el Pack 360 con el corrector PostureAlign. La sensación de descompresión al llegar del trabajo es una maravilla. El proceso de compra con Apple Pay fue instantáneo y llegó en 8 días."
          </p>
        </div>

        <div class="review-card">
          <div class="review-header">
            <div>
              <div class="review-author">Patricia B.</div>
              <div class="review-role">Teletrabajadora · Sevilla, España</div>
            </div>
            <span class="verified-pill">✓ Compra Verificada</span>
          </div>
          <div class="stars">★★★★★</div>
          <p class="review-text" style="margin-top: 8px;">
            "Sufro de migrañas tensionales crónicas y el antifaz frío ThermoSilk junto con la almohada es el mejor combo que he probado en años. Se nota la calidad médica de los materiales."
          </p>
        </div>

        <div class="review-card">
          <div class="review-header">
            <div>
              <div class="review-author">Marcos G.</div>
              <div class="review-role">Arquitecto · Austin, TX</div>
            </div>
            <span class="verified-pill">✓ Compra Verificada</span>
          </div>
          <div class="stars">★★★★★</div>
          <p class="review-text" style="margin-top: 8px;">
            "Dudaba si funcionaría pero con los 30 días de prueba me animé. Ya no tengo rigidez al despertar y mi cuello tiene mucha más movilidad lateral. Un 10 en atención y calidad."
          </p>
        </div>
      </div>
    </section>

    <!-- 7. FAQ Accordion -->
    <section class="section-spacing" id="faq">
      <div class="section-header">
        <span class="section-tag">RESOLVEMOS TUS DUDAS</span>
        <h2 class="section-title">Preguntas Frecuentes</h2>
        <p class="section-desc">
          Todo lo que necesitas saber sobre el uso clínico, envíos y garantía de satisfacción.
        </p>
      </div>

      <div class="faq-container">
        <div class="faq-item active">
          <div class="faq-question" onclick="toggleFaq(this)">
            <span>¿Cuánto tiempo debo usar OrthoCloud™ Pro al día para notar mejoría?</span>
            <span class="faq-arrow">▼</span>
          </div>
          <div class="faq-answer">
            Basta con 8 a 10 minutos al día. Recomendamos comenzar por el Lado Suave (curva cóncava) durante los primeros 3 a 5 días para que tus ligamentos y vértebras se acostumbren, y luego pasar al Lado Intenso para una descompresión profunda.
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question" onclick="toggleFaq(this)">
            <span>¿Puedo dormir toda la noche sobre OrthoCloud™ Pro?</span>
            <span class="faq-arrow">▼</span>
          </div>
          <div class="faq-answer">
            No está pensada como almohada de descanso nocturno de 8 horas, sino como un dispositivo activo de descompresión física. Se usa 10 a 15 minutos en el suelo o en la cama antes de acostarte o al terminar tu jornada de trabajo.
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question" onclick="toggleFaq(this)">
            <span>¿Cuánto tarda el envío y cómo recibo mi seguimiento?</span>
            <span class="faq-arrow">▼</span>
          </div>
          <div class="faq-answer">
            Procesamos los pedidos en 24-48 horas hábiles. La entrega se realiza mediante mensajería express asegurada en un plazo habitual de 7 a 10 días laborables. Recibirás tu código de seguimiento internacional por correo electrónico tan pronto como el paquete salga del almacén.
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question" onclick="toggleFaq(this)">
            <span>¿Cómo funciona la Garantía de 30 Noches de Prueba?</span>
            <span class="faq-arrow">▼</span>
          </div>
          <div class="faq-answer">
            Prueba OrthoCloud™ Pro durante 30 días en tu casa. Si no sientes que tu rigidez cervical y tus dolores de cabeza se reducen notablemente, ponte en contacto con nuestro equipo de soporte en <code>soporte@aetherwell.com</code> y gestionaremos el reembolso íntegro de tu dinero sin trámites complicados.
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question" onclick="toggleFaq(this)">
            <span>¿Cómo se limpia y cuida el producto?</span>
            <span class="faq-arrow">▼</span>
          </div>
          <div class="faq-answer">
            La superficie médica impermeable de la almohada se puede limpiar fácilmente con un paño suave húmedo con agua o jabón neutro. En caso de los modelos con funda textil, esta es desenfundable y lavable a máquina en ciclo suave a 30°C.
          </div>
        </div>
      </div>
    </section>

  </main>

  <!-- 8. Professional Legal Footer -->
  <footer class="footer">
    <div class="footer-container">
      <div>
        <div class="footer-logo">${brandName}</div>
        <p style="color: #cbd5e1; line-height: 1.6; max-width: 420px;">
          Ingeniería ergonómica y descanso clínico para profesionales y personas que buscan recuperar su movilidad cervical sin citas costosas.
        </p>
        <div class="footer-disclaimer">
          Aviso: AetherWell™ es un dispositivo de bienestar ergonómico y descanso biomecánico. No sustituye el diagnóstico ni el tratamiento médico prescrito para patologías espinales severas o cirugías recientes.
        </div>
      </div>

      <div class="footer-col">
        <h4>Información Legal & Transparencia</h4>
        <ul class="footer-links">
          <li><a onclick="openLegalModal('envios')">Política de Envíos y Entregas</a></li>
          <li><a onclick="openLegalModal('devoluciones')">Garantía 30 Días y Devoluciones</a></li>
          <li><a onclick="openLegalModal('privacidad')">Política de Privacidad (RGPD)</a></li>
          <li><a onclick="openLegalModal('terminos')">Términos y Condiciones</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Atención al Cliente</h4>
        <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 12px;">
          ¿Tienes dudas con tu pedido o necesitas asesoramiento ergonómico?
        </p>
        <p><strong>Email:</strong> <a href="mailto:soporte@aetherwell.com" style="color: #38bdf8;">soporte@aetherwell.com</a></p>
        <p style="margin-top: 6px;"><strong>Horario:</strong> Lunes a Domingo, 24/7</p>
        <p style="margin-top: 6px; font-size: 0.8rem; color: #64748b;">Pasarela certificada PCI-DSS Nivel 1</p>
      </div>
    </div>

    <div class="footer-bottom">
      <div>© ${new Date().getFullYear()} ${brandName}. Todos los derechos reservados.</div>
      <div style="display: flex; gap: 16px;">
        <span>🔒 Conexión Cifrada SSL 256-Bit</span>
        <span>🇪🇺 Cumplimiento RGPD & UE</span>
      </div>
    </div>
  </footer>

  <!-- 9. Legal Modals Container -->
  <div class="modal-overlay" id="legal-modal-overlay" onclick="closeLegalModal(event)">
    <div class="modal-card">
      <button class="modal-close-btn" onclick="closeLegalModal()">✕</button>
      <div id="modal-content-slot"></div>
    </div>
  </div>

  <!-- 10. GDPR Cookie Consent Banner -->
  <div id="cookie-banner">
    <div class="cookie-content">
      <div>
        🍪 <strong>Privacidad y Cookies:</strong> Utilizamos cookies técnicas necesarias para procesar pedidos de forma segura mediante Stripe y optimizar tu navegación. Consulta nuestra <a onclick="openLegalModal('privacidad')" style="text-decoration: underline; cursor: pointer; color: var(--primary);">Política de Privacidad</a>.
      </div>
      <button class="btn-accept-cookies" onclick="acceptCookies()">Aceptar y Continuar</button>
    </div>
  </div>

  <!-- Mobile Sticky Bar -->
  <div class="mobile-sticky-bar">
    <div class="mobile-price-group">
      <span class="mobile-price-now" id="mobile-price-val">$${duoPrice.toFixed(2)} USD</span>
      <span class="mobile-shipping-hint">Envío Gratis Desbloqueado</span>
    </div>
    <button class="btn-mobile-buy" onclick="redirectToStripeCheckout()">PAGAR CON STRIPE</button>
  </div>

  <script>
    // Estado reactivo del carrito en el cliente
    const THRESHOLD = ${threshold};
    const HERO_PRICE = ${heroPrice};
    const MASK_PRICE = ${maskPrice};
    const POSTURE_PRICE = ${posturePrice};
    const BUNDLE_PRICE = ${bundlePrice};
    const DUO_PRICE = ${duoPrice};

    let selectedTier = 2; // Por defecto: Opción 2 (Dúo Alivio Total)

    // Diapositivas de la Galería con Fotografías Reales de Estudio 4K y Diagramas Biomecánicos
    const GALLERY_SLIDES = [
      {
        badge: "FOTOGRAFÍA 1 · ORTHOCLOUD™ PRO (ESTUDIO 4K)",
        caption: "OrthoCloud™ Pro — Curva de tracción de 26° y 8 nodos de acupresión médica",
        content: '<img src="/assets/orthocloud-hero.jpg" alt="OrthoCloud Pro Camilla de Tracción Cervical" style="max-width:100%; max-height:260px; object-fit:contain; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.08);" onerror="this.onerror=null; this.src=\\'/assets/orthocloud-hero.png\\';" />'
      },
      {
        badge: "FOTOGRAFÍA 2 · ANTIFAZ DE MIGRAÑAS THERMOSILK™",
        caption: "ThermoSilk™ — Antifaz térmico de crioterapia 360° para migraña y fatiga visual",
        content: '<img src="/assets/thermosilk-mask.jpg" alt="Antifaz de Crioterapia ThermoSilk" style="max-width:100%; max-height:260px; object-fit:contain; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.08);" onerror="this.onerror=null; this.src=\\'/assets/thermosilk-mask.png\\';" />'
      },
      {
        badge: "FOTOGRAFÍA 3 · CORRECTOR POSTUREALIGN™ SMART",
        caption: "PostureAlign™ Smart — Corrector inteligente invisible con sensor háptico 25°",
        content: '<img src="/assets/posturealign-smart.jpg" alt="Corrector Inteligente PostureAlign Smart" style="max-width:100%; max-height:260px; object-fit:contain; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.08);" onerror="this.onerror=null; this.src=\\'/assets/posturealign-smart.png\\';" />'
      },
      {
        badge: "DIAGRAMA BIOMECÁNICO · TRACCIÓN CERVICAL 26°",
        caption: "Descompresión y apertura del espacio intervertebral C1 a C7 bajo gravedad pasiva",
        content: \`<svg viewBox="0 0 320 220" width="100%" height="220" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="160" cy="180" rx="120" ry="18" fill="#e2e8f0" opacity="0.5"/>
          <path d="M 70 80 Q 110 50 150 75 Q 180 95 190 140 Q 200 160 250 160" fill="none" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
          <g fill="#0d9488">
            <rect x="130" y="78" width="18" height="10" rx="3"/>
            <rect x="142" y="92" width="18" height="10" rx="3"/>
            <rect x="154" y="106" width="18" height="10" rx="3"/>
            <rect x="166" y="120" width="18" height="10" rx="3"/>
            <rect x="178" y="134" width="18" height="10" rx="3"/>
          </g>
          <path d="M 125 65 L 105 50" stroke="#2563eb" stroke-width="3"/>
          <path d="M 195 145 L 220 160" stroke="#2563eb" stroke-width="3"/>
          <text x="160" y="45" font-size="12" font-weight="900" fill="#0f172a" text-anchor="middle">ESPACIO INTERVERTEBRAL +35%</text>
          <text x="160" y="195" font-size="11" font-weight="bold" fill="#0d9488" text-anchor="middle">DESCOMPRESIÓN SUAVE C1 A C7</text>
        </svg>\`
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
        priceCur.textContent = '$' + HERO_PRICE.toFixed(2) + ' USD';
        priceCmp.textContent = '$79.99 USD';
        savings.textContent = 'Ahorras 50%';
        mobileVal.textContent = '$' + HERO_PRICE.toFixed(2) + ' USD';
        amtLabel.textContent = '$' + HERO_PRICE.toFixed(2) + ' / $' + THRESHOLD.toFixed(2) + ' USD';
        fill.style.width = '88.8%';
        fill.style.background = 'linear-gradient(90deg, #3b82f6, #0d9488)';
        msg.innerHTML = '⚠️ <strong>¡Te faltan solo $5.01 USD</strong> para desbloquear el <strong>ENVÍO RÁPIDO GRATIS</strong> (Ahorras $4.99). Pasa al Pack Alivio Total superior:';
      } else if (tierNum === 2) {
        priceCur.textContent = '$' + DUO_PRICE.toFixed(2) + ' USD';
        priceCmp.textContent = '$109.98 USD';
        savings.textContent = 'Ahorras 50% + Envío Gratis';
        mobileVal.textContent = '$' + DUO_PRICE.toFixed(2) + ' USD';
        amtLabel.textContent = '$' + DUO_PRICE.toFixed(2) + ' / $' + THRESHOLD.toFixed(2) + ' USD';
        fill.style.width = '100%';
        fill.style.background = 'linear-gradient(90deg, #0d9488, #10b981)';
        msg.innerHTML = '🎉 <strong>¡ENHORABUENA!</strong> Has desbloqueado el <strong>ENVÍO RÁPIDO GRATIS ($0.00 USD)</strong>.';
      } else if (tierNum === 3) {
        priceCur.textContent = '$' + BUNDLE_PRICE.toFixed(2) + ' USD';
        priceCmp.textContent = '$159.97 USD';
        savings.textContent = 'Ahorras $100 USD (62% DTO)';
        mobileVal.textContent = '$' + BUNDLE_PRICE.toFixed(2) + ' USD';
        amtLabel.textContent = '$' + BUNDLE_PRICE.toFixed(2) + ' / $' + THRESHOLD.toFixed(2) + ' USD';
        fill.style.width = '100%';
        fill.style.background = 'linear-gradient(90deg, #0d9488, #10b981)';
        msg.innerHTML = '🏆 <strong>¡PACK 360° SELECCIONADO!</strong> Despacho VIP Prioritario y Envío Gratis.';
      }
    }

    async function redirectToStripeCheckout() {
      const btn = document.getElementById('btn-stripe-checkout');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '⏳ Conectando con Stripe Checkout Seguro...';

      const items = [];
      if (selectedTier === 3) {
        items.push({ productId: 'prod_bundle_relief_360_004', quantity: 1, unitPriceOverride: BUNDLE_PRICE });
      } else if (selectedTier === 2) {
        items.push({ productId: 'prod_hero_orthocloud_001', quantity: 1, unitPriceOverride: HERO_PRICE });
        items.push({ productId: 'prod_bump_thermosilk_002', quantity: 1, isUpsell: true, unitPriceOverride: MASK_PRICE });
      } else {
        items.push({ productId: 'prod_hero_orthocloud_001', quantity: 1, unitPriceOverride: HERO_PRICE });
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
          btn.innerHTML = '🚀 Redirigiendo a Stripe Seguro...';
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

    function toggleFaq(el) {
      const item = el.parentElement;
      item.classList.toggle('active');
    }

    // Modales Legales
    const LEGAL_TEXTS = {
      envios: \`
        <h3 class="modal-title">Política de Envíos y Entregas</h3>
        <div class="modal-body">
          <p>En <strong>AetherWell™</strong> nos comprometemos a garantizar una experiencia de entrega transparente, ágil y segura.</p>
          <h4>1. Plazos de Procesamiento</h4>
          <p>Todos los pedidos son preparados y verificados clínicamente para su expedición en un plazo de <strong>24 a 48 horas laborables</strong> desde la confirmación del pago.</p>
          <h4>2. Tiempos de Tránsito</h4>
          <p>El plazo de entrega habitual en España, Estados Unidos y la Unión Europea oscila entre <strong>7 y 10 días laborables</strong> tras el despacho desde nuestro centro logístico.</p>
          <h4>3. Seguimiento del Paquete</h4>
          <p>Recibirás automáticamente un correo electrónico con tu número de tracking internacional en cuanto la empresa de transporte asigne la etiqueta.</p>
          <h4>4. Aranceles e Impuestos</h4>
          <p>Todos los precios mostrados incluyen los impuestos correspondientes. No se aplicarán cargos aduaneros adicionales en las entregas estándar.</p>
        </div>
      \`,
      devoluciones: \`
        <h3 class="modal-title">Política de Devoluciones y Garantía de 30 Noches</h3>
        <div class="modal-body">
          <p>Tu descanso y alivio cervical son nuestra prioridad absoluta. Por ello ofrecemos una <strong>Garantía de Satisfacción de 30 Noches de Prueba</strong>.</p>
          <h4>1. Período de Prueba de 30 Días</h4>
          <p>Dispones de 30 días naturales desde la recepción de tu pedido para utilizar OrthoCloud™ Pro en tu hogar. Si tras seguir las pautas de uso de 10 minutos al día no experimentas mejoría en tu cuello o migrañas, tienes derecho a solicitar la devolución.</p>
          <h4>2. Proceso de Devolución Sencillo</h4>
          <p>Basta con escribir a nuestro equipo de atención en <code>soporte@aetherwell.com</code> indicando tu número de pedido. Te facilitaremos las instrucciones de retorno.</p>
          <h4>3. Reembolso</h4>
          <p>Una vez recibido e inspeccionado el producto devuelto, emitiremos el reembolso íntegro mediante el mismo método de pago (Stripe / Tarjeta) en un plazo de 3 a 5 días laborables.</p>
        </div>
      \`,
      privacidad: \`
        <h3 class="modal-title">Política de Privacidad y Protección de Datos (RGPD)</h3>
        <div class="modal-body">
          <p>En cumplimiento del Reglamento General de Protección de Datos (RGPD UE 2016/679) y la LOPDGDD, te informamos sobre el tratamiento de tus datos personales:</p>
          <h4>1. Responsable del Tratamiento</h4>
          <p>AetherWell™ Health & Ergonomic Technologies. Contacto DPO: <code>soporte@aetherwell.com</code>.</p>
          <h4>2. Finalidad del Tratamiento</h4>
          <p>Tus datos de contacto y dirección son tratados exclusivamente para la tramitación, facturación, envío de pedidos y comunicación del estado de entrega.</p>
          <h4>3. Seguridad de Pagos (Stripe PCI-DSS Nivel 1)</h4>
          <p>Nunca almacenamos ni tenemos acceso a los datos completos de tu tarjeta de crédito o débito. Todos los cobros son procesados de forma cifrada directamente por <strong>Stripe Inc.</strong>, pasarela certificada con el máximo estándar bancario internacional <strong>PCI-DSS Nivel 1</strong>.</p>
          <h4>4. Derechos del Usuario</h4>
          <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, limitación y portabilidad en cualquier momento remitiendo un correo a <code>soporte@aetherwell.com</code>.</p>
        </div>
      \`,
      terminos: \`
        <h3 class="modal-title">Términos y Condiciones de Contratación</h3>
        <div class="modal-body">
          <p>Las presentes condiciones rigen la adquisición de productos en la tienda oficial AetherWell™.</p>
          <h4>1. Precios y Moneda</h4>
          <p>Todos los precios se expresan en Dólares Estadounidenses (USD) o su equivalente en Euros e incluyen los impuestos aplicables.</p>
          <h4>2. Métodos de Pago Aceptados</h4>
          <p>Aceptamos tarjetas de crédito y débito (Visa, MasterCard, American Express), así como pagos móviles seguros Apple Pay y Google Pay a través de Stripe Checkout.</p>
          <h4>3. Reserva de Propiedad</h4>
          <p>Los productos seguirán siendo propiedad de AetherWell™ hasta el cobro completo y liquidación del importe pactado.</p>
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

    // Consentimiento de Cookies RGPD
    function checkCookies() {
      if (!localStorage.getItem('aetherwell_cookies_accepted')) {
        document.getElementById('cookie-banner').style.display = 'block';
      }
    }

    function acceptCookies() {
      localStorage.setItem('aetherwell_cookies_accepted', 'true');
      document.getElementById('cookie-banner').style.display = 'none';
    }

    // Fecha dinámica de entrega estimada (+7 a +10 días hábiles)
    function setupDeliveryDate() {
      const now = new Date();
      const start = new Date(now);
      const end = new Date(now);
      start.setDate(now.getDate() + 7);
      end.setDate(now.getDate() + 10);

      const options = { month: 'short', day: 'numeric' };
      const startStr = start.toLocaleDateString('es-ES', options);
      const endStr = end.toLocaleDateString('es-ES', options);

      const textEl = document.getElementById('delivery-estimate-text');
      if (textEl) {
        textEl.textContent = '🚚 Entrega estimada con seguimiento express: ' + startStr + ' - ' + endStr;
      }
    }

    // Detección de retorno desde Stripe Checkout
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
        banner.innerHTML = '🎉 <strong>¡PAGO CONFIRMADO CON ÉXITO!</strong> Tu orden ha sido recibida y se encuentra en cola de despacho express prioritario.' + (sessionId ? '<br><span style="font-size:0.82rem; font-family:monospace; color:#047857;">Stripe Checkout ID: ' + sessionId + '</span>' : '');
        banner.scrollIntoView({ behavior: 'smooth' });
      } else if (banner && paymentStatus === 'cancelled') {
        banner.style.display = 'block';
        banner.style.background = '#fef2f2';
        banner.style.border = '2px solid #ef4444';
        banner.style.color = '#991b1b';
        banner.innerHTML = '⚠️ <strong>PAGO CANCELADO:</strong> El proceso de pago en Stripe no se completó. Tus artículos y descuentos siguen guardados para cuando desees finalizar tu compra.';
        banner.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // Inicializaciones al cargar la página
    switchGalleryTab(0);
    selectTier(2); // Seleccionar Pack Dúo por defecto
    setupDeliveryDate();
    checkCookies();
    checkReturnStatus();
  </script>
</body>
</html>`;
}
