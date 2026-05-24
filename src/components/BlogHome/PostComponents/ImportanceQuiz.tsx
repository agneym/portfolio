import { useState } from "react";

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

/**
 * A simple two-button quiz placed at the end of the cascade origins post.
 * Asks: which origin needs !important the most?
 * Answer: User Agent — because it's the weakest origin and can never win otherwise.
 */

export function ImportanceQuiz() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const correct = "userAgent";
  const isCorrect = selected === correct;

  const handleSelect = (key: string) => {
    if (showResult) return;
    setSelected(key);
    setShowResult(true);
    if (key === correct) {
      playWinSound();
    } else {
      playLoseSound();
    }
  };

  const handleReset = () => {
    setSelected(null);
    setShowResult(false);
  };

  return (
    <div className="not-prose mt-8 font-sans">
      {!showResult ? (
        /* Question state — two buttons side by side */
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSelect("userAgent")}
            aria-label="User Agent stylesheet"
            className="cursor-pointer rounded-xl border-2 border-slate-200 bg-white p-4 text-left text-sm font-semibold transition-all hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500 dark:hover:bg-slate-700/50"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                A
              </span>
              <span className="text-slate-800 dark:text-slate-200">
                User Agent stylesheet
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleSelect("author")}
            aria-label="Author stylesheet"
            className="cursor-pointer rounded-xl border-2 border-slate-200 bg-white p-4 text-left text-sm font-semibold transition-all hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500 dark:hover:bg-slate-700/50"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                B
              </span>
              <span className="text-slate-800 dark:text-slate-200">
                Author stylesheet
              </span>
            </div>
          </button>
        </div>
      ) : (
        /* Result state */
        <div>
          <div className="grid grid-cols-2 gap-3">
            {(["userAgent", "author"] as const).map((key) => {
              const isThis = key === "userAgent";
              const isSelectedOpt = selected === key;
              const isCorrectOpt = key === correct;

              let className =
                "rounded-xl border-2 p-4 text-left text-sm font-semibold transition-all";
              if (isCorrectOpt) {
                className +=
                  " border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/40";
              } else if (isSelectedOpt && !isCorrectOpt) {
                className +=
                  " border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-950/40";
              } else {
                className +=
                  " border-slate-200 bg-white opacity-50 dark:border-slate-700 dark:bg-slate-800";
              }

              return (
                <div key={key} className={className}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isThis
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                          : "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300"
                      }`}
                    >
                      {isThis ? "A" : "B"}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {isThis ? "User Agent stylesheet" : "Author stylesheet"}
                    </span>
                    {isCorrectOpt && (
                      <span className="ml-auto text-emerald-600 dark:text-emerald-400">
                        ✓
                      </span>
                    )}
                    {isSelectedOpt && !isCorrectOpt && (
                      <span className="ml-auto text-red-500">✗</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          <div
            className={`mt-5 rounded-xl border p-4 ${
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
              Without{" "}
              <code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-xs dark:bg-slate-700">
                !important
              </code>
              , the User Agent stylesheet can <em>never</em> win against Author
              or User styles. It sits at the bottom of the origin hierarchy.
              <code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-xs dark:bg-slate-700">
                !important
              </code>{" "}
              flips the priority order — User Agent !important actually becomes
              the <em>strongest</em> of all. So the origin that benefits most
              from{" "}
              <code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-xs dark:bg-slate-700">
                !important
              </code>{" "}
              is the one that needs it to be relevant at all: User Agent.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
