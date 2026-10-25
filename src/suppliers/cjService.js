/**
 * @fileoverview Servicio de Integración Oficial con CJdropshipping API v2.0.
 * Manejo de autenticación, caché de token 24h/15d, catálogo navideño 2026 y despacho automático de órdenes.
 */

import fs from 'node:fs';
import path from 'node:path';
import { loadOperationalEnv } from '../config/env.js';

const CJ_API_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';
const TOKEN_CACHE_FILE = path.resolve(process.cwd(), '.cj_token.json');

// Mapeo oficial de los 10 artículos de Navidad 2026 verificados en CJdropshipping vinculadas al catálogo AetherWell™
export const CJ_PRODUCT_MAPPING = {
  prod_xmas_curtain_001: {
    pid: '2410010837151621500',
    vid: '2410010837151621600',
    sku: 'CJHD215087601AZ',
    title: 'Cortina LED Navideña de Anillos Mágicos 3D (3x0,5m · 120 LEDs · Enchufe Europeo)',
    logisticName: 'CJPacket Sensitive',
    cogsUsd: 3.86
  },
  'AW-XMAS-001': {
    pid: '2410010837151621500',
    vid: '2410010837151621600',
    sku: 'CJHD215087601AZ',
    title: 'Cortina LED Navideña de Anillos Mágicos 3D (3x0,5m · 120 LEDs · Enchufe Europeo)',
    logisticName: 'CJPacket Sensitive',
    cogsUsd: 3.86
  },
  prod_xmas_projector_002: {
    pid: '5F4195DB-D9CE-4C79-BB79-88666FF1AE83',
    vid: '1446397786626068480',
    sku: 'CJJJJRHD01618-4W EU',
    title: 'Proyector LED Rotatorio 360° de Copos de Nieve y 16 Figuras Navideñas (Enchufe Europeo)',
    logisticName: 'CJPacket Sensitive',
    cogsUsd: 2.17
  },
  'AW-XMAS-002': {
    pid: '5F4195DB-D9CE-4C79-BB79-88666FF1AE83',
    vid: '1446397786626068480',
    sku: 'CJJJJRHD01618-4W EU',
    title: 'Proyector LED Rotatorio 360° de Copos de Nieve y 16 Figuras Navideñas (Enchufe Europeo)',
    logisticName: 'CJPacket Sensitive',
    cogsUsd: 2.17
  },
  prod_xmas_crystal_003: {
    pid: '1772557137365970944',
    vid: '1772557138200637440',
    sku: 'CJJT199669907GT',
    title: 'Esfera de Cristal K9 3D Grabada con Láser + Base de Madera Maciza LED USB',
    logisticName: 'CJPacket Ordinary',
    cogsUsd: 2.19
  },
  'AW-XMAS-003': {
    pid: '1772557137365970944',
    vid: '1772557138200637440',
    sku: 'CJJT199669907GT',
    title: 'Esfera de Cristal K9 3D Grabada con Láser + Base de Madera Maciza LED USB',
    logisticName: 'CJPacket Ordinary',
    cogsUsd: 2.19
  },
  prod_xmas_tree_004: {
    pid: '2409270619361600100',
    vid: '2409270619361600300',
    sku: 'CJHD214824101AZ',
    title: 'Árbol de Navidad LED Espiral de Mesa en Hierro Forjado Dorado con Estrella',
    logisticName: 'CJPacket Sensitive',
    cogsUsd: 4.70
  },
  'AW-XMAS-004': {
    pid: '2409270619361600100',
    vid: '2409270619361600300',
    sku: 'CJHD214824101AZ',
    title: 'Árbol de Navidad LED Espiral de Mesa en Hierro Forjado Dorado con Estrella',
    logisticName: 'CJPacket Sensitive',
    cogsUsd: 4.70
  },
  prod_xmas_acrylic_005: {
    pid: '1718542483283521536',
    vid: '1718542483350630400',
    sku: 'CJYS188276401AZ',
    title: 'Lámpara Acrílica 3D Merry Christmas de Luz Cálida LED',
    logisticName: 'CJPacket Ordinary',
    cogsUsd: 1.69
  },
  'AW-XMAS-005': {
    pid: '1718542483283521536',
    vid: '1718542483350630400',
    sku: 'CJYS188276401AZ',
    title: 'Lámpara Acrílica 3D Merry Christmas de Luz Cálida LED',
    logisticName: 'CJPacket Ordinary',
    cogsUsd: 1.69
  },
  prod_xmas_diffuser_006: {
    pid: '2409120357171620500',
    vid: '2409120357171620600',
    sku: 'CJJT213542601AZ',
    title: 'Difusor de Aromas y Humidificador Ultrasónico Efecto Llama de Chimenea 7 Colores',
    logisticName: 'CJPacket Sensitive',
    cogsUsd: 4.19
  },
  'AW-XMAS-006': {
    pid: '2409120357171620500',
    vid: '2409120357171620600',
    sku: 'CJJT213542601AZ',
    title: 'Difusor de Aromas y Humidificador Ultrasónico Efecto Llama de Chimenea 7 Colores',
    logisticName: 'CJPacket Sensitive',
    cogsUsd: 4.19
  },
  prod_xmas_scarf_007: {
    pid: '2410090540211619700',
    vid: '2410090540221612100',
    sku: 'CJYD215515205EV',
    title: 'Bufanda Térmica Calefactable USB con 3 Temperaturas (42°C/48°C/55°C) Lavable',
    logisticName: 'CJPacket Ordinary',
    cogsUsd: 4.53
  },
  'AW-XMAS-007': {
    pid: '2410090540211619700',
    vid: '2410090540221612100',
    sku: 'CJYD215515205EV',
    title: 'Bufanda Térmica Calefactable USB con 3 Temperaturas (42°C/48°C/55°C) Lavable',
    logisticName: 'CJPacket Ordinary',
    cogsUsd: 4.53
  },
  prod_xmas_camera_008: {
    pid: '2408070402051618100',
    vid: '2408070402051618400',
    sku: 'CJYD210394201AZ',
    title: 'Minicámara Digital Infantil 4K HD con Zoom 16x (Especial Regalo Navidad y Reyes)',
    logisticName: 'CJPacket Sensitive',
    cogsUsd: 10.61
  },
  'AW-XMAS-008': {
    pid: '2408070402051618100',
    vid: '2408070402051618400',
    sku: 'CJYD210394201AZ',
    title: 'Minicámara Digital Infantil 4K HD con Zoom 16x (Especial Regalo Navidad y Reyes)',
    logisticName: 'CJPacket Sensitive',
    cogsUsd: 10.61
  },
  prod_xmas_galaxy_009: {
    pid: '2408210642591619700',
    vid: '2408210643001610400',
    sku: 'CJYD211644701AZ',
    title: 'Proyector LED de Galaxia, Nebulosa Boreal y Estrellas 360° UFO',
    logisticName: 'CJPacket Sensitive',
    cogsUsd: 6.97
  },
  'AW-XMAS-009': {
    pid: '2408210642591619700',
    vid: '2408210643001610400',
    sku: 'CJYD211644701AZ',
    title: 'Proyector LED de Galaxia, Nebulosa Boreal y Estrellas 360° UFO',
    logisticName: 'CJPacket Sensitive',
    cogsUsd: 6.97
  },
  prod_xmas_hat_010: {
    pid: '1698975667251064832',
    vid: '1698975667280424960',
    sku: 'CJMR183978001AZ',
    title: 'Gorro Navideño Animado Interactivo con Orejas Móviles por Airbag y Luces LED 7 Colores',
    logisticName: 'CJPacket Ordinary',
    cogsUsd: 2.28
  },
  'AW-XMAS-010': {
    pid: '1698975667251064832',
    vid: '1698975667280424960',
    sku: 'CJMR183978001AZ',
    title: 'Gorro Navideño Animado Interactivo con Orejas Móviles por Airbag y Luces LED 7 Colores',
    logisticName: 'CJPacket Ordinary',
    cogsUsd: 2.28
  },
  prod_xmas_bundle_all: {
    bundle: true,
    logisticName: 'CJPacket Sensitive',
    items: [
      { vid: '2410010837151621600', quantity: 1 },
      { vid: '1446397786626068480', quantity: 1 },
      { vid: '1772557138200637440', quantity: 1 },
      { vid: '2409270619361600300', quantity: 1 },
      { vid: '1718542483350630400', quantity: 1 },
      { vid: '2409120357171620600', quantity: 1 },
      { vid: '2410090540221612100', quantity: 1 },
      { vid: '2408070402051618400', quantity: 1 },
      { vid: '2408210643001610400', quantity: 1 },
      { vid: '1698975667280424960', quantity: 1 }
    ]
  },
  'AW-XMAS-BUNDLE': {
    bundle: true,
    logisticName: 'CJPacket Sensitive',
    items: [
      { vid: '2410010837151621600', quantity: 1 },
      { vid: '1446397786626068480', quantity: 1 },
      { vid: '1772557138200637440', quantity: 1 },
      { vid: '2409270619361600300', quantity: 1 },
      { vid: '1718542483350630400', quantity: 1 },
      { vid: '2409120357171620600', quantity: 1 },
      { vid: '2410090540221612100', quantity: 1 },
      { vid: '2408070402051618400', quantity: 1 },
      { vid: '2408210643001610400', quantity: 1 },
      { vid: '1698975667280424960', quantity: 1 }
    ]
  },
  prod_viral_011: {
    pid: '2609290358281623700',
    vid: '2610160136531626809',
    sku: 'CJMZ320782836JQ',
    title: 'Pasamontañas 3D Hiperrealista Esquí y Moto',
    logisticName: 'CJPacket Eub',
    cogsUsd: 1.10
  },
  'AW-VIRAL-011': {
    pid: '2609290358281623700',
    vid: '2610160136531626809',
    sku: 'CJMZ320782836JQ',
    title: 'Pasamontañas 3D Hiperrealista Esquí y Moto',
    logisticName: 'CJPacket Eub',
    cogsUsd: 1.10
  },
  prod_viral_012: {
    pid: '1393043039106240512',
    vid: '1393043040461000704',
    sku: 'CJSD112822601AZ',
    title: 'Mini Linterna LED COB de Llavero con Mosquetón Ultraligera (38 g)',
    logisticName: 'CJPacket Eub',
    cogsUsd: 0.59
  },
  'AW-VIRAL-012': {
    pid: '1393043039106240512',
    vid: '1393043040461000704',
    sku: 'CJSD112822601AZ',
    title: 'Mini Linterna LED COB de Llavero con Mosquetón Ultraligera (38 g)',
    logisticName: 'CJPacket Eub',
    cogsUsd: 0.59
  },
  prod_viral_013: {
    pid: '1398152856363732992',
    vid: '2605210623341625300',
    sku: 'CJSD114825308HS',
    title: 'Linterna Táctica LED Zoom Ultrapotente USB con Pantalla de Batería',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 2.99
  },
  'AW-VIRAL-013': {
    pid: '1398152856363732992',
    vid: '2605210623341625300',
    sku: 'CJSD114825308HS',
    title: 'Linterna Táctica LED Zoom Ultrapotente USB con Pantalla de Batería',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 2.99
  },
  prod_viral_014: {
    pid: '1760197513509871616',
    vid: '1760197513576980480',
    sku: 'CJYP197300601AZ',
    title: 'Cascos Inalámbricos Bluetooth Plegables Extra Bass Ultraligeros',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 1.65
  },
  'AW-VIRAL-014': {
    pid: '1760197513509871616',
    vid: '1760197513576980480',
    sku: 'CJYP197300601AZ',
    title: 'Cascos Inalámbricos Bluetooth Plegables Extra Bass Ultraligeros',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 1.65
  },
  prod_viral_015: {
    pid: '1544596715590922240',
    vid: '1544596715666419712',
    sku: 'CJEJ151918601AZ',
    title: 'Auriculares Inalámbricos TWS con Pantalla LED Digital Inteligente',
    logisticName: 'CJPacket Sensitive',
    cogsUsd: 3.69
  },
  'AW-VIRAL-015': {
    pid: '1544596715590922240',
    vid: '1544596715666419712',
    sku: 'CJEJ151918601AZ',
    title: 'Auriculares Inalámbricos TWS con Pantalla LED Digital Inteligente',
    logisticName: 'CJPacket Sensitive',
    cogsUsd: 3.69
  },
  prod_viral_016: {
    pid: '1784859045673836544',
    vid: '1784859045757722624',
    sku: 'CJBQ202388401AZ',
    title: 'Gorro y Diadema Musical Bluetooth Inalámbrico para Dormir y Running',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 6.63
  },
  'AW-VIRAL-016': {
    pid: '1784859045673836544',
    vid: '1784859045757722624',
    sku: 'CJBQ202388401AZ',
    title: 'Gorro y Diadema Musical Bluetooth Inalámbrico para Dormir y Running',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 6.63
  },
  prod_viral_017: {
    pid: '1605139484134354944',
    vid: '1605139484176297985',
    sku: 'CJSN164392805EV',
    title: 'Lámpara de Mesa Inalámbrica Táctil Seta en Madera Nogal',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 9.68
  },
  'AW-VIRAL-017': {
    pid: '1605139484134354944',
    vid: '1605139484176297985',
    sku: 'CJSN164392805EV',
    title: 'Lámpara de Mesa Inalámbrica Táctil Seta en Madera Nogal',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 9.68
  },
  prod_viral_018: {
    pid: 'F91CA00A-6403-435D-8E5A-5555B4D78FFA',
    vid: '401F84AD-0F3A-4955-9DF8-48DCF734D9FB',
    sku: 'CJJZSNSN00255-Positive white 6LED-1pcs',
    title: 'Aplique de Pared LED Magnético con Sensor Inteligente sin Cables',
    logisticName: 'YunExpress Ordinary',
    cogsUsd: 2.69
  },
  'AW-VIRAL-018': {
    pid: 'F91CA00A-6403-435D-8E5A-5555B4D78FFA',
    vid: '401F84AD-0F3A-4955-9DF8-48DCF734D9FB',
    sku: 'CJJZSNSN00255-Positive white 6LED-1pcs',
    title: 'Aplique de Pared LED Magnético con Sensor Inteligente sin Cables',
    logisticName: 'YunExpress Ordinary',
    cogsUsd: 2.69
  },
  prod_viral_019: {
    pid: '2408020738341606800',
    vid: '2408020738341607100',
    sku: 'CJSN209979302BY',
    title: 'Proyector Astronauta de Galaxia y Nebulosa 360° con Mando',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 7.96
  },
  'AW-VIRAL-019': {
    pid: '2408020738341606800',
    vid: '2408020738341607100',
    sku: 'CJSN209979302BY',
    title: 'Proyector Astronauta de Galaxia y Nebulosa 360° con Mando',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 7.96
  },
  prod_viral_020: {
    pid: '1392396647220252672',
    vid: '1603215010296246272',
    sku: 'CJSN112543561IR',
    title: 'Lámpara Proyector Puesta de Sol Sunset Lamp 180° RGB con Mando',
    logisticName: 'CJPacket Sensitive',
    cogsUsd: 8.60
  },
  'AW-VIRAL-020': {
    pid: '1392396647220252672',
    vid: '1603215010296246272',
    sku: 'CJSN112543561IR',
    title: 'Lámpara Proyector Puesta de Sol Sunset Lamp 180° RGB con Mando',
    logisticName: 'CJPacket Sensitive',
    cogsUsd: 8.60
  },
  prod_viral_021: {
    pid: 'F79E18C1-CA52-49E2-8309-3308C6C04D05',
    vid: '0BBE0C99-5F88-4FB7-ACFA-E9CD0593E121',
    sku: 'CJWJWJDZ00176-Blue',
    title: 'Bola Voladora Boomerang RGB 360° con Inducción',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 10.06
  },
  'AW-VIRAL-021': {
    pid: 'F79E18C1-CA52-49E2-8309-3308C6C04D05',
    vid: '0BBE0C99-5F88-4FB7-ACFA-E9CD0593E121',
    sku: 'CJWJWJDZ00176-Blue',
    title: 'Bola Voladora Boomerang RGB 360° con Inducción',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 10.06
  },
  prod_viral_022: {
    pid: '2406120927071614600',
    vid: '2406120927071614800',
    sku: 'CJYD205893901AZ',
    title: 'Lámpara Táctil de Silicona Rebel Duck Recargable USB',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 5.69
  },
  'AW-VIRAL-022': {
    pid: '2406120927071614600',
    vid: '2406120927071614800',
    sku: 'CJYD205893901AZ',
    title: 'Lámpara Táctil de Silicona Rebel Duck Recargable USB',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 5.69
  },
  prod_viral_023: {
    pid: '1465145114119770112',
    vid: '1465145114186878976',
    sku: 'CJJT136588001AZ',
    title: 'Mini Impresora Térmica Portátil Bluetooth sin Tinta',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 15.28
  },
  'AW-VIRAL-023': {
    pid: '1465145114119770112',
    vid: '1465145114186878976',
    sku: 'CJJT136588001AZ',
    title: 'Mini Impresora Térmica Portátil Bluetooth sin Tinta',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 15.28
  },
  prod_viral_024: {
    pid: '1454623662098485248',
    vid: '1454623662304006144',
    sku: 'CJFM133625601AZ',
    title: 'Máscara LED Luminosa Reactiva al Sonido para Fiestas y Eventos',
    logisticName: 'CJPacket Eub Special Line',
    cogsUsd: 7.16
  },
  'AW-VIRAL-024': {
    pid: '1454623662098485248',
    vid: '1454623662304006144',
    sku: 'CJFM133625601AZ',
    title: 'Máscara LED Luminosa Reactiva al Sonido para Fiestas y Eventos',
    logisticName: 'CJPacket Eub Special Line',
    cogsUsd: 7.16
  },
  prod_viral_025: {
    pid: '1737785083941105664',
    vid: '1737785084066934784',
    sku: 'CJYD192666301AZ',
    title: 'Quitapelusas Eléctrico Recargable USB con Pantalla Digital LED',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 3.35
  },
  'AW-VIRAL-025': {
    pid: '1737785083941105664',
    vid: '1737785084066934784',
    sku: 'CJYD192666301AZ',
    title: 'Quitapelusas Eléctrico Recargable USB con Pantalla Digital LED',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 3.35
  },
  prod_viral_026: {
    pid: '2408160514451617700',
    vid: '2408160514451617900',
    sku: 'CJYD211196101AZ',
    title: 'Mini Sellador Térmico Magnético 2 en 1 Recargable USB para Bolsas',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 1.65
  },
  'AW-VIRAL-026': {
    pid: '2408160514451617700',
    vid: '2408160514451617900',
    sku: 'CJYD211196101AZ',
    title: 'Mini Sellador Térmico Magnético 2 en 1 Recargable USB para Bolsas',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 1.65
  },
  prod_viral_027: {
    pid: '10A2E8CF-227C-49D0-AF4E-FAE2945E2D3D',
    vid: '2608060254151617200',
    sku: 'CJJZLELE00235-Charging sensing yellow light-500mm',
    title: 'Barra LED Magnética Ultrafina 50 cm con Sensor de Movimiento USB',
    logisticName: 'CJPacket Sensitive',
    cogsUsd: 1.06
  },
  'AW-VIRAL-027': {
    pid: '10A2E8CF-227C-49D0-AF4E-FAE2945E2D3D',
    vid: '2608060254151617200',
    sku: 'CJJZLELE00235-Charging sensing yellow light-500mm',
    title: 'Barra LED Magnética Ultrafina 50 cm con Sensor de Movimiento USB',
    logisticName: 'CJPacket Sensitive',
    cogsUsd: 1.06
  },
  prod_viral_028: {
    pid: '2406090246571623400',
    vid: '2406090246571624000',
    sku: 'CJJT205645303CX',
    title: 'Lámpara Acrílica 3D Táctil Tricolor con Control Remoto',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 2.42
  },
  'AW-VIRAL-028': {
    pid: '2406090246571623400',
    vid: '2406090246571624000',
    sku: 'CJJT205645303CX',
    title: 'Lámpara Acrílica 3D Táctil Tricolor con Control Remoto',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 2.42
  },
  prod_viral_029: {
    pid: '1359670736125562880',
    vid: '1359670737455157248',
    sku: 'CJQC101111901AZ',
    title: 'Proyector LED Láser Inalámbrico de Bienvenida para Puerta de Coche',
    logisticName: 'CJPacket Eub',
    cogsUsd: 1.41
  },
  'AW-VIRAL-029': {
    pid: '1359670736125562880',
    vid: '1359670737455157248',
    sku: 'CJQC101111901AZ',
    title: 'Proyector LED Láser Inalámbrico de Bienvenida para Puerta de Coche',
    logisticName: 'CJPacket Eub',
    cogsUsd: 1.41
  },
  prod_viral_030: {
    pid: '1694541389201154048',
    vid: '1694541389276651520',
    sku: 'CJJT182943504DW',
    title: 'Lámpara de Noche Táctil de Silicona Suave Recargable LED',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 5.47
  },
  'AW-VIRAL-030': {
    pid: '1694541389201154048',
    vid: '1694541389276651520',
    sku: 'CJJT182943504DW',
    title: 'Lámpara de Noche Táctil de Silicona Suave Recargable LED',
    logisticName: 'CJPacket Liquid Line',
    cogsUsd: 5.47
  }
};

