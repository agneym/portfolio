import { useState } from "react";

interface PipelineStep {
  num: number;
  title: string;
  summary: string;
  detail: string;
}

const steps: PipelineStep[] = [
  {
    num: 1,
    title: "Relevance",
    summary: "Is this selector even relevant to the element?",
    detail:
      "Only declarations whose selectors match the element enter the cascade. Everything else is discarded before the real sorting begins.",
  },
  {
    num: 2,
    title: "Importance",
    summary: "Separate !important from normal declarations.",
    detail:
      "Normal and important declarations are sorted separately. An important declaration from a lower origin can beat a normal declaration from a higher origin.",
  },
  {
    num: 3,
    title: "Origin",
    summary: "Where does this rule come from?",
    detail:
      "Order (lowest → highest): User-Agent → User → Author. Browser defaults are the weakest. Your CSS is the strongest — normally.",
  },
  {
    num: 4,
    title: "Cascade Layers",
    summary: "Which @layer does this belong to?",
    detail:
      "This is the new kid. Layers sort by their declared order. Unlayered styles form an implicit final layer that beats all named layers.",
  },
  {
    num: 5,
    title: "Specificity",
    summary: "Compare (A, B, C) weights of selectors.",
    detail:
      "A = IDs, B = classes/attributes/pseudo-classes, C = elements/pseudo-elements. Higher wins. Only compared within the same layer and origin.",
  },
  {
    num: 6,
    title: "Scoping Proximity",
    summary: "Prefer selectors closer to the scope root.",
    detail:
      "When using @scope, declarations from scopes closer to the element win over more distant scopes, regardless of specificity.",
  },
  {
    num: 7,
    title: "Order of Appearance",
    summary: "Last one wins.",
    detail:
      "When everything else is tied — same origin, same layer, same specificity — the rule that appears later in the document wins. This is the final tiebreaker.",
  },
];

export function CascadePipeline() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="not-prose my-8 space-y-3 font-sans">
      {steps.map((step, i) => {
        const isActive = i === activeIndex;
        return (
          <div key={step.num}>
            <button
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`flex w-full items-center gap-4 rounded-lg p-4 text-left transition-colors ${
                isActive
                  ? "border-l-[3px] border-l-blue-600 bg-slate-50 dark:border-l-blue-400 dark:bg-slate-800/60"
                  : "border-l-[3px] border-l-slate-200 hover:bg-slate-50 dark:border-l-slate-700 dark:hover:bg-slate-800/40"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-400"
                }`}
              >
                {step.num}
              </span>
              <div>
                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {step.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {step.summary}
                </p>
              </div>
            </button>
            {isActive && (
              <div className="mx-4 mt-1 mb-2 ml-14 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
                {step.detail}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
