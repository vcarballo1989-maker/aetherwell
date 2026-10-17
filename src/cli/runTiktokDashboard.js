/**
 * @fileoverview CLI Runner para el Agente Autónomo de TikTok Ads Dashboard.
 * Permite ejecutar acciones directas dentro del navegador del fundador.
 */

import { TikTokDashboardAgent } from '../marketing/tiktokDashboardAgent.js';

async function main() {
  console.log('==============================================================================');
  console.log('   ANTIGRAVITY - AGENTE DE AUTOMATIZACIÓN DE TIKTOK ADS DASHBOARD');
  console.log('==============================================================================');

  const agent = new TikTokDashboardAgent({
    advertiserId: '7607711370196615636',
    draftId: '1829324173694055'
  });

  console.log('[*] Verificando puerto de depuración de Chrome en http://127.0.0.1:9222...');
  const portStatus = await agent.checkPortAvailability();

  if (!portStatus.available) {
    console.warn('\n[!] Chrome no está conectado al puerto 9222.');
    console.log(`    Motivo: ${portStatus.error}`);
    console.log('\n[SOLUCIÓN DE 1 CLIC]:');
    console.log('    Ejecuta el archivo: conectar_tiktok_chrome.bat');
    console.log('    (Se encuentra en: c:\\Users\\victor\\Desktop\\dropshiping\\conectar_tiktok_chrome.bat)');
    console.log('    Reabrirá Chrome con tu borrador (ID: 1829324173694055) y el puerto habilitado.\n');
    process.exit(0);
  }

  console.log(`[+] Conectado a Chrome: ${portStatus.browser}`);
  console.log('[*] Localizando pestaña de TikTok Ads (Borrador: 1829324173694055)...');

  try {
    const pageInfo = await agent.locateOrOpenTikTokPage();
    console.log(`[+] Pestaña activa: "${pageInfo.title}" (${pageInfo.url})`);

    console.log('[*] Configurando creativos, URL de destino y textos de alta conversión...');
    const setupReport = await agent.setupCampaignCreatives({
      displayName: 'AetherWell™ España',
      adText: 'Alivia la tensión en cuello y hombros en solo 10 minutos al día. ¡Envío urgente 24/48h a toda España! 🇪🇸 Pruébalo con garantía de satisfacción.',
      landingUrl: 'https://aetherwell-4crw.onrender.com/',
      cta: 'Compra ahora'
    });
    console.log('[+] Reporte de inyección:', setupReport);

    console.log('[*] Intentando abrir editor nativo de TikTok / Symphony...');
    const editorResult = await agent.openNativeTikTokEditor();
    console.log('[+] Resultado del editor nativo:', editorResult);

    await agent.disconnect();
    console.log('\n[✓] Operación completada con éxito. Sesión del usuario preservada intacta.');
  } catch (err) {
    console.error('[!] Error interactuando con TikTok Ads:', err.message);
    await agent.disconnect().catch(() => {});
  }
}

main().catch(console.error);
