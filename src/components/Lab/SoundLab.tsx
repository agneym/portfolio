import clsx from "clsx";
import { DialRoot, useDialKitController } from "dialkit";
import type { DialConfig } from "dialkit";
import "dialkit/styles.css";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  KEY_SOUNDS,
  MASTER,
  audioState,
  playKey,
  setMasterVolume,
  unlock,
} from "components/shared/feedback/audio";
import type { KeySound } from "components/shared/feedback/audio";
import { isTypingTarget } from "components/shared/shortcuts";
import { useHydrated } from "components/shared/useHydrated";
import { PRESETS } from "./soundPresets";
import { soundDials } from "./soundDials";

type Voice = keyof typeof KEY_SOUNDS;

// Module level so DialKit sees the same config on every render.
const LETTER_DIALS = {
  ...soundDials(KEY_SOUNDS.alpha),
  master: [MASTER, 0, 1, 0.01],
} satisfies DialConfig;
const SPACE_DIALS = soundDials(KEY_SOUNDS.space);
const ENTER_DIALS = soundDials(KEY_SOUNDS.enter);
const MOD_DIALS = soundDials(KEY_SOUNDS.mod);

const LETTERS = ["a", "g", "n", "e", "y"] as const;
const ROLL_TEXT = "agney menon types agney ";

type TestKey = { id: string; label: string; voice: Voice; span: number };
const TEST_KEYS: TestKey[] = [
  ...LETTERS.map((letter) => ({
    id: letter,
    label: letter.toUpperCase(),
    voice: "alpha" as const,
    span: 1,
  })),
  { id: "mod", label: "Mod", voice: "mod", span: 1.25 },
  { id: "space", label: "", voice: "space", span: 4 },
  { id: "enter", label: "Enter", voice: "enter", span: 1.75 },
];

/** DialKit hands back plain values; the selects come back as strings. */
const asSound = (values: unknown) => values as KeySound;

function useAudioState() {
  const [state, setState] = useState<string>("not started");
  const refresh = useCallback(() => {
    // Let resume() settle before reading the state.
    window.setTimeout(() => setState(audioState() ?? "not started"), 50);
  }, []);
  return [state, refresh] as const;
}

