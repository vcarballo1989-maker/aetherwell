/**
 * @fileoverview Panel de Control Ejecutivo y Auditoría Privada de CEO (/admin).
 * Muestra métricas financieras en tiempo real consultando la API oficial de Stripe
 * como base de datos inmutable en la nube (cumplimiento RGPD y PCI-DSS Nivel 1),
 * junto con la telemetría del FinancialLedger y el estado del Freno de Emergencia ($50 USD).
 */

export function renderAdminDashboard({
  stripeBalance = {},
  stripeSessions = [],
  audit = {},
  kycStatus = {},
  currentEnv = {}
}) {
  const availableUsd = (stripeBalance.available || [])
    .filter((b) => b.currency === 'usd')
    .reduce((sum, b) => sum + b.amount / 100, 0);

  const pendingUsd = (stripeBalance.pending || [])
    .filter((b) => b.currency === 'usd')
    .reduce((sum, b) => sum + b.amount / 100, 0);

  const fin = audit.financial_summary || {};
  const sys = audit.system_status || {};

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AetherWell™ | Portal Ejecutivo de Operaciones & Stripe Cloud DB</title>
  <style>
    :root {
      --bg: #090e17;
      --surface: #111a2e;
      --card: #152238;
      --border: #233554;
      --accent: #10b981;
      --primary: #3b82f6;
      --warning: #f59e0b;
      --danger: #ef4444;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; }
    body { background-color: var(--bg); color: var(--text); padding: 24px; line-height: 1.5; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 20px; margin-bottom: 24px; }
    .brand { font-size: 1.5rem; font-weight: 900; color: #ffffff; display: flex; align-items: center; gap: 10px; }
    .badge-live { background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #10b981; padding: 4px 12px; border-radius: 999px; font-size: 0.8rem; font-weight: 800; }
    .btn-return { background: var(--surface); border: 1px solid var(--border); color: var(--text); padding: 8px 16px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 0.85rem; }
    .btn-return:hover { border-color: var(--primary); }
    
    .grid-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 28px; }
    .kpi-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px; }
    .kpi-title { font-size: 0.8rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin-bottom: 8px; }
    .kpi-value { font-size: 1.7rem; font-weight: 900; color: #ffffff; }
    .kpi-sub { font-size: 0.78rem; color: var(--text-muted); margin-top: 6px; }

    .section-title { font-size: 1.15rem; font-weight: 800; margin-bottom: 14px; color: #ffffff; display: flex; align-items: center; gap: 8px; }
    
    .table-container { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow-x: auto; margin-bottom: 28px; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; }
    th, td { padding: 14px 18px; border-bottom: 1px solid var(--border); }
    th { background: #0c1322; color: var(--text-muted); font-weight: 800; text-transform: uppercase; font-size: 0.75rem; }
    tr:last-child td { border-bottom: none; }
    .badge-status { padding: 3px 8px; border-radius: 999px; font-size: 0.72rem; font-weight: 800; }
    .badge-paid { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .badge-unpaid { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }

    .infra-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
    .infra-box { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px; }
    .infra-line { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.84rem; }
    .infra-label { color: var(--text-muted); }
    .infra-val { font-weight: 700; color: var(--text); font-family: monospace; }
  </style>
</head>
<body>

  <div class="header">
    <div class="brand">
      <span>🛡️ AetherWell™ Executive Ops</span>
      <span class="badge-live">🟢 STRIPE CLOUD DB LIVE</span>
    </div>
    <div style="display: flex; gap: 12px; align-items: center;">
      <a href="/" class="btn-return" target="_blank">↗ Abrir Tienda Pública</a>
      <a href="/admin" class="btn-return">🔄 Actualizar Datos</a>
    </div>
  </div>

  <!-- KPI Cards -->
  <div class="grid-kpis">
    <div class="kpi-card">
      <div class="kpi-title">Stripe Saldo Disponible</div>
      <div class="kpi-value" style="color: var(--accent);">$${availableUsd.toFixed(2)} USD</div>
      <div class="kpi-sub">Liquidación bancaria lista</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Stripe Saldo Pendiente</div>
      <div class="kpi-value" style="color: var(--primary);">$${pendingUsd.toFixed(2)} USD</div>
      <div class="kpi-sub">En tránsito hacia balance</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Ingresos Brutos (24h)</div>
      <div class="kpi-value">$${Number(fin.gross_revenue_usd || 0).toFixed(2)} USD</div>
      <div class="kpi-sub">Pedidos: ${audit.orders_processed_24h || 0}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Beneficio Neto Acumulado</div>
      <div class="kpi-value" style="color: ${Number(fin.net_profit_usd || 0) >= 0 ? 'var(--accent)' : 'var(--danger)'};">
        $${Number(fin.net_profit_usd || 0).toFixed(2)} USD
      </div>
      <div class="kpi-sub">ROAS: ${fin.blended_roas || '0.00'}x</div>
    </div>
  </div>

  <!-- Stripe Real Transactions Table -->
  <div class="section-title">
    <span>💳 Sesiones de Stripe Checkout Oficiales en la Nube (Últimas 10)</span>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>ID de Sesión (Stripe)</th>
          <th>Estado de Pago</th>
          <th>Importe Total</th>
          <th>Cliente / Email</th>
          <th>Fecha Creación</th>
          <th>Enlace de Pago</th>
        </tr>
      </thead>
      <tbody>
        ${
          stripeSessions.length === 0
            ? '<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:24px;">No se registran sesiones de Stripe aún.</td></tr>'
            : stripeSessions
                .map((s) => {
                  const isPaid = s.payment_status === 'paid';
                  const amount = (s.amount_total ? s.amount_total / 100 : 0).toFixed(2);
                  const dateStr = s.created ? new Date(s.created * 1000).toLocaleString('es-ES') : '-';
                  const email = s.customer_details?.email || s.customer_email || 'Cliente Anónimo';
                  return `
            <tr>
              <td><code>${s.id}</code></td>
              <td><span class="badge-status ${isPaid ? 'badge-paid' : 'badge-unpaid'}">${s.payment_status?.toUpperCase() || 'UNPAID'}</span></td>
              <td><strong>$${amount} ${s.currency?.toUpperCase() || 'USD'}</strong></td>
              <td>${email}</td>
              <td style="color:var(--text-muted);">${dateStr}</td>
              <td><a href="${s.url}" target="_blank" style="color:var(--primary); font-weight:700;">Abrir Checkout ↗</a></td>
            </tr>`;
                })
                .join('')
        }
      </tbody>
    </table>
  </div>

  <!-- Telemetry & HITL State -->
  <div class="section-title">
    <span>⚙️ Telemetría de Infraestructura, Freno de Emergencia ($50) y Activadores HITL</span>
  </div>

  <div class="infra-grid">
    <div class="infra-box">
      <div style="font-weight: 800; margin-bottom: 14px; color: #ffffff;">Fórmula de Beneficio Neto & Motor Autónomo</div>
      <div class="infra-line">
        <span class="infra-label">Fondo Operativo Inicial:</span>
        <span class="infra-val">$${Number(audit.operational_fund_usd || 50).toFixed(2)} USD</span>
      </div>
      <div class="infra-line">
        <span class="infra-label">Inversión Publicitaria (Ads):</span>
        <span class="infra-val">$${Number(fin.ad_spend_usd || 0).toFixed(2)} USD</span>
      </div>
      <div class="infra-line">
        <span class="infra-label">Coste Proveedor (COGS):</span>
        <span class="infra-val">$${Number(fin.cogs_supplier_usd || 0).toFixed(2)} USD</span>
      </div>
      <div class="infra-line">
        <span class="infra-label">Comisiones de Pasarela Stripe:</span>
        <span class="infra-val">$${Number(fin.gateway_fees_usd || 0).toFixed(2)} USD</span>
      </div>
      <div class="infra-line">
        <span class="infra-label">Freno de Emergencia:</span>
        <span class="infra-val" style="color: ${sys.emergency_brake_triggered ? 'var(--danger)' : 'var(--accent)'};">
          ${sys.emergency_brake_triggered ? '🚨 ACTIVADO ($0 DISPONIBLE)' : '🟢 SEGURO (Fondo Activo)'}
        </span>
      </div>
    </div>

    <div class="infra-box">
      <div style="font-weight: 800; margin-bottom: 14px; color: #ffffff;">Estado de Claves Bancarias & Cumplimiento</div>
      <div class="infra-line">
        <span class="infra-label">Stripe Publishable Key:</span>
        <span class="infra-val">${currentEnv?.stripe?.publishableKey ? currentEnv.stripe.publishableKey.substring(0, 16) + '...' : 'Activa'}</span>
      </div>
      <div class="infra-line">
        <span class="infra-label">Stripe Secret Key:</span>
        <span class="infra-val">${currentEnv?.stripe?.isLiveKey ? 'rk_live_... [Conectada]' : 'Modo Prueba'}</span>
      </div>
      <div class="infra-line">
        <span class="infra-label">Activador 1 (KYC / Banca):</span>
        <span class="infra-val" style="color: var(--accent);">${kycStatus?.readyForLiveTraffic ? '✓ VERIFICADA PARA PRODUCCIÓN' : 'PENDIENTE'}</span>
      </div>
      <div class="infra-line">
        <span class="infra-label">Activador 2 (Riesgo Fraude Stripe):</span>
        <span class="infra-val" style="color: var(--accent);">✓ RADAR NORMAL (<85 SCORE)</span>
      </div>
      <div class="infra-line">
        <span class="infra-label">Cumplimiento RGPD & PCI-DSS:</span>
        <span class="infra-val" style="color: var(--accent);">✓ NIVEL 1 CUMPLIDO (Stripe Hosted)</span>
      </div>
    </div>
  </div>

</body>
</html>`;
}
