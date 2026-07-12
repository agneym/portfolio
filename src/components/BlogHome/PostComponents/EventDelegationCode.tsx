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
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm break-all">
              {method.label}
            </code>
          </label>
        ))}
      </div>
      {codeHTML ? (
        <div
          className="custom-snippet overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: codeHTML }}
        />
      ) : (
        <pre className="bg-muted rounded-lg p-4">Loading...</pre>
      )}
      <div className="space-y-2">
        {propagationMethods.map((method) => (
          <details
            key={method.value}
            className="border-muted bg-muted rounded-lg border p-4"
          >
            <summary className="cursor-pointer select-none">
              <code className="bg-muted text-secondary rounded px-1.5 py-0.5 text-sm font-medium">
                {method.label}
              </code>
            </summary>
            <ul className="text-secondary mt-3 list-inside list-disc space-y-1 text-sm">
              {methodToAnswer[method.value].map((log, i) => (
                <li key={i}>
                  <code className="bg-muted rounded px-1.5 py-0.5">{log}</code>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}
