import clsx from "clsx";
import { Link } from "@tanstack/react-router";
import avatarPic from "images/avatar-400x400.jpg";
import GithubIcon from "images/social-media/github.svg?react";
import TwitterIcon from "images/social-media/twitter.svg?react";
import { Hand, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode, RefObject } from "react";
import {
  NAV_SHORTCUTS,
  OPEN_SHEET_EVENT,
  isExternal,
  isTypingTarget,
  shortcutsEnabled,
} from "components/shared/shortcuts";
import { ThemeButton } from "components/shared/ThemeButton";
import {
  feedback,
  setSoundEnabled,
  startFeedback,
} from "components/shared/feedback";
import type { FeedbackKind } from "components/shared/feedback";
import { useSoundEnabled } from "components/shared/feedback/hooks";

/** Board geometry: 32 columns = 8u, so a 1u key spans 4 columns. */
const NAME_ROWS = [
  { letters: "AGNEY", offset: 0 },
  { letters: "MENON", offset: 0 },
] as const;

const SECRET_WORDS = ["agney", "menon"];

const GREETINGS = [
  "Hi! Thanks for stopping by.",
  "That's me. Agney.",
  "You found the Enter key. Nice.",
  "Psst. Press ? for the rest.",
];

type KeyStyle = CSSProperties & { "--i"?: number; "--span"?: number };

function useBoardKeys() {
  const [pressed, setPressed] = useState<ReadonlySet<string>>(new Set());
  const timers = useRef(new Map<string, number>());

  const press = useCallback((id: string, holdMs = 0) => {
    setPressed((current) => new Set(current).add(id));
    window.clearTimeout(timers.current.get(id));
    if (holdMs > 0) {
      timers.current.set(
        id,
        window.setTimeout(() => {
          setPressed((current) => {
            const next = new Set(current);
            next.delete(id);
            return next;
          });
        }, holdMs),
      );
    }
  }, []);

  const release = useCallback((id: string) => {
    setPressed((current) => {
      if (!current.has(id)) return current;
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  }, []);

  return { pressed, press, release };
}

type BoardActions = {
  press: (id: string, duration?: number) => void;
  release: (id: string) => void;
  sayHi: (text?: string) => void;
  type: (letter: string, touch?: boolean) => void;
};

const NAME_LETTERS = new Set("agneymo");

/** Sound and haptics for a physical key press that isn't a plain letter. */
function feedbackForKey(
  event: KeyboardEvent,
  key: string,
  { press, sayHi }: Pick<BoardActions, "press" | "sayHi">,
) {
  if (key === " ") {
    press("space");
    if (!event.repeat) feedback("space");
  } else if (key === "enter" && event.target === document.body) {
    press("enter");
    if (!event.repeat) feedback("enter");
    sayHi();
  }
}

/** The physical keyboard presses the keys on screen. */
function usePhysicalKeyboard(actions: BoardActions) {
  const { press, release, sayHi, type } = actions;
  useEffect(() => {
    const modKeys = new Set(["t", "s", ...NAV_SHORTCUTS.map((nav) => nav.key)]);
    const isModKey = (key: string) =>
      key === "?" || (modKeys.has(key) && shortcutsEnabled());

    const onDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event)) return;
      const key = event.key.toLowerCase();
      if (NAME_LETTERS.has(key)) {
        press(`letter-${key}`);
        if (event.repeat) return;
        feedback("alpha");
        type(key);
      } else if (
        key === " " ||
        (key === "enter" && event.target === document.body)
      ) {
        feedbackForKey(event, key, { press, sayHi });
      } else if (!event.repeat && isModKey(key)) {
        feedback("mod");
      }
    };
    const onUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === " ") release("space");
      else if (key === "enter") release("enter");
      else release(`letter-${key}`);
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [press, release, sayHi, type]);
}

/** Taps and clicks on the decorative keys, handled by delegation. */
function useBoardPointer(
  boardRef: RefObject<HTMLDivElement | null>,
  { press, type }: Pick<BoardActions, "press" | "type">,
) {
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const touch = event.pointerType !== "mouse";
      const key = (event.target as HTMLElement).closest<HTMLElement>(
        ".clack-key",
      );
      if (!key) return;
      feedback((key.dataset.sound ?? "alpha") as FeedbackKind, { touch });
      const target = key.closest<HTMLElement>("[data-toy-key]");
      if (!target) return;
      press(target.dataset.toyKey!, 160);
      const letter = target.dataset.letter;
      if (letter) type(letter, touch);
    };
    board.addEventListener("pointerdown", onPointerDown);
    return () => board.removeEventListener("pointerdown", onPointerDown);
  }, [boardRef, press, type]);
}

/** Alternates the wave animation so repeated greetings restart it. */
function waveAttr(wave: number) {
  if (wave === 0) return undefined;
  return wave % 2 === 0 ? "a" : "b";
}

