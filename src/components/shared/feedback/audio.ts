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

/**
 * Every parameter of one key sound. The shipped voices below are the
 * defaults; the sound lab (/lab/sound) passes its own to `playKey`.
 * Times are in seconds, frequencies in Hz, levels are linear gain.
 */
export type KeySound = {
  /** The stem: a filtered noise burst. */
  click: {
    filter: "bandpass" | "highpass" | "lowpass";
    frequency: number;
    q: number;
    decay: number;
    level: number;
    /** A softer second click after this delay (0: off): stabiliser rattle. */
    rattle: number;
    /** Level of the rattle relative to the click. */
    rattleLevel: number;
  };
  /** An optional, very short high transient on top (level 0: off). */
  tick: {
    level: number;
    frequency: number;
    q: number;
    decay: number;
    delay: number;
  };
  /** The cap bottoming out: a pitch-dropping oscillator. */
  thump: {
    wave: "sine" | "triangle" | "square" | "sawtooth";
    start: number;
    end: number;
    decay: number;
    level: number;
  };
  /** An optional ringing resonance of the case and plate (level 0: off). */
  bottomOut: {
    level: number;
    frequency: number;
    q: number;
    decay: number;
    delay: number;
  };
  envelope: {
    /** Time to peak for every layer. */
    attack: number;
    /** Stretches every decay and delay: 1 is as written. */
    length: number;
  };
  /** Random spread per press, as a fraction (0.1 is ±10%). */
  variation: {
    pitch: number;
    level: number;
    clickFrequency: number;
    clickQ: number;
    clickDecay: number;
    thumpDecay: number;
  };
  output: {
    /** Gain of this voice before the shared master bus. */
    level: number;
    /** Low-pass over the whole voice in Hz (20000: off). */
    tone: number;
  };
};

const BASE = {
  tick: { level: 0, frequency: 7000, q: 2, decay: 0.008, delay: 0 },
  bottomOut: { level: 0, frequency: 900, q: 10, decay: 0.04, delay: 0.004 },
  envelope: { attack: 0.002, length: 1 },
  variation: {
    pitch: 0.06,
    level: 0.12,
    clickFrequency: 0.15,
    clickQ: 0.2,
    clickDecay: 0.15,
    thumpDecay: 0.1,
  },
  output: { level: 1, tone: 20000 },
} satisfies Partial<KeySound>;

export const KEY_SOUNDS = {
  // Alphas: a crisp, bright clack.
  alpha: {
    ...BASE,
    click: {
      filter: "bandpass",
      frequency: 3400,
      q: 1.1,
      decay: 0.028,
      level: 0.55,
      rattle: 0,
      rattleLevel: 0.45,
    },
    thump: { wave: "sine", start: 190, end: 95, decay: 0.05, level: 0.45 },
  },
  // Spacebar: a deep, round thock with a stabiliser rattle.
  space: {
    ...BASE,
    click: {
      filter: "bandpass",
      frequency: 1500,
      q: 0.7,
      decay: 0.05,
      level: 0.45,
      rattle: 0.016,
      rattleLevel: 0.45,
    },
    thump: { wave: "sine", start: 115, end: 55, decay: 0.12, level: 0.7 },
  },
  // Enter: big and satisfying, between alpha and space.
  enter: {
    ...BASE,
    click: {
      filter: "bandpass",
      frequency: 2300,
      q: 0.9,
      decay: 0.04,
      level: 0.5,
      rattle: 0.012,
      rattleLevel: 0.45,
    },
    thump: { wave: "sine", start: 140, end: 65, decay: 0.09, level: 0.6 },
  },
  // Modifiers and nav keys: a lighter, higher tick.
  mod: {
    ...BASE,
    click: {
      filter: "bandpass",
      frequency: 4800,
      q: 1.4,
      decay: 0.018,
      level: 0.4,
      rattle: 0,
      rattleLevel: 0.45,
    },
    thump: { wave: "sine", start: 260, end: 170, decay: 0.03, level: 0.25 },
  },
} satisfies Record<string, KeySound>;

/** Pentatonic notes (Hz), so any run of them sounds sweet. */
const C5 = 523.25;
const D5 = 587.33;
const E5 = 659.25;
const G5 = 783.99;
const A5 = 880;
const C6 = 1046.5;
const E6 = 1318.51;

