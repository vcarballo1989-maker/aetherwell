/**
 * @fileoverview Generador de música de fondo Lo-Fi / Electrónica Moderna 100% libre de derechos.
 * Sintetizado matemáticamente en PCM puro sin muestras de audio protegidas por copyright.
 */

import fs from 'node:fs';

/**
 * Crea una cabecera RIFF WAV estándar para audio PCM 16-bit estéreo 44.1 kHz
 */
function createWavHeader(dataLength, sampleRate = 44100, channels = 2) {
  const buffer = Buffer.alloc(44);
  const byteRate = sampleRate * channels * 2;
  const blockAlign = channels * 2;

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(dataLength + 36, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20);  // PCM = 1
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40);

  return buffer;
}

/**
 * Genera una pista musical rítmica moderna de fondo (95 BPM) de duración configurable
 * @param {string} outputPath Ruta del archivo .wav
 * @param {number} durationSeconds Duración en segundos
 */
export function generateModernBeatWav(outputPath, durationSeconds = 30) {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const dataLength = numSamples * 4; // 2 canales * 2 bytes
  const pcmBuffer = Buffer.alloc(dataLength);

  const bpm = 96;
  const beatDuration = 60 / bpm;
  const barDuration = beatDuration * 4;

  // Acordes modernos etéreos en Hz: [Fmaj9, G6, Em7, Am7]
  const chords = [
    [174.61, 220.00, 261.63, 329.63], // F, A, C, E
    [196.00, 246.94, 293.66, 392.00], // G, B, D, G
    [164.81, 196.00, 246.94, 293.66], // E, G, B, D
    [220.00, 261.63, 329.63, 440.00]  // A, C, E, A
  ];

  let bufferOffset = 0;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // 1. Progresión Armónica de Sintetizador Lo-Fi
    const chordIndex = Math.floor((t % (barDuration * 4)) / barDuration) % chords.length;
    const currentChord = chords[chordIndex];
    let chordSignal = 0;

    for (let c = 0; c < currentChord.length; c++) {
      const freq = currentChord[c];
      // Oscilador seno con armónico suave y trémolo
      const vibrato = 1.0 + 0.003 * Math.sin(2 * Math.PI * 4.5 * t);
      const tone = Math.sin(2 * Math.PI * freq * vibrato * t);
      const overtone = 0.25 * Math.sin(2 * Math.PI * freq * 2.0 * t);
      chordSignal += (tone + overtone);
    }
    chordSignal = (chordSignal / currentChord.length) * 0.18;

    // 2. Bombo / Sub-Bass Rítmico (beats 0 y 2.5 de cada compás)
    const beatPos = (t % barDuration) / beatDuration;
    let kick = 0;
    const kickTime1 = t % beatDuration;
    if (beatPos < 0.5 && kickTime1 < 0.25) {
      const kickFreq = 110 * Math.exp(-kickTime1 * 22);
      kick = Math.sin(2 * Math.PI * kickFreq * kickTime1) * Math.exp(-kickTime1 * 14) * 0.35;
    }

    // 3. Shaker / Hi-Hat Suave en semicorcheas
    const sixteenth = (t % (beatDuration / 2)) / (beatDuration / 2);
    let hat = 0;
    if (sixteenth < 0.08) {
      // Ruido blanco filtrado suave
      const noise = (Math.random() * 2 - 1);
      hat = noise * Math.exp(-sixteenth * 35) * 0.05;
    }

    // 4. Snare / Palm Slap suave en beats 1 y 3
    let snare = 0;
    const snarePos1 = Math.abs(beatPos - 1.0);
    const snarePos2 = Math.abs(beatPos - 3.0);
    const distToSnare = Math.min(snarePos1, snarePos2);
    if (distToSnare < 0.18) {
      const snareTime = distToSnare;
      const noise = (Math.random() * 2 - 1) * Math.exp(-snareTime * 18);
      const body = Math.sin(2 * Math.PI * 180 * snareTime) * Math.exp(-snareTime * 25);
      snare = (noise * 0.7 + body * 0.3) * 0.12;
    }

    // Mezcla final de la base musical
    let sampleVal = chordSignal + kick + hat + snare;

    // Fade In (primeros 1.5s) y Fade Out (últimos 2s)
    let envelope = 1.0;
    if (t < 1.5) {
      envelope = t / 1.5;
    } else if (t > durationSeconds - 2.0) {
      envelope = Math.max(0, (durationSeconds - t) / 2.0);
    }

    sampleVal = Math.max(-1.0, Math.min(1.0, sampleVal * envelope));
    const intSample = Math.floor(sampleVal * 32767);

    // Escribir canal izquierdo y derecho (Stereo)
    pcmBuffer.writeInt16LE(intSample, bufferOffset);
    pcmBuffer.writeInt16LE(intSample, bufferOffset + 2);
    bufferOffset += 4;
  }

  const header = createWavHeader(dataLength, sampleRate, 2);
  const finalBuffer = Buffer.concat([header, pcmBuffer]);
  fs.writeFileSync(outputPath, finalBuffer);

  return outputPath;
}
