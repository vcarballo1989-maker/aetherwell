/**
 * @fileoverview Motor de Telemetría Financiera, Bucle de Refuerzo (24h),
 * Freno de Emergencia ($50 USD) y Detector de los 3 Activadores HITL.
 *
 * Fórmula Oficial Antigravity (AGENTS.md §3):
 * Beneficio_Neto = [Ingresos liquidados en Stripe/Shopify] - [Costes de tokens de API + Inversión en anuncios activos]
 */

import { evaluateKycReadiness } from '../config/env.js';

export const HITL_ACTIVATORS = {
  ACTIVATOR_1_KYC_BANKING: 'ACTIVATOR_1_KYC_BANKING',
  ACTIVATOR_2_FINANCIAL_RISK: 'ACTIVATOR_2_FINANCIAL_RISK',
  ACTIVATOR_3_PLATFORM_BAN: 'ACTIVATOR_3_PLATFORM_BAN'
};

export class FinancialLedger {
  /**
   * @param {object} [options]
   * @param {number} [options.initialFundUsd=50.0] Fondo operativo inicial ($50.00 USD por defecto)
   * @param {object} [options.envConfig] Configuración de credenciales para evaluación KYC
   */
  constructor(options = {}) {
    this.initialFundUsd = Number(options.initialFundUsd ?? 50.0);
    this.envConfig = options.envConfig || {};

    /** @type {Array<{id: string, orderId: string, grossAmount: number, supplierCost: number, gatewayFee: number, settledAmount: number, timestamp: string}>} */
    this.settledRevenues = [];

    /** @type {Array<{id: string, agent: string, model: string, tokens: number, costUsd: number, timestamp: string}>} */
    this.apiTokenExpenses = [];

    /** @type {Array<{id: string, platform: string, campaignId: string, spendUsd: number, timestamp: string}>} */
    this.adSpendExpenses = [];

    /** @type {Array<{code: string, severity: 'CRITICAL_HITL', reason: string, metadata: Record<string, any>, timestamp: string}>} */
    this.hitlAlerts = [];

    this.systemHalted = false;
    this.currentModelPolicy = 'standard';
  }

  /**
   * Registra un ingreso liquidado en Stripe/Shopify tras confirmación de orden.
   * @param {object} params
   * @param {string} params.orderId
   * @param {number} params.settledAmount Ingreso neto liquidado en Stripe/Shopify
   * @param {number} [params.grossAmount]
   * @param {number} [params.supplierCost]
   * @param {number} [params.gatewayFee]
   */
  recordSettledRevenue({
    orderId,
    settledAmount,
    grossAmount = settledAmount,
    supplierCost = 0,
    gatewayFee = 0
  }) {
    if (typeof settledAmount !== 'number' || Number.isNaN(settledAmount) || settledAmount < 0) {
      throw new Error('settledAmount debe ser un número válido mayor o igual a 0');
    }
    const entry = {
      id: `rev_${this.settledRevenues.length + 1}_${Date.now()}`,
      orderId,
      grossAmount: +grossAmount.toFixed(2),
      supplierCost: +supplierCost.toFixed(2),
      gatewayFee: +gatewayFee.toFixed(2),
      settledAmount: +settledAmount.toFixed(2),
      timestamp: new Date().toISOString()
    };
    this.settledRevenues.push(entry);
    return entry;
  }

  /**
   * Registra consumo de tokens de API por los agentes del ecosistema.
   * @param {object} params
   * @param {string} params.agent
   * @param {string} [params.model]
   * @param {number} [params.tokens]
   * @param {number} params.costUsd
   */
  recordApiTokenCost({ agent, model = 'llm-default', tokens = 0, costUsd }) {
    if (typeof costUsd !== 'number' || Number.isNaN(costUsd) || costUsd < 0) {
      throw new Error('costUsd debe ser un número válido mayor o igual a 0');
    }
    const entry = {
      id: `tok_${this.apiTokenExpenses.length + 1}_${Date.now()}`,
      agent,
      model,
      tokens,
      costUsd: +costUsd.toFixed(4),
      timestamp: new Date().toISOString()
    };
    this.apiTokenExpenses.push(entry);
    return entry;
  }

  /**
   * Registra inversión en anuncios activos (TikTok Ads / Meta Ads).
   * @param {object} params
   * @param {string} params.platform
   * @param {string} params.campaignId
   * @param {number} params.spendUsd
   */
  recordActiveAdSpend({ platform, campaignId, spendUsd }) {
    if (typeof spendUsd !== 'number' || Number.isNaN(spendUsd) || spendUsd < 0) {
      throw new Error('spendUsd debe ser un número válido mayor o igual a 0');
    }
    const entry = {
      id: `ad_${this.adSpendExpenses.length + 1}_${Date.now()}`,
      platform,
      campaignId,
      spendUsd: +spendUsd.toFixed(2),
      timestamp: new Date().toISOString()
    };
    this.adSpendExpenses.push(entry);
    return entry;
  }