export const MASTER = 0.22;

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
  destination: AudioNode = out!,
  attack = 0.002,
) {
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0001), at + attack);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    at + Math.max(decay, attack + 0.002),
  );
  gain.connect(destination);
  return gain;
}

/** A filtered noise burst: the click, the tick, and the bottom-out ring. */
function burst(
  audio: AudioContext,
  bus: AudioNode,
  at: number,
  {
    filter: type,
    frequency,
    q,
    decay,
    level,
    attack,
  }: {
    filter: BiquadFilterType;
    frequency: number;
    q: number;
    decay: number;
    level: number;
    attack: number;
  },
) {
  const source = audio.createBufferSource();
  source.buffer = noise!;
  // Long lab decays outlast the buffer from a late offset; wrap around.
  source.loop = true;
  const filter = audio.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = frequency;
  filter.Q.value = q;
  source
    .connect(filter)
    .connect(envelope(audio, at, level, decay, bus, attack));
  source.start(at, Math.random() * 0.4);
  source.stop(at + decay + 0.01);
}

function click(
  audio: AudioContext,
  bus: AudioNode,
  at: number,
  sound: KeySound,
  level: number,
) {
  const { click, variation, envelope: env } = sound;
  burst(audio, bus, at, {
    filter: click.filter,
    frequency: click.frequency * jitter(variation.clickFrequency),
    q: click.q * jitter(variation.clickQ),
    decay: click.decay * env.length * jitter(variation.clickDecay),
    level: click.level * level,
    attack: env.attack,
  });
}

/** Play one key with the given parameters (defaults: `KEY_SOUNDS`). */
function key(audio: AudioContext, sound: KeySound) {
  const at = audio.currentTime + 0.001;
  const { envelope: env, variation, output } = sound;
  const stretch = env.length;

  // Per-voice bus: level, and an optional low-pass over the whole voice.
  let bus: AudioNode = out!;
  if (output.tone < 20000) {
    const tone = audio.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = output.tone;
    tone.connect(bus);
    bus = tone;
  }
  if (output.level !== 1) {
    const gain = audio.createGain();
    gain.gain.value = output.level;
    gain.connect(bus);
    bus = gain;
  }

  const level = jitter(variation.level);
  if (sound.click.level > 0) {
    click(audio, bus, at, sound, level);
    if (sound.click.rattle > 0) {
      click(
        audio,
        bus,
        at + sound.click.rattle * stretch,
        sound,
        level * sound.click.rattleLevel,
      );
    }
  }

  const { tick, bottomOut } = sound;
  if (tick.level > 0) {
    burst(audio, bus, at + tick.delay * stretch, {
      filter: "bandpass",
      frequency: tick.frequency * jitter(variation.clickFrequency),
      q: tick.q,
      decay: tick.decay * stretch * jitter(variation.clickDecay),
      level: tick.level * level,
      attack: env.attack / 2,
    });
  }
  if (bottomOut.level > 0) {
    burst(audio, bus, at + bottomOut.delay * stretch, {
      filter: "bandpass",
      frequency: bottomOut.frequency * jitter(variation.pitch),
      q: bottomOut.q,
      decay: bottomOut.decay * stretch * jitter(variation.thumpDecay),
      level: bottomOut.level * level,
      attack: env.attack,
    });
  }

  const { thump } = sound;
  if (thump.level <= 0) return;
  const osc = audio.createOscillator();
  osc.type = thump.wave;
  const pitch = jitter(variation.pitch);
  osc.frequency.setValueAtTime(thump.start * pitch, at);
  osc.frequency.exponentialRampToValueAtTime(
    thump.end * pitch,
    at + thump.decay * stretch,
  );
  const decay = thump.decay * stretch * jitter(variation.thumpDecay);
  osc.connect(envelope(audio, at, thump.level * level, decay, bus, env.attack));
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

/** Play a key with custom parameters: the sound lab's entry point. */
export function playKey(sound: KeySound) {
  try {
    const audio = context();
    if (!audio) return;
    if (audio.state === "suspended") void audio.resume();
    key(audio, sound);
  } catch {
    // Never let a bad dial break the page.
  }
}

/** "running" once a gesture has started audio; undefined before. */
export function audioState() {
  return ctx?.state;
}

/** The shared bus gain for every sound (default `MASTER`). */
export function setMasterVolume(volume: number) {
  context();
  if (out) out.gain.value = volume;
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
        key(audio, KEY_SOUNDS[kind]);
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
