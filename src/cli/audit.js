/**
 * @fileoverview Generador Oficial de Telemetría Financiera y Auditoría 24h.
 * Ejecuta el Ciclo 1 en vivo procesando los pedidos reales a través del embudo de 5 pasos,
 * sincronizando `data/financial_state.json` y `FINANCIAL_AUDIT_24H.md`.
 */

import { runCycle1Execution } from './run_cycle1.js';

const result = runCycle1Execution();

export default result;