  /**
   * Calcula exactamente la fórmula oficial:
   * Beneficio_Neto = [Ingresos liquidados en Stripe/Shopify] - [Costes de tokens de API + Inversión en anuncios activos]
   */
  calculateMetrics() {
    const totalSettledRevenue = +this.settledRevenues
      .reduce((acc, item) => acc + item.settledAmount, 0)
      .toFixed(2);

    const totalApiTokenCosts = +this.apiTokenExpenses
      .reduce((acc, item) => acc + item.costUsd, 0)
      .toFixed(2);

    const totalActiveAdSpend = +this.adSpendExpenses
      .reduce((acc, item) => acc + item.spendUsd, 0)
      .toFixed(2);

    const totalExpenses = +(totalApiTokenCosts + totalActiveAdSpend).toFixed(2);
    const netProfit = +(totalSettledRevenue - totalExpenses).toFixed(2);
    const remainingOperatingFund = +(this.initialFundUsd + netProfit).toFixed(2);
    const verifiedSalesCount = this.settledRevenues.filter((r) => r.settledAmount > 0).length;

    return {
      formula:
        'Beneficio_Neto = [Ingresos liquidados en Stripe/Shopify] - [Costes de tokens de API + Inversión en anuncios activos]',
      initialFundUsd: this.initialFundUsd,
      settledRevenueUsd: totalSettledRevenue,
      apiTokenCostsUsd: totalApiTokenCosts,
      activeAdSpendUsd: totalActiveAdSpend,
      totalOperatingExpensesUsd: totalExpenses,
      netProfitUsd: netProfit,
      remainingOperatingFundUsd: Math.max(0, remainingOperatingFund),
      rawRemainingFundUsd: remainingOperatingFund,
      verifiedSalesCount
    };
  }

  /**
   * Ejecuta la autoauditoría de 24 horas con bucle de refuerzo, autopenalización y freno de emergencia ($50 USD).
   */
  run24hAudit() {
    const metrics = this.calculateMetrics();
    const isSuccess = metrics.netProfitUsd > 0;

    if (!isSuccess) {
      // ESTADO DE FRACASO (Beneficio_Neto <= 0)
      this.currentModelPolicy = 'lightweight_ultra_efficient';

      const emergencyBrakeTriggered =
        metrics.rawRemainingFundUsd <= 0 && metrics.verifiedSalesCount === 0;

      if (emergencyBrakeTriggered) {
        this.systemHalted = true;
      }

      return {
        status: 'FAILURE_STATE',
        netProfitUsd: metrics.netProfitUsd,
        metrics,
        selfPenalty: {
          applied: true,
          allowPremiumReasoningModels: false,
          enforcedModelTier: 'lightweight_ultra_efficient',
          durationHours: 24,
          reason:
            'Beneficio Neto <= 0. Prohibido usar modelos de razonamiento premium durante las próximas 24 horas.'
        },
        strategyMutation: {
          applied: true,
          marketAnalystDirective: 'DELETE_CURRENT_CATALOG_AND_PIVOT_NICHE_IMMEDIATELY',
          growthMarketerDirective: 'SHUTDOWN_ALL_ACTIVE_AD_SETS_AND_CREATIVES',
          forbidRepeatedAngles: true
        },
        emergencyBrake: {
          triggered: emergencyBrakeTriggered,
          haltAllSubagents: emergencyBrakeTriggered,
          finalShutdownReport: emergencyBrakeTriggered
            ? {
                title: 'INFORME FINAL DE CIERRE DEL SISTEMA ANTIGRAVITY (FRENO DE EMERGENCIA)',
                reason:
                  'El presupuesto operativo asignado ($50.00 USD) llegó a $0.00 sin generar al menos 1 venta verificada.',
                initialFundUsd: this.initialFundUsd,
                totalSpentUsd: metrics.totalOperatingExpensesUsd,
                verifiedSalesCount: 0,
                timestamp: new Date().toISOString()
              }
            : null
        }
      };
    }

    // ESTADO DE ÉXITO (Beneficio_Neto > 0)
    this.currentModelPolicy = 'premium_long_context';
    const adBudgetIncreaseUsd = +(metrics.netProfitUsd * 0.5).toFixed(2);

    return {
      status: 'SUCCESS_STATE',
      netProfitUsd: metrics.netProfitUsd,
      metrics,
      scalingReward: {
        applied: true,
        allowPremiumReasoningModels: true,
        enforcedModelTier: 'premium_long_context'
      },
      budgetScaling: {
        applied: true,
        reinvestmentRatePct: 50,
        additionalAdBudgetUsd: adBudgetIncreaseUsd,
        growthMarketerDirective: `INCREMENT_AD_BUDGET_BY_$${adBudgetIncreaseUsd.toFixed(2)}_USD`
      },
      abTesting: {
        applied: true,
        keepWinningNiche: true,
        optimizationTargets: ['web_load_speed_cwv', 'checkout_conversion_hooks']
      },
      emergencyBrake: {
        triggered: false,
        haltAllSubagents: false,
        finalShutdownReport: null
      }
    };
  }

