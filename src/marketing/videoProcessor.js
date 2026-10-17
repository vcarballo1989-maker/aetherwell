/**
 * @fileoverview Procesador y Renderizador Automático de Vídeos Publicitarios para TikTok Ads España.
 * Elimina el audio de fábrica, normaliza a 9:16 vertical (720x1280), genera locución en español
 * y mezcla una pista musical moderna 100% libre de derechos de autor.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, execSync } from 'node:child_process';
import ffmpegStatic from 'ffmpeg-static';
import { generateModernBeatWav } from './audioSynthesizer.js';

const TIKTOK_PACK_DIR = path.resolve(process.cwd(), 'marketing', 'tiktok_pack');
const OUTPUT_DIR = path.resolve(TIKTOK_PACK_DIR, 'LISTOS_PARA_SUBIR');
const TTS_HELPER_PATH = path.resolve(process.cwd(), 'src', 'marketing', 'tts_helper.ps1');

const CAMPAIGN_ADS = [
  {
    outputFileName: 'ANUNCIO_1_CERVICAL_ESPANA_9x16.mp4',
    sourceVideo: 'video_01_cervical_acupoints_ems_relief.mp4',
    title: 'Alivio Cervical y Descompresión en 10 Minutos (OrthoCloud™ Pro)',
    targetDuration: 22,
    script: '¿Sufres de dolor cervical, rigidez de hombros o migrañas al terminar tu jornada laboral? Descubre OrthoCloud Pro. Su diseño de tracción bidireccional restaura la curvatura natural de tu cuello y libera los nervios pinzados en solo diez minutos al día. Miles de personas en España ya disfrutan de un descanso profundo sin dolor. Con entrega rápida en 24 a 48 horas por Correos Express y pago seguro con tarjeta. Consigue el tuyo hoy en AetherWell.'
  },
  {
    outputFileName: 'ANUNCIO_2_ALIVIO_CUELLO_ESPANA_9x16.mp4',
    sourceVideo: 'video_03_posture_corrector_invisible_9x16.mp4',
    title: 'Corrección Postural Invisible (PostureAlign™ Smart)',
    targetDuration: 20,
    script: 'Si trabajas más de seis horas sentado frente al ordenador, tu espalda acumula una sobrecarga constante. La solución no son más analgésicos, sino corregir la alineación de tu columna. Nuestro corrector inteligente entrena tu memoria muscular de forma totalmente invisible bajo la ropa. Calidad certificada y entrega express a toda España. Entra ahora en AetherWell y siente el alivio desde el primer día.'
  },
  {
    outputFileName: 'ANUNCIO_3_DESCANSO_TOTAL_ESPANA_9x16.mp4',
    sourceVideo: 'video_05_sleep_mask_thermal_compression_9x16.mp4',
    title: 'Descanso Profundo & Crioterapia Térmica (ThermoSilk™ Mask)',
    targetDuration: 24,
    script: 'El descanso profundo que tu mente y tu cuerpo necesitan. Combina la relajación cervical con el antifaz de compresión térmica ThermoSilk para disolver migrañas y estrés ocular en minutos. Fabricación con certificación médica y garantía de devolución de treinta días. Envío gratis en pedidos superiores a cuarenta y cinco euros. Visita AetherWell en el enlace y transforma tus noches.'
  }
];

/**
 * Sintetiza la locución en español usando Windows SAPI (Microsoft Helena Desktop)
 */
function synthesizeVoiceover(text, outputWavPath) {
  try {
    execFileSync('powershell.exe', [
      '-NoProfile',
      '-ExecutionPolicy', 'Bypass',
      '-File', TTS_HELPER_PATH,
      '-Text', text,
      '-OutputFile', outputWavPath
    ], { stdio: 'pipe' });
    return outputWavPath;
  } catch (err) {
    throw new Error(`Error en síntesis TTS: ${err.message}`);
  }
}

/**
 * Obtiene la duración de un archivo de vídeo o audio usando ffmpeg
 */
function getMediaDuration(filePath) {
  try {
    const out = execSync(`"${ffmpegStatic}" -i "${filePath}" 2>&1`, { encoding: 'utf8' });
    const match = out.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
    if (match) {
      const hours = parseFloat(match[1]);
      const minutes = parseFloat(match[2]);
      const seconds = parseFloat(match[3]);
      return hours * 3600 + minutes * 60 + seconds;
    }
  } catch (err) {
    const out = err.stdout || err.stderr || '';
    const match = out.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
    if (match) {
      const hours = parseFloat(match[1]);
      const minutes = parseFloat(match[2]);
      const seconds = parseFloat(match[3]);
      return hours * 3600 + minutes * 60 + seconds;
    }
  }
  return 20.0;
}

/**
 * Procesa un anuncio individual renderizando el vídeo 9:16 con audio remasterizado
 */
