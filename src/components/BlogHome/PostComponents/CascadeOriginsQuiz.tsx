import { useState } from "react";
import { Heading } from "@prose-ui/react";

// ---------------------------------------------------------------------------
// Web Audio API sound effects
// ---------------------------------------------------------------------------

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  try {
    if (!audioCtx) {
      audioCtx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

function playWinSound() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    [523, 659, 784].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + i * 0.12 + 0.3,
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.3);
    });
  } catch {
    // Silently ignore audio errors
  }
}

function playLoseSound() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // Silently ignore audio errors
  }
}

// ---------------------------------------------------------------------------

type OriginKey = "userAgentCSS" | "userCSS" | "authorCSS";

interface QuizQuestion {
  /** The HTML element being styled */
  element: string;
  /** CSS from each cascade origin */
  userAgentCSS: string;
  userCSS: string;
  authorCSS: string;
  /** Optional override for visual display order of the stylesheet blocks */
  displayOrder?: OriginKey[];
  /** The question text */
  question: string;
  /** Two possible answers */
  optionA: string;
  optionB: string;
  /** Which option wins */
  correct: "A" | "B";
  /** Why this answer is correct */
  explanation: string;
}

const questions: QuizQuestion[] = [
  {
    element: '<p class="intro">Cascade is the kingmaker 👑</p>',
    userAgentCSS: "p { font-size: 16px; }",
    userCSS: "p { font-size: 18px; }",
    authorCSS: "p { font-size: 14px; }",
    question: "What will the font-size of this paragraph be?",
    optionA: "14px",
    optionB: "18px",
    correct: "A",
    explanation:
      "The Author stylesheet always wins over User and User-Agent origins. Even though the User stylesheet declares a larger font-size, the Author origin has higher priority. The cascade stops at step 3 (Origin) — it never even reaches specificity or order of appearance.",
  },
  {
    element: "<button>Click me</button>",
    userAgentCSS:
      "button {\n  background: buttonface;\n  color: buttontext;\n  border: 2px outset buttonborder;\n}",
    userCSS: "button {\n  background: #6366f1;\n  color: white;\n}",
    authorCSS: "/* Author doesn't set\n   button styles */",
    question: "What background color will this button have?",
    optionA: "buttonface (browser default gray)",
    optionB: "#6366f1 (indigo)",
    correct: "B",
    explanation:
      "Since the Author stylesheet doesn't declare a background for buttons, the cascade falls back to the User origin. User stylesheets (from browser extensions, user settings, or accessibility overrides) beat User-Agent defaults. #6366f1 wins.",
  },
  {
    element:
      '<article id="post"><p>Origin beats specificity — every time.</p></article>',
    userAgentCSS: "p { color: black; }",
    userCSS:
      "#post p {\n  color: #166534;\n  font-weight: bold;\n  /* specificity: 1,0,1 */\n}",
    authorCSS: ".body-text {\n  color: #7c3aed;\n  /* specificity: 0,1,0 */\n}",
    question:
      "User has an ID selector (specificity 1,0,1), Author only has a class (0,1,0). Which color wins?",
    optionA: "#7c3aed (purple, from Author .body-text)",
    optionB: "#166534 (green, from User #post p)",
    correct: "A",
    explanation:
      "Surprising but true: origin priority beats specificity. The cascade checks origin (step 3) before specificity (step 5). Author Normal sits higher in the origin hierarchy than User Normal, so even a weak Author class selector overrides a User ID selector. Specificity only matters within the same origin.",
  },
  {
    element: "<h1>Hello, world!</h1>",
    userAgentCSS: "h1 { font-size: 2em; }",
    userCSS: "h1 { font-size: 1.5em; }",
    authorCSS: "h1 { font-size: 3rem; }",
    displayOrder: ["authorCSS", "userAgentCSS", "userCSS"],
    question:
      "Notice the stylesheets are displayed out of their usual order below. What font-size will the h1 end up with?",
    optionA: "3rem",
    optionB: "1.5em",
    correct: "A",
    explanation:
      "Cascade origins have a fixed priority: Author > User > User-Agent. This order is baked into the browser — it doesn't matter how the stylesheets are visually arranged on this page, in what order they were loaded, or where they appear in the source. Author declarations always beat User declarations, and User always beats User-Agent. The cascade doesn't care about visual order between different origins. The Author's 3rem wins.",
  },
  {
    element: '<p class="alert">⚠️ Important notice</p>',
    userAgentCSS: "p { color: black !important; }",
    userCSS: "p { color: #166534; }",
    authorCSS: "p { color: #1e40af; }",
    question: "What color will the alert text be?",
    optionA: "#1e40af (blue, from Author)",
    optionB: "black (from User-Agent !important)",
    correct: "B",
    explanation:
      "Here's the caveat: !important flips the cascade origin order. A normal Author rule normally beats everything, but an !important declaration from a lower origin (User-Agent) beats normal declarations from higher origins (Author, User). With !important, the priority reverses: User-Agent !important > User !important > Author !important.",
  },
];

const originLabels = [
  { key: "userAgentCSS", label: "User-Agent Stylesheet", color: "amber" },
  { key: "userCSS", label: "User Stylesheet", color: "emerald" },
  { key: "authorCSS", label: "Author Stylesheet", color: "violet" },
] as const;

const colorMap: Record<
  string,
  { bg: string; border: string; text: string; badge: string }
