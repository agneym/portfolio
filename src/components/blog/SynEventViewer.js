"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  ChevronDown,
  Info,
  MousePointer2,
  Code2,
} from "lucide-react";

/**
 * TreeItem Component
 * Recursively renders keys and values of an object.
 */
const TreeItem = ({ label, value, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(depth < 1); // Auto-open first level

  const isObject = value !== null && typeof value === "object";
  const displayValue = () => {
    if (value === null)
      return <span className="text-gray-500 italic">null</span>;
    if (typeof value === "function")
      return <span className="text-blue-400 italic">ƒ ()</span>;
    if (typeof value === "string")
      return <span className="text-green-400">"{value}"</span>;
    if (typeof value === "number")
      return <span className="text-orange-400">{value}</span>;
    if (typeof value === "boolean")
      return <span className="text-purple-400">{value.toString()}</span>;
    if (Array.isArray(value))
      return <span className="text-gray-400">Array({value.length})</span>;
    if (isObject)
      return (
        <span className="text-gray-400">
          {value.constructor?.name || "Object"}
        </span>
      );
    return <span className="text-gray-300">{String(value)}</span>;
  };

  const handleClick = (e) => {
    if (isObject) {
      e.stopPropagation();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="font-mono text-sm leading-6">
      <div
        className={`flex cursor-pointer items-center gap-1 rounded px-1 transition-colors hover:bg-white/5 ${isObject ? "group" : ""}`}
        onClick={handleClick}
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        {isObject ? (
          isOpen ? (
            <ChevronDown size={14} className="text-gray-500" />
          ) : (
            <ChevronRight size={14} className="text-gray-500" />
          )
        ) : (
          <div className="w-[14px]" />
        )}

        <span className="font-semibold text-blue-300">{label}:</span>
        <span className="ml-1 truncate">{displayValue()}</span>
      </div>

      {isObject && isOpen && (
        <div>
          {Object.entries(value).map(([key, val]) => (
            <TreeItem key={key} label={key} value={val} depth={depth + 1} />
          ))}
          {/* Include prototype properties if they are interesting, but for a synthetic event, standard keys are usually enough */}
        </div>
      )}
    </div>
  );
};

export function SynEventViewer() {
  const [capturedEvent, setCapturedEvent] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const consoleRef = useRef(null);

  const handleTriggerClick = (e) => {
    // Capture the synthetic event.
    // Important: React events are pooled in older versions,
    // but in React 17+ they aren't. We'll still take a shallow clone of
    // keys to be safe and clean.

    const eventObj = {};

    // We iterate through all properties including those in the prototype
    // to show the full scale of the SyntheticEvent
    for (let prop in e) {
      try {
        const val = e[prop];
        // Skip circular references to the React internal fibers if they are too deep
        if (prop === "_dispatchInstances" || prop === "_targetInst") {
          eventObj[prop] = "[Internal React Fiber]";
          continue;
        }
        eventObj[prop] = val;
      } catch (err) {
        eventObj[prop] = "[Unaccessible]";
      }
    }

    setCapturedEvent(eventObj);
    setIsCapturing(false);

    // Auto scroll to view
    setTimeout(() => {
      consoleRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-950 p-4 text-slate-100 md:p-8">
      <div className="w-full max-w-4xl space-y-8">
        {/* Interaction Zone */}
        <section className="flex flex-col items-center gap-6 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <button
            onClick={handleTriggerClick}
            onMouseEnter={() => setIsCapturing(true)}
            onMouseLeave={() => setIsCapturing(false)}
            className={`group relative flex transform items-center gap-3 rounded-xl px-8 py-4 font-bold transition-all hover:scale-105 active:scale-95 ${
              capturedEvent
                ? "bg-indigo-600 hover:bg-indigo-500"
                : "bg-blue-500 hover:bg-blue-400"
            }`}
          >
            <MousePointer2
              className={`transition-transform ${isCapturing ? "animate-bounce" : ""}`}
            />
            {capturedEvent ? "Capture new click event" : "Click Me"}
          </button>

          {!capturedEvent && (
            <p className="flex items-center gap-2 text-sm text-slate-500">
              <Info size={14} />
              The inspector below will populate once you click.
            </p>
          )}
        </section>

        {/* Console / Tree View */}
        {capturedEvent && (
          <section
            ref={consoleRef}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="flex items-center justify-between rounded-t-xl border border-b-0 border-slate-800 bg-slate-900 px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full border border-red-500/40 bg-red-500/20"></div>
                  <div className="h-3 w-3 rounded-full border border-yellow-500/40 bg-yellow-500/20"></div>
                  <div className="h-3 w-3 rounded-full border border-green-500/40 bg-green-500/20"></div>
                </div>
                <span className="ml-2 font-mono text-xs text-slate-500">
                  Developer Tools - Event Inspector
                </span>
              </div>
              <button
                onClick={() => setCapturedEvent(null)}
                className="text-xs text-slate-500 transition-colors hover:text-slate-300"
              >
                Clear
              </button>
            </div>

            <div className="min-h-[400px] overflow-x-auto rounded-b-xl border border-slate-800 bg-black/40 p-4 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2 font-mono text-xs text-green-500">
                <span>&gt;</span>
                <span className="text-slate-400">Captured:</span>
                <span className="rounded bg-green-500/10 px-1.5 py-0.5 italic">
                  SyntheticBaseEvent
                </span>
              </div>

              <TreeItem label="SyntheticEvent" value={capturedEvent} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