/** Speech bubble state plus the name-spelling easter egg. */
function useGreeter() {
  const [wave, setWave] = useState(0);
  const [message, setMessage] = useState("");
  const greetingIndex = useRef(0);
  const typed = useRef("");

  const sayHi = useCallback((text?: string) => {
    setWave((count) => count + 1);
    const next = text ?? GREETINGS[greetingIndex.current % GREETINGS.length]!;
    if (!text) greetingIndex.current += 1;
    setMessage(next);
  }, []);

  const type = useCallback(
    (letter: string, touch = false) => {
      typed.current = (typed.current + letter).slice(-8);
      if (SECRET_WORDS.some((word) => typed.current.endsWith(word))) {
        typed.current = "";
        sayHi("You spelled my name. Hello!");
        feedback("wave", { touch });
      }
    },
    [sayHi],
  );

  // The speech bubble says its piece, then gets out of the way.
  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(""), 3200);
    return () => window.clearTimeout(timeout);
  }, [message, wave]);

  return { wave, message, sayHi, type };
}

export function KeyboardHero() {
  const { pressed, press, release } = useBoardKeys();
  const { wave, message, sayHi, type } = useGreeter();
  const boardRef = useRef<HTMLDivElement>(null);

  // Sound and haptics load in the background, off the critical path.
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    return startFeedback(board);
  }, []);

  usePhysicalKeyboard({ press, release, sayHi, type });
  useBoardPointer(boardRef, { press, type });

  const isPressed = (id: string) => pressed.has(id);

  return (
    <section
      aria-labelledby="hero-title"
      className="flex min-w-0 flex-col items-start gap-y-6"
    >
      <h1
        id="hero-title"
        className="text-primary text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold tracking-tight"
      >
        Hey <span aria-hidden>👋</span> I&apos;m
        <span className="sr-only"> Agney Menon</span>
      </h1>

      <div
        ref={boardRef}
        data-wave={waveAttr(wave)}
        className="clack-board bg-plate-deep relative rounded-[var(--radius-plate)] shadow-[inset_0_2px_0_var(--key-highlight),inset_0_-3px_0_var(--color-skirt),0_24px_48px_-20px_var(--key-cast)] lg:-rotate-2"
      >
        {/* Row 1: artisan Esc, A G N E Y, ? */}
        <span
          data-toy-key="artisan"
          data-pressed={isPressed("artisan")}
          style={{ "--i": 0, "--span": 8 } as KeyStyle}
          className="keycap clack-key overflow-hidden p-[calc(var(--u)*0.08)]"
          aria-hidden
        >
          <img
            src={avatarPic}
            alt=""
            width={160}
            height={160}
            className="pointer-events-none size-full rounded-[calc(var(--radius-key)-4px)] object-cover"
          />
        </span>
        <LetterRow
          letters={NAME_ROWS[0].letters}
          isPressed={isPressed}
          firstIndex={1}
        />
        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(new CustomEvent(OPEN_SHEET_EVENT))
          }
          data-pressed={isPressed("help")}
          data-sound="mod"
          style={{ "--i": 6, "--span": 4 } as KeyStyle}
          className="keycap keycap-plain clack-key font-mono text-[calc(var(--u)*0.3)] font-bold"
          aria-label="Keyboard shortcuts"
          aria-keyshortcuts="?"
        >
          ?
        </button>

        {/* Row 2: theme, M E N O N, Enter */}
        <span
          data-sound="mod"
          style={{ "--i": 7, "--span": 6 } as KeyStyle}
          className="clack-key [&>button]:size-full [&>button]:rounded-[var(--radius-key)]"
        >
          <ThemeButton />
        </span>
        <LetterRow
          letters={NAME_ROWS[1].letters}
          isPressed={isPressed}
          firstIndex={8}
        />
        <button
          type="button"
          onClick={(event) => {
            // Keyboard activation (detail 0) has no pointerdown to sound.
            if (event.detail === 0) feedback("enter");
            sayHi();
          }}
          data-pressed={isPressed("enter")}
          data-sound="enter"
          style={{ "--i": 13, "--span": 6 } as KeyStyle}
          className="keycap clack-key flex-col items-start justify-between px-[calc(var(--u)*0.14)] py-[calc(var(--u)*0.12)] text-left [--cap-ink:var(--color-text-on-lemon)] [--cap-skirt:color-mix(in_oklab,var(--color-lemon)_60%,var(--color-primary))] [--cap:var(--color-lemon)]"
          aria-label="Say hi"
        >
          <span className="font-display text-[calc(var(--u)*0.17)] leading-none font-semibold">
            Enter
          </span>
          <Hand aria-hidden className="size-[calc(var(--u)*0.3)] self-end" />
        </button>

        {/* Row 3: the site, as modifier keys */}
        <NavKeys />

        {/* Row 4: socials around the spacebar */}
        <SocialKey
          href="https://github.com/agneym"
          label="My Github Profile"
          index={18}
        >
          <GithubIcon aria-hidden width="45%" />
        </SocialKey>
        <p
          data-toy-key="space"
          data-pressed={isPressed("space")}
          data-sound="space"
          style={{ "--i": 19, "--span": 20 } as KeyStyle}
          className="keycap clack-key text-secondary-strong px-4 text-center text-[clamp(0.8125rem,calc(var(--u)*0.21),1.125rem)] font-bold"
        >
          Web Developer. Storyteller.
        </p>
        <SocialKey
          href="https://twitter.com/agneymenon"
          label="My Twitter Profile"
          index={20}
        >
          <TwitterIcon aria-hidden width="42%" />
        </SocialKey>
        <SoundKey index={21} />

        <p
          aria-live="polite"
          className={clsx(
            "bg-primary text-surface pointer-events-none absolute -top-4 left-[calc(var(--u)*1.2)] z-10 max-w-[16rem] -translate-y-full rounded-2xl rounded-bl-sm px-4 py-2 text-sm font-bold shadow-[0_12px_24px_-10px_var(--key-cast)] transition-[opacity,transform] duration-300 ease-[var(--ease-out-expo)]",
            message ? "opacity-100" : "translate-y-[calc(-100%+6px)] opacity-0",
          )}
        >
          {message}
        </p>
      </div>

      <p className="text-secondary text-sm text-pretty">
        <span className="pointer-coarse:hidden">
          Try typing my name, or press{" "}
          <kbd className="keycap keycap-plain mx-0.5 px-1.5 font-mono text-xs [--travel:2px]">
            ?
          </kbd>{" "}
          for shortcuts.
        </span>
        <span className="hidden pointer-coarse:inline">
          Tap the letters. Spell my name.
        </span>
      </p>
    </section>
  );
}

