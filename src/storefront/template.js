/**
 * @fileoverview Storefront AetherWell — Tienda de Gadgets, Iluminación & Hogar (España).
 * Diseño natural, limpio, atemporal y modular alimentado dinámicamente desde `data/catalog.json`.
 * Cero emojis, cero urgencia artificial, cero códigos internos de proveedor en la vista del cliente.
 */

function formatEuro(amount) {
  return Number(amount || 0).toFixed(2).replace('.', ',') + ' €';
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderHighConvertingStorefront(catalogData = {}, kycStatus = {}, ledger = null, operationalEnv = null) {
  const { metadata = {}, products = [] } = catalogData;
  const brandName = (metadata.brandName || 'AetherWell').replace(/™/g, '').trim();
  const threshold = Number(metadata.freeShippingThresholdUsd || 45.0);
  const standardShipping = Number(metadata.standardShippingFeeUsd || 4.99);

  // Filtrar los artículos físicos principales del catálogo (excluyendo garantías digitales internas y bundles globales de la cuadrícula principal)
  const displayProducts = products.filter(
    (p) => p.id !== 'prod_warranty_vip_03' && p.role !== 'bundle_complete'
  );

  // Preparar datos limpios para el cliente (sin exponer jamás SKU, VID, PID ni nombres de proveedores)
  const clientCatalog = displayProducts.map((p, index) => {
    const cleanTitle = String(p.title || p.name || `Artículo ${index + 1}`).replace(/™/g, '').trim();
    const images = Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : ['/assets/xmas-01-curtain-lights.jpg'];
    const specs = p.specs || {
      que_es: p.description || cleanTitle,
      como_es: (p.features && p.features[0]) || 'Dimensiones estándar verificadas para uso doméstico.',
      materiales: (p.features && p.features[1]) || 'Materiales de alta durabilidad y acabado técnico.',
      caja: '1 unidad completa con accesorios de alimentación y manual de usuario.',
      funciones: (p.features && p.features[2]) || 'Funcionamiento inmediato, bajo consumo energético y garantía oficial.'
    };

    return {
      id: p.id,
      index: index + 1,
      title: cleanTitle,
      shortName: String(p.shortName || cleanTitle).replace(/™/g, '').trim(),
      category: p.category || 'Iluminación & Ambiente',
      shortSummary: String(p.shortSummary || p.description || cleanTitle).replace(/™/g, '').trim(),
      price: Number(p.price || 24.99),
      compareAtPrice: Number(p.compareAtPrice || +(Number(p.price || 24.99) * 1.8).toFixed(2)),
      images,
      specs,
      features: Array.isArray(p.features) ? p.features : []
    };
  });

  const productCardsHtml = clientCatalog
    .map((item) => {
      const photoButtonsHtml = item.images.length > 1
        ? `<div class="card-photo-switcher" role="group" aria-label="Selector de fotografías">
            ${item.images
              .map(
                (imgUrl, idx) => `
              <button type="button" class="photo-pill ${idx === 0 ? 'active' : ''}" onclick="switchCardPhoto('${escapeHtml(item.id)}', ${idx}, '${escapeHtml(imgUrl)}', this)">
                Foto ${idx + 1}
              </button>`
              )
              .join('')}
          </div>`
        : '';

      return `
        <article class="product-card" data-product-id="${escapeHtml(item.id)}" data-category="${escapeHtml(item.category)}" data-search="${escapeHtml((item.title + ' ' + item.shortSummary + ' ' + item.category).toLowerCase())}">
          <div class="card-media">
            <img id="card-img-${escapeHtml(item.id)}" src="${escapeHtml(item.images[0])}" alt="${escapeHtml(item.title)}" loading="lazy" onclick="openProductModal('${escapeHtml(item.id)}')" />
            ${photoButtonsHtml}
          </div>

          <div class="card-body">
            <div class="card-category">${escapeHtml(item.category)}</div>
            <h3 class="card-title" onclick="openProductModal('${escapeHtml(item.id)}')">${escapeHtml(item.title)}</h3>
            <p class="card-summary">${escapeHtml(item.shortSummary)}</p>

            <div class="card-price-row">
              <div class="card-price-group">
                <span class="card-price-current">${formatEuro(item.price)}</span>
                ${item.compareAtPrice > item.price ? `<span class="card-price-compare">${formatEuro(item.compareAtPrice)}</span>` : ''}
              </div>
              <span class="card-tax-note">IVA incl.</span>
            </div>

            <button type="button" class="btn-spec-trigger" onclick="openProductModal('${escapeHtml(item.id)}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <span>Ver ficha técnica y detalles</span>
            </button>

            <details class="card-inline-specs">
              <summary>Resumen rápido de especificaciones (5 puntos)</summary>
              <div class="inline-specs-content">
                <p><strong>1. ¿Qué es?:</strong> ${escapeHtml(item.specs.que_es)}</p>
                <p><strong>2. ¿Cómo es y qué medidas tiene?:</strong> ${escapeHtml(item.specs.como_es)}</p>
                <p><strong>3. ¿De qué está hecho?:</strong> ${escapeHtml(item.specs.materiales)}</p>
                <p><strong>4. ¿Qué lleva en la caja?:</strong> ${escapeHtml(item.specs.caja)}</p>
                <p><strong>5. ¿Qué funciones tiene?:</strong> ${escapeHtml(item.specs.funciones)}</p>
              </div>
            </details>

            <div class="card-actions">
              <button type="button" class="btn-add-cart" onclick="addToCart('${escapeHtml(item.id)}', 1)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span>Añadir a la cesta</span>
              </button>
              <button type="button" class="btn-quick-buy" onclick="buySingleCatalogProduct('${escapeHtml(item.id)}', ${item.price}, this)">
                Compra rápida
              </button>
            </div>
          </div>
        </article>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(brandName)} | Gadgets, Iluminación & Hogar</title>
  <meta name="description" content="AetherWell España: Tienda online de iluminación ambiental, gadgets de electrónica ligera y confort para el hogar. Especificaciones verificadas, pago seguro con Stripe y envío a toda España." />
  <meta name="robots" content="index, follow" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${escapeHtml(brandName)}" />
  <meta property="og:title" content="${escapeHtml(brandName)} — Gadgets, Iluminación & Hogar" />
  <meta property="og:description" content="Artículos de iluminación ambiental, electrónica funcional y confort para el hogar. Envío gratuito en pedidos superiores a 45 € y garantía oficial de 30 días." />
  <meta property="og:image" content="/assets/xmas-01-curtain-lights.jpg" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <style>
    :root {
      --bg-white: #FFFFFF;
      --bg-stone: #F7F7F8;
      --bg-stone-hover: #EFEFF1;
      --text-main: #111827;
      --text-muted: #4B5563;
      --text-light: #6B7280;
      --accent-dark: #111827;
      --accent-slate: #1E293B;
      --border-light: #E5E7EB;
      --border-medium: #D1D5DB;
      --success-text: #065F46;
      --success-bg: #ECFDF5;
      --radius-sm: 6px;
      --radius-md: 8px;
      --radius-lg: 12px;
      --shadow-subtle: 0 1px 3px rgba(17, 24, 39, 0.05);
      --shadow-card: 0 4px 16px rgba(17, 24, 39, 0.06);
      --shadow-modal: 0 20px 45px rgba(17, 24, 39, 0.16);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--bg-white);
      color: var(--text-main);
      line-height: 1.55;
      -webkit-font-smoothing: antialiased;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    button {
      font-family: inherit;
    }

    .container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* 1. Top Announcement Bar */
    .top-bar {
      background-color: var(--bg-stone);
      color: var(--text-muted);
      font-size: 0.8rem;
      font-weight: 500;
      padding: 9px 16px;
      text-align: center;
      border-bottom: 1px solid var(--border-light);
      letter-spacing: 0.01em;
    }

    /* 2. Store Header */
    .site-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background-color: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border-light);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      min-height: 72px;
      padding: 12px 0;
    }

    .brand-block {
      display: flex;
      flex-direction: column;
      cursor: pointer;
    }

    .brand-logo {
      font-size: 1.35rem;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--text-main);
      line-height: 1.15;
    }

    .brand-subtitle {
      font-size: 0.72rem;
      color: var(--text-light);
      font-weight: 500;
      letter-spacing: 0.02em;
    }

    .header-nav {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .nav-cat-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 0.875rem;
      font-weight: 500;
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: color 0.15s ease, background-color 0.15s ease;
    }

    .nav-cat-btn:hover {
      color: var(--text-main);
      background-color: var(--bg-stone);
    }

    .nav-cat-btn.active {
      color: var(--text-main);
      background-color: var(--bg-stone);
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-box svg {
      position: absolute;
      left: 11px;
      color: var(--text-light);
      pointer-events: none;
    }

    .search-input {
      background-color: var(--bg-stone);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      padding: 8px 12px 8px 34px;
      font-size: 0.85rem;
      color: var(--text-main);
      width: 210px;
      transition: border-color 0.15s ease, background-color 0.15s ease;
    }

    .search-input:focus {
      outline: none;
      background-color: var(--bg-white);
      border-color: var(--text-main);
    }

    .cart-trigger-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background-color: var(--accent-dark);
      color: #FFFFFF;
      border: 1px solid var(--accent-dark);
      border-radius: var(--radius-md);
      padding: 8px 14px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .cart-trigger-btn:hover {
      background-color: var(--accent-slate);
    }

    /* Stripe Status Notification */
    #stripe-status-banner {
      display: none;
      margin: 20px 0 0;
      padding: 16px 20px;
      border-radius: var(--radius-md);
      font-size: 0.9rem;
    }

    /* 3. Sober Minimalist Hero Section */
    .store-hero {
      background-color: var(--bg-stone);
      border-bottom: 1px solid var(--border-light);
      padding: 52px 0 44px;
    }

    .hero-inner {
      max-width: 780px;
    }

    .hero-eyebrow {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      margin-bottom: 12px;
    }

    .hero-title {
      font-size: clamp(1.85rem, 3.2vw, 2.5rem);
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: -0.025em;
      line-height: 1.2;
      margin-bottom: 14px;
    }

    .hero-description {
      font-size: 1rem;
      color: var(--text-muted);
      max-width: 660px;
      margin-bottom: 24px;
    }

    .hero-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn-primary-hero {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background-color: var(--accent-dark);
      color: #FFFFFF;
      padding: 11px 20px;
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      font-weight: 600;
      transition: background-color 0.15s ease;
    }

    .btn-primary-hero:hover {
      background-color: var(--accent-slate);
    }

    .btn-secondary-hero {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background-color: var(--bg-white);
      color: var(--text-main);
      border: 1px solid var(--border-medium);
      padding: 11px 18px;
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .btn-secondary-hero:hover {
      background-color: var(--bg-stone-hover);
    }

    /* 4. Catalog Toolbar & Filter Pills */
    .catalog-section {
      padding: 40px 0 64px;
    }

    .catalog-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 28px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-light);
    }

    .filter-pills {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .filter-pill {
      background-color: var(--bg-stone);
      color: var(--text-muted);
      border: 1px solid var(--border-light);
      padding: 7px 14px;
      border-radius: var(--radius-md);
      font-size: 0.84rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .filter-pill:hover {
      color: var(--text-main);
      border-color: var(--border-medium);
    }

    .filter-pill.active {
      background-color: var(--accent-dark);
      color: #FFFFFF;
      border-color: var(--accent-dark);
    }

    .catalog-count {
      font-size: 0.85rem;
      color: var(--text-light);
      font-weight: 500;
    }

    /* 5. Product Grid & Cards */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 28px;
    }

    .product-card {
      background-color: var(--bg-white);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: box-shadow 0.2s ease, border-color 0.2s ease;
    }

    .product-card:hover {
      box-shadow: var(--shadow-card);
      border-color: var(--border-medium);
    }

    .card-media {
      position: relative;
      background-color: var(--bg-stone);
      aspect-ratio: 1 / 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      border-bottom: 1px solid var(--border-light);
    }

    .card-media img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .card-media img:hover {
      transform: scale(1.015);
    }

    .card-photo-switcher {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      display: inline-flex;
      gap: 4px;
      background-color: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(6px);
      padding: 4px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-light);
      box-shadow: var(--shadow-subtle);
    }

    .photo-pill {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 0.72rem;
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .photo-pill:hover {
      color: var(--text-main);
    }

    .photo-pill.active {
      background-color: var(--accent-dark);
      color: #FFFFFF;
      font-weight: 600;
    }

    .card-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .card-category {
      font-size: 0.74rem;
      font-weight: 600;
      color: var(--text-light);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }

    .card-title {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--text-main);
      line-height: 1.35;
      margin-bottom: 8px;
      cursor: pointer;
    }

    .card-title:hover {
      color: var(--accent-slate);
    }

    .card-summary {
      font-size: 0.86rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .card-price-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid var(--border-light);
      margin-bottom: 14px;
    }

    .card-price-group {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .card-price-current {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .card-price-compare {
      font-size: 0.85rem;
      color: var(--text-light);
      text-decoration: line-through;
    }

    .card-tax-note {
      font-size: 0.74rem;
      color: var(--text-light);
    }

    .btn-spec-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
      background-color: var(--bg-stone);
      color: var(--text-main);
      border: 1px solid var(--border-light);
      padding: 9px 12px;
      border-radius: var(--radius-md);
      font-size: 0.82rem;
      font-weight: 500;
      cursor: pointer;
      margin-bottom: 8px;
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }

    .btn-spec-trigger:hover {
      background-color: var(--bg-stone-hover);
      border-color: var(--border-medium);
    }

    .card-inline-specs {
      margin-bottom: 12px;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      background-color: var(--bg-stone);
      font-size: 0.8rem;
    }

    .card-inline-specs summary {
      padding: 8px 12px;
      cursor: pointer;
      font-weight: 500;
      color: var(--text-muted);
      list-style: none;
    }

    .card-inline-specs summary::-webkit-details-marker {
      display: none;
    }

    .inline-specs-content {
      padding: 10px 12px 12px;
      border-top: 1px solid var(--border-light);
      color: var(--text-muted);
      display: flex;
      flex-direction: column;
      gap: 6px;
      line-height: 1.45;
      background-color: var(--bg-white);
      border-radius: 0 0 var(--radius-md) var(--radius-md);
    }

    .inline-specs-content strong {
      color: var(--text-main);
    }

    .card-actions {
      display: grid;
      grid-template-columns: 1.35fr 1fr;
      gap: 8px;
    }

    .btn-add-cart {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background-color: var(--accent-dark);
      color: #FFFFFF;
      border: 1px solid var(--accent-dark);
      padding: 10px 14px;
      border-radius: var(--radius-md);
      font-size: 0.84rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .btn-add-cart:hover {
      background-color: var(--accent-slate);
    }

    .btn-quick-buy {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: var(--bg-white);
      color: var(--text-main);
      border: 1px solid var(--border-medium);
      padding: 10px 12px;
      border-radius: var(--radius-md);
      font-size: 0.84rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }

    .btn-quick-buy:hover {
      background-color: var(--bg-stone);
      border-color: var(--text-main);
    }

    .empty-search-state {
      display: none;
      text-align: center;
      padding: 48px 20px;
      background-color: var(--bg-stone);
      border-radius: var(--radius-lg);
      color: var(--text-muted);
    }

    /* 6. Product Detail Modal (5-Section Technical Sheet) */
    .product-modal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 250;
      background-color: rgba(17, 24, 39, 0.55);
      backdrop-filter: blur(4px);
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .product-modal-card {
      background-color: var(--bg-white);
      border-radius: var(--radius-lg);
      max-width: 920px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-modal);
      border: 1px solid var(--border-light);
      position: relative;
    }

    .modal-header-bar {
      position: sticky;
      top: 0;
      z-index: 10;
      background-color: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      border-bottom: 1px solid var(--border-light);
    }

    .modal-header-cat {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-light);
    }

    .modal-close-icon {
      background: var(--bg-stone);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      width: 34px;
      height: 34px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--text-main);
    }

    .modal-grid {
      display: grid;
      grid-template-columns: 1fr 1.15fr;
      gap: 28px;
      padding: 24px;
    }

    .modal-gallery-main {
      background-color: var(--bg-stone);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      aspect-ratio: 1 / 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      margin-bottom: 12px;
    }

    .modal-gallery-main img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: var(--radius-sm);
    }

    .modal-thumbs {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .modal-thumb-btn {
      width: 64px;
      height: 64px;
      padding: 4px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-light);
      background-color: var(--bg-stone);
      cursor: pointer;
    }

    .modal-thumb-btn.active {
      border-color: var(--accent-dark);
      border-width: 2px;
    }

    .modal-thumb-btn img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .modal-info-title {
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 8px;
      line-height: 1.3;
    }

    .modal-info-price-bar {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border-light);
    }

    .modal-price-now {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .modal-price-old {
      font-size: 0.95rem;
      color: var(--text-light);
      text-decoration: line-through;
    }

    .modal-specs-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 22px;
    }

    .modal-spec-box {
      background-color: var(--bg-stone);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      padding: 12px 14px;
    }

    .modal-spec-box h4 {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 4px;
    }

    .modal-spec-box p {
      font-size: 0.84rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .modal-cta-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    /* 7. Side Cart Drawer */
    .cart-drawer-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 300;
      background-color: rgba(17, 24, 39, 0.45);
      backdrop-filter: blur(2px);
    }

    .cart-drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      max-width: 420px;
      z-index: 310;
      background-color: var(--bg-white);
      border-left: 1px solid var(--border-light);
      box-shadow: var(--shadow-modal);
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.22s ease;
    }

    .cart-drawer.open {
      transform: translateX(0);
    }

    .cart-drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 20px;
      border-bottom: 1px solid var(--border-light);
    }

    .cart-drawer-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .cart-shipping-banner {
      background-color: var(--bg-stone);
      padding: 12px 20px;
      border-bottom: 1px solid var(--border-light);
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .cart-shipping-bar-bg {
      height: 6px;
      background-color: var(--border-light);
      border-radius: 999px;
      overflow: hidden;
      margin-top: 8px;
    }

    .cart-shipping-bar-fill {
      height: 100%;
      background-color: var(--accent-dark);
      width: 0%;
      transition: width 0.25s ease;
    }

    .cart-items-container {
      flex: 1;
      overflow-y: auto;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .cart-empty-msg {
      text-align: center;
      color: var(--text-light);
      font-size: 0.9rem;
      padding: 48px 16px;
    }

    .cart-item-row {
      display: grid;
      grid-template-columns: 64px 1fr;
      gap: 12px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border-light);
    }

    .cart-item-img {
      width: 64px;
      height: 64px;
      object-fit: contain;
      background-color: var(--bg-stone);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-sm);
      padding: 4px;
    }

    .cart-item-title {
      font-size: 0.86rem;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 4px;
      line-height: 1.3;
    }

    .cart-item-price {
      font-size: 0.84rem;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .cart-item-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .qty-stepper {
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-sm);
      background-color: var(--bg-stone);
    }

    .qty-btn {
      background: transparent;
      border: none;
      width: 26px;
      height: 26px;
      cursor: pointer;
      font-weight: 600;
      color: var(--text-main);
    }

    .qty-val {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0 8px;
    }

    .cart-remove-btn {
      background: transparent;
      border: none;
      color: var(--text-light);
      font-size: 0.76rem;
      cursor: pointer;
      text-decoration: underline;
    }

    .cart-drawer-footer {
      padding: 18px 20px;
      border-top: 1px solid var(--border-light);
      background-color: var(--bg-stone);
    }

    .cart-summary-line {
      display: flex;
      justify-content: space-between;
      font-size: 0.86rem;
      color: var(--text-muted);
      margin-bottom: 6px;
    }

    .cart-summary-total {
      display: flex;
      justify-content: space-between;
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-main);
      margin: 10px 0 14px;
      padding-top: 10px;
      border-top: 1px solid var(--border-light);
    }

    .btn-checkout-stripe {
      width: 100%;
      background-color: var(--accent-dark);
      color: #FFFFFF;
      border: 1px solid var(--accent-dark);
      padding: 13px 16px;
      border-radius: var(--radius-md);
      font-size: 0.92rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background-color 0.15s ease;
    }

    .btn-checkout-stripe:hover {
      background-color: var(--accent-slate);
    }

    .btn-checkout-stripe:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    /* 8. Trust & Service Section */
    .trust-section {
      background-color: var(--bg-stone);
      border-top: 1px solid var(--border-light);
      border-bottom: 1px solid var(--border-light);
      padding: 56px 0;
    }

    .trust-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
    }

    .trust-item {
      background-color: var(--bg-white);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      padding: 22px;
    }

    .trust-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      background-color: var(--bg-stone);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--text-main);
      margin-bottom: 12px;
    }

    .trust-item h3 {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 6px;
    }

    .trust-item p {
      font-size: 0.84rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    /* 9. Sober FAQ Section */
    .faq-section {
      padding: 56px 0;
    }

    .section-heading {
      max-width: 640px;
      margin-bottom: 28px;
    }

    .section-heading h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }

    .section-heading p {
      font-size: 0.92rem;
      color: var(--text-muted);
    }

    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 820px;
    }

    .faq-item {
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      background-color: var(--bg-white);
    }

    .faq-item summary {
      padding: 16px 18px;
      font-size: 0.92rem;
      font-weight: 600;
      color: var(--text-main);
      cursor: pointer;
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .faq-item summary::-webkit-details-marker {
      display: none;
    }

    .faq-answer {
      padding: 0 18px 16px;
      font-size: 0.88rem;
      color: var(--text-muted);
      line-height: 1.6;
      border-top: 1px solid var(--border-light);
      padding-top: 12px;
    }

    /* 10. Footer */
    .site-footer {
      background-color: var(--bg-stone);
      border-top: 1px solid var(--border-light);
      padding: 44px 0 32px;
      font-size: 0.84rem;
      color: var(--text-muted);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr;
      gap: 32px;
      padding-bottom: 28px;
      border-bottom: 1px solid var(--border-light);
    }

    .footer-col h4 {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 10px;
    }

    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .footer-links button,
    .footer-links a {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 0.84rem;
      cursor: pointer;
      text-align: left;
      padding: 0;
    }

    .footer-links button:hover,
    .footer-links a:hover {
      color: var(--text-main);
    }

    .footer-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      padding-top: 20px;
      font-size: 0.78rem;
      color: var(--text-light);
    }

    /* Legal Modal */
    #legal-modal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 350;
      background-color: rgba(17, 24, 39, 0.5);
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .legal-modal-card {
      background-color: var(--bg-white);
      border-radius: var(--radius-lg);
      max-width: 640px;
      width: 100%;
      max-height: 82vh;
      overflow-y: auto;
      padding: 28px;
      border: 1px solid var(--border-light);
      box-shadow: var(--shadow-modal);
      position: relative;
    }

    .legal-modal-card h3 {
      font-size: 1.15rem;
      margin-bottom: 12px;
      color: var(--text-main);
    }

    .legal-modal-card h4 {
      font-size: 0.92rem;
      margin: 14px 0 6px;
      color: var(--text-main);
    }

    .legal-modal-card p {
      font-size: 0.86rem;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    /* Cookie Banner */
    #cookie-banner {
      display: none;
      position: fixed;
      bottom: 16px;
      left: 16px;
      right: 16px;
      max-width: 560px;
      margin: 0 auto;
      background-color: var(--bg-white);
      border: 1px solid var(--border-medium);
      border-radius: var(--radius-md);
      padding: 14px 18px;
      box-shadow: var(--shadow-card);
      z-index: 200;
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .cookie-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .btn-cookie-accept {
      background-color: var(--accent-dark);
      color: #FFFFFF;
      border: none;
      border-radius: var(--radius-sm);
      padding: 7px 14px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }

    @media (max-width: 860px) {
      .header-inner {
        flex-wrap: wrap;
      }
      .header-nav {
        order: 3;
        width: 100%;
        overflow-x: auto;
        padding-top: 6px;
      }
      .modal-grid {
        grid-template-columns: 1fr;
      }
      .footer-grid {
        grid-template-columns: 1fr;
      }
      .search-input {
        width: 160px;
      }
    }
  </style>
</head>
<body>

  <!-- 1. Discreet Top Bar -->
  <div class="top-bar">
    Envío a toda España en 5-9 días laborables · Envío gratuito en pedidos superiores a 45 € · Garantía oficial de 30 días
  </div>

  <!-- 2. Real Store Header -->
  <header class="site-header">
    <div class="container header-inner">
      <div class="brand-block" onclick="filterByCategory('all')">
        <span class="brand-logo">${escapeHtml(brandName)}</span>
        <span class="brand-subtitle">Gadgets, Iluminación &amp; Hogar</span>
      </div>

      <nav class="header-nav" aria-label="Categorías principales">
        <button type="button" class="nav-cat-btn active" data-cat="all" onclick="filterByCategory('all')">Todos los artículos</button>
        <button type="button" class="nav-cat-btn" data-cat="Iluminación & Ambiente" onclick="filterByCategory('Iluminación & Ambiente')">Iluminación &amp; Ambiente</button>
        <button type="button" class="nav-cat-btn" data-cat="Gadgets & Electrónica" onclick="filterByCategory('Gadgets & Electrónica')">Gadgets &amp; Electrónica</button>
        <button type="button" class="nav-cat-btn" data-cat="Confort & Hogar" onclick="filterByCategory('Confort & Hogar')">Confort &amp; Hogar</button>
      </nav>

      <div class="header-actions">
        <div class="search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="search" id="catalog-search-input" class="search-input" placeholder="Buscar artículo..." oninput="handleSearchInput(this.value)" aria-label="Buscar artículo" />
        </div>

        <button type="button" class="cart-trigger-btn" onclick="openCartDrawer()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span id="header-cart-label">Cesta (0)</span>
        </button>
      </div>
    </div>
  </header>

  <div class="container">
    <div id="stripe-status-banner"></div>
  </div>

  <!-- 3. Sober Minimalist Hero Banner -->
  <section class="store-hero">
    <div class="container hero-inner">
      <span class="hero-eyebrow">Catálogo Permanente España</span>
      <h1 class="hero-title">${escapeHtml(brandName)} — Innovación, Iluminación y Gadgets para tu Hogar</h1>
      <p class="hero-description">
        Seleccionamos artículos de iluminación ambiental, electrónica ligera y confort cotidiano con fotografías reales, especificaciones completas de materiales y medidas, y pago seguro en Euros.
      </p>
      <div class="hero-actions">
        <a href="#catalogo" class="btn-primary-hero">Explorar catálogo</a>
        <button type="button" class="btn-secondary-hero" onclick="openCartDrawer()">Ver cesta de compra</button>
      </div>
    </div>
  </section>

  <!-- 4. Dynamic Product Grid -->
  <main class="container catalog-section" id="catalogo">
    <div class="catalog-toolbar">
      <div class="filter-pills">
        <button type="button" class="filter-pill active" data-pill="all" onclick="filterByCategory('all')">Todos (${clientCatalog.length})</button>
        <button type="button" class="filter-pill" data-pill="Iluminación & Ambiente" onclick="filterByCategory('Iluminación & Ambiente')">Iluminación &amp; Ambiente</button>
        <button type="button" class="filter-pill" data-pill="Gadgets & Electrónica" onclick="filterByCategory('Gadgets & Electrónica')">Gadgets &amp; Electrónica</button>
        <button type="button" class="filter-pill" data-pill="Confort & Hogar" onclick="filterByCategory('Confort & Hogar')">Confort &amp; Hogar</button>
      </div>
      <div class="catalog-count" id="catalog-count-label">Mostrando ${clientCatalog.length} artículos</div>
    </div>

    <div class="product-grid" id="product-grid">
      ${productCardsHtml}
    </div>

    <div class="empty-search-state" id="empty-search-state">
      <p>No se han encontrado artículos que coincidan con tu búsqueda.</p>
      <button type="button" class="btn-secondary-hero" style="margin-top:12px;" onclick="resetFilters()">Mostrar todos los artículos</button>
    </div>
  </main>

  <!-- 5. Trust & Service Guarantees -->
  <section class="trust-section" id="confianza">
    <div class="container">
      <div class="trust-grid">
        <div class="trust-item">
          <div class="trust-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
          <h3>Envío a toda España</h3>
          <p>Entrega en 5-9 días laborables con código de seguimiento. Envío estándar gratuito en pedidos a partir de 45,00 € (4,99 € en pedidos inferiores).</p>
        </div>

        <div class="trust-item">
          <div class="trust-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h3>Pago seguro con Stripe</h3>
          <p>Transacciones procesadas en Euros (IVA 21% incluido) mediante pasarela cifrada Stripe con soporte para Visa, Mastercard, Apple Pay y Google Pay.</p>
        </div>

        <div class="trust-item">
          <div class="trust-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3>Garantía oficial de 30 días</h3>
          <p>Plazo de 30 días desde la recepción para solicitar cambio, sustitución inmediata o reembolso íntegro en caso de defecto o incidencia.</p>
        </div>

        <div class="trust-item">
          <div class="trust-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3>Especificaciones verificadas</h3>
          <p>Cada ficha detalla las dimensiones reales en centímetros, materiales de fabricación, contenido exacto de la caja y modo de alimentación.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. Sober FAQ Section -->
  <section class="faq-section" id="faq">
    <div class="container">
      <div class="section-heading">
        <h2>Preguntas frecuentes</h2>
        <p>Información clara sobre envíos, métodos de pago y garantía en España.</p>
      </div>

      <div class="faq-list">
        <details class="faq-item">
          <summary>¿Cuáles son los plazos y costes de envío a España?</summary>
          <div class="faq-answer">
            Todos los pedidos se procesan en un plazo de 24 a 48 horas laborables y se entregan en España peninsular y Baleares en un plazo estimado de 5 a 9 días laborables mediante mensajería con número de seguimiento. El envío es gratuito en pedidos a partir de 45,00 € y tiene un coste fijo de 4,99 € en pedidos de importe inferior.
          </div>
        </details>

        <details class="faq-item">
          <summary>¿Los artículos con enchufe son compatibles con las tomas de España?</summary>
          <div class="faq-answer">
            Sí. Los artículos conectados a la red eléctrica (como la Cortina LED de Anillos 3D o el Proyector LED Rotatorio) incluyen enchufe europeo estándar de 220V sin necesidad de adaptadores. El resto de artículos funcionan mediante puerto USB estándar (5V) o baterías AAA según se detalla en el apartado "¿Qué lleva en la caja?" de cada ficha técnica.
          </div>
        </details>

        <details class="faq-item">
          <summary>¿Qué métodos de pago están disponibles?</summary>
          <div class="faq-answer">
            Los pagos se realizan en Euros (€) con el 21% de IVA incluido a través de Stripe Checkout. Puedes abonar tu compra con cualquier tarjeta de débito o crédito Visa, Mastercard, Maestro, así como mediante Apple Pay y Google Pay.
          </div>
        </details>

        <details class="faq-item">
          <summary>¿Cómo funciona la garantía de sustitución o devolución de 30 días?</summary>
          <div class="faq-answer">
            Dispones de 30 días naturales desde la entrega para devolver cualquier artículo o solicitar su reemplazo gratuito si presenta algún desperfecto de transporte o funcionamiento. El reembolso se efectúa directamente en el mismo método de pago utilizado en Stripe.
          </div>
        </details>
      </div>
    </div>
  </section>

  <!-- 7. Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>${escapeHtml(brandName)}</h4>
          <p style="max-width: 340px; line-height: 1.55;">
            Tienda online de iluminación ambiental, gadgets de electrónica ligera y artículos de confort para el hogar con envío a toda España.
          </p>
        </div>

        <div class="footer-col">
          <h4>Categorías</h4>
          <ul class="footer-links">
            <li><button type="button" onclick="filterByCategory('all')">Todos los artículos</button></li>
            <li><button type="button" onclick="filterByCategory('Iluminación & Ambiente')">Iluminación &amp; Ambiente</button></li>
            <li><button type="button" onclick="filterByCategory('Gadgets & Electrónica')">Gadgets &amp; Electrónica</button></li>
            <li><button type="button" onclick="filterByCategory('Confort & Hogar')">Confort &amp; Hogar</button></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Información legal</h4>
          <ul class="footer-links">
            <li><button type="button" onclick="openLegalModal('envios')">Política de envíos y entregas</button></li>
            <li><button type="button" onclick="openLegalModal('devoluciones')">Garantía y devoluciones (30 días)</button></li>
            <li><button type="button" onclick="openLegalModal('privacidad')">Política de privacidad (RGPD)</button></li>
            <li><button type="button" onclick="openLegalModal('terminos')">Condiciones de compra (LSSI-CE)</button></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} ${escapeHtml(brandName)}. Todos los derechos reservados. Precios con IVA 21% incluido.</span>
        <span>Pagos seguros procesados por Stripe Payments Europe, Ltd.</span>
      </div>
    </div>
  </footer>

  <!-- 8. Product Technical Sheet Modal (5 Sections) -->
  <div class="product-modal-overlay" id="product-modal-overlay" onclick="closeProductModal(event)">
    <div class="product-modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-product-title">
      <div class="modal-header-bar">
        <span class="modal-header-cat" id="modal-product-cat">Ficha Técnica del Artículo</span>
        <button type="button" class="modal-close-icon" onclick="closeProductModal()" aria-label="Cerrar ficha">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="modal-grid">
        <div>
          <div class="modal-gallery-main">
            <img id="modal-main-img" src="/assets/xmas-01-curtain-lights.jpg" alt="Vista detallada del artículo" />
          </div>
          <div class="modal-thumbs" id="modal-thumbs-row"></div>
        </div>

        <div>
          <h2 class="modal-info-title" id="modal-product-title"></h2>
          <div class="modal-info-price-bar">
            <span class="modal-price-now" id="modal-product-price"></span>
            <span class="modal-price-old" id="modal-product-compare"></span>
            <span class="card-tax-note">IVA 21% incluido</span>
          </div>

          <div class="modal-specs-list">
            <div class="modal-spec-box">
              <h4>1. ¿Qué es?</h4>
              <p id="modal-spec-1"></p>
            </div>
            <div class="modal-spec-box">
              <h4>2. ¿Cómo es y qué medidas tiene?</h4>
              <p id="modal-spec-2"></p>
            </div>
            <div class="modal-spec-box">
              <h4>3. ¿De qué está hecho?</h4>
              <p id="modal-spec-3"></p>
            </div>
            <div class="modal-spec-box">
              <h4>4. ¿Qué lleva en la caja?</h4>
              <p id="modal-spec-4"></p>
            </div>
            <div class="modal-spec-box">
              <h4>5. ¿Qué funciones tiene?</h4>
              <p id="modal-spec-5"></p>
            </div>
          </div>

          <div class="modal-cta-row">
            <button type="button" class="btn-add-cart" id="modal-add-cart-btn">Añadir a la cesta</button>
            <button type="button" class="btn-quick-buy" id="modal-quick-buy-btn">Compra rápida</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 9. Side Cart Drawer -->
  <div class="cart-drawer-backdrop" id="cart-drawer-backdrop" onclick="closeCartDrawer()"></div>
  <aside class="cart-drawer" id="cart-drawer" aria-label="Cesta de la compra">
    <div class="cart-drawer-header">
      <span class="cart-drawer-title" id="cart-drawer-title">Cesta de la compra (0)</span>
      <button type="button" class="modal-close-icon" onclick="closeCartDrawer()" aria-label="Cerrar cesta">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <div class="cart-shipping-banner">
      <div id="cart-shipping-msg">Envío gratuito en pedidos a partir de 45,00 €</div>
      <div class="cart-shipping-bar-bg">
        <div class="cart-shipping-bar-fill" id="cart-shipping-fill"></div>
      </div>
    </div>

    <div class="cart-items-container" id="cart-items-container">
      <div class="cart-empty-msg">Tu cesta está vacía. Añade cualquier artículo del catálogo para comenzar.</div>
    </div>

    <div class="cart-drawer-footer">
      <div class="cart-summary-line">
        <span>Subtotal</span>
        <span id="cart-subtotal-val">0,00 €</span>
      </div>
      <div class="cart-summary-line">
        <span>Envío a España</span>
        <span id="cart-shipping-val">4,99 €</span>
      </div>
      <div class="cart-summary-total">
        <span>Total (IVA incluido)</span>
        <span id="cart-total-val">0,00 €</span>
      </div>
      <button type="button" class="btn-checkout-stripe" id="btn-cart-checkout" onclick="checkoutCartWithStripe()" disabled>
        Finalizar pedido seguro
      </button>
    </div>
  </aside>

  <!-- 10. Legal Modal -->
  <div id="legal-modal-overlay" onclick="closeLegalModal(event)">
    <div class="legal-modal-card">
      <div style="display:flex; justify-content:flex-end;">
        <button type="button" class="modal-close-icon" onclick="closeLegalModal()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div id="modal-content-slot"></div>
    </div>
  </div>

  <!-- 11. Discreet GDPR Cookie Notice -->
  <div id="cookie-banner">
    <div class="cookie-row">
      <span>Utilizamos cookies técnicas necesarias para el funcionamiento de la cesta y los pagos seguros con Stripe conforme a la normativa española (LSSI-CE).</span>
      <button type="button" class="btn-cookie-accept" onclick="acceptCookies()">Aceptar</button>
    </div>
  </div>

  <script>
    const CATALOG_ITEMS = ${JSON.stringify(clientCatalog)};
    const FREE_SHIPPING_THRESHOLD = ${threshold};
    const STANDARD_SHIPPING_FEE = ${standardShipping};

    let activeCategory = 'all';
    let searchQuery = '';
    let cart = [];

    try {
      const savedCart = localStorage.getItem('aetherwell_cart_v3');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) cart = parsed;
      }
    } catch (e) {}

    function saveCart() {
      try {
        localStorage.setItem('aetherwell_cart_v3', JSON.stringify(cart));
      } catch (e) {}
    }

    function formatEurJs(val) {
      return Number(val || 0).toFixed(2).replace('.', ',') + ' €';
    }

    function findCatalogItem(productId) {
      return CATALOG_ITEMS.find((p) => p.id === productId) || null;
    }

    /* Cambiar foto en la tarjeta de la cuadrícula */
    function switchCardPhoto(productId, photoIdx, imgUrl, btnEl) {
      const imgEl = document.getElementById('card-img-' + productId);
      if (imgEl) imgEl.src = imgUrl;
      if (btnEl && btnEl.parentElement) {
        const pills = btnEl.parentElement.querySelectorAll('.photo-pill');
        pills.forEach((p, idx) => {
          p.className = idx === photoIdx ? 'photo-pill active' : 'photo-pill';
        });
      }
    }

    /* Filtrado por categoría y buscador en tiempo real */
    function filterByCategory(category) {
      activeCategory = category;

      document.querySelectorAll('.nav-cat-btn').forEach((btn) => {
        btn.className = btn.getAttribute('data-cat') === category ? 'nav-cat-btn active' : 'nav-cat-btn';
      });

      document.querySelectorAll('.filter-pill').forEach((pill) => {
        pill.className = pill.getAttribute('data-pill') === category ? 'filter-pill active' : 'filter-pill';
      });

      applyCatalogFilters();
    }

    function handleSearchInput(val) {
      searchQuery = String(val || '').trim().toLowerCase();
      applyCatalogFilters();
    }

    function resetFilters() {
      activeCategory = 'all';
      searchQuery = '';
      const input = document.getElementById('catalog-search-input');
      if (input) input.value = '';
      filterByCategory('all');
    }

    function applyCatalogFilters() {
      const cards = document.querySelectorAll('.product-card');
      let visibleCount = 0;

      cards.forEach((card) => {
        const cardCat = card.getAttribute('data-category') || '';
        const cardSearch = card.getAttribute('data-search') || '';
        const matchesCat = activeCategory === 'all' || cardCat === activeCategory;
        const matchesSearch = !searchQuery || cardSearch.includes(searchQuery);

        if (matchesCat && matchesSearch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      const countEl = document.getElementById('catalog-count-label');
      if (countEl) {
        countEl.textContent = 'Mostrando ' + visibleCount + (visibleCount === 1 ? ' artículo' : ' artículos');
      }

      const emptyEl = document.getElementById('empty-search-state');
      if (emptyEl) {
        emptyEl.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    /* Modal de Ficha Técnica de 5 puntos */
    function openProductModal(productId) {
      const item = findCatalogItem(productId);
      if (!item) return;

      document.getElementById('modal-product-cat').textContent = item.category;
      document.getElementById('modal-product-title').textContent = item.title;
      document.getElementById('modal-product-price').textContent = formatEurJs(item.price);
      const cmpEl = document.getElementById('modal-product-compare');
      cmpEl.textContent = item.compareAtPrice > item.price ? formatEurJs(item.compareAtPrice) : '';

      document.getElementById('modal-spec-1').textContent = item.specs.que_es;
      document.getElementById('modal-spec-2').textContent = item.specs.como_es;
      document.getElementById('modal-spec-3').textContent = item.specs.materiales;
      document.getElementById('modal-spec-4').textContent = item.specs.caja;
      document.getElementById('modal-spec-5').textContent = item.specs.funciones;

      const mainImg = document.getElementById('modal-main-img');
      mainImg.src = item.images[0];
      mainImg.alt = item.title;

      const thumbsRow = document.getElementById('modal-thumbs-row');
      thumbsRow.innerHTML = item.images
        .map(
          (imgUrl, idx) =>
            '<button type="button" class="modal-thumb-btn ' +
            (idx === 0 ? 'active' : '') +
            '" onclick="switchModalPhoto(\\'' +
            imgUrl +
            '\\', ' +
            idx +
            ')"><img src="' +
            imgUrl +
            '" alt="Foto ' +
            (idx + 1) +
            '" /></button>'
        )
        .join('');

      const addBtn = document.getElementById('modal-add-cart-btn');
      addBtn.onclick = function () {
        closeProductModal();
        addToCart(item.id, 1);
      };

      const buyBtn = document.getElementById('modal-quick-buy-btn');
      buyBtn.onclick = function () {
        buySingleCatalogProduct(item.id, item.price, buyBtn);
      };

      document.getElementById('product-modal-overlay').style.display = 'flex';
    }

    function switchModalPhoto(imgUrl, idx) {
      document.getElementById('modal-main-img').src = imgUrl;
      const btns = document.querySelectorAll('#modal-thumbs-row .modal-thumb-btn');
      btns.forEach((b, i) => {
        b.className = i === idx ? 'modal-thumb-btn active' : 'modal-thumb-btn';
      });
    }

    function closeProductModal(e) {
      if (!e || e.target.id === 'product-modal-overlay') {
        document.getElementById('product-modal-overlay').style.display = 'none';
      }
    }

    /* Gestión de Cesta Lateral (Cart Drawer) */
    function openCartDrawer() {
      document.getElementById('cart-drawer-backdrop').style.display = 'block';
      document.getElementById('cart-drawer').classList.add('open');
      renderCartUI();
    }

    function closeCartDrawer() {
      document.getElementById('cart-drawer').classList.remove('open');
      document.getElementById('cart-drawer-backdrop').style.display = 'none';
    }

    function addToCart(productId, qty) {
      const item = findCatalogItem(productId);
      if (!item) return;

      const existing = cart.find((c) => c.productId === productId);
      if (existing) {
        existing.quantity += qty;
      } else {
        cart.push({
          productId: item.id,
          title: item.shortName || item.title,
          price: item.price,
          image: item.images[0],
          quantity: qty
        });
      }

      saveCart();
      renderCartUI();
      openCartDrawer();
    }

    function updateCartQty(productId, delta) {
      const idx = cart.findIndex((c) => c.productId === productId);
      if (idx === -1) return;
      cart[idx].quantity += delta;
      if (cart[idx].quantity <= 0) {
        cart.splice(idx, 1);
      }
      saveCart();
      renderCartUI();
    }

    function removeFromCart(productId) {
      cart = cart.filter((c) => c.productId !== productId);
      saveCart();
      renderCartUI();
    }

    function renderCartUI() {
      const totalCount = cart.reduce((acc, c) => acc + c.quantity, 0);
      const subtotal = +cart.reduce((acc, c) => acc + c.price * c.quantity, 0).toFixed(2);
      const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
      const total = +(subtotal + shipping).toFixed(2);

      const headerLabel = document.getElementById('header-cart-label');
      if (headerLabel) headerLabel.textContent = 'Cesta (' + totalCount + ')';

      const drawerTitle = document.getElementById('cart-drawer-title');
      if (drawerTitle) drawerTitle.textContent = 'Cesta de la compra (' + totalCount + ')';

      const fillEl = document.getElementById('cart-shipping-fill');
      const msgEl = document.getElementById('cart-shipping-msg');
      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        fillEl.style.width = '100%';
        msgEl.textContent = 'Envío estándar gratuito desbloqueado (0,00 €)';
      } else {
        const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        fillEl.style.width = pct + '%';
        const missing = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2).replace('.', ',');
        msgEl.textContent = 'Te faltan ' + missing + ' € para el envío gratuito a España';
      }

      const container = document.getElementById('cart-items-container');
      if (cart.length === 0) {
        container.innerHTML = '<div class="cart-empty-msg">Tu cesta está vacía. Añade cualquier artículo del catálogo para comenzar.</div>';
      } else {
        container.innerHTML = cart
          .map(
            (c) =>
              '<div class="cart-item-row">' +
              '<img class="cart-item-img" src="' +
              c.image +
              '" alt="' +
              c.title +
              '" />' +
              '<div>' +
              '<div class="cart-item-title">' +
              c.title +
              '</div>' +
              '<div class="cart-item-price">' +
              formatEurJs(c.price) +
              ' / ud.</div>' +
              '<div class="cart-item-controls">' +
              '<div class="qty-stepper">' +
              '<button type="button" class="qty-btn" onclick="updateCartQty(\\'' +
              c.productId +
              '\\', -1)">-</button>' +
              '<span class="qty-val">' +
              c.quantity +
              '</span>' +
              '<button type="button" class="qty-btn" onclick="updateCartQty(\\'' +
              c.productId +
              '\\', 1)">+</button>' +
              '</div>' +
              '<button type="button" class="cart-remove-btn" onclick="removeFromCart(\\'' +
              c.productId +
              '\\')">Eliminar</button>' +
              '</div>' +
              '</div>' +
              '</div>'
          )
          .join('');
      }

      document.getElementById('cart-subtotal-val').textContent = formatEurJs(subtotal);
      document.getElementById('cart-shipping-val').textContent =
        subtotal === 0 ? '—' : shipping === 0 ? 'Gratis (0,00 €)' : formatEurJs(shipping);
      document.getElementById('cart-total-val').textContent = formatEurJs(total);

      const checkoutBtn = document.getElementById('btn-cart-checkout');
      checkoutBtn.disabled = cart.length === 0;
    }

    /* Pago en Stripe Checkout desde la cesta */
    async function checkoutCartWithStripe() {
      if (cart.length === 0) return;
      const btn = document.getElementById('btn-cart-checkout');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Conectando con Stripe...';

      const items = cart.map((c) => ({
        productId: c.productId,
        quantity: c.quantity,
        unitPriceOverride: c.price
      }));

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
          window.location.href = data.url;
        } else {
          alert('No se pudo iniciar la sesión de pago: ' + (data.error || 'Inténtalo de nuevo.'));
          btn.disabled = false;
          btn.textContent = originalText;
        }
      } catch (err) {
        alert('Error de conexión con la pasarela de pago: ' + err.message);
        btn.disabled = false;
        btn.textContent = originalText;
      }
    }

    /* Compra rápida directa de un artículo en Stripe Checkout */
    async function buySingleCatalogProduct(productId, unitPrice, btnEl) {
      const originalText = btnEl ? btnEl.textContent : 'Compra rápida';
      if (btnEl) {
        btnEl.disabled = true;
        btnEl.textContent = 'Conectando...';
      }
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
          window.location.href = data.url;
        } else {
          alert('No se pudo iniciar la sesión de pago: ' + (data.error || 'Inténtalo de nuevo.'));
          if (btnEl) {
            btnEl.disabled = false;
            btnEl.textContent = originalText;
          }
        }
      } catch (err) {
        alert('Error de conexión con la pasarela de pago: ' + err.message);
        if (btnEl) {
          btnEl.disabled = false;
          btnEl.textContent = originalText;
        }
      }
    }

    /* Modales Legales */
    const LEGAL_TEXTS = {
      envios:
        '<h3>Política de envíos y entregas (España y UE)</h3>' +
        '<h4>1. Ámbito y plazos</h4>' +
        '<p>Realizamos envíos a toda España peninsular, Baleares y Unión Europea. Los pedidos se expiden en 24-48 horas laborables con entrega estimada en 5 a 9 días laborables mediante mensajería con seguimiento.</p>' +
        '<h4>2. Tarifas</h4>' +
        '<p>Envío estándar gratuito en pedidos iguales o superiores a 45,00 €. En pedidos de importe inferior se aplica una tarifa plana de 4,99 €. Todos los precios incluyen el 21% de IVA.</p>',
      devoluciones:
        '<h3>Garantía y devoluciones (30 días)</h3>' +
        '<p>Todos los artículos cuentan con 30 días naturales desde la fecha de recepción para solicitar cambio, sustitución sin coste o reembolso íntegro conforme a la normativa española de consumidores y usuarios (LGDCU).</p>',
      privacidad:
        '<h3>Política de privacidad y protección de datos (RGPD)</h3>' +
        '<p>En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la LOPDGDD 3/2018, los datos facilitados durante el proceso de compra se emplean únicamente para la gestión logística del pedido y su facturación. Los pagos se procesan de forma segura en Stripe Payments Europe, Ltd. bajo estándar PCI-DSS Nivel 1.</p>',
      terminos:
        '<h3>Condiciones generales de contratación (LSSI-CE)</h3>' +
        '<p>Las compras se formalizan en Euros (€) con IVA incluido a través de la pasarela oficial Stripe Checkout con soporte para tarjetas bancarias, Apple Pay y Google Pay.</p>'
    };

    function openLegalModal(type) {
      const overlay = document.getElementById('legal-modal-overlay');
      const slot = document.getElementById('modal-content-slot');
      slot.innerHTML = LEGAL_TEXTS[type] || '<p>Información disponible.</p>';
      overlay.style.display = 'flex';
    }

    function closeLegalModal(e) {
      if (!e || e.target.id === 'legal-modal-overlay') {
        document.getElementById('legal-modal-overlay').style.display = 'none';
      }
    }

    function checkCookies() {
      try {
        if (!localStorage.getItem('aetherwell_cookies_accepted')) {
          document.getElementById('cookie-banner').style.display = 'block';
        }
      } catch (e) {}
    }

    function acceptCookies() {
      try {
        localStorage.setItem('aetherwell_cookies_accepted', 'true');
      } catch (e) {}
      document.getElementById('cookie-banner').style.display = 'none';
    }

    function checkReturnStatus() {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment_status');
      const sessionId = urlParams.get('session_id');
      const banner = document.getElementById('stripe-status-banner');

      if (banner && paymentStatus === 'success') {
        cart = [];
        saveCart();
        renderCartUI();
        banner.style.display = 'block';
        banner.style.background = '#ECFDF5';
        banner.style.border = '1px solid #10B981';
        banner.style.color = '#065F46';
        banner.innerHTML =
          '<strong>Pedido confirmado correctamente.</strong> Hemos recibido tu orden y se encuentra en preparación para su envío a España.' +
          (sessionId ? '<br><span style="font-size:0.8rem; font-family:monospace;">Referencia de operación: ' + sessionId + '</span>' : '');
      } else if (banner && paymentStatus === 'cancelled') {
        banner.style.display = 'block';
        banner.style.background = '#F7F7F8';
        banner.style.border = '1px solid #D1D5DB';
        banner.style.color = '#111827';
        banner.innerHTML = 'El proceso de pago se ha cancelado. Tus artículos siguen disponibles en el catálogo.';
      }
    }

    renderCartUI();
    checkCookies();
    checkReturnStatus();
  </script>
</body>
</html>`;
}