> = {
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-300",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-300",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-200 dark:border-violet-800",
    text: "text-violet-700 dark:text-violet-300",
    badge:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
  },
};

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="m-0 overflow-x-auto p-3 font-mono text-xs leading-relaxed break-all whitespace-pre-wrap text-slate-700 dark:text-slate-300">
      <code>{code}</code>
    </pre>
  );
}

export function CascadeOriginsQuiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<"A" | "B" | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const q = questions[current]!;
  const isCorrect = selected === q.correct;

  const handleSelect = (option: "A" | "B") => {
    if (showResult) return;
    setSelected(option);
    setShowResult(true);
    if (option === q.correct) {
      playWinSound();
    } else {
      playLoseSound();
    }
  };

  const handleNext = () => {
    if (isCorrect) {
      setCompleted((prev) => new Set(prev).add(current));
    }
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setCompleted(new Set());
  };

  const allDone = completed.size === questions.length;
  const isLast = current === questions.length - 1;

  return (
    <div className="not-prose mt-8">
      {/* Header with progress */}
      <div className="mb-6 flex items-center justify-between">
        <Heading level={3} className="text-xl font-bold tracking-tight">
          🧪 Quiz
        </Heading>
        <div className="flex items-center gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === current
                  ? "bg-blue-600 dark:bg-blue-400"
                  : completed.has(i)
                    ? "bg-emerald-500"
                    : "bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>

      {allDone ? (
        /* Completion screen */
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-800 dark:bg-emerald-950/40">
          <div className="mb-3 text-4xl">🎉</div>
          <Heading
            level={4}
            className="mb-2 text-xl font-bold text-emerald-800 dark:text-emerald-300"
          >
            You nailed it!
          </Heading>
          <p className="mb-6 text-sm text-emerald-700 dark:text-emerald-400">
            You understand how cascade origins work. Remember: origins are step
            3 — they determine priority before specificity even comes into play.
          </p>
          <button
            type="button"
            onClick={handleRestart}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Target element */}
          <div className="mb-5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/50">
            <p className="mb-2 text-xs font-semibold tracking-widest text-slate-400 uppercase dark:text-slate-500">
              Target Element
            </p>
            <code className="text-sm font-semibold break-all whitespace-pre-wrap text-slate-800 dark:text-slate-200">
              {q.element}
            </code>
          </div>

          {/* Three stylesheets stacked vertically */}
          <p className="mb-2 text-xs font-semibold tracking-widest text-slate-400 uppercase dark:text-slate-500">
            Stylesheets
          </p>
          <div className="mb-6 flex flex-col">
            {(q.displayOrder ?? originLabels.map((l) => l.key)).map(
              (key, i, arr) => {
                const meta = originLabels.find((l) => l.key === key)!;
                const c = colorMap[meta.color]!;
                const css = q[key];
                const isFirst = i === 0;
                const isLast = i === arr.length - 1;
                return (
                  <div
                    key={key}
                    className={`border-l-4 ${c.border} ${c.bg} px-3 py-2 ${
                      isFirst
                        ? "rounded-t-lg"
                        : isLast
                          ? "rounded-b-lg"
                          : "border-t border-b border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <span
                      className={`mb-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide ${c.badge}`}
                    >
                      {meta.label}
                    </span>
                    <CodeBlock code={css} />
                  </div>
                );
              },
            )}
          </div>

          {/* Question */}
          <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/40">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
              {q.question}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {(["A", "B"] as const).map((opt) => {
              const label = opt === "A" ? q.optionA : q.optionB;
              const isSelected = selected === opt;
              const isCorrectOpt = opt === q.correct;

              let buttonStyle =
                "rounded-xl border-2 p-4 text-left text-sm font-semibold transition-all";
              if (!showResult) {
                buttonStyle +=
                  " border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500 dark:hover:bg-slate-700/50";
              } else if (isCorrectOpt) {
                buttonStyle +=
                  " border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/40";
              } else if (isSelected && !isCorrectOpt) {
                buttonStyle +=
                  " border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-950/40";
              } else {
                buttonStyle +=
                  " border-slate-200 bg-white opacity-50 dark:border-slate-700 dark:bg-slate-800";
              }

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  disabled={showResult}
                  className={buttonStyle}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      {opt}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {label}
                    </span>
                    {showResult && isCorrectOpt && (
                      <span className="ml-auto text-emerald-600 dark:text-emerald-400">
                        ✓
                      </span>
                    )}
                    {showResult && isSelected && !isCorrectOpt && (
                      <span className="ml-auto text-red-500">✗</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <div
              className={`my-5 rounded-xl border p-4 ${
                isCorrect
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
                  : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
              }`}
            >
              <p
                className={`mb-1 text-sm font-semibold ${
                  isCorrect
                    ? "text-emerald-800 dark:text-emerald-300"
                    : "text-amber-800 dark:text-amber-300"
                }`}
              >
                {isCorrect ? "✅ Correct!" : "❌ Not quite."}
              </p>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {q.explanation}
              </p>
            </div>
          )}

          {/* Next / Restart button */}
          {showResult && (
            <button
              type="button"
              onClick={isLast ? handleRestart : handleNext}
              className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {isCorrect
                ? isLast
                  ? "🎉 Finish & Restart"
                  : "Next Question →"
                : "Try Next Question →"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
