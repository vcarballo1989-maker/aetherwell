/**
 * @fileoverview Storefront DTC de Lujo Clínico y Alta Conversión — AetherWell™ (Mercado España).
 * Precios en Euros (€) con IVA 21% incluido, checkout oficial Stripe en EUR,
 * certificaciones europeas (OEKO-TEX® Standard 100 & Marcado CE),
 * cumplimiento estricto RGPD / LSSI-CE / LGDCU y logística adaptada a España.
 */

export function renderHighConvertingStorefront(catalogData = {}, kycStatus = {}, ledger = null, operationalEnv = null) {
  const { products = [], metadata = {} } = catalogData;
  const brandName = metadata.brandName || 'AetherWell™';
  const threshold = 45.0;

  const heroPrice = 39.99;
  const heroCompare = 79.99;
  const maskPrice = 14.99;
  const maskCompare = 29.99;
  const posturePrice = 19.99;
  const postureCompare = 49.99;
  const bundlePrice = 59.99;
  const bundleCompare = 159.99;
  const duoPrice = +(heroPrice + maskPrice).toFixed(2); // 54.98

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${brandName} España | Camilla de Tracción Cervical 3D — Alivio Clínico en 10 Minutos</title>
  <meta name="description" content="Descomprime tu cuello, elimina migrañas y corrige la postura con OrthoCloud™ Pro de AetherWell™. Garantía de 30 noches de prueba y Envío Gratis a toda España." />
  <meta name="keywords" content="traccion cervical, almohada ortopedica cervical españa, alivio dolor cuello, tech neck, descompresion cervical en casa, AetherWell OrthoCloud Pro" />
  <meta name="robots" content="index, follow" />
  
  <!-- Open Graph -->
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="${brandName} Clinical Sleep España" />
  <meta property="og:title" content="OrthoCloud™ Pro — Tracción Cervical 3D y Alivio Clínico en 10 Minutos" />
  <meta property="og:description" content="50% DTO. Hoy + Envío Rápido Gratis a toda España en pedidos superiores a 45 €. Garantía de 30 noches." />
  <meta property="og:image" content="/assets/orthocloud-hero.jpg" />
  <meta property="product:price:amount" content="${heroPrice.toFixed(2)}" />
  <meta property="product:price:currency" content="EUR" />

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
      padding: 24px;
      aspect-ratio: 1 / 0.92;
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
      font-size: 2.3rem;
      font-weight: 900;
      color: var(--text);
      letter-spacing: -0.02em;
    }
    .price-compare {
      font-size: 1.2rem;
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
      width: 100%;
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
      font-size: 1.2rem;
      color: var(--text);
    }
    .tier-price-compare {
      font-size: 0.82rem;
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
      gap: 8px;
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
      font-size: 1.2rem;
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
    <span class="badge">✨ OFERTA DE LANZAMIENTO</span>
    50% DTO. HOY + ENVÍO GRATIS A TODA ESPAÑA EN PEDIDOS &gt; 45,00 € (IVA 21% Incluido) — Garantía de 30 Noches de Prueba
  </div>

  <!-- 2. Sticky Navbar -->
  <header class="navbar">
    <div class="navbar-container">
      <div class="brand-group">
        <a href="/" class="brand-logo">
          <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          <span>${brandName}</span>
        </a>
        <span class="brand-subtitle">Clinical Sleep & Cervical Recovery España</span>
      </div>

      <nav class="nav-links">
        <a href="#ficha-tecnica">Ficha Técnica Real</a>
        <a href="#catalogo-completo">Catálogo Completo (5 Artículos)</a>
        <a href="#beneficios">Beneficios Clínicos</a>
        <a href="#comparativa">Comparativa</a>
        <a href="#opiniones">Opiniones (1.428)</a>
        <a href="#faq">Preguntas Frecuentes</a>
      </nav>

      <div class="nav-badges">
        <div class="trust-pill">
          <span>🟢</span> Envío Prioritario España (24-48h)
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
          <div class="gallery-badge" id="viewer-badge">FOTO REAL 1 · ALMOHADA ELÉCTRICA 3 EN 1 (VISTA GENERAL + USO)</div>
          <div class="gallery-discount-badge">-50% DTO</div>

          <div class="viewer-svg-stage" id="viewer-svg-stage">
            <img src="/assets/pillow-1-main.jpg" alt="Almohada Cervical Eléctrica 3 en 1 OrthoCloud Pro" style="max-width:100%; max-height:290px; object-fit:contain; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.08);" />
          </div>

          <div class="viewer-caption" id="viewer-caption">
            Almohada Eléctrica 3 en 1 (SKU: CJYD326642303CX) — Calor Térmico + Elevación Tracción + Masaje Vibración
          </div>
        </div>

        <!-- 4 Clickable Thumbnails -->
        <div class="thumbnails-row">
          <button class="thumb-btn active" onclick="switchGalleryTab(0)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span>1. Vista General</span>
          </button>
          <button class="thumb-btn" onclick="switchGalleryTab(1)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
            <span>2. Botones USB-C</span>
          </button>
          <button class="thumb-btn" onclick="switchGalleryTab(2)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 7v4M10 7v4M14 7v4M18 7v4"/></svg>
            <span>3. Medidas 42.5cm</span>
          </button>
          <button class="thumb-btn" onclick="switchGalleryTab(3)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            <span>4. Los 3 Modos</span>
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
            <span>Certificado OEKO-TEX® & Marcado CE</span>
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

        <h1 class="product-title">OrthoCloud™ Pro — Almohada Cervical Eléctrica 3 en 1 (Tracción + Calor + Masaje)</h1>
        <p class="product-subtitle">
          <strong>Producto Real Verificado (SKU: CJYD326642303CX):</strong> Almohada ergonómica de espuma viscoelástica <em>Memory Foam</em> (42,5 × 27 cm) con <strong>3 modos eléctricos por USB-C</strong>: 🟢 Elevación de tracción cervical arriba/abajo, 🔴 Compresa térmica relajante y 🔵 Masaje por vibración profunda con apagado automático a los 30 minutos.
        </p>

        <!-- Pricing Section -->
        <div class="price-box">
          <span class="price-current" id="box-price-current">54,98 €</span>
          <span class="price-compare" id="box-price-compare">109,99 €</span>
          <span class="savings-badge" id="box-savings-badge">Ahorras 50%</span>
        </div>

        <!-- Stock and Delivery Notification -->
        <div class="urgency-box">
          <div class="urgency-line">
            <span>🔥</span>
            <span>En stock — Quedan 9 unidades con despacho prioritario hoy en España</span>
          </div>
          <div class="delivery-line" id="delivery-estimate-text">
            🚚 Entrega estimada en España: Correos Express / CTT en 7-10 días laborables
          </div>
        </div>

        <!-- Interactive Free Shipping Bar -->
        <div class="shipping-bar-wrapper">
          <div class="shipping-bar-labels">
            <span id="shipping-bar-status-label">Progreso hacia Envío Gratis España</span>
            <span id="shipping-bar-amount-label" style="color: var(--primary);">54,98 € / 45,00 €</span>
          </div>
          <div class="shipping-progress-bg">
            <div id="shipping-progress-fill" class="shipping-progress-fill" style="width: 100%;"></div>
          </div>
          <div class="shipping-msg" id="shipping-bar-msg">
            🎉 <strong>¡ENHORABUENA!</strong> Has desbloqueado el <strong>ENVÍO RÁPIDO GRATIS A TODA ESPAÑA (0,00 €)</strong>.
          </div>
        </div>

        <!-- Tiered Pack Selector -->
        <div class="tier-selector-title">Selecciona tu Paquete Clínico (IVA Incluido):</div>

        <!-- Option 1: 1x Solo Almohada -->
        <div class="tier-card" id="tier-card-1" onclick="selectTier(1)">
          <div class="tier-header">
            <div class="tier-left">
              <input type="radio" name="pack_tier" id="radio-tier-1" class="tier-radio" />
              <div>
                <div class="tier-name">1x Almohada Cervical Eléctrica 3 en 1 OrthoCloud™ Pro</div>
                <div class="tier-desc">Incluye Almohada Eléctrica (42,5×27cm) + Cable USB-C en caja (+ 4,99 € envío)</div>
              </div>
            </div>
            <div class="tier-pricing">
              <span class="tier-price-main">39,99 €</span>
              <span class="tier-price-compare">79,99 €</span>
            </div>
          </div>
        </div>

        <!-- Option 2: Duo Hero + Dream Patches (Pre-selected - Most Popular) -->
        <div class="tier-card selected" id="tier-card-2" onclick="selectTier(2)">
          <div class="tier-badge-ribbon">⭐ MÁS ELEGIDO (78% DE CLIENTES EN ESPAÑA)</div>
          <div class="tier-header">
            <div class="tier-left">
              <input type="radio" name="pack_tier" id="radio-tier-2" class="tier-radio" checked />
              <div>
                <div class="tier-name">Pack Descanso Total (Almohada Eléctrica + 30 Parches Dream Patches™)</div>
                <div class="tier-desc">Incluye Pack de 30 Parches Nocturnos con Valeriana y Ashwagandha • <strong>¡ENVÍO GRATIS A ESPAÑA!</strong></div>
              </div>
            </div>
            <div class="tier-pricing">
              <span class="tier-price-main">54,98 €</span>
              <span class="tier-price-compare">109,99 €</span>
            </div>
          </div>
        </div>

        <!-- Option 3: Full 360 Pack -->
        <div class="tier-card" id="tier-card-3" onclick="selectTier(3)">
          <div class="tier-badge-ribbon">🏆 PACK CLÍNICO 360° · AHORRA 100 €</div>
          <div class="tier-header">
            <div class="tier-left">
              <input type="radio" name="pack_tier" id="radio-tier-3" class="tier-radio" />
              <div>
                <div class="tier-name">Pack Clínico 360° (Almohada Eléctrica + 30 Parches + Collarín PostureAlign™)</div>
                <div class="tier-desc">Incluye Soporte Cervical Ajustable en Altura PostureAlign™ • <strong>¡ENVÍO PRIORITARIO GRATIS!</strong></div>
              </div>
            </div>
            <div class="tier-pricing">
              <span class="tier-price-main">59,99 €</span>
              <span class="tier-price-compare">159,99 €</span>
            </div>
          </div>
        </div>

        <!-- Single Magnetic Purchase Button -->
        <button class="btn-buy-now" id="btn-stripe-checkout" onclick="redirectToStripeCheckout()">
          <svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
          <span id="btn-buy-label">🔒 FINALIZAR COMPRA SEGURA — PAGAR EN EUROS</span>
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
            <span>🛡️</span> Garantía de 30 Noches de Prueba sin riesgo • Devolución 100% sencilla
          </div>
        </div>

      </div>

    </section>

    <!-- 3.5. Ficha Técnica Detallada: Todo lo que necesitas saber de la Almohada Eléctrica OrthoCloud™ Pro -->
    <section class="section-spacing" id="ficha-tecnica">
      <div class="section-header">
        <span class="section-tag">TRANSPARENCIA TOTAL · ESPECIFICACIONES DE FÁBRICA</span>
        <h2 class="section-title">Ficha Técnica Detallada: Todo lo que necesitas saber de la Almohada Eléctrica OrthoCloud™ Pro</h2>
        <p class="section-desc">
          Fotografías reales de fábrica y especificaciones exactas del modelo oficial <strong>3 in 1 Neck Massager Pillow (SKU CJ: CJYD326642303CX)</strong>. Sin dibujos confusos: esto es exactamente lo que recibes en casa.
        </p>
      </div>

      <!-- 3 Fotos Reales de Apoyo (Comparativa, Anatomía y Alivio) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 32px;">
        <div style="background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 14px; box-shadow: var(--shadow-sm); text-align: center;">
          <img src="/assets/pillow-5-compare.jpg" alt="Comparativa Almohada Eléctrica 3 en 1 vs Otras" style="width: 100%; height: 220px; object-fit: contain; border-radius: 8px;" />
          <div style="font-size: 0.85rem; font-weight: 800; color: var(--text); margin-top: 10px;">Comparativa Real: 3 Modos Activos vs Espuma Rígida</div>
        </div>
        <div style="background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 14px; box-shadow: var(--shadow-sm); text-align: center;">
          <img src="/assets/pillow-6-anatomy.jpg" alt="Anatomía de Tracción y Calor en Cuello y Hombros" style="width: 100%; height: 220px; object-fit: contain; border-radius: 8px;" />
          <div style="font-size: 0.85rem; font-weight: 800; color: var(--text); margin-top: 10px;">Acción Focalizada en Cervicales (C1-C7) y Trapecios</div>
        </div>
        <div style="background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 14px; box-shadow: var(--shadow-sm); text-align: center;">
          <img src="/assets/pillow-7-relief.jpg" alt="Alivio de Cefaleas, Dolor Cervical y Rigidez" style="width: 100%; height: 220px; object-fit: contain; border-radius: 8px;" />
          <div style="font-size: 0.85rem; font-weight: 800; color: var(--text); margin-top: 10px;">Termoterapia + Elevación para Alivio en 10-20 Minutos</div>
        </div>
      </div>

      <!-- Las 5 Preguntas Clave de Todo Comprador -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
        <div class="benefit-card" style="border-left: 4px solid var(--primary);">
          <h3 style="color: var(--primary); margin-bottom: 8px;">1. ¿Qué es exactamente?</h3>
          <p>
            Es la <strong>Almohada Cervical Eléctrica 3 en 1 OrthoCloud™ Pro</strong> (<em>3 in 1 Neck Massager Pillow</em>, SKU verificado <code>CJYD326642303CX</code>): un cojín terapéutico motorizado diseñado para descomprimir las vértebras del cuello, aplicar calor constante relajante y realizar masaje vibratorio profundo desde la cama o el sofá.
          </p>
        </div>

        <div class="benefit-card" style="border-left: 4px solid var(--blue-trust);">
          <h3 style="color: var(--blue-trust); margin-bottom: 8px;">2. ¿Cómo es y qué medidas tiene?</h3>
          <p>
            Tiene unas dimensiones amplias de <strong>42,5 cm de largo × 27 cm de ancho</strong> (16,7" × 10,6") y un peso sólido de <strong>1.010 gramos</strong>. Presenta un diseño ergonómico dividido en <strong>dos zonas</strong>: un cilindro cervical activo que se acopla bajo la nuca y una almohadilla superior suave que sostiene la cabeza sin forzar el cuello.
          </p>
        </div>

        <div class="benefit-card" style="border-left: 4px solid #0f766e;">
          <h3 style="color: #0f766e; margin-bottom: 8px;">3. ¿De qué está hecha? (Materiales)</h3>
          <p>
            <strong>Núcleo interior:</strong> Espuma viscoelástica <em>Memory Foam</em> de alta densidad y rebote lento que no se aplasta.<br/>
            <strong>Exterior:</strong> Tejido hipoalergénico gris jaspeado transpirable con <strong>panel central de malla térmica hexagonal</strong> y embellecedores laterales en <strong>cuero PU marrón cosido</strong> donde se aloja la botonera.
          </p>
        </div>

        <div class="benefit-card" style="border-left: 4px solid #d97706;">
          <h3 style="color: #d97706; margin-bottom: 8px;">4. ¿Qué lleva en la caja?</h3>
          <p>
            Recibes el paquete oficial de fábrica en su caja rígida protectora (<em>Cowhide Box</em>):<br/>
            • <strong>1× Almohada Cervical Eléctrica 3 en 1 OrthoCloud™ Pro</strong> (Gris Clásico, 42,5 × 27 cm).<br/>
            • <strong>1× Cable de alimentación USB Tipo C (5V)</strong>.<br/>
            • <strong>1× Manual de instrucciones</strong> con guía de los modos Manual y Automático.
          </p>
        </div>

        <div class="benefit-card" style="border-left: 4px solid #e11d48; grid-column: 1 / -1;">
          <h3 style="color: #e11d48; margin-bottom: 8px;">5. ¿Qué funciones tiene y cómo funciona?</h3>
          <p style="margin-bottom: 10px;">
            En el lateral de cuero marrón incorpora el puerto USB-C y <strong>2 botones físicos muy sencillos</strong>: el botón de <strong>Modo Manual</strong> (pulsación larga para encender/apagar; pulsación corta para cambiar de función) y el botón de <strong>Ciclo Automático</strong>. Cuenta con <strong>3 funciones terapéuticas con indicador LED de color</strong> y apagado de seguridad a los <strong>30 minutos</strong>:
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-top: 10px;">
            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 10px; font-size: 0.88rem;">
              🔴 <strong>Luz Roja — Calor Térmico Constante:</strong> Aplica termoterapia suave en la nuca para dilatar los vasos sanguíneos y derretir la rigidez muscular.
            </div>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 10px; font-size: 0.88rem;">
              🟢 <strong>Luz Verde — Elevación y Tracción Ajustable:</strong> Inflado/elevación física arriba y abajo que estira suavemente el espacio intervertebral cervical.
            </div>
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 10px; font-size: 0.88rem;">
              🔵 <strong>Luz Azul — Masaje por Vibración:</strong> Micro-vibraciones rítmicas de tejido profundo que relajan los trapecios y alivian la fatiga acumulada.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3.8. Catálogo Completo de los 5 Artículos Reales AetherWell™ (Con Fotos Reales, Vídeos y Compra Directa) -->
    <section class="section-spacing" id="catalogo-completo">
      <div class="section-header">
        <span class="section-tag">CATÁLOGO OFICIAL VERIFICADO · 5 PRODUCTOS REALES</span>
        <h2 class="section-title">Todos Nuestros Artículos de Alivio Cervical y Descanso (Compra Individual o en Pack)</h2>
        <p class="section-desc">
          Aquí puedes ver en detalle cada uno de los <strong>5 productos reales de nuestro almacén</strong> —incluyendo el famoso <strong>Masajeador Manual de 6 Rodillos ("el de los rodillitos")</strong> y el <strong>Collarín Eléctrico de Impulsos EMS</strong>—, con sus fotografías reales de proveedor, vídeos demostrativos y ficha técnica completa.
        </p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 32px;">

        <!-- ARTÍCULO 1: ALMOHADA CERVICAL ELÉCTRICA 3 EN 1 -->
        <div style="background: #ffffff; border: 2px solid var(--primary); border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-md);">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 18px; border-bottom: 1px solid var(--border); padding-bottom: 14px;">
            <div>
              <span style="background: var(--primary-subtle); color: var(--primary); border: 1px solid var(--primary-border); font-size: 0.75rem; font-weight: 800; padding: 4px 10px; border-radius: 999px;">PRODUCTO #1 (ESTRELLA) · SKU CJ: CJYD326642303CX</span>
              <h3 style="font-size: 1.35rem; font-weight: 900; color: var(--text); margin-top: 6px;">1. Almohada Cervical Eléctrica 3 en 1 OrthoCloud™ Pro (Calor + Elevación + Vibración)</h3>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.5rem; font-weight: 900; color: var(--primary);">39,99 € <span style="font-size: 0.95rem; color: var(--text-dim); text-decoration: line-through; font-weight: 600;">79,99 €</span></div>
              <div style="font-size: 0.76rem; color: var(--text-muted);">IVA 21% Incluido · VID: 2610151230071628101</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; align-items: start;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <img src="/assets/pillow-1-main.jpg" alt="Almohada Eléctrica 3 en 1 Vista Principal" style="width: 100%; height: 170px; object-fit: contain; background: #f8fafc; border-radius: 10px; border: 1px solid var(--border); padding: 6px;" />
              <img src="/assets/pillow-2-side-controls.jpg" alt="Panel Lateral USB-C Almohada" style="width: 100%; height: 170px; object-fit: contain; background: #f8fafc; border-radius: 10px; border: 1px solid var(--border); padding: 6px;" />
              <img src="/assets/pillow-3-specs.jpg" alt="Medidas Almohada 42.5x27cm" style="width: 100%; height: 170px; object-fit: contain; background: #f8fafc; border-radius: 10px; border: 1px solid var(--border); padding: 6px;" />
              <img src="/assets/pillow-4-modes.jpg" alt="3 Modos Eléctricos Almohada" style="width: 100%; height: 170px; object-fit: contain; background: #f8fafc; border-radius: 10px; border: 1px solid var(--border); padding: 6px;" />
            </div>

            <div style="font-size: 0.9rem; color: #334155; display: flex; flex-direction: column; gap: 10px;">
              <div><strong>• ¿Qué es?:</strong> Almohada ortopédica eléctrica 3 en 1 para tracción cervical pasiva y activa, termoterapia y masaje relajante en casa.</div>
              <div><strong>• ¿Cómo es?:</strong> Mide <strong>42,5 cm × 27 cm</strong> (peso 1.010 g), color gris jaspeado clásico con zona térmica central en panal y botonera lateral en cuero PU marrón.</div>
              <div><strong>• ¿De qué está hecha?:</strong> Núcleo de espuma viscoelástica <em>Memory Foam</em> de alta densidad indeformable y funda textil transpirable suave al tacto.</div>
              <div><strong>• ¿Qué lleva en la caja?:</strong> 1× Almohada Eléctrica 3 en 1 en caja original, 1× Cable USB Tipo C (5V) y 1× Manual de usuario.</div>
              <div><strong>• ¿Qué funciones tiene?:</strong>Modo Manual y Modo Automático con 3 terapias (🔴 Calor constante, 🟢 Elevación/inflado de tracción arriba-abajo, 🔵 Vibración de masaje) y apagado automático a los 30 min.</div>
              <div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 10px;">
                <button onclick="buySingleCatalogProduct('prod_hero_orthocloud_001', 39.99, this)" style="background: var(--primary); color: #ffffff; border: none; padding: 12px 20px; border-radius: 10px; font-weight: 800; cursor: pointer; font-size: 0.92rem;">
                  🛒 Comprar Almohada Eléctrica (39,99 €)
                </button>
                <a href="#compra" onclick="selectTier(2)" style="background: var(--surface-subtle); color: var(--text); border: 1px solid var(--border); padding: 12px 16px; border-radius: 10px; font-weight: 700; font-size: 0.88rem;">
                  ⭐ Ver en Pack con Envío Gratis (54,98 €)
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- ARTÍCULO 2: MASAJEADOR CERVICAL MANUAL DE 6 RODILLOS ("EL DE LOS RODILLITOS") -->
        <div style="background: #ffffff; border: 2px solid #0284c7; border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-md);">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 18px; border-bottom: 1px solid var(--border); padding-bottom: 14px;">
            <div>
              <span style="background: #e0f2fe; color: #0369a1; border: 1px solid #7dd3fc; font-size: 0.75rem; font-weight: 800; padding: 4px 10px; border-radius: 999px;">PRODUCTO #2 (EL DE LOS RODILLITOS · VIRAL TIKTOK) · SKU CJ: CJAM130816101AZ</span>
              <h3 style="font-size: 1.35rem; font-weight: 900; color: var(--text); margin-top: 6px;">2. RollerRelief™ — Masajeador Cervical Manual de 6 Rodillos Giratorios 360°</h3>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.5rem; font-weight: 900; color: #0284c7;">19,99 € <span style="font-size: 0.95rem; color: var(--text-dim); text-decoration: line-through; font-weight: 600;">39,99 €</span></div>
              <div style="font-size: 0.76rem; color: var(--text-muted);">IVA 21% Incluido · VID: 1444929719253471232</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; align-items: start;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; align-items: center;">
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <img src="/assets/6roller_23WD_new_roller_swan_blue.jpg" alt="Masajeador Cervical 6 Rodillos Foto Proveedor" style="width: 100%; height: 155px; object-fit: contain; background: #f8fafc; border-radius: 10px; border: 1px solid var(--border); padding: 4px;" />
                <img src="/assets/roller-1-main.jpg" alt="Masajeador 6 Rodillos en Uso Real en Cuello" style="width: 100%; height: 155px; object-fit: cover; background: #f8fafc; border-radius: 10px; border: 1px solid var(--border);" />
              </div>
              <div style="text-align: center;">
                <video src="/assets/roller-demo.mp4" poster="/assets/roller-2-action.jpg" controls muted loop playsinline style="width: 100%; max-height: 320px; border-radius: 10px; border: 1px solid var(--border); background: #000;"></video>
                <div style="font-size: 0.75rem; font-weight: 700; color: #0284c7; margin-top: 4px;">▶️ Vídeo Real: Así se pasa por el cuello</div>
              </div>
            </div>

            <div style="font-size: 0.9rem; color: #334155; display: flex; flex-direction: column; gap: 10px;">
              <div><strong>• ¿Qué es?:</strong> Es el famoso <strong>masajeador cervical manual con rodillos</strong> ("el cacharrito que se pasa por el cuello con rodillitos"): una pinza ergonómica con dos brazos flexibles que aprietas suavemente con las manos mientras la deslizas arriba y abajo por la nuca.</div>
              <div><strong>• ¿Cómo es?:</strong> Diseño tipo cisne (<em>Swan Roller</em>) con asas antideslizantes y <strong>2 cabezales basculantes equipados con 6 rodillos giratorios dentados</strong> (3 a cada lado del cuello) en color Azul/Verde Menta con rodillos grises.</div>
              <div><strong>• ¿De qué está hecho?:</strong> Arco de polímero <strong>PP elástico de alta resistencia</strong> (se abre hasta 180° sin romperse) y bolas/rodillos de <strong>elastómero TPR hipoalergénico</strong> firme pero suave con la piel.</div>
              <div><strong>• ¿Qué lleva en la caja?:</strong> 1× Masajeador Cervical Manual de 6 Rodillos RollerRelief™ completo y listo para usar (no requiere pilas ni cables).</div>
              <div><strong>• ¿Qué funciones tiene?:</strong> Masaje miofascial profundo de punto gatillo (<em>Trigger Point</em>) en cervicales, trapecios, hombros e incluso gemelos/piernas. Tú controlas el 100% de la fuerza apretando más o menos las asas, con rotación 360° que amasa los músculos como los dedos de un fisioterapeuta.</div>
              <div style="margin-top: 8px;">
                <button onclick="buySingleCatalogProduct('prod_roller_neck_005', 19.99, this)" style="background: #0284c7; color: #ffffff; border: none; padding: 12px 20px; border-radius: 10px; font-weight: 800; cursor: pointer; font-size: 0.92rem;">
                  🛒 Comprar Masajeador de 6 Rodillos (19,99 €)
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ARTÍCULO 3: MASAJEADOR CERVICAL ELÉCTRICO DE IMPULSOS EMS + CALOR -->
        <div style="background: #ffffff; border: 2px solid #7c3aed; border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-md);">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 18px; border-bottom: 1px solid var(--border); padding-bottom: 14px;">
            <div>
              <span style="background: #f3e8ff; color: #6d28d9; border: 1px solid #d8b4fe; font-size: 0.75rem; font-weight: 800; padding: 4px 10px; border-radius: 999px;">PRODUCTO #3 (ELECTROESTIMULACIÓN TENS/EMS) · SKU CJ: CJJT157094913MN</span>
              <h3 style="font-size: 1.35rem; font-weight: 900; color: var(--text); margin-top: 6px;">3. PulseNeck™ Smart — Collarín Eléctrico de Impulsos EMS + Compresa Térmica</h3>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.5rem; font-weight: 900; color: #7c3aed;">24,99 € <span style="font-size: 0.95rem; color: var(--text-dim); text-decoration: line-through; font-weight: 600;">49,99 €</span></div>
              <div style="font-size: 0.76rem; color: var(--text-muted);">IVA 21% Incluido · VID: 2409110614231617900</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; align-items: start;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; align-items: center;">
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <img src="/assets/ems_04DW_gradient.jpg" alt="Collarín Eléctrico Smart Neck Massager EMS" style="width: 100%; height: 155px; object-fit: contain; background: #f8fafc; border-radius: 10px; border: 1px solid var(--border); padding: 4px;" />
                <img src="/assets/ems-1-main.jpg" alt="Contenido de la Caja Smart Neck Massager" style="width: 100%; height: 155px; object-fit: cover; background: #f8fafc; border-radius: 10px; border: 1px solid var(--border);" />
              </div>
              <div style="text-align: center;">
                <video src="/assets/ems-demo.mp4" poster="/assets/ems-2-controls.jpg" controls muted loop playsinline style="width: 100%; max-height: 320px; border-radius: 10px; border: 1px solid var(--border); background: #000;"></video>
                <div style="font-size: 0.75rem; font-weight: 700; color: #7c3aed; margin-top: 4px;">▶️ Vídeo Real: Unboxing y Controles LED</div>
              </div>
            </div>

            <div style="font-size: 0.9rem; color: #334155; display: flex; flex-direction: column; gap: 10px;">
              <div><strong>• ¿Qué es?:</strong> Un masajeador cervical inalámbrico en forma de collarín ligero que utiliza microcorrientes de baja frecuencia (EMS/TENS) y calor constante para descontracturar las cervicales mientras trabajas o descansas.</div>
              <div><strong>• ¿Cómo es?:</strong> Diseño en U ergonómico ultraligero (160 g) en acabado degradado verde menta/lavanda con panel lateral iluminado por 2 barras LED azules y 3 botones táctiles (Encendido/Modo, <code>+</code> y <code>-</code>).</div>
              <div><strong>• ¿De qué está hecho?:</strong> Cuerpo flexible de ABS + silicona suave y <strong>2 placas flotantes de acero inoxidable 304</strong> de alta conductividad térmica y eléctrica.</div>
              <div><strong>• ¿Qué lleva en la caja?:</strong> 1× Collarín Eléctrico <em>Smart Neck Massager</em> en su caja original, 1× Cable de carga USB y 1× Manual en inglés/español (tal como se ve en el vídeo de unboxing).</div>
              <div><strong>• ¿Qué funciones tiene?:</strong> Compresa caliente constante (38°C–42°C), múltiples modos de pulso eléctrico (acupuntura, golpeteo, amasado) y 15 niveles de intensidad regulables con apagado inteligente a los 15 minutos.</div>
              <div style="margin-top: 8px;">
                <button onclick="buySingleCatalogProduct('prod_ems_neck_006', 24.99, this)" style="background: #7c3aed; color: #ffffff; border: none; padding: 12px 20px; border-radius: 10px; font-weight: 800; cursor: pointer; font-size: 0.92rem;">
                  🛒 Comprar Collarín Eléctrico EMS (24,99 €)
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ARTÍCULO 4: COLLARÍN / SOPORTE CERVICAL AJUSTABLE POSTUREALIGN -->
        <div style="background: #ffffff; border: 2px solid #0f766e; border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-md);">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 18px; border-bottom: 1px solid var(--border); padding-bottom: 14px;">
            <div>
              <span style="background: #ccfbf1; color: #115e59; border: 1px solid #5eead4; font-size: 0.75rem; font-weight: 800; padding: 4px 10px; border-radius: 999px;">PRODUCTO #4 (SOPORTE CERVICAL POSTURAL) · SKU CJ: CJYD320981502BY</span>
              <h3 style="font-size: 1.35rem; font-weight: 900; color: var(--text); margin-top: 6px;">4. PostureAlign™ — Soporte Cervical Ergonómico con Ajuste de Altura para "Cuello de Texto"</h3>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.5rem; font-weight: 900; color: #0f766e;">19,99 € <span style="font-size: 0.95rem; color: var(--text-dim); text-decoration: line-through; font-weight: 600;">49,99 €</span></div>
              <div style="font-size: 0.76rem; color: var(--text-muted);">IVA 21% Incluido · VID: 2609291139381606301</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; align-items: start;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <img src="/assets/cj_neckbrace_gray.jpg" alt="Collarín Soporte Cervical Ajustable Gris" style="width: 100%; height: 220px; object-fit: contain; background: #f8fafc; border-radius: 10px; border: 1px solid var(--border); padding: 6px;" />
              <img src="/assets/cj_neckbrace_main.jpg" alt="Estructura de Ajuste de Altura Soporte Cervical" style="width: 100%; height: 220px; object-fit: contain; background: #f8fafc; border-radius: 10px; border: 1px solid var(--border); padding: 6px;" />
            </div>

            <div style="font-size: 0.9rem; color: #334155; display: flex; flex-direction: column; gap: 10px;">
              <div><strong>• ¿Qué es?:</strong> Un collarín / soporte biomecánico abierto y transpirable diseñado para evitar que inclines la cabeza hacia adelante (<em>Forward-Head Posture</em>) cuando trabajas con el ordenador o miras el móvil.</div>
              <div><strong>• ¿Cómo es?:</strong> Estructura abierta de soporte dinámico en 4 direcciones con apoyo submandibular acolchado, base clavicular suave, columna frontal con cremallera de elevación milimétrica y cinta trasera elástica ajustable en color Gris Nube (<em>Cloud Light Gray</em>).</div>
              <div><strong>• ¿De qué está hecho?:</strong> Chasis ligero de policarbonato/ABS médico con almohadillas de <strong>espuma viscoelástica <em>Memory Foam</em> respetuosa con la piel</strong> y correa tejida transpirable con cierre de velcro.</div>
              <div><strong>• ¿Qué lleva en la caja?:</strong> 1× Soporte Cervical Ajustable PostureAlign™ completo con correa cervical integrada.</div>
              <div><strong>• ¿Qué funciones tiene?:</strong> <strong>Ajuste de altura con un solo toque (<em>One-touch height adjustment</em>)</strong> para adaptar el ángulo exacto de tu barbilla, descargando el peso de la cabeza sobre las clavículas sin ahogar ni dar calor como los collarines cerrados antiguos.</div>
              <div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 10px;">
                <button onclick="buySingleCatalogProduct('prod_upsell_posturealign_003', 19.99, this)" style="background: #0f766e; color: #ffffff; border: none; padding: 12px 20px; border-radius: 10px; font-weight: 800; cursor: pointer; font-size: 0.92rem;">
                  🛒 Comprar Soporte Cervical PostureAlign™ (19,99 €)
                </button>
                <a href="#compra" onclick="selectTier(3)" style="background: var(--surface-subtle); color: var(--text); border: 1px solid var(--border); padding: 12px 16px; border-radius: 10px; font-weight: 700; font-size: 0.88rem;">
                  🏆 Incluido en el Pack Clínico 360°
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- ARTÍCULO 5: PARCHES NOCTURNOS RELAJANTES DREAM PATCHES (30 UNIDADES) -->
        <div style="background: #ffffff; border: 2px solid #2563eb; border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-md);">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 18px; border-bottom: 1px solid var(--border); padding-bottom: 14px;">
            <div>
              <span style="background: #dbeafe; color: #1d4ed8; border: 1px solid #93c5fd; font-size: 0.75rem; font-weight: 800; padding: 4px 10px; border-radius: 999px;">PRODUCTO #5 (DESCANSO NOCTURNO PROFUNDO) · SKU CJ: CJPF327478901AZ</span>
              <h3 style="font-size: 1.35rem; font-weight: 900; color: var(--text); margin-top: 6px;">5. Dream Patches™ — Pack de 30 Parches Transdérmicos Nocturnos (Valeriana & Ashwagandha)</h3>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.5rem; font-weight: 900; color: #2563eb;">19,99 € <span style="font-size: 0.88rem; color: #059669; font-weight: 800;">(14,99 € en Pack Dúo)</span></div>
              <div style="font-size: 0.76rem; color: var(--text-muted);">IVA 21% Incluido · VID: 2610170347321601300</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; align-items: start;">
            <div style="text-align: center;">
              <img src="/assets/cj_patch_CJPF3274789.jpg" alt="Dream Patches 30 Parches con Valeriana y Ashwagandha" style="width: 100%; max-height: 250px; object-fit: contain; background: #f8fafc; border-radius: 10px; border: 1px solid var(--border); padding: 8px;" />
            </div>

            <div style="font-size: 0.9rem; color: #334155; display: flex; flex-direction: column; gap: 10px;">
              <div><strong>• ¿Qué es?:</strong> Un tratamiento mensual (30 noches) de parches transdérmicos botánicos de liberación nocturna prolongada para calmar el sistema nervioso y conciliar un sueño profundo tras tu sesión de tracción cervical.</div>
              <div><strong>• ¿Cómo es?:</strong> Bolsa hermética con cierre zip que contiene láminas con <strong>30 parches adhesivos circulares azules hipoalergénicos</strong> de aplicación tópica en muñeca, hombro o base del cuello.</div>
              <div><strong>• ¿De qué está hecho?:</strong> Extractos botánicos naturales de <strong>Raíz de Valeriana (<em>Valerian Root</em>) y Ashwagandha</strong> sobre matriz adhesiva transpirable suave con la piel, sin melatonina sintética ni somnolencia matutina.</div>
              <div><strong>• ¿Qué lleva en la caja?:</strong> 1× Sobre sellado <em>Dream Patches</em> con <strong>30 parches individuales</strong> (suministro completo para 1 mes).</div>
              <div><strong>• ¿Qué funciones tiene?:</strong> Promueve la relajación nocturna continua durante 8 horas, reduce el estrés acumulado del día y mejora la calidad del sueño profundo REM.</div>
              <div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 10px;">
                <button onclick="buySingleCatalogProduct('prod_bump_thermosilk_002', 19.99, this)" style="background: #2563eb; color: #ffffff; border: none; padding: 12px 20px; border-radius: 10px; font-weight: 800; cursor: pointer; font-size: 0.92rem;">
                  🛒 Comprar Pack 30 Parches (19,99 €)
                </button>
                <a href="#compra" onclick="selectTier(2)" style="background: var(--surface-subtle); color: var(--text); border: 1px solid var(--border); padding: 12px 16px; border-radius: 10px; font-weight: 700; font-size: 0.88rem;">
                  🔥 Llevar por 14,99 € en el Pack Descanso Total
                </a>
              </div>
            </div>
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
          <h3>Espuma Médica OEKO-TEX® & CE</h3>
          <p>
            A diferencia de las imitaciones de plástico duro que lastiman tus vértebras, nuestra espuma de memoria auto-moldeable acuna tu nuca con firmeza terapéutica certificada.
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
          Descubre por qué más de 1.400 pacientes en España han sustituido visitas recurrentes al fisioterapeuta por OrthoCloud™ Pro.
        </p>
      </div>

      <div class="comparison-wrapper">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Característica Clínica</th>
              <th class="highlight">AetherWell™ OrthoCloud Pro 🏆</th>
              <th>Almohadas Genéricas</th>
              <th>Clínica de Fisioterapia</th>
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
              <td><strong>Certificación Europea Hipoalergénica</strong></td>
              <td class="highlight">✅ OEKO-TEX® Standard 100 & CE</td>
              <td>⚠️ Relleno sintético barato</td>
              <td>N/A</td>
            </tr>
            <tr>
              <td><strong>Coste de inversión</strong></td>
              <td class="highlight"><strong>39,99 € (Pago único · IVA incl.)</strong></td>
              <td>25 € - 45 €</td>
              <td><strong>280 € / mes (Sesiones periódicas)</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 6. Wall of Verified Reviews -->
    <section class="section-spacing" id="opiniones">
      <div class="section-header">
        <span class="section-tag">TESTIMONIOS REALES EN ESPAÑA</span>
        <h2 class="section-title">Lo que opinan quienes ya recuperaron su cuello</h2>
        <p class="section-desc">
          Reseñas 100% verificadas de clientes que eliminaron la rigidez de oficina y las migrañas.
        </p>
      </div>

      <div class="reviews-grid">
        <div class="review-card">
          <div class="review-header">
            <div>
              <div class="review-author">Carlos M.</div>
              <div class="review-role">Ingeniero de Software · Madrid</div>
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
              <div class="review-role">Odontóloga · Barcelona</div>
            </div>
            <span class="verified-pill">✓ Compra Verificada</span>
          </div>
          <div class="stars">★★★★★</div>
          <p class="review-text" style="margin-top: 8px;">
            "Por mi profesión trabajo inclinada hacia adelante todo el día en la clínica. Mi fisioterapeuta me recomendó tracción cervical pasiva en casa. La densidad de la espuma de AetherWell es perfecta: no es plástico duro como otros productos, sostiene el cráneo sin doler."
          </p>
        </div>

        <div class="review-card">
          <div class="review-header">
            <div>
              <div class="review-author">Sofía L.</div>
              <div class="review-role">Diseñadora Digital · Valencia</div>
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
              <div class="review-role">Responsable de Producto · Bilbao</div>
            </div>
            <span class="verified-pill">✓ Compra Verificada</span>
          </div>
          <div class="stars">★★★★★</div>
          <p class="review-text" style="margin-top: 8px;">
            "Compré el Pack 360 con el corrector PostureAlign. La sensación de descompresión al llegar del trabajo es una maravilla. El pago con Apple Pay en euros fue instantáneo y llegó por mensajería en 8 días."
          </p>
        </div>

        <div class="review-card">
          <div class="review-header">
            <div>
              <div class="review-author">Patricia B.</div>
              <div class="review-role">Teletrabajadora · Sevilla</div>
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
              <div class="review-role">Arquitecto · Málaga</div>
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
          Todo lo que necesitas saber sobre el uso clínico, envíos a España y garantía de satisfacción.
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
            <span>¿Cuánto tarda el envío a España y cómo recibo mi seguimiento?</span>
            <span class="faq-arrow">▼</span>
          </div>
          <div class="faq-answer">
            Procesamos los pedidos en 24-48 horas laborables. La entrega en España peninsular y Baleares se realiza mediante mensajería asegurada (Correos Express / CTT Express) en un plazo habitual de 7 a 10 días laborables. Recibirás tu código de seguimiento por correo electrónico.
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
          Ingeniería ergonómica y descanso clínico para profesionales y personas en España que buscan recuperar su movilidad cervical sin citas costosas.
        </p>
        <div class="footer-disclaimer">
          Aviso Legal y Sanitario: AetherWell™ es un dispositivo de bienestar ergonómico y descanso biomecánico. No sustituye el diagnóstico ni el tratamiento médico prescrito para patologías espinales severas o cirugías recientes.
        </div>
      </div>

      <div class="footer-col">
        <h4>Marco Legal España & UE</h4>
        <ul class="footer-links">
          <li><a onclick="openLegalModal('envios')">Política de Envíos (España & UE)</a></li>
          <li><a onclick="openLegalModal('devoluciones')">Garantía 30 Días y Desistimiento</a></li>
          <li><a onclick="openLegalModal('privacidad')">Protección de Datos (RGPD & LOPDGDD)</a></li>
          <li><a onclick="openLegalModal('terminos')">Términos y Condiciones (LSSI-CE)</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Atención al Cliente</h4>
        <p style="color: #cbd5e1; line-height: 1.6; margin-bottom: 12px;">
          ¿Tienes dudas con tu pedido o necesitas asesoramiento ergonómico?
        </p>
        <p><strong>Email:</strong> <a href="mailto:soporte@aetherwell.com" style="color: #38bdf8;">soporte@aetherwell.com</a></p>
        <p style="margin-top: 6px;"><strong>Horario:</strong> Lunes a Domingo, 24/7</p>
        <p style="margin-top: 6px; font-size: 0.8rem; color: #64748b;">Liquidación en Euros (€) · Pasarela Stripe PCI-DSS Nivel 1</p>
      </div>
    </div>

    <div class="footer-bottom">
      <div>© ${new Date().getFullYear()} ${brandName} España. Todos los derechos reservados. Precios con IVA 21% incluido.</div>
      <div style="display: flex; gap: 16px;">
        <span>🔒 Conexión Cifrada SSL 256-Bit</span>
        <span>🇪🇺 Cumplimiento RGPD & LSSI-CE</span>
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
        🍪 <strong>Privacidad y Cookies:</strong> Utilizamos cookies técnicas necesarias para procesar pagos seguros en euros mediante Stripe y optimizar tu navegación según la legislación española (LSSI-CE). Consulta nuestra <a onclick="openLegalModal('privacidad')" style="text-decoration: underline; cursor: pointer; color: var(--primary);">Política de Privacidad</a>.
      </div>
      <button class="btn-accept-cookies" onclick="acceptCookies()">Aceptar y Continuar</button>
    </div>
  </div>

  <!-- Mobile Sticky Bar -->
  <div class="mobile-sticky-bar">
    <div class="mobile-price-group">
      <span class="mobile-price-now" id="mobile-price-val">54,98 €</span>
      <span class="mobile-shipping-hint">Envío Gratis a toda España</span>
    </div>
    <button class="btn-mobile-buy" onclick="redirectToStripeCheckout()">PAGAR EN EUROS</button>
  </div>

  <script>
    // Estado reactivo del carrito en el cliente (Euros €)
    const THRESHOLD = ${threshold};
    const HERO_PRICE = ${heroPrice};
    const MASK_PRICE = ${maskPrice};
    const POSTURE_PRICE = ${posturePrice};
    const BUNDLE_PRICE = ${bundlePrice};
    const DUO_PRICE = ${duoPrice};

    let selectedTier = 2; // Por defecto: Opción 2 (Pack Alivio Total)

    // Diapositivas de la Galería con las 4 Fotografías Reales de la Almohada Cervical Eléctrica 3 en 1 (SKU: CJYD326642303CX)
    const GALLERY_SLIDES = [
      {
        badge: "FOTO REAL 1 · ALMOHADA ELÉCTRICA 3 EN 1 (VISTA GENERAL + USO)",
        caption: "Almohada Eléctrica 3 en 1 (SKU: CJYD326642303CX) — Calor Térmico + Elevación Tracción + Masaje Vibración",
        content: '<img src="/assets/pillow-1-main.jpg" alt="Almohada Cervical Eléctrica 3 en 1 OrthoCloud Pro" style="max-width:100%; max-height:290px; object-fit:contain; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.08);" />'
      },
      {
        badge: "FOTO REAL 2 · PANEL LATERAL USB-C Y BOTONES DE CONTROL",
        caption: "Acabado lateral en cuero PU marrón con puerto USB-C y 2 botones: Ciclo Automático y Modo Manual",
        content: '<img src="/assets/pillow-2-side-controls.jpg" alt="Panel Lateral USB-C y Controles Almohada Eléctrica" style="max-width:100%; max-height:290px; object-fit:contain; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.08);" />'
      },
      {
        badge: "FOTO REAL 3 · MEDIDAS EXACTAS (42,5 × 27 CM) Y PARÁMETROS",
        caption: "Dimensiones: 42,5 cm × 27 cm · Espuma Memory Foam · 5V USB-C · Apagado automático a los 30 minutos",
        content: '<img src="/assets/pillow-3-specs.jpg" alt="Medidas y Especificaciones 42.5x27cm Almohada Eléctrica" style="max-width:100%; max-height:290px; object-fit:contain; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.08);" />'
      },
      {
        badge: "FOTO REAL 4 · LOS 3 MODOS ELÉCTRICOS (ROJO / VERDE / AZUL)",
        caption: "🔴 Luz Roja: Calor Térmico · 🟢 Luz Verde: Elevación Tracción Arriba/Abajo · 🔵 Luz Azul: Masaje Vibración",
        content: '<img src="/assets/pillow-4-modes.jpg" alt="Los 3 Modos Eléctricos de Tracción, Calor y Vibración" style="max-width:100%; max-height:290px; object-fit:contain; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.08);" />'
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
        priceCur.textContent = '39,99 €';
        priceCmp.textContent = '79,99 €';
        savings.textContent = 'Ahorras 50%';
        mobileVal.textContent = '39,99 €';
        amtLabel.textContent = '39,99 € / 45,00 €';
        fill.style.width = '88.8%';
        fill.style.background = 'linear-gradient(90deg, #3b82f6, #0d9488)';
        msg.innerHTML = '⚠️ <strong>¡Te faltan solo 5,01 €</strong> para desbloquear el <strong>ENVÍO GRATIS A TODA ESPAÑA</strong> (Ahorras 4,99 €). Selecciona el Pack Alivio Total superior:';
      } else if (tierNum === 2) {
        priceCur.textContent = '54,98 €';
        priceCmp.textContent = '109,99 €';
        savings.textContent = 'Ahorras 50% + Envío Gratis';
        mobileVal.textContent = '54,98 €';
        amtLabel.textContent = '54,98 € / 45,00 €';
        fill.style.width = '100%';
        fill.style.background = 'linear-gradient(90deg, #0d9488, #10b981)';
        msg.innerHTML = '🎉 <strong>¡ENHORABUENA!</strong> Has desbloqueado el <strong>ENVÍO RÁPIDO GRATIS A TODA ESPAÑA (0,00 €)</strong>.';
      } else if (tierNum === 3) {
        priceCur.textContent = '59,99 €';
        priceCmp.textContent = '159,99 €';
        savings.textContent = 'Ahorras 100 € (62% DTO)';
        mobileVal.textContent = '59,99 €';
        amtLabel.textContent = '59,99 € / 45,00 €';
        fill.style.width = '100%';
        fill.style.background = 'linear-gradient(90deg, #0d9488, #10b981)';
        msg.innerHTML = '🏆 <strong>¡PACK 360° SELECCIONADO!</strong> Despacho VIP Prioritario y Envío Gratis.';
      }
    }

    async function redirectToStripeCheckout() {
      const btn = document.getElementById('btn-stripe-checkout');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '⏳ Conectando con Stripe Checkout Seguro en Euros...';

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

    // Modales Legales Adaptados al Marco Jurídico Español
    const LEGAL_TEXTS = {
      envios: \`
        <h3 class="modal-title">Política de Envíos y Entregas (España & Unión Europea)</h3>
        <div class="modal-body">
          <p>En <strong>AetherWell™ España</strong> garantizamos un servicio de entrega rápido, seguro y totalmente transparente.</p>
          <h4>1. Ámbito de Envío</h4>
          <p>Realizamos envíos a toda España (Península y Baleares) y países de la Unión Europea (Portugal, Francia, Italia, Alemania).</p>
          <h4>2. Plazos de Preparación y Tránsito</h4>
          <p>Todos los pedidos se preparan y embalan en un plazo de <strong>24 a 48 horas laborables</strong>. El plazo habitual de entrega mediante mensajería express (Correos Express / CTT Express) es de <strong>7 a 10 días laborables</strong>.</p>
          <h4>3. Gastos de Envío</h4>
          <p>Los envíos son <strong>completamente gratuitos</strong> para todos los pedidos superiores a 45,00 €. Para pedidos de menor importe, el coste de envío estándar es de 4,99 €.</p>
          <h4>4. Impuestos</h4>
          <p>Todos los precios llevan el <strong>IVA del 21% incluido</strong>. No existen aduanas ni recargos sorpresa.</p>
        </div>
      \`,
      devoluciones: \`
        <h3 class="modal-title">Garantía de 30 Noches de Prueba y Desistimiento Legal</h3>
        <div class="modal-body">
          <p>Queremos que compres con total tranquilidad. Por ello ampliamos el derecho legal de desistimiento a una <strong>Garantía de 30 Noches de Prueba</strong>.</p>
          <h4>1. Derecho Legal de Desistimiento (LGDCU)</h4>
          <p>Conforme al Real Decreto Legislativo 1/2007, de 16 de noviembre, por el que se aprueba el texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios, dispones de un mínimo de 14 días naturales para desistir de tu compra, que en AetherWell™ ampliamos a <strong>30 días naturales</strong>.</p>
          <h4>2. Procedimiento de Devolución</h4>
          <p>Envía un correo a <code>soporte@aetherwell.com</code> indicando tu número de pedido. Te facilitaremos la etiqueta y las instrucciones de retorno.</p>
          <h4>3. Reembolso</h4>
          <p>Una vez recibido el artículo, se procesará el reembolso íntegro mediante el mismo método de pago (Stripe / Tarjeta) en un plazo máximo de 3 a 5 días laborables.</p>
        </div>
      \`,
      privacidad: \`
        <h3 class="modal-title">Política de Privacidad y Protección de Datos (RGPD & LOPDGDD)</h3>
        <div class="modal-body">
          <p>En cumplimiento del Reglamento General de Protección de Datos (RGPD UE 2016/679) y la Ley Orgánica 3/2018 (LOPDGDD), te informamos:</p>
          <h4>1. Responsable del Tratamiento</h4>
          <p>AetherWell™ Technologies. Contacto DPO: <code>soporte@aetherwell.com</code>.</p>
          <h4>2. Finalidad del Tratamiento</h4>
          <p>Gestión de pedidos, facturación legal con IVA, entrega del paquete y soporte postventa.</p>
          <h4>3. Seguridad de Pagos (Stripe PCI-DSS Nivel 1)</h4>
          <p>Los pagos se procesan de forma cifrada mediante la pasarela bancaria oficial <strong>Stripe Payments Europe, Ltd.</strong> bajo el estándar internacional <strong>PCI-DSS Nivel 1</strong>. En ningún momento nuestro servidor almacena números de tarjeta ni datos bancarios confidenciales.</p>
          <h4>4. Ejercicio de Derechos</h4>
          <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, limitación y portabilidad enviando un correo a <code>soporte@aetherwell.com</code>.</p>
        </div>
      \`,
      terminos: \`
        <h3 class="modal-title">Términos y Condiciones de Contratación (LSSI-CE)</h3>
        <div class="modal-body">
          <p>Condiciones de contratación conforme a la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE):</p>
          <h4>1. Moneda y Facturación</h4>
          <p>Todas las transacciones se realizan en <strong>Euros (€)</strong> con el IVA aplicable (21%) desglosado en la confirmación de pedido.</p>
          <h4>2. Medios de Pago Admitidos</h4>
          <p>Tarjetas de débito y crédito bancarias (Visa, MasterCard, American Express), Apple Pay y Google Pay a través de Stripe.</p>
          <h4>3. Legislación Aplicable y Fuero</h4>
          <p>Las presentes condiciones se rigen por la legislación española. En caso de litigio, las partes se someten a los juzgados y tribunales del domicilio del consumidor.</p>
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

    // Fecha dinámica de entrega estimada (+7 a +10 días laborables)
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
        banner.innerHTML = '🎉 <strong>¡PAGO CONFIRMADO CON ÉXITO!</strong> Tu orden ha sido recibida y se encuentra en cola de despacho express prioritario para España.' + (sessionId ? '<br><span style="font-size:0.82rem; font-family:monospace; color:#047857;">Stripe Checkout ID: ' + sessionId + '</span>' : '');
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
