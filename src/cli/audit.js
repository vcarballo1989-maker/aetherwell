/**
 * @fileoverview CLI de Auditoría Financiera 24h y Verificación de Estado KYC / Checkout.
 */

import { loadCatalog } from '../catalog/catalogService.js';
import { FinancialLedger } from '../finance/ledger.js';

const catalog = loadCatalog();
const ledger = new FinancialLedger({ initialFundUsd: 50.0 });
const kycStatus = ledger.checkActivator1KycBanking();

console.log(
  JSON.stringify(
    {
      catalogSource: catalog.source,
      activeProductsCount: catalog.products.length,
      initialMetrics: ledger.calculateMetrics(),
      hitlActivator1Status: kycStatus
    },
    null,
    2
  )
);
