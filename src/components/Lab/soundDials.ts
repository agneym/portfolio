import type { DialConfig } from "dialkit";
import type { KeySound } from "components/shared/feedback/audio";

/** DialKit controls for one key sound, starting from its shipped values. */
export function soundDials(sound: KeySound) {
  const { click, tick, thump, bottomOut, envelope, variation, output } = sound;
  return {
    click: {
      filter: {
        type: "select",
        options: ["bandpass", "highpass", "lowpass"],
        default: click.filter,
      },
      frequency: [click.frequency, 200, 12000, 10],
      q: [click.q, 0.1, 20, 0.05],
      decay: [click.decay, 0.003, 0.3, 0.001],
      level: [click.level, 0, 1.5, 0.01],
      rattle: [click.rattle, 0, 0.08, 0.001],
      rattleLevel: [click.rattleLevel, 0, 1.5, 0.01],
    },
    thump: {
      wave: {
        type: "select",
        options: ["sine", "triangle", "square", "sawtooth"],
        default: thump.wave,
      },
      start: [thump.start, 30, 1200, 1],
      end: [thump.end, 20, 1200, 1],
      decay: [thump.decay, 0.005, 0.4, 0.001],
      level: [thump.level, 0, 1.5, 0.01],
    },
    tick: {
      _collapsed: true,
      level: [tick.level, 0, 1.5, 0.01],
      frequency: [tick.frequency, 1000, 16000, 50],
      q: [tick.q, 0.1, 20, 0.05],
      decay: [tick.decay, 0.001, 0.05, 0.001],
      delay: [tick.delay, 0, 0.05, 0.001],
    },
    bottomOut: {
      _collapsed: true,
      level: [bottomOut.level, 0, 1.5, 0.01],
      frequency: [bottomOut.frequency, 80, 6000, 10],
      q: [bottomOut.q, 0.5, 40, 0.1],
      decay: [bottomOut.decay, 0.005, 0.4, 0.001],
      delay: [bottomOut.delay, 0, 0.05, 0.001],
    },
    envelope: {
      attack: [envelope.attack, 0.0005, 0.02, 0.0005],
      length: [envelope.length, 0.25, 4, 0.05],
    },
    variation: {
      pitch: [variation.pitch, 0, 0.5, 0.01],
      level: [variation.level, 0, 0.5, 0.01],
      clickFrequency: [variation.clickFrequency, 0, 0.5, 0.01],
      clickQ: [variation.clickQ, 0, 0.5, 0.01],
      clickDecay: [variation.clickDecay, 0, 0.5, 0.01],
      thumpDecay: [variation.thumpDecay, 0, 0.5, 0.01],
    },
    output: {
      level: [output.level, 0, 3, 0.01],
      tone: [output.tone, 500, 20000, 100],
    },
  } satisfies DialConfig;
}