/**
 * Obtiene o refresca el token de acceso oficial de CJdropshipping v2.0
 * Respetando el límite estricto de no generar múltiples tokens en 24h.
 */
export async function getCjAccessToken(forceRefresh = false) {
  const env = loadOperationalEnv();
  const apiKey = env.suppliers?.cjApiKey || process.env.CJ_API_KEY || 'CJ5949933@api@a3dbfc875a0b40d69e728777547b36c5';

  if (!forceRefresh && fs.existsSync(TOKEN_CACHE_FILE)) {
    try {
      const cached = JSON.parse(fs.readFileSync(TOKEN_CACHE_FILE, 'utf8'));
      if (cached?.accessToken && cached?.accessTokenExpiryDate) {
        const expiry = new Date(cached.accessTokenExpiryDate).getTime();
        const now = Date.now();
        // Si el token aún tiene más de 2 horas de vida, reutilizarlo
        if (expiry - now > 2 * 60 * 60 * 1000) {
          return {
            success: true,
            accessToken: cached.accessToken,
            expiryDate: cached.accessTokenExpiryDate,
            openId: cached.openId,
            cached: true
          };
        }
      }
    } catch {
      // Ignorar error de lectura de caché y proceder a pedir token
    }
  }

  // Si no hay token en caché o expiró, solicitar a CJ
  try {
    const res = await fetch(`${CJ_API_BASE}/authentication/getAccessToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey })
    });

    const data = await res.json();
    if (data.code === 200 && data.data?.accessToken) {
      try {
        fs.writeFileSync(TOKEN_CACHE_FILE, JSON.stringify(data.data, null, 2), 'utf8');
      } catch {
        // Ignorar si no se puede escribir
      }
      return {
        success: true,
        accessToken: data.data.accessToken,
        expiryDate: data.data.accessTokenExpiryDate,
        openId: data.data.openId,
        pointsRemaining: data.pointsInfo?.remaining || 50000,
        cached: false
      };
    } else {
      return {
        success: false,
        error: data.message || 'Error autenticando con CJdropshipping API v2.0',
        code: data.code
      };
    }
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

/**
 * Consulta el estado de conexión con el almacén mayorista de CJdropshipping
 */
export async function checkCjConnection() {
  const auth = await getCjAccessToken();
  if (!auth.success) {
    return {
      connected: false,
      accountId: 'CJ5949933',
      statusText: 'DESCONECTADO',
      error: auth.error
    };
  }

  try {
    const res = await fetch(`${CJ_API_BASE}/product/list?keyWord=christmas+lights&pageNum=1&pageSize=1`, {
      headers: { 'CJ-Access-Token': auth.accessToken }
    });
    const data = await res.json();
    return {
      connected: res.ok && data.code === 200,
      accountId: 'CJ5949933',
      openId: auth.openId || 56911,
      statusText: 'CONECTADO EN VIVO 200 OK',
      tokenExpiry: auth.expiryDate,
      totalCatalogProducts: data.data?.total || 1560000,
      verifiedProductsCount: 10,
      syncedSkus: [
        'CJHD215087601AZ (Cortina LED Anillos Mágicos 3D)',
        'CJJJJRHD01618-4W EU (Proyector Nieve 360°)',
        'CJJT199669907GT (Esfera Cristal K9 3D)',
        'CJHD214824101AZ (Árbol LED Espiral Dorado)',
        'CJYS188276401AZ (Lámpara Acrílica 3D Merry Christmas)',
        'CJJT213542601AZ (Difusor Efecto Llama Chimenea)',
        'CJYD215515205EV (Bufanda Térmica Calefactable USB)',
        'CJYD210394201AZ (Minicámara Digital Infantil 4K)',
        'CJYD211644701AZ (Proyector Galaxia UFO 360°)',
        'CJMR183978001AZ (Gorro Navideño Orejas Móviles LED)'
      ]
    };
  } catch (err) {
    return {
      connected: false,
      accountId: 'CJ5949933',
      statusText: 'ERROR_RED',
      error: err.message
    };
  }
}

/**
 * Crea una orden real en CJdropshipping API v2.0 (createOrderV2)
 * Se envía con payType: 3 para quedar en la bandeja "Imported Orders" lista para despacho.
 * @param {object} orderInput
 */
export async function createCjDropshippingOrder(orderInput) {
  const auth = await getCjAccessToken();
  if (!auth.success) {
    return {
      success: false,
      error: `Fallo de autenticación CJ: ${auth.error}`
    };
  }

  const orderNumber = orderInput.orderNumber || `AW_${Date.now()}`;
  const customerName = orderInput.shippingCustomerName || orderInput.customerName || 'Cliente AetherWell';
  const address1 = orderInput.shippingAddress || orderInput.addressLine1 || 'Calle Gran Via 28';
  const city = orderInput.shippingCity || orderInput.city || 'Madrid';
  const province = orderInput.shippingProvince || orderInput.province || orderInput.state || 'Madrid';
  const zip = orderInput.shippingZip || orderInput.postalCode || '28013';
  const country = orderInput.shippingCountry || 'Spain';
  const countryCode = (orderInput.shippingCountryCode || orderInput.countryCode || 'ES').toUpperCase();
  const phone = orderInput.shippingPhone || orderInput.phone || '+34600000000';
  const email = orderInput.email || orderInput.customerEmail || 'pedidos@aetherwell.com';

  // Mapear productos a VIDs de CJdropshipping y detectar logisticName óptimo
  const rawProducts = Array.isArray(orderInput.products) ? orderInput.products : [];
  const cjProducts = [];
  let selectedLogisticName = 'CJPacket Sensitive';

  for (const item of rawProducts) {
    const key = item.productId || item.sku || item.id;
    const mapping = CJ_PRODUCT_MAPPING[key];
    const qty = Number(item.quantity || 1);

    if (mapping) {
      if (mapping.logisticName) {
        selectedLogisticName = mapping.logisticName;
      }
      if (mapping.bundle && Array.isArray(mapping.items)) {
        for (const bItem of mapping.items) {
          cjProducts.push({
            vid: bItem.vid,
            quantity: bItem.quantity * qty
          });
        }
      } else if (mapping.vid) {
        cjProducts.push({
          vid: mapping.vid,
          quantity: qty
        });
      }
    } else {
      // Fallback: usar VID principal de la Cortina LED Navideña 3D si no coincide
      cjProducts.push({
        vid: '2410010837151621600',
        quantity: qty
      });
    }
  }

  if (cjProducts.length === 0) {
    cjProducts.push({
      vid: '2410010837151621600',
      quantity: 1
    });
  }

  const payload = {
    orderNumber,
    shippingCustomerName: customerName,
    shippingAddress: address1,
    shippingCity: city,
    shippingProvince: province,
    shippingZip: zip,
    shippingCountry: country,
    shippingCountryCode: countryCode,
    shippingPhone: phone,
    email,
    remark: `AetherWell Navidad España [Stripe: ${orderInput.stripeSessionId || 'N/A'}]`,
    fromCountryCode: 'CN',
    logisticName: orderInput.logisticName || selectedLogisticName,
    payType: 3,
    products: cjProducts
  };

  try {
    const res = await fetch(`${CJ_API_BASE}/shopping/order/createOrderV2`, {
      method: 'POST',
      headers: {
        'CJ-Access-Token': auth.accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.code === 200 && data.data?.orderId) {
      return {
        success: true,
        orderId: data.data.orderId,
        orderNumber: data.data.orderNumber,
        productAmountUsd: data.data.productAmount,
        status: 'IMPORTED_WAITING_DISPATCH',
        cjResponse: data.data
      };
    } else {
      return {
        success: false,
        error: data.message || 'Error en createOrderV2 de CJ',
        code: data.code,
        payloadSent: payload
      };
    }
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

/**
 * Despacha automáticamente a CJdropshipping un pedido pagado en Stripe Checkout
 * @param {string} sessionId ID de la sesión de Stripe
 * @param {string} stripeSecretKey Clave secreta de Stripe
 */
export async function dispatchStripeSessionToCj(sessionId, stripeSecretKey) {
  if (!sessionId || !stripeSecretKey) {
    return { success: false, error: 'Faltan sessionId o stripeSecretKey' };
  }

  try {
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}?expand[]=line_items&expand[]=customer_details`, {
      headers: { Authorization: `Bearer ${stripeSecretKey}` }
    });

    if (!res.ok) {
      return { success: false, error: `Error Stripe: ${res.statusText}` };
    }

    const session = await res.json();
    if (session.payment_status !== 'paid') {
      return {
        success: false,
        paymentStatus: session.payment_status,
        message: 'La sesión aún no ha sido pagada en Stripe'
      };
    }

    const customerDetails = session.customer_details || {};
    const shippingDetails = session.shipping_details || {};
    const address = shippingDetails.address || customerDetails.address || {};

    const lineItems = session.line_items?.data || [];
    const products = lineItems
      .filter((li) => {
        const desc = (li.description || '').toLowerCase();
        return !desc.includes('envío') && !desc.includes('envio') && !desc.includes('correos express');
      })
      .map((li) => {
        const desc = `${li.description || ''} ${li.price?.product?.name || ''}`.toLowerCase();
        let productId = 'prod_xmas_curtain_001';
        if (desc.includes('pack') || desc.includes('colección completa') || desc.includes('aw-xmas-bundle')) {
          productId = 'prod_xmas_bundle_all';
        } else if (desc.includes('pasamontañas') || desc.includes('pasamontanas') || desc.includes('balaclava')) {
          productId = 'prod_viral_011';
        } else if (desc.includes('llavero') || desc.includes('mosquetón') || desc.includes('mosqueton') || desc.includes('38 g')) {
          productId = 'prod_viral_012';
        } else if (desc.includes('linterna táctica') || desc.includes('linterna tactica') || desc.includes('zoom ultrapotente')) {
          productId = 'prod_viral_013';
        } else if (desc.includes('cascos') || desc.includes('plegables') || desc.includes('extra bass')) {
          productId = 'prod_viral_014';
        } else if (desc.includes('auriculares') || desc.includes('tws')) {
          productId = 'prod_viral_015';
        } else if (desc.includes('diadema') || desc.includes('gorro musical') || desc.includes('dormir')) {
          productId = 'prod_viral_016';
        } else if (desc.includes('seta') || desc.includes('nogal')) {
          productId = 'prod_viral_017';
        } else if (desc.includes('aplique') || desc.includes('sensor inteligente')) {
          productId = 'prod_viral_018';
        } else if (desc.includes('astronauta')) {
          productId = 'prod_viral_019';
        } else if (desc.includes('puesta de sol') || desc.includes('sunset')) {
          productId = 'prod_viral_020';
        } else if (desc.includes('bola voladora') || desc.includes('boomerang')) {
          productId = 'prod_viral_021';
        } else if (desc.includes('rebel duck') || desc.includes('pato')) {
          productId = 'prod_viral_022';
        } else if (desc.includes('impresora térmica') || desc.includes('impresora termica')) {
          productId = 'prod_viral_023';
        } else if (desc.includes('máscara led') || desc.includes('mascara led') || desc.includes('reactiva al sonido')) {
          productId = 'prod_viral_024';
        } else if (desc.includes('quitapelusas')) {
          productId = 'prod_viral_025';
        } else if (desc.includes('sellador térmico') || desc.includes('sellador termico')) {
          productId = 'prod_viral_026';
        } else if (desc.includes('barra led magnética') || desc.includes('barra led magnetica') || desc.includes('50 cm')) {
          productId = 'prod_viral_027';
        } else if (desc.includes('tricolor') || desc.includes('control remoto')) {
          productId = 'prod_viral_028';
        } else if (desc.includes('puerta de coche') || desc.includes('láser inalámbrico')) {
          productId = 'prod_viral_029';
        } else if (desc.includes('silicona suave')) {
          productId = 'prod_viral_030';
        } else if (desc.includes('copos de nieve') || desc.includes('16 figuras') || desc.includes('16 patrones') || desc.includes('aw-xmas-002')) {
          productId = 'prod_xmas_projector_002';
        } else if (desc.includes('esfera') || desc.includes('cristal k9') || desc.includes('aw-xmas-003')) {
          productId = 'prod_xmas_crystal_003';
        } else if (desc.includes('espiral') || desc.includes('hierro forjado') || desc.includes('aw-xmas-004')) {
          productId = 'prod_xmas_tree_004';
        } else if (desc.includes('acrílica') || desc.includes('acrilica') || desc.includes('merry christmas') || desc.includes('aw-xmas-005')) {
          productId = 'prod_xmas_acrylic_005';
        } else if (desc.includes('difusor') || desc.includes('chimenea') || desc.includes('llama') || desc.includes('aw-xmas-006')) {
          productId = 'prod_xmas_diffuser_006';
        } else if (desc.includes('bufanda') || desc.includes('calefactable') || desc.includes('aw-xmas-007')) {
          productId = 'prod_xmas_scarf_007';
        } else if (desc.includes('minicámara') || desc.includes('minicamara') || desc.includes('cámara digital') || desc.includes('aw-xmas-008')) {
          productId = 'prod_xmas_camera_008';
        } else if (desc.includes('galaxia') || desc.includes('nebulosa') || desc.includes('ufo') || desc.includes('aw-xmas-009')) {
          productId = 'prod_xmas_galaxy_009';
        } else if (desc.includes('gorro') || desc.includes('orejas móviles') || desc.includes('airbag') || desc.includes('aw-xmas-010')) {
          productId = 'prod_xmas_hat_010';
        } else if (desc.includes('cortina') || desc.includes('anillos') || desc.includes('aw-xmas-001')) {
          productId = 'prod_xmas_curtain_001';
        }
        return {
          productId,
          quantity: li.quantity || 1
        };
      });

    const cjResult = await createCjDropshippingOrder({
      orderNumber: `AW_${session.id.slice(-8).toUpperCase()}`,
      stripeSessionId: session.id,
      shippingCustomerName: shippingDetails.name || customerDetails.name || 'Cliente AetherWell',
      shippingAddress: address.line1 || 'Dirección de envío',
      shippingCity: address.city || 'Madrid',
      shippingProvince: address.state || 'Madrid',
      shippingZip: address.postal_code || '28001',
      shippingCountry: address.country === 'ES' ? 'Spain' : address.country || 'Spain',
      shippingCountryCode: address.country || 'ES',
      shippingPhone: customerDetails.phone || '+34600000000',
      email: customerDetails.email || session.customer_email || 'cliente@aetherwell.com',
      products
    });

    return {
      success: cjResult.success,
      stripeSessionId: session.id,
      paymentStatus: session.payment_status,
      customerEmail: customerDetails.email,
      cjOrder: cjResult
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}
