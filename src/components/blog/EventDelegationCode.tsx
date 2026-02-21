"use client";

import { useEffect, useId, useState } from "react";
import { codeToHtml } from "shiki";

const propagationMethods = [
  { value: "stopPropagation", label: "event.stopPropagation" },
  {
    value: "stopImmediatePropagation",
    label: "event.stopImmediatePropagation",
  },
  {
    value: "nativeStopPropagation",
    label: "event.nativeEvent.stopPropagation",
  },
  {
    value: "nativeStopImmediatePropagation",
    label: "event.nativeEvent.stopImmediatePropagation",
  },
] as const;

type PropagationMethod = (typeof propagationMethods)[number]["value"];

const methodToCodeLine = new Map<PropagationMethod, string>([
  ["stopPropagation", "event.stopPropagation();"],
  ["stopImmediatePropagation", "event.stopImmediatePropagation();"],
  ["nativeStopPropagation", "event.nativeEvent.stopPropagation();"],
  [
    "nativeStopImmediatePropagation",
    "event.nativeEvent.stopImmediatePropagation();",
  ],
]);

const methodToAnswer: Record<PropagationMethod, string[]> = {
  stopPropagation: ["Parent clicked", "Root El clicked"],
  stopImmediatePropagation: ["Parent clicked", "Root El clicked"],
  nativeStopPropagation: ["Parent clicked", "Root El clicked"],
  nativeStopImmediatePropagation: ["Parent clicked"],
};

const getCode = (
  method: PropagationMethod,
) => `import React, { useEffect } from "react";

function App() {
  useEffect(() => {
    const handleDocumentClick = (event) => {
      console.log("Document clicked");
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);
  useEffect(() => {
    const handleRootElClick = (event) => {
      console.log("Root El clicked");
    };
    const rootEl = document.getElementById("root");
    rootEl.addEventListener("click", handleRootElClick);
    return () => {
      rootEl.removeEventListener("click", handleRootElClick);
    };
  }, []);

  const handleParentClick = (event) => {
    ${methodToCodeLine.get(method)}
    console.log("Parent clicked");
  };

  return (
    <div onClick={handleParentClick}>
      <button>Click me!</button>
    </div>
  );
}

export default App;`;

export function EventDelegationCode() {
  const [selectedMethod, setSelectedMethod] =
    useState<PropagationMethod>("stopPropagation");
  const [codeHTML, setCodeHTML] = useState<string>("");
  const groupName = useId();

  useEffect(() => {
    const highlight = async () => {
      const html = await codeToHtml(getCode(selectedMethod), {
        lang: "tsx",
        themes: {
          light: "github-light",
          dark: "tokyo-night",
        },
      });
      setCodeHTML(html);
    };
    void highlight();
  }, [selectedMethod]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {propagationMethods.map((method) => (
          <label
            key={method.value}
            className="flex cursor-pointer items-center gap-2"
          >
            <input
              type="radio"
              name={groupName}
              value={method.value}
              checked={selectedMethod === method.value}
              onChange={(e) =>
                setSelectedMethod(e.target.value as PropagationMethod)
              }
              className="h-4 w-4 accent-blue-600"
            />
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">
              {method.label}
            </code>
          </label>
        ))}
      </div>
      {codeHTML ? (
        <div dangerouslySetInnerHTML={{ __html: codeHTML }} />
      ) : (
        <pre className="rounded-lg bg-gray-100 p-4 dark:bg-gray-900">
          Loading...
        </pre>
      )}
      <div className="space-y-2">
        {propagationMethods.map((method) => (
          <details
            key={method.value}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"
          >
            <summary className="cursor-pointer select-none">
              <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                {method.label}
              </code>
            </summary>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-400">
              {methodToAnswer[method.value].map((log, i) => (
                <li key={i}>
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">
                    {log}
                  </code>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}
