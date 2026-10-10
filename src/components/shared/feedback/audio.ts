/**
 * Clack's switch sounds, synthesized with the Web Audio API. No samples:
 * every press is a filtered noise burst (the click of the stem) plus a
 * pitched-down sine (the thump of the cap bottoming out), varied a little
 * each time so fast typing never sounds like a machine gun.
 *
 * Loaded lazily by `./index.ts`; the AudioContext is only created inside a
 * user gesture, after the visitor has turned sound on.
 */
import type { FeedbackKind } from "./index";

type Voice = {
  /** Noise filter: band-pass centre in Hz and its Q. */
  click: number;
  q: number;
  /** How long the click rings, in seconds. */
  clickDecay: number;
  clickLevel: number;
  /** Thump: start and end pitch in Hz. */
  thump: number;
  thumpEnd: number;
  thumpDecay: number;
  thumpLevel: number;
  /** A softer second click: the stabiliser rattle on long keys. */
  rattle?: number;
};

const VOICES = {
  // Alphas: a crisp, bright clack.
  alpha: {
    click: 3400,
    q: 1.1,
    clickDecay: 0.028,
    clickLevel: 0.55,
    thump: 190,
    thumpEnd: 95,
    thumpDecay: 0.05,
    thumpLevel: 0.45,
  },
  // Spacebar: a deep, round thock with a stabiliser rattle.
  space: {
    click: 1500,
    q: 0.7,
    clickDecay: 0.05,
    clickLevel: 0.45,
    thump: 115,
    thumpEnd: 55,
    thumpDecay: 0.12,
    thumpLevel: 0.7,
    rattle: 0.016,
  },
  // Enter: big and satisfying, between alpha and space.
  enter: {
    click: 2300,
    q: 0.9,
    clickDecay: 0.04,
    clickLevel: 0.5,
    thump: 140,
    thumpEnd: 65,
    thumpDecay: 0.09,
    thumpLevel: 0.6,
    rattle: 0.012,
  },
  // Modifiers and nav keys: a lighter, higher tick.
  mod: {
    click: 4800,
    q: 1.4,
    clickDecay: 0.018,
    clickLevel: 0.4,
    thump: 260,
    thumpEnd: 170,
    thumpDecay: 0.03,
    thumpLevel: 0.25,
  },
} satisfies Record<string, Voice>;

/** Pentatonic notes (Hz), so any run of them sounds sweet. */
const C5 = 523.25;
const D5 = 587.33;
const E5 = 659.25;
const G5 = 783.99;
const A5 = 880;
const C6 = 1046.5;
const E6 = 1318.51;

const MASTER = 0.22;

let ctx: AudioContext | undefined;
let out: GainNode | undefined;
let noise: AudioBuffer | undefined;

const jitter = (amount: number) => 1 + (Math.random() * 2 - 1) * amount;

function context() {
  if (ctx) return ctx;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return undefined;
  try {
    // iOS 17+: mix with the visitor's music instead of pausing it, and
    // stay quiet when the ringer switch is on silent.
    const session = (navigator as { audioSession?: { type: string } })
      .audioSession;
    if (session) session.type = "ambient";
  } catch {
    // Not supported: fine.
  }
  ctx = new Ctor({ latencyHint: "interactive" });

  // A gentle limiter so fast typing never clips.
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -18;
  limiter.ratio.value = 6;
  out = ctx.createGain();
  out.gain.value = MASTER;
  out.connect(limiter).connect(ctx.destination);

  // Half a second of white noise, reused (from a random offset) per press.
  const length = Math.floor(ctx.sampleRate * 0.5);
  noise = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return ctx;
}

/** Call inside a user gesture so the context is allowed to run. */
export function unlock() {
  try {
    const audio = context();
    if (audio?.state === "suspended") void audio.resume();
  } catch {
    // Some browsers refuse outside a gesture; the next press tries again.
  }
}

function envelope(
  audio: AudioContext,
  at: number,
  peak: number,
  decay: number,
) {
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + decay);
  gain.connect(out!);
  return gain;
}

function click(audio: AudioContext, at: number, voice: Voice, level: number) {
  const source = audio.createBufferSource();
  source.buffer = noise!;
  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = voice.click * jitter(0.15);
  filter.Q.value = voice.q * jitter(0.2);
  const decay = voice.clickDecay * jitter(0.15);
  source
    .connect(filter)
    .connect(envelope(audio, at, voice.clickLevel * level, decay));
  source.start(at, Math.random() * 0.4);
  source.stop(at + decay + 0.01);
}

function key(audio: AudioContext, voice: Voice) {
  const at = audio.currentTime + 0.001;
  const level = jitter(0.12);
  click(audio, at, voice, level);
  if (voice.rattle) click(audio, at + voice.rattle, voice, level * 0.45);

  const osc = audio.createOscillator();
  osc.type = "sine";
  const pitch = jitter(0.06);
  osc.frequency.setValueAtTime(voice.thump * pitch, at);
  osc.frequency.exponentialRampToValueAtTime(
    voice.thumpEnd * pitch,
    at + voice.thumpDecay,
  );
  const decay = voice.thumpDecay * jitter(0.1);
  osc.connect(envelope(audio, at, voice.thumpLevel * level, decay));
  osc.start(at);
  osc.stop(at + decay + 0.01);
}

function notes(
  audio: AudioContext,
  pitches: number[],
  {
    step,
    type,
    level,
    length,
  }: {
    step: number;
    type: OscillatorType;
    level: number;
    length: number;
  },
) {
  const start = audio.currentTime + 0.01;
  pitches.forEach((pitch, n) => {
    const at = start + n * step;
    const osc = audio.createOscillator();
    osc.type = type;
    osc.frequency.value = pitch;
    // Square waves are loud and buzzy; round them off.
    const tone = audio.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 3200;
    osc.connect(tone).connect(envelope(audio, at, level, length));
    osc.start(at);
    osc.stop(at + length + 0.02);
  });
}

export function play(kind: FeedbackKind) {
  try {
    const audio = context();
    if (!audio) return;
    if (audio.state === "suspended") void audio.resume();
    switch (kind) {
      case "alpha":
      case "space":
      case "enter":
      case "mod":
        key(audio, VOICES[kind]);
        break;
      case "toggle":
        notes(audio, [E5, A5], {
          step: 0.07,
          type: "triangle",
          level: 0.35,
          length: 0.18,
        });
        break;
      case "wave":
        // One note per letter, timed to roll with the wave down the board.
        notes(audio, [C5, D5, E5, G5, C6], {
          step: 0.085,
          type: "triangle",
          level: 0.4,
          length: 0.4,
        });
        break;
      case "konami-on":
        // A little 8-bit power-up, for the cheat code.
        notes(audio, [G5 / 2, C5, E5, G5, C6, E6], {
          step: 0.06,
          type: "square",
          level: 0.14,
          length: 0.16,
        });
        break;
      case "konami-off":
        notes(audio, [C6, G5, E5, C5], {
          step: 0.06,
          type: "square",
          level: 0.12,
          length: 0.14,
        });
        break;
    }
  } catch {
    // Audio is a garnish; never let it break the keyboard.
  }
}
