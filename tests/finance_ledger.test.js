/**
 * @fileoverview Suite exhaustiva de pruebas unitarias para el motor de Telemetría Financiera (`src/finance/ledger.js`):
 * - Fórmula oficial de Beneficio Neto
 * - Bucle de refuerzo y autopenalización cada 24h
 * - Freno de emergencia ($50.00 USD)
 * - Detección de los 3 Activadores HITL
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { FinancialLedger, HITL_ACTIVATORS } from '../src/finance/ledger.js';

describe('Motor Financiero: Fórmula de Beneficio Neto, Bucle 24h y Freno de Emergencia ($50 USD)', () => {
  it('Inicializa con el fondo operativo de $50.00 USD y calcula exactamente la fórmula oficial', () => {
    const ledger = new FinancialLedger({ initialFundUsd: 50.0 });

    // Ingresos liquidados en Stripe/Shopify: $120.00
    ledger.recordSettledRevenue({ orderId: 'ORD-1', settledAmount: 75.5 });
    ledger.recordSettledRevenue({ orderId: 'ORD-2', settledAmount: 44.5 });

    // Costes de tokens de API: $3.25
    ledger.recordApiTokenCost({ agent: 'market_analyst', tokens: 45000, costUsd: 1.75 });
    ledger.recordApiTokenCost({ agent: 'dev_engineer', tokens: 38000, costUsd: 1.5 });

    // Inversión en anuncios activos: $40.00
    ledger.recordActiveAdSpend({ platform: 'TikTok', campaignId: 'camp_01', spendUsd: 25.0 });
    ledger.recordActiveAdSpend({ platform: 'Meta', campaignId: 'camp_02', spendUsd: 15.0 });

    const metrics = ledger.calculateMetrics();
    // Beneficio_Neto = 120.00 - (3.25 + 40.00) = 76.75
    assert.equal(metrics.settledRevenueUsd, 120.0);
    assert.equal(metrics.apiTokenCostsUsd, 3.25);
    assert.equal(metrics.activeAdSpendUsd, 40.0);
    assert.equal(metrics.totalOperatingExpensesUsd, 43.25);
    assert.equal(metrics.netProfitUsd, 76.75);
    assert.equal(metrics.remainingOperatingFundUsd, 126.75);
    assert.equal(metrics.verifiedSalesCount, 2);
  });

  it('ESTADO DE ÉXITO (Beneficio_Neto > 0): Desbloquea modelos premium, asigna 50% a Ads y activa pruebas A/B', () => {
    const ledger = new FinancialLedger({ initialFundUsd: 50.0 });
    ledger.recordSettledRevenue({ orderId: 'ORD-WIN', settledAmount: 100.0 });
    ledger.recordApiTokenCost({ agent: 'growth_marketer', costUsd: 5.0 });
    ledger.recordActiveAdSpend({ platform: 'TikTok', campaignId: 'camp_win', spendUsd: 35.0 });
    // Beneficio_Neto = 100 - 40 = +60.00 USD

    const audit = ledger.run24hAudit();
    assert.equal(audit.status, 'SUCCESS_STATE');
    assert.equal(audit.netProfitUsd, 60.0);
    assert.equal(audit.scalingReward.allowPremiumReasoningModels, true);
    assert.equal(audit.budgetScaling.additionalAdBudgetUsd, 30.0); // 50% de $60.00
    assert.equal(audit.abTesting.keepWinningNiche, true);
    assert.equal(audit.emergencyBrake.triggered, false);
  });

  it('ESTADO DE FRACASO (Beneficio_Neto <= 0 con presupuesto aún disponible): Aplica Autopenalización de modelo y Mutación de Estrategia sin Freno de Emergencia', () => {
    const ledger = new FinancialLedger({ initialFundUsd: 50.0 });
    ledger.recordApiTokenCost({ agent: 'market_analyst', costUsd: 2.0 });
    ledger.recordActiveAdSpend({ platform: 'Meta', campaignId: 'camp_test', spendUsd: 18.0 });
    // Beneficio_Neto = 0 - 20 = -20.00 USD, pero quedan $30.00 del fondo de $50.00

    const audit = ledger.run24hAudit();
    assert.equal(audit.status, 'FAILURE_STATE');
    assert.equal(audit.netProfitUsd, -20.0);
    assert.equal(audit.selfPenalty.applied, true);
    assert.equal(audit.selfPenalty.allowPremiumReasoningModels, false);
    assert.equal(audit.selfPenalty.enforcedModelTier, 'lightweight_ultra_efficient');
    assert.equal(
      audit.strategyMutation.marketAnalystDirective,
      'DELETE_CURRENT_CATALOG_AND_PIVOT_NICHE_IMMEDIATELY'
    );
    assert.equal(
      audit.strategyMutation.growthMarketerDirective,
      'SHUTDOWN_ALL_ACTIVE_AD_SETS_AND_CREATIVES'
    );
    assert.equal(audit.emergencyBrake.triggered, false);
  });

  it('FRENO DE EMERGENCIA ($50 USD): Detiene todos los subagentes y genera informe final si el fondo llega a $0 sin 1 venta verificada', () => {
    const ledger = new FinancialLedger({ initialFundUsd: 50.0 });
    ledger.recordApiTokenCost({ agent: 'all_agents', costUsd: 5.0 });
    ledger.recordActiveAdSpend({ platform: 'TikTok', campaignId: 'burn_50', spendUsd: 45.0 });
    // Gasto total = $50.00, Ventas = 0, Presupuesto restante = $0.00

    const audit = ledger.run24hAudit();
    assert.equal(audit.status, 'FAILURE_STATE');
    assert.equal(audit.emergencyBrake.triggered, true);
    assert.equal(audit.emergencyBrake.haltAllSubagents, true);
    assert.equal(ledger.systemHalted, true);
    assert.ok(audit.emergencyBrake.finalShutdownReport.title.includes('FRENO DE EMERGENCIA'));
  });

  it('Detecta correctamente los 3 Activadores HITL (KYC/Banca, Riesgo Financiero y Baneos de Plataforma)', () => {
    const ledger = new FinancialLedger();

    const hitl1 = ledger.checkActivator1KycBanking();
    assert.equal(hitl1.triggered, true);
    assert.equal(hitl1.alert.code, HITL_ACTIVATORS.ACTIVATOR_1_KYC_BANKING);

    const hitl2 = ledger.checkActivator2FinancialRisk({
      type: 'chargeback_dispute',
      orderId: 'ORD-999',
      amountUsd: 89.99
    });
    assert.equal(hitl2.triggered, true);
    assert.equal(hitl2.alert.code, HITL_ACTIVATORS.ACTIVATOR_2_FINANCIAL_RISK);

    const hitl3 = ledger.checkActivator3PlatformBan({
      platform: 'Meta',
      status: 'bot_detection_ban'
    });
    assert.equal(hitl3.triggered, true);
    assert.equal(hitl3.alert.code, HITL_ACTIVATORS.ACTIVATOR_3_PLATFORM_BAN);
    assert.equal(ledger.hitlAlerts.length, 3);
  });
});
