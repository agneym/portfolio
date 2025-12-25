import { useRef, useState, useEffect } from "react";
import { RotateCcw, MousePointerClick } from "lucide-react";
import SpeedSelect from "./SpeedSelect";
import { flushSync } from "react-dom";

// Node configuration with positions for the SVG tree
const TREE_NODES = [
  {
    id: "window",
    label: "Window",
    type: "root",
    x: 400,
    y: 50,
    parentId: null,
  },
  {
    id: "document",
    label: "Document",
    type: "root",
    x: 400,
    y: 120,
    parentId: "window",
  },
  {
    id: "html",
    label: "HTML",
    type: "tag",
    x: 400,
    y: 190,
    parentId: "document",
  },
  { id: "body", label: "BODY", type: "tag", x: 400, y: 260, parentId: "html" },

  // Left Branch
  {
    id: "section",
    label: "SECTION",
    type: "tag",
    x: 220,
    y: 360,
    parentId: "body",
  },
  {
    id: "p",
    label: "P.intro",
    type: "element",
    x: 220,
    y: 450,
    parentId: "section",
  },

  // Right Branch
  { id: "main", label: "MAIN", type: "tag", x: 580, y: 360, parentId: "body" },
  {
    id: "div",
    label: "DIV.card",
    type: "tag",
    x: 580,
    y: 450,
    parentId: "main",
  },
  {
    id: "button",
    label: "BUTTON",
    type: "element",
    x: 580,
    y: 540,
    parentId: "div",
  },
];

type LogEntry = {
  id: number;
  element: string;
  action: string;
  type: string;
};

