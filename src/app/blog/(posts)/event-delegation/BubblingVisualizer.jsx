"use client";

import React, { useRef, useState } from "react";
import { RotateCcw, MousePointerClick } from "lucide-react";
import { useTheme } from "next-themes";
import { SpeedSelect } from "./SpeedSelect";
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

export const BubblingVisualizer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle, capture, target, bubble
  const [logs, setLogs] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(800);
  const logContainerRef = useRef(null);

  // Helper to get the lineage path from root to a specific node
  const getPath = (targetId) => {
    const path = [];
    let current = TREE_NODES.find((n) => n.id === targetId);
    while (current) {
      path.unshift(current);
      current = TREE_NODES.find((n) => n.id === current.parentId);
    }
    return path;
  };

  const simulateEvent = async (targetId) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setLogs([]);
    const path = getPath(targetId);

    // --- CAPTURE PHASE (Root -> Target) ---
    setPhase("capture");

    for (let i = 0; i < path.length; i++) {
      const node = path[i];
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

    // We go backwards, starting from parent of target up to root
    // Note: The target itself fires in "target" phase, but conceptually is part of bubble flow logic often
    // Standard DOM event flow: Capture -> Target -> Bubble.
    // The "Target" node usually fires listeners for both capture (if set) and bubble.
    // For visualization simplicity, we move UP from the target immediately.

    for (let i = path.length - 2; i >= 0; i--) {
      const node = path[i];
      setActiveNodeId(node.id);
      addLog(node.label, "Bubble Phase", "bubble");
      await wait(speed);
    }

    setPhase("idle");
    setActiveNodeId(null);
    setIsAnimating(false);
    addLog("Event Loop", "Finished", "info");
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const addLog = (element, action, type) => {
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
  const getNodeColor = (nodeId) => {
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

  const getTextColor = (nodeId) => {
    if (activeNodeId !== nodeId) return "fill-slate-500 dark:fill-slate-400";
    if (phase === "capture")
      return "fill-rose-700 dark:fill-rose-300 font-bold";
    if (phase === "target") return "fill-blue-700 dark:fill-blue-300 font-bold";
    if (phase === "bubble")
      return "fill-emerald-700 dark:fill-emerald-300 font-bold";
    return "fill-slate-500 dark:fill-slate-400";
  };

  return (
    <div className="p-4 font-sans flex flex-col lg:flex-row gap-6 mx-[calc(50%-40vw)]">
      {/* --- LEFT PANEL: VISUALIZATION --- */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-baseline bg-slate-50 dark:bg-slate-800 py-8">
          <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-y-1 gap-x-2 text-slate-900 dark:text-slate-100 items-center">
            <MousePointerClick className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <h2 className="text-slate-900 dark:text-slate-100 my-0!">
              DOM Event Visualizer
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 my-0! col-start-2">
              Click a node to trigger an event simulation
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded border border-slate-200 dark:border-transparent text-xs font-medium text-slate-900 dark:text-slate-100">
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
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors disabled:opacity-30 text-slate-700 dark:text-slate-200"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 relative overflow-auto flex justify-center items-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:16px_16px] p-8">
          {/* LEGEND */}
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm text-xs space-y-2">
            <div className="font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Event Phases
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <span>Capture (Down)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Target</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span>Bubbling (Up)</span>
            </div>
          </div>

          <svg
            width="600"
            height="600"
            viewBox="0 0 800 600"
            className="max-w-full h-auto drop-shadow-xl"
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

              // Determine line color based on active path logic
              let strokeColor = isDark ? "#475569" : "#cbd5e1"; // slate-600 in dark, slate-300 in light
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
                        : "#f43f5e" // rose-400 in dark, rose-500 in light
                      : isDark
                        ? "#34d399"
                        : "#10b981"; // emerald-400 in dark, emerald-500 in light
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
                  className={`${getNodeColor(node.id)} transition-colors duration-300 stroke-2`}
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
      <div className="w-full lg:w-80 bg-slate-900 text-slate-300 rounded-xl shadow-lg border border-slate-800 dark:border-slate-600 flex flex-col h-96 lg:h-auto lg:max-h-[calc(100vh-12rem)]">
        <div className="p-4 border-b border-slate-700 dark:border-slate-600 bg-slate-950 rounded-t-xl">
          <h3 className="font-mono text-sm font-bold text-slate-300  flex items-center gap-2 my-0!">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Console Output
          </h3>
        </div>

        <div
          className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3 custom-scrollbar"
          ref={logContainerRef}
        >
          {logs.length === 0 ? (
            <div className="text-slate-600 text-center mt-10 italic">
              Waiting for event...
              <br />
              Click a node in the tree.
            </div>
          ) : (
            logs.map((log, idx) => (
              <div
                key={log.id}
                className="flex gap-2 animate-in slide-in-from-left-2 duration-300"
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
                  <div className="text-white dark:text-slate-900 mt-0.5">
                    <span className="text-slate-400">Node: </span> {log.element}
                  </div>
                  <div className="text-slate-500 italic pl-2 border-l-2 border-slate-700 mt-1">
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
};