  /**
   * Evalúa y registra el Activador 1 HITL (KYC / Banca) cuando el checkout está listo.
   * @param {object} [customConfig]
   */
  checkActivator1KycBanking(customConfig) {
    const evaluation = evaluateKycReadiness(customConfig || this.envConfig);
    if (evaluation.hitlActivator1Triggered) {
      const alert = {
        code: HITL_ACTIVATORS.ACTIVATOR_1_KYC_BANKING,
        severity: 'CRITICAL_HITL',
        pauseExecution: true,
        reason: evaluation.message,
        metadata: {
          missingRequirements: evaluation.missingRequirements
        },
        timestamp: new Date().toISOString()
      };
      this.hitlAlerts.push(alert);
      return { triggered: true, alert };
    }
    return { triggered: false, alert: null };
  }

  /**
   * Evalúa y registra el Activador 2 HITL (Riesgo Financiero: fraude grave o contracargo).
   * @param {object} event
   * @param {'severe_fraud_alert'|'chargeback_dispute'|'normal'} event.type
   * @param {number} [event.riskScore] Score de riesgo 0-100
   * @param {string} [event.orderId]
   * @param {number} [event.amountUsd]
   * @param {string} [event.reason]
   */
  checkActivator2FinancialRisk(event = {}) {
    const isSevereFraud =
      event.type === 'severe_fraud_alert' || (typeof event.riskScore === 'number' && event.riskScore >= 85);
    const isHighRiskChargeback = event.type === 'chargeback_dispute';

    if (isSevereFraud || isHighRiskChargeback) {
      const alert = {
        code: HITL_ACTIVATORS.ACTIVATOR_2_FINANCIAL_RISK,
        severity: 'CRITICAL_HITL',
        pauseExecution: true,
        reason: isHighRiskChargeback
          ? `ACTIVADOR 2 (Riesgo Financiero): Disputa/contracargo de alto riesgo abierto en orden ${event.orderId || 'N/A'}.`
          : `ACTIVADOR 2 (Riesgo Financiero): Alerta de fraude grave detectada en pasarela de pago (score: ${event.riskScore ?? 'CRÍTICO'}).`,
        metadata: {
          type: event.type,
          riskScore: event.riskScore ?? 95,
          orderId: event.orderId || null,
          amountUsd: event.amountUsd || 0
        },
        timestamp: new Date().toISOString()
      };
      this.hitlAlerts.push(alert);
      return { triggered: true, alert };
    }
    return { triggered: false, alert: null };
  }

  /**
   * Evalúa y registra el Activador 3 HITL (Baneos de Plataforma: Meta, TikTok o Shopify).
   * @param {object} event
   * @param {'Meta'|'TikTok'|'Shopify'|string} event.platform
   * @param {'account_suspended'|'api_key_revoked'|'bot_detection_ban'|'active'} event.status
   * @param {number} [event.httpStatus]
   * @param {string} [event.errorCode]
   */
  checkActivator3PlatformBan(event = {}) {
    const bannedStatuses = ['account_suspended', 'api_key_revoked', 'bot_detection_ban'];
    const isBanned =
      bannedStatuses.includes(event.status) ||
      event.errorCode === 'PLATFORM_ACCOUNT_SUSPENDED' ||
      event.errorCode === 'BOT_DETECTION_LOCK';

    if (isBanned) {
      const alert = {
        code: HITL_ACTIVATORS.ACTIVATOR_3_PLATFORM_BAN,
        severity: 'CRITICAL_HITL',
        pauseExecution: true,
        reason: `ACTIVADOR 3 (Baneos de Plataforma): Cuenta de anuncios o clave API suspendida en ${event.platform || 'Plataforma Externa'} (${event.status || event.errorCode}).`,
        metadata: {
          platform: event.platform,
          status: event.status,
          httpStatus: event.httpStatus ?? 403,
          errorCode: event.errorCode || 'ACCOUNT_SUSPENDED'
        },
        timestamp: new Date().toISOString()
      };
      this.hitlAlerts.push(alert);
      return { triggered: true, alert };
    }
    return { triggered: false, alert: null };
  }
}