export default function BubblingVisualizer() {
  const [isDark, setIsDark] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "capture" | "target" | "bubble">(
    "idle",
  );
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(800);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Watch for theme changes
  useEffect(() => {
    const checkDark = () => document.documentElement.classList.contains("dark");
    setIsDark(checkDark());

    const observer = new MutationObserver(() => {
      setIsDark(checkDark());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Helper to get the lineage path from root to a specific node
  const getPath = (targetId: string) => {
    const path: (typeof TREE_NODES)[number][] = [];
    let current = TREE_NODES.find((n) => n.id === targetId);
    while (current) {
      path.unshift(current);
      current = TREE_NODES.find((n) => n.id === current!.parentId);
    }
    return path;
  };

  const simulateEvent = async (targetId: string) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setLogs([]);
    const path = getPath(targetId);

    // --- CAPTURE PHASE (Root -> Target) ---
    setPhase("capture");

    for (let i = 0; i < path.length; i++) {
      const node = path[i];
      if (!node) continue;
      setActiveNodeId(node.id);

      // Check if it's the target (last item)
      if (i === path.length - 1) {
        setPhase("target");
        addLog(node.label, "Target Reached", "target");
      } else {
        addLog(node.label, "Capture Phase", "capture");
      }

      await wait(speed);
    }

    // --- BUBBLE PHASE (Target -> Root) ---
    setPhase("bubble");

    for (let i = path.length - 2; i >= 0; i--) {
      const node = path[i];
      if (!node) continue;
      setActiveNodeId(node.id);
      addLog(node.label, "Bubble Phase", "bubble");
      await wait(speed);
    }

    setPhase("idle");
    setActiveNodeId(null);
    setIsAnimating(false);
    addLog("Event Loop", "Finished", "info");
  };

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const addLog = (element: string, action: string, type: string) => {
    flushSync(() => {
      setLogs((prev) => [...prev, { id: Date.now(), element, action, type }]);
    });
    logContainerRef.current?.scrollTo({
      top: logContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const reset = () => {
    setIsAnimating(false);
    setLogs([]);
    setActiveNodeId(null);
    setPhase("idle");
  };

  // Color Logic
  const getNodeColor = (nodeId: string) => {
    if (activeNodeId !== nodeId)
      return "fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600";
    if (phase === "capture")
      return "fill-rose-100 dark:fill-rose-900/50 stroke-rose-500 dark:stroke-rose-400";
    if (phase === "target")
      return "fill-blue-100 dark:fill-blue-900/50 stroke-blue-500 dark:stroke-blue-400";
    if (phase === "bubble")
      return "fill-emerald-100 dark:fill-emerald-900/50 stroke-emerald-500 dark:stroke-emerald-400";
    return "fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600";
  };

  const getTextColor = (nodeId: string) => {
    if (activeNodeId !== nodeId) return "fill-slate-500 dark:fill-slate-400";
    if (phase === "capture")
      return "fill-rose-700 dark:fill-rose-300 font-bold";
    if (phase === "target") return "fill-blue-700 dark:fill-blue-300 font-bold";
    if (phase === "bubble")
      return "fill-emerald-700 dark:fill-emerald-300 font-bold";
    return "fill-slate-500 dark:fill-slate-400";
  };

  return (
    <div className="mx-[calc(50%-40vw)] flex flex-col gap-6 p-4 font-sans lg:flex-row">
      {/* --- LEFT PANEL: VISUALIZATION --- */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-baseline justify-between border-b border-slate-100 bg-slate-50 p-4 py-8 dark:border-slate-800 dark:bg-slate-800">
          <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-2 gap-y-1 text-slate-900 dark:text-slate-100">
            <MousePointerClick className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <h2 className="my-0! text-slate-900 dark:text-slate-100">
              DOM Event Visualizer
            </h2>
            <p className="col-start-2 my-0! text-sm text-slate-500 dark:text-slate-400">
              Click a node to trigger an event simulation
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded border border-slate-200 px-3 py-1 text-xs font-medium text-slate-900 dark:border-transparent dark:text-slate-100">
              <span>Speed:</span>
              <SpeedSelect
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                disabled={isAnimating}
              />
            </div>
            <button
              onClick={reset}
              disabled={!isAnimating && logs.length === 0}
              className="rounded-full p-2 text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-30 dark:text-slate-200 dark:hover:bg-slate-700"
              title="Reset"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] p-8 dark:bg-[radial-gradient(#475569_1px,transparent_1px)]">
          {/* LEGEND */}
          <div className="absolute top-4 left-4 space-y-2 rounded-lg border border-slate-200 bg-white/90 p-3 text-xs shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/90">
            <div className="mb-1 font-semibold text-slate-600 dark:text-slate-300">
              Event Phases
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <div className="h-3 w-3 rounded-full bg-rose-500"></div>
              <span>Capture (Down)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span>Target</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
              <span>Bubbling (Up)</span>
            </div>
          </div>

          <svg
            width="600"
            height="600"
            viewBox="0 0 800 600"
            className="h-auto max-w-full drop-shadow-xl"
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="0"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
              </marker>
            </defs>

            {/* CONNECTIONS */}
            {TREE_NODES.map((node) => {
              if (!node.parentId) return null;
              const parent = TREE_NODES.find((p) => p.id === node.parentId);
              if (!parent) return null;

              // Determine line color based on active path logic
              let strokeColor = isDark ? "#475569" : "#cbd5e1";
              let strokeWidth = 2;

              // Highlights lines during animation
              if (activeNodeId && phase !== "idle") {
                const isActivePath =
                  (activeNodeId === node.id && phase === "capture") ||
                  (activeNodeId === parent.id && phase === "bubble");

                if (isActivePath) {
                  strokeColor =
                    phase === "capture"
                      ? isDark
                        ? "#fb7185"
                        : "#f43f5e"
                      : isDark
                        ? "#34d399"
                        : "#10b981";
                  strokeWidth = 4;
                }
              }

              return (
                <line
                  key={`link-${node.id}`}
                  x1={parent.x}
                  y1={parent.y + 25}
                  x2={node.x}
                  y2={node.y - 25}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* NODES */}
            {TREE_NODES.map((node) => (
              <g
                key={node.id}
                onClick={() => simulateEvent(node.id)}
                className={`cursor-pointer transition-all duration-300 ${isAnimating ? "cursor-not-allowed" : "hover:opacity-80"}`}
              >
                {/* Shadow/Bg for Node */}
                <rect
                  x={node.x - 80}
                  y={node.y - 25}
                  width="160"
                  height="50"
                  rx="12"
                  className={`${getNodeColor(node.id)} stroke-2 transition-colors duration-300`}
                />

                {/* Node Label */}
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  className={`text-sm font-medium select-none ${getTextColor(node.id)} transition-colors duration-300`}
                >
                  {node.label}
                </text>

                {/* Indicator Circle (shows the 'event' traveling) */}
                {activeNodeId === node.id && (
                  <circle
                    cx={node.x + 65}
                    cy={node.y}
                    r="6"
                    className={`${phase === "capture" ? "fill-rose-500" : phase === "bubble" ? "fill-emerald-500" : "fill-blue-500"} animate-pulse`}
                  />
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* --- RIGHT PANEL: LOGS --- */}
      <div className="flex h-96 w-full flex-col rounded-xl border border-slate-800 bg-slate-900 text-slate-300 shadow-lg lg:h-auto lg:max-h-[calc(100vh-12rem)] lg:w-80 dark:border-slate-600">
        <div className="rounded-t-xl border-b border-slate-700 bg-slate-950 p-4 dark:border-slate-600">
          <h3 className="my-0! flex items-center gap-2 font-mono text-sm font-bold text-slate-300">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Console Output
          </h3>
        </div>

        <div
          className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-4 font-mono text-xs"
          ref={logContainerRef}
        >
          {logs.length === 0 ? (
            <div className="mt-10 text-center text-slate-600 italic">
              Waiting for event...
              <br />
              Click a node in the tree.
            </div>
          ) : (
            logs.map((log, idx) => (
              <div
                key={log.id}
                className="animate-in slide-in-from-left-2 flex gap-2 duration-300"
              >
                <span className="text-slate-600">
                  {(idx + 1).toString().padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span
                      className={`font-bold ${
                        log.type === "capture"
                          ? "text-rose-400"
                          : log.type === "bubble"
                            ? "text-emerald-400"
                            : log.type === "target"
                              ? "text-blue-400"
                              : "text-slate-400"
                      }`}
                    >
                      {log.type.toUpperCase()}
                    </span>
                    <span className="text-slate-500">
                      {new Date(log.id).toLocaleTimeString().split(" ")[0]}
                    </span>
                  </div>
                  <div className="mt-0.5 text-white dark:text-slate-900">
                    <span className="text-slate-400">Node: </span> {log.element}
                  </div>
                  <div className="mt-1 border-l-2 border-slate-700 pl-2 text-slate-500 italic">
                    event.currentTarget === {log.element}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