export function SoundLab() {
  const hydrated = useHydrated();
  const { resolvedTheme } = useTheme();
  const [pressed, setPressed] = useState<ReadonlySet<string>>(new Set());
  const [copied, setCopied] = useState("");
  const [preset, setPreset] = useState("Current");
  const [audio, refreshAudio] = useAudioState();
  const rollTimers = useRef<number[]>([]);

  const letters = useDialKitController("Letter keys", LETTER_DIALS, {
    id: "lab-sound-alpha",
    persist: true,
  });
  const space = useDialKitController("Spacebar", SPACE_DIALS, {
    id: "lab-sound-space",
    persist: true,
    defaultCollapsed: true,
  });
  const enter = useDialKitController("Enter", ENTER_DIALS, {
    id: "lab-sound-enter",
    persist: true,
    defaultCollapsed: true,
  });
  const mod = useDialKitController("Modifiers", MOD_DIALS, {
    id: "lab-sound-mod",
    persist: true,
    defaultCollapsed: true,
  });

  // Read the latest dials at play time, so a roll follows live edits.
  const latest = useRef({ letters, space, enter, mod });
  useEffect(() => {
    latest.current = { letters, space, enter, mod };
  });

  const { master } = letters.values;
  useEffect(() => {
    if (audioState()) setMasterVolume(master);
  }, [master]);

  const soundFor = useCallback((voice: Voice): KeySound => {
    const { letters, space, enter, mod } = latest.current;
    const panel = { alpha: letters, space, enter, mod }[voice];
    return asSound(panel.getValues());
  }, []);

  const hit = useCallback(
    (key: TestKey) => {
      unlock();
      setMasterVolume(latest.current.letters.getValues().master);
      playKey(soundFor(key.voice));
      setPressed((current) => new Set(current).add(key.id));
      window.setTimeout(() => {
        setPressed((current) => {
          const next = new Set(current);
          next.delete(key.id);
          return next;
        });
      }, 110);
    },
    [soundFor],
  );

  // Start the AudioContext on the first gesture, in an activating event.
  useEffect(() => {
    const onGesture = () => {
      unlock();
      refreshAudio();
    };
    const gestures = ["pointerup", "keydown", "touchend"] as const;
    for (const type of gestures) {
      window.addEventListener(type, onGesture, { passive: true });
    }
    return () => {
      for (const type of gestures) {
        window.removeEventListener(type, onGesture);
      }
    };
  }, [refreshAudio]);

  // The physical keyboard plays the test keys.
  useEffect(() => {
    const onDown = (event: KeyboardEvent) => {
      if (event.repeat || isTypingTarget(event)) return;
      const target = event.target as HTMLElement | null;
      // Leave Space and Enter to focused buttons and DialKit's controls.
      if (target?.closest("button, [role], .dialkit-root")) {
        if (event.key === " " || event.key === "Enter") return;
      }
      const name = event.key.toLowerCase();
      const key = TEST_KEYS.find(
        (test) =>
          test.id === name ||
          (name === " " && test.id === "space") ||
          (name === "enter" && test.id === "enter") ||
          (name === "shift" && test.id === "mod"),
      );
      if (!key) return;
      if (name === " ") event.preventDefault();
      hit(key);
    };
    window.addEventListener("keydown", onDown);
    return () => window.removeEventListener("keydown", onDown);
  }, [hit]);

  const stopRoll = useCallback(() => {
    for (const timer of rollTimers.current) window.clearTimeout(timer);
    rollTimers.current = [];
  }, []);
  useEffect(() => stopRoll, [stopRoll]);

  /** Human-ish typing: 70 to 160 ms between keys, a beat at each word. */
  const roll = useCallback(() => {
    stopRoll();
    let at = 0;
    for (const char of ROLL_TEXT) {
      const key = TEST_KEYS.find((test) =>
        char === " " ? test.id === "space" : test.id === char,
      );
      at += char === " " ? 190 : 70 + Math.random() * 90;
      const press = key ?? TEST_KEYS[Math.floor(Math.random() * 5)]!;
      rollTimers.current.push(window.setTimeout(() => hit(press), at));
    }
    rollTimers.current.push(
      window.setTimeout(() => hit(TEST_KEYS.at(-1)!), at + 260),
    );
  }, [hit, stopRoll]);

  /** Auto-repeat: one letter, fast and steady, to hear the variation. */
  const repeat = useCallback(() => {
    stopRoll();
    for (let n = 0; n < 24; n++) {
      rollTimers.current.push(
        window.setTimeout(() => hit(TEST_KEYS[0]!), n * 45),
      );
    }
  }, [hit, stopRoll]);

  const applyPreset = (name: string) => {
    const choice = PRESETS.find((item) => item.name === name);
    if (!choice) return;
    letters.setValues(choice.sound);
    setPreset(name);
    unlock();
    window.setTimeout(() => hit(TEST_KEYS[0]!), 30);
  };

  const params = () => {
    const { master, ...alpha } = letters.getValues();
    return {
      master,
      alpha: asSound(alpha),
      space: asSound(space.getValues()),
      enter: asSound(enter.getValues()),
      mod: asSound(mod.getValues()),
    };
  };

  const copy = async () => {
    const json = JSON.stringify(params(), null, 2);
    try {
      await navigator.clipboard.writeText(json);
      setCopied("Copied. Paste it into chat.");
    } catch {
      setCopied("Clipboard blocked: copy the JSON below.");
    }
    window.setTimeout(() => setCopied(""), 3000);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-12 pb-24 sm:px-8 lg:flex-row lg:items-start">
      <main className="flex min-w-0 flex-1 flex-col gap-8">
        <header className="flex flex-col gap-3">
          <p className="text-secondary font-mono text-xs tracking-widest uppercase">
            Lab
          </p>
          <h1 className="text-primary text-4xl font-semibold tracking-tight">
            Key sound playground
          </h1>
          <p className="text-secondary-strong max-w-prose text-pretty">
            Tune the synthesized clack with the dials. Click the keys or type A
            G N E Y, Space, Enter and Shift. Sound plays here even when the
            site&apos;s sound switch is off. Audio:{" "}
            <span data-testid="audio-state" className="font-mono text-sm">
              {audio}
            </span>
          </p>
        </header>

        <div
          className="bg-plate-deep flex w-max max-w-full flex-wrap gap-[calc(var(--u)*0.1)] rounded-[var(--radius-plate)] p-[calc(var(--u)*0.28)] shadow-[inset_0_2px_0_var(--key-highlight),inset_0_-3px_0_var(--color-skirt)] [--u:min(4.5rem,calc((100vw-3rem)/6))]"
          aria-label="Test keys"
        >
          {TEST_KEYS.map((key) => (
            <button
              key={key.id}
              type="button"
              data-key={key.id}
              data-pressed={pressed.has(key.id)}
              onPointerDown={(event) => {
                if (event.button === 0) hit(key);
              }}
              onClick={(event) => {
                // Keyboard activation has no pointerdown.
                if (event.detail === 0) hit(key);
              }}
              style={
                {
                  width: `calc(var(--u) * ${key.span} + var(--u) * 0.1 * ${key.span - 1})`,
                  height: "var(--u)",
                } as CSSProperties
              }
              className={clsx(
                "keycap font-display items-start justify-start p-[calc(var(--u)*0.12)] leading-none font-semibold",
                key.voice === "alpha" && "text-[calc(var(--u)*0.4)]",
                key.voice === "mod" &&
                  "keycap-mod text-[calc(var(--u)*0.2)] font-bold",
                key.voice === "enter" &&
                  "text-[calc(var(--u)*0.2)] [--cap-ink:var(--color-text-on-lemon)] [--cap-skirt:color-mix(in_oklab,var(--color-lemon)_60%,var(--color-primary))] [--cap:var(--color-lemon)]",
              )}
              aria-label={key.label || "Space"}
            >
              {key.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="keycap keycap-mod px-4 py-2 font-bold"
            onClick={roll}
          >
            Typing roll
          </button>
          <button
            type="button"
            className="keycap keycap-mod px-4 py-2 font-bold"
            onClick={repeat}
          >
            Auto-repeat
          </button>
        </div>

        <section className="flex flex-col gap-3" aria-labelledby="presets">
          <h2 id="presets" className="text-primary text-lg font-semibold">
            Letter presets
          </h2>
          <div className="flex flex-wrap gap-3">
            {PRESETS.map((item) => (
              <button
                key={item.name}
                type="button"
                aria-pressed={preset === item.name}
                title={item.hint}
                data-preset={item.name}
                className="keycap keycap-plain flex-col items-start gap-0.5 px-4 py-2 text-left"
                onClick={() => applyPreset(item.name)}
              >
                <span className="font-bold">{item.name}</span>
                <span className="text-xs opacity-75">{item.hint}</span>
              </button>
            ))}
          </div>
          <p className="text-secondary text-sm">
            A preset loads into the Letter keys dials; tweak from there. The
            dials remember your edits in this browser. The panel&apos;s Version
            menu saves versions to compare.
          </p>
        </section>

        <section className="flex flex-col gap-3" aria-labelledby="export">
          <h2 id="export" className="text-primary text-lg font-semibold">
            Take it home
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="keycap px-4 py-2 font-bold [--cap-ink:var(--color-text-on-lemon)] [--cap:var(--color-lemon)]"
              onClick={() => void copy()}
              data-testid="copy-params"
            >
              Copy params
            </button>
            <span aria-live="polite" className="text-secondary text-sm">
              {copied}
            </span>
          </div>
          <details className="text-sm">
            <summary className="text-secondary cursor-pointer">
              Current params (JSON)
            </summary>
            <pre
              data-testid="params-json"
              className="bg-plate-deep mt-2 max-h-96 overflow-auto rounded-xl p-4 font-mono text-xs"
            >
              {JSON.stringify(params(), null, 2)}
            </pre>
          </details>
        </section>
      </main>

      <aside className="w-full lg:sticky lg:top-6 lg:w-80 lg:shrink-0">
        {hydrated && (
          <DialRoot
            mode="inline"
            productionEnabled
            theme={resolvedTheme === "dark" ? "dark" : "light"}
          />
        )}
      </aside>
    </div>
  );
}