function NavKeys() {
  return NAV_SHORTCUTS.filter((item) => item.key !== "h").map((item, n) => (
    <NavKey key={item.key} item={item} index={14 + n} />
  ));
}

function NavKey({
  item,
  index,
}: {
  item: (typeof NAV_SHORTCUTS)[number];
  index: number;
}) {
  const shared = {
    className:
      "keycap keycap-mod clack-key clack-nav flex-col items-start justify-between px-[calc(var(--u)*0.14)] py-[calc(var(--u)*0.12)] text-left",
    style: { "--i": index } as KeyStyle,
    "data-sound": "mod",
    "aria-keyshortcuts": item.key,
  };
  const body = (
    <>
      <span
        aria-hidden
        className="font-mono text-[calc(var(--u)*0.15)] leading-none uppercase opacity-80"
      >
        {item.key}
      </span>
      <span className="font-display text-[clamp(0.6875rem,calc(var(--u)*0.2),1rem)] leading-none font-semibold">
        {item.label}
      </span>
    </>
  );
  if (isExternal(item)) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" {...shared}>
        {body}
      </a>
    );
  }
  return (
    <Link to={item.href} {...shared}>
      {body}
    </Link>
  );
}

function LetterRow({
  letters,
  isPressed,
  firstIndex,
}: {
  letters: string;
  isPressed: (id: string) => boolean;
  firstIndex: number;
}) {
  return letters.split("").map((letter, position) => {
    const id = `letter-${letter.toLowerCase()}`;
    return (
      <span
        key={`${letter}-${position}`}
        aria-hidden
        data-toy-key={id}
        data-letter={letter.toLowerCase()}
        data-pressed={isPressed(id)}
        style={{ "--i": firstIndex + position, "--span": 4 } as KeyStyle}
        className="keycap clack-key font-display cursor-pointer items-start justify-start p-[calc(var(--u)*0.12)] text-[calc(var(--u)*0.4)] leading-none font-semibold"
      >
        {letter}
      </span>
    );
  });
}

function SocialKey({
  href,
  label,
  index,
  children,
}: {
  href: string;
  label: string;
  index: number;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{ "--i": index, "--span": 4 } as KeyStyle}
      data-sound="mod"
      className="keycap keycap-plain clack-key"
    >
      {children}
    </a>
  );
}

/**
 * Sound is opt-in: a media key with a lock-light, like Caps Lock. Lit
 * lemon while key sounds are on. The state lives in localStorage.
 */
function SoundKey({ index }: { index: number }) {
  const on = useSoundEnabled();
  const Icon = on ? Volume2 : VolumeX;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Key sounds"
      aria-keyshortcuts="s"
      title={on ? "Key sounds on (s)" : "Key sounds off (s)"}
      onClick={() => setSoundEnabled(!on)}
      data-sound="mod"
      style={{ "--i": index, "--span": 4 } as KeyStyle}
      className="keycap keycap-plain clack-key"
    >
      <Icon aria-hidden className="size-[calc(var(--u)*0.3)]" />
      <span
        aria-hidden
        className={clsx(
          "absolute top-[calc(var(--u)*0.1)] right-[calc(var(--u)*0.1)] size-[calc(var(--u)*0.07)] rounded-full transition-[background-color,box-shadow] duration-200",
          on
            ? "bg-lemon shadow-[0_0_6px_1px_var(--color-lemon)]"
            : "bg-[var(--color-skirt)]",
        )}
      />
    </button>
  );
}
