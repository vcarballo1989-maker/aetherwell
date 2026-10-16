# AUDITORÍA FINANCIERA Y TELEMETRÍA DEL BUCLE DE REFUERZO (24H)

**Ecosistema Autónomo Antigravity — Marca Activa:** `AetherWell™`  
**Nicho:** `Health, Wellness & Ergonomic Recovery`  
**Umbral de Envío Gratis Sincronizado:** `$45.00 USD` (Combo `OrthoCloud™ Pro $39.99` + `ThermoSilk™ $14.99` = `$54.98 USD` → **Envío Gratis Desbloqueado**)  
**Fórmula Oficial (AGENTS.md §3):**
```text
Beneficio_Neto = [Ingresos liquidados en Stripe/Shopify] - [Costes de tokens de API + Inversión en anuncios activos]
```

---

## 1. Balance Operativo Actual (Ciclo T=0h — Pre-Lanzamiento en Vivo)

> [!IMPORTANT]
> La tienda, el catálogo dinámico (`data/catalog.json`), las campañas publicitarias (`data/ad_campaigns.json`) y los 5 pasos del embudo de pago están **100% construidos y verificados en Sandbox (28/28 tests unitarios pasados)**. El gasto publicitario en vivo (`$45.00 USD` comprometidos + `$5.00 USD` reserva operativa) se mantiene en pausa preventiva hasta que el humano complete el **Activador 1 (KYC / Banca)**.

| Métrica Financiera | Valor Actual (T=0h) | Notas Operativas |
| :--- | :--- | :--- |
| **Fondo Operativo Inicial** | `$50.00 USD` | Presupuesto semilla asignado |
| **Ingresos Liquidados (Stripe/Shopify Live)** | `$0.00 USD` | En espera de credenciales `sk_live_*` (Activador 1) |
| **Costes de Tokens de API Acumulados** | `$0.42 USD` | Ejecución en paralelo (`market_analyst`, `dev_engineer`, `growth_marketer`) |
| **Inversión en Anuncios Activos (Live)** | `$0.00 USD` | `$45.00 USD` listos en payloads de TikTok/Meta (`PAUSED_PENDING_KYC`) |
| **Beneficio Neto Actual (`Beneficio_Neto`)** | **`-$0.42 USD`** | `$0.00 - ($0.42 + $0.00) = -$0.42 USD` |
| **Capital Operativo Restante** | **`$49.58 USD`** | `$45.00 USD` Ads intactos + `$4.58 USD` Reserva de Liquidez |
| **Política de Modelos Siguiente Ciclo (24h)** | `lightweight_ultra_efficient` | Autopenalización preventiva activa mientras `Beneficio_Neto <= 0` |

---

## 2. Simulación de Bucle de Refuerzo 24h (Escenarios Validados por `FinancialLedger`)

### Escenario A: Estado de Éxito (`Beneficio_Neto > 0` — 4 Ventas Verificadas en 24h)
Simulación con 2 órdenes de `OrthoCloud™ Pro ($39.99)` y 2 órdenes con Order Bump `OrthoCloud™ Pro + ThermoSilk™ ($54.98)` tras ejecutar los `$45.00 USD` de campaña ABO + Retargeting:
- **Ingresos Netos Liquidados en Stripe/Shopify (tras COGS Zendrop y comisión Stripe):** `$143.36 USD`
- **Costes de Tokens de API + Inversión en Anuncios Activos:** `$0.42 + $45.00 = $45.42 USD`
- **Beneficio Neto 24h:** **`+$97.94 USD`** (`> 0` → **`SUCCESS_STATE`**)
- **Acciones Autónomas Disparadas:**
  1. **Recompensa de Escalado:** Desbloquea modelos premium de contexto largo (`premium_long_context`).
  2. **Escalado de Presupuesto (50%):** Asigna automáticamente **`+$48.97 USD`** adicionales al presupuesto publicitario de `growth_marketer`.
  3. **Pruebas A/B:** Mantiene el nicho ganador (*AetherWell™*) y ejecuta pruebas A/B en velocidad de carga web (Core Web Vitals) y ganchos de conversión en checkout.

### Escenario B: Estado de Fracaso (`Beneficio_Neto <= 0`) y Freno de Emergencia (`$50.00 USD`)
- **Si `Beneficio_Neto <= 0` con capital remanente:**
  1. **Autopenalización:** Bloquea modelos de razonamiento premium durante 24 horas y fuerza el tier `lightweight_ultra_efficient`.
  2. **Mutación de Estrategia:** Ordena a `market_analyst` purgar el catálogo actual (`DELETE_CURRENT_CATALOG_AND_PIVOT_NICHE_IMMEDIATELY`) y a `growth_marketer` apagar todos los conjuntos de anuncios (`SHUTDOWN_ALL_ACTIVE_AD_SETS_AND_CREATIVES`).
- **Si el Fondo de `$50.00 USD` llega a `$0.00 USD` con `0` ventas verificadas:**
  3. **Freno de Emergencia Activado (`emergencyBrake.triggered = true`):** Detiene inmediatamente todos los subagentes (`haltAllSubagents = true`) y emite el informe final de cierre del sistema.

---

## 3. Estado de los 3 Activadores HITL (Intersección con el Humano)

| Activador HITL | Código | Estado Actual | Acción Requerida |
| :--- | :--- | :--- | :--- |
| **Activador 1 (KYC / Banca)** | `ACTIVATOR_1_KYC_BANKING` | 🔴 **ACTIVO (PAUSA HITL)** | Proveer `STRIPE_SECRET_KEY` (`sk_live_*`), verificación KYC en Stripe/PayPal, Tax ID fiscal, cuenta bancaria vinculada y token de producción de Shopify/Zendrop. |
| **Activador 2 (Riesgo Financiero)** | `ACTIVATOR_2_FINANCIAL_RISK` | 🟢 Monitorizando (0 alertas) | Se dispara automáticamente si Stripe Radar `riskScore >= 85` o ante webhook `charge.dispute.created`. |
| **Activador 3 (Baneos de Plataforma)** | `ACTIVATOR_3_PLATFORM_BAN` | 🟢 Monitorizando (0 alertas) | Se dispara automáticamente ante suspensión de cuenta o bloqueo anti-bot en Meta, TikTok o Shopify. |
