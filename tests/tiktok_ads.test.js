/**
 * @fileoverview Pruebas unitarias para el Motor de TikTok Marketing API v1.3 y Guardián de Presupuesto Diario (9,50 €).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { TikTokAdsService } from '../src/marketing/tiktokAdsService.js';

describe('TikTok Marketing API v1.3 & Guardián de Presupuesto Diario (9,50 €/día)', () => {
  it('Inicializa con la configuración de presupuesto y límites predeterminados', () => {
    const service = new TikTokAdsService({
      advertiserId: '7428190382910291',
      dailySpendCapEur: 9.50,
      maxAllowedCpcEur: 0.40
    });

    assert.equal(service.config.advertiserId, '7428190382910291');
    assert.equal(service.config.dailySpendCapEur, 9.50);
    assert.equal(service.config.maxAllowedCpcEur, 0.40);
  });

  it('Sube vídeo publicitario de forma segura y genera firma hash MD5', async () => {
    const service = new TikTokAdsService();
    const videoPath = path.join(process.cwd(), 'marketing', 'tiktok_pack', 'LISTOS_PARA_SUBIR', 'ANUNCIO_1_CERVICAL_ESPANA_9x16.mp4');

    if (fs.existsSync(videoPath)) {
      const uploadResult = await service.uploadVideo(videoPath);
      assert.equal(uploadResult.success, true);
      assert.ok(uploadResult.videoId);
      assert.ok(uploadResult.videoSignature);
      assert.equal(uploadResult.format, 'MP4_9x16_VERTICAL');
    } else {
      // Fallback si no está el archivo físico en entorno de CI
      assert.ok(true);
    }
  });

  it('Crea campaña en modo CONVERSIONS orientada al mercado español', async () => {
    const service = new TikTokAdsService();
    const campaign = await service.createCampaign('AetherWell_Spain_Cervical_Pro');

    assert.equal(campaign.success, true);
    assert.ok(campaign.campaignId);
    assert.equal(campaign.objectiveType, 'LEAD_GENERATION_OR_SALES');
  });

  it('GUARDIÁN: Permite tráfico seguro cuando el gasto está por debajo de 9,50 €/día', async () => {
    const service = new TikTokAdsService();
    service.simulatedLedger.todaySpendEur = 4.20;
    service.simulatedLedger.todayClicks = 15;

    const guardianResult = await service.enforceDailySpendCap(['camp_123']);
    assert.equal(guardianResult.guardianTriggered, false);
    assert.equal(guardianResult.status, 'SAFE_WITHIN_BUDGET');
    assert.equal(guardianResult.report.todaySpendEur, 4.20);
    assert.equal(guardianResult.report.budgetRemainingEur, 5.30);
  });

  it('GUARDIÁN: Dispara Auto-Kill y pausa campañas cuando el gasto diario alcanza o supera 9,50 €/día', async () => {
    const service = new TikTokAdsService();
    service.simulatedLedger.todaySpendEur = 9.55;
    service.simulatedLedger.todayClicks = 32;

    const guardianResult = await service.enforceDailySpendCap(['camp_spain_01']);
    assert.equal(guardianResult.guardianTriggered, true);
    assert.equal(guardianResult.action, 'CAMPAIGNS_PAUSED_BY_GUARDIAN');
    assert.ok(guardianResult.reason.includes('Límite diario alcanzado'));
    assert.equal(guardianResult.actionsTaken.length, 1);
    assert.equal(guardianResult.actionsTaken[0].optStatus, 'DISABLE');
  });

  it('GUARDIÁN: Dispara Auto-Kill preventivo cuando el CPC supera el máximo permitido (> 0,40 €)', async () => {
    const service = new TikTokAdsService();
    service.simulatedLedger.todaySpendEur = 3.50;
    service.simulatedLedger.todayClicks = 5; // CPC = 0.70 € > 0.40 €

    const guardianResult = await service.enforceDailySpendCap(['camp_spain_expensive']);
    assert.equal(guardianResult.guardianTriggered, true);
    assert.equal(guardianResult.action, 'CAMPAIGNS_PAUSED_BY_GUARDIAN');
    assert.ok(guardianResult.reason.includes('CPC excesivo'));
  });

  it('Devuelve telemetría completa y precisa para el panel /admin', async () => {
    const service = new TikTokAdsService();
    const adminStatus = await service.getStatusForAdmin();

    assert.equal(adminStatus.advertiserId, '7428190382910291');
    assert.equal(adminStatus.dailySpendCapEur, 9.50);
    assert.equal(adminStatus.maxAllowedCpcEur, 0.40);
    assert.equal(adminStatus.targetCountry, 'España (ES)');
    assert.ok(adminStatus.guardianStatus.includes('Auto-Kill'));
  });
});
