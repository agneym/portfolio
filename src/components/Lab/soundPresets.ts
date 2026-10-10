import { KEY_SOUNDS } from "components/shared/feedback/audio";
import type { KeySound } from "components/shared/feedback/audio";

type Overrides = { [K in keyof KeySound]?: Partial<KeySound[K]> };

const alpha: KeySound = KEY_SOUNDS.alpha;

function preset(overrides: Overrides): KeySound {
  const sound = structuredClone(alpha);
  for (const group of Object.keys(overrides) as (keyof KeySound)[]) {
    Object.assign(sound[group], overrides[group]);
  }
  return sound;
}

/** Starting points for the letter keys. "Current" is what ships. */
export const PRESETS: { name: string; hint: string; sound: KeySound }[] = [
  {
    name: "Current",
    hint: "What ships today",
    sound: structuredClone(alpha),
  },
  {
    name: "Thocky",
    hint: "Deep, muted, lubed tactile",
    sound: preset({
      click: { filter: "lowpass", frequency: 1800, q: 0.8, decay: 0.035 },
      thump: { start: 150, end: 60, decay: 0.09, level: 0.75 },
      bottomOut: {
        level: 0.25,
        frequency: 420,
        q: 6,
        decay: 0.06,
        delay: 0.003,
      },
      output: { tone: 5000 },
    }),
  },
  {
    name: "Clicky blue",
    hint: "Sharp double click, light bottom-out",
    sound: preset({
      click: {
        frequency: 4200,
        q: 1.6,
        decay: 0.02,
        level: 0.6,
        rattle: 0.011,
        rattleLevel: 0.75,
      },
      tick: { level: 0.6, frequency: 6500, q: 3, decay: 0.006 },
      thump: { start: 220, end: 120, decay: 0.04, level: 0.3 },
    }),
  },
  {
    name: "Creamy linear",
    hint: "Smooth, soft, even",
    sound: preset({
      click: { filter: "lowpass", frequency: 1200, q: 0.7, decay: 0.03 },
      thump: { start: 130, end: 70, decay: 0.07, level: 0.6 },
      bottomOut: { level: 0.15, frequency: 600, q: 4, decay: 0.05 },
      variation: { pitch: 0.03, level: 0.06, clickFrequency: 0.08 },
      output: { tone: 3500 },
    }),
  },
  {
    name: "Typewriter",
    hint: "Metal type bar, a ring of the frame",
    sound: preset({
      click: {
        frequency: 2600,
        q: 2.5,
        decay: 0.04,
        level: 0.7,
        rattle: 0.02,
        rattleLevel: 0.35,
      },
      tick: { level: 0.5, frequency: 5000, q: 4, decay: 0.012 },
      thump: { start: 300, end: 90, decay: 0.06, level: 0.5 },
      bottomOut: {
        level: 0.45,
        frequency: 1800,
        q: 18,
        decay: 0.08,
        delay: 0.01,
      },
      variation: { pitch: 0.1, level: 0.2 },
    }),
  },
];
