import { useCallback, useEffect, useState } from "react";

const FIXED_CODE = `function useQuery() {
  const trackedProperties = new Set();
  // Do operations
  // ...
  const result = {};
  const resultProxy = new Proxy(result, {
    get(target, prop) {
      trackedProperties.add(prop);
      return target[prop];
    },
  });
  return resultProxy;
}`;

const INITIAL_USER_CODE = `const result = useQuery();
console.log(result.data);
console.log(result.isLoading);`;

const PRESETS = [
  {
    label: "const result = useQuery()",
    code: `const result = useQuery();`,
  },
  {
    label: `const { isLoading } = useQuery()`,
    code: `const { isLoading } = useQuery();`,
  },
  {
    label: `const { isLoading, ...rest } = useQuery()`,
    code: `const { isLoading, ...rest } = useQuery();`,
  },
] as const;

/**
 * Run the user's code with a real Proxy-backed useQuery.
 * Returns the tracked property names.
 */
function executeUserCode(code: string): {
  tracked: string[];
  error: string | null;
} {
  const tracked = new Set<string>();

  // Deep-proxy factory: wraps any object so nested access
  // (result.data.name) still fires the get trap for the parent key.
  const proxyCache = new WeakMap<object, object>();

  function deepProxy(obj: Record<string, unknown>): unknown {
    if (obj === null || typeof obj !== "object") return obj;
    if (proxyCache.has(obj)) return proxyCache.get(obj);

    const proxy = new Proxy(obj, {
      get(target, prop, receiver) {
        if (typeof prop === "symbol")
          return Reflect.get(target, prop, receiver);
        tracked.add(prop);
        const value = Reflect.get(target, prop, receiver);
        if (value !== null && typeof value === "object") {
          return deepProxy(value as Record<string, unknown>);
        }
        return value;
      },
    });
    proxyCache.set(obj, proxy);
    return proxy;
  }

  function useQuery() {
    const result: Record<string, unknown> = {
      data: { name: "John", age: 30 },
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
      isSuccess: true,
      status: "success",
    };
    return deepProxy(result);
  }

  // Silent console so user code with console.log doesn't throw
  const noopConsole = { log: () => {}, error: () => {} };

  try {
    const fn = new Function("useQuery", "console", code);
    fn(useQuery, noopConsole);
    return { tracked: [...tracked].sort(), error: null };
  } catch (err) {
    return {
      tracked: [...tracked].sort(),
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export function NotifyOnChangePropsPlayground() {
  const [userCode, setUserCode] = useState(INITIAL_USER_CODE);
  const [trackedProps, setTrackedProps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setUserCode(e.target.value);
    },
    [],
  );

  useEffect(() => {
    const result = executeUserCode(userCode);
    setTrackedProps(result.tracked);
    setError(result.error);
  }, [userCode]);

  return (
    <div className="not-prose my-8 font-sans">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
          Interactive Playground
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Edit the code snippet on the left — the real Proxy tracks which
          properties you access.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Fixed: useQuery implementation */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                How useQuery works internally
              </span>
            </div>
            <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-relaxed dark:border-slate-700 dark:bg-slate-900">
              <code>{FIXED_CODE}</code>
            </pre>
          </div>

          {/* Editable: user code */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Your code — try editing this
              </span>
            </div>
            <textarea
              value={userCode}
              onChange={handleChange}
              spellCheck={false}
              rows={4}
              aria-label="Editable code snippet"
              className="w-full resize-none rounded-lg border border-blue-300 bg-blue-50/50 p-4 font-mono text-sm leading-relaxed text-slate-800 transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-blue-700 dark:bg-blue-950/30 dark:text-slate-200 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
            />
            {error && (
              <p className="mt-2 font-mono text-xs text-red-500 dark:text-red-400">
                {error}
              </p>
            )}
            <div className="mt-3">
              <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                Click through these or edit the code above:
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setUserCode(preset.code)}
                    className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-600 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: tracked properties */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              trackedProperties
            </span>
          </div>
          <div className="min-h-48 space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            {trackedProps.length === 0 ? (
              <p className="text-sm text-slate-400 italic dark:text-slate-500">
                No properties tracked yet — access useQuery&apos;s result above
              </p>
            ) : (
              <div className="space-y-2">
                <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  {"new Set(["}
                </p>
                <div className="flex flex-wrap gap-2 pl-4">
                  {trackedProps.map((prop) => (
                    <span
                      key={prop}
                      className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 font-mono text-sm font-medium text-amber-800 transition-all dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                      {prop}
                    </span>
                  ))}
                </div>
                <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  {"]) => re-renders only when these change"}
                </p>
              </div>
            )}

            {/* Explanation */}
            <div className="rounded-md border border-slate-200 bg-white/60 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/40">
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {trackedProps.length === 0
                  ? "The Proxy trap records each property you access. Destructure or use dot-notation to see it appear here."
                  : `The Proxy's get trap fired for: ${trackedProps.map((p) => `"${p}"`).join(", ")}. The component will only re-render when one of these properties changes.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