export async function processSingleAd(adConfig) {
  const sourcePath = path.join(TIKTOK_PACK_DIR, adConfig.sourceVideo);
  const outputPath = path.join(OUTPUT_DIR, adConfig.outputFileName);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Vídeo de origen no encontrado: ${sourcePath}`);
  }

  const tempVoicePath = path.join(OUTPUT_DIR, `temp_voice_${Date.now()}.wav`);
  const tempBeatPath = path.join(OUTPUT_DIR, `temp_beat_${Date.now()}.wav`);

  try {
    // 1. Sintetizar locución en español
    console.log(`[TTS] Sintetizando voz en español para: ${adConfig.outputFileName}...`);
    synthesizeVoiceover(adConfig.script, tempVoicePath);
    const voiceDuration = getMediaDuration(tempVoicePath);
    const finalDuration = Math.max(voiceDuration + 1.5, adConfig.targetDuration);

    // 2. Generar pista musical moderna libre de derechos
    console.log(`[Music] Sintetizando beat moderno Lo-Fi/Electrónico (${finalDuration.toFixed(1)}s)...`);
    generateModernBeatWav(tempBeatPath, finalDuration + 2);

    // 3. Renderizar en FFmpeg con relación 9:16 vertical (720x1280) y fondo desenfocado
    console.log(`[FFmpeg] Renderizando vídeo vertical 9:16 (720x1280) con mezcla de audio limpia...`);
    const filterComplex = [
      // Video: desenfoque estético de fondo y primer plano centrado manteniendo relación de aspecto
      `[0:v]split=2[v_bg][v_fg];`,
      `[v_bg]scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,boxblur=25:5[bg];`,
      `[v_fg]scale=720:1280:force_original_aspect_ratio=decrease[fg];`,
      `[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1[v_out];`,
      // Audio: Mezclar voz (1.0) con beat musical moderno (-12dB / 0.35)
      `[1:a]volume=1.0[a_voice];`,
      `[2:a]volume=0.32[a_beat];`,
      `[a_voice][a_beat]amix=inputs=2:duration=first:dropout_transition=2[a_out]`
    ].join('');

    const ffmpegArgs = [
      '-y',
      '-stream_loop', '-1', // Repetir vídeo si la locución dura más que el clip
      '-i', sourcePath,
      '-i', tempVoicePath,
      '-i', tempBeatPath,
      '-filter_complex', filterComplex,
      '-map', '[v_out]',
      '-map', '[a_out]',
      '-t', String(finalDuration),
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '22',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-ar', '44100',
      '-movflags', '+faststart',
      outputPath
    ];

    execFileSync(ffmpegStatic, ffmpegArgs, { stdio: 'pipe' });
    const stats = fs.statSync(outputPath);

    console.log(`✓ Vídeo listo: ${adConfig.outputFileName} (${(stats.size / (1024 * 1024)).toFixed(2)} MB, ${finalDuration.toFixed(1)}s, 720x1280 9:16)`);
    return {
      success: true,
      file: adConfig.outputFileName,
      path: outputPath,
      sizeBytes: stats.size,
      sizeMb: +(stats.size / (1024 * 1024)).toFixed(2),
      durationSeconds: +finalDuration.toFixed(1),
      aspectRatio: '9:16 (720x1280)',
      audioCopyrightStatus: '100% ROYALTY_FREE (Synthesized)',
      ttsVoice: 'Microsoft Helena Desktop (es-ES)'
    };
  } finally {
    // Limpieza de temporales
    try { if (fs.existsSync(tempVoicePath)) fs.unlinkSync(tempVoicePath); } catch {}
    try { if (fs.existsSync(tempBeatPath)) fs.unlinkSync(tempBeatPath); } catch {}
  }
}

/**
 * Procesa en lote todos los anuncios publicitarios para TikTok España
 */
export async function processAllTikTokAds() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`================================================================`);
  console.log(`🎬 INICIANDO PROCESAMIENTO AUTOMATIZADO DE VÍDEOS TIKTOK ADS 9:16`);
  console.log(`================================================================`);

  const results = [];
  for (const ad of CAMPAIGN_ADS) {
    try {
      const res = await processSingleAd(ad);
      results.push(res);
    } catch (err) {
      console.error(`✗ Error procesando ${ad.outputFileName}:`, err.message);
      results.push({
        success: false,
        file: ad.outputFileName,
        error: err.message
      });
    }
  }

  console.log(`\n🎉 PROCESAMIENTO FINALIZADO: ${results.filter(r => r.success).length}/${CAMPAIGN_ADS.length} VÍDEOS COMPLETADOS.`);
  return results;
}

// Ejecución directa si se invoca por línea de comandos
if (process.argv[1] && process.argv[1].endsWith('videoProcessor.js')) {
  processAllTikTokAds().then(res => {
    console.log(JSON.stringify(res, null, 2));
  }).catch(console.error);
}
