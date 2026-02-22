"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, MousePointer2, ShieldAlert, Code, Play } from "lucide-react";

export function PropagationVisualizer() {
  const [mode, setMode] = useState("none");
  const [activeHandler, setActiveHandler] = useState(null);
  const [executionLog, setExecutionLog] = useState([]);

  const parentRef = useRef(null);
  const childRef = useRef(null);
  const wrapperRef = useRef(null);
  const audioCtxRef = useRef(null);
  const isPlayingRef = useRef(false);

  // Native Web Audio API Synthesizer (Dependency-free alternative to Tone.js)
  const playTone = (frequency) => {
    if (!frequency) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      // Create nodes
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Set tone characteristics (Triangle wave for a pleasant, plucky bell sound)
      osc.type = "triangle";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Envelope: Quick attack, exponential release
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05); // Attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6); // Release

      // Connect and play
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.65);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  // Event Listener Attachment & Orchestration
  useEffect(() => {
    const child = childRef.current;
    const parent = parentRef.current;
    const wrapper = wrapperRef.current;
    if (!child || !parent || !wrapper) return;

    let executionQueue = [];
    let processingTimer = null;

    // The processor plays back synchronous DOM events sequentially
    // so the user can visually and audibly digest the chain of events.
    const processQueue = async () => {
      isPlayingRef.current = true;
      setExecutionLog([]);

      for (const step of executionQueue) {
        setActiveHandler(step.id);
        setExecutionLog((prev) => [...prev, step]);
        playTone(step.freq);

        // Wait 600ms between each event to show clear illumination & audio separation
        await new Promise((r) => setTimeout(r, 600));
      }

      setActiveHandler(null);
      isPlayingRef.current = false;
    };

    // Capture click before it hits the elements to reset state and queue
    const handleCapture = (e) => {
      if (!parent.contains(e.target)) return;

      // Prevent user from clicking repeatedly while an animation sequence is running
      if (isPlayingRef.current) {
        e.stopPropagation();
        return;
      }

      executionQueue = [];
      clearTimeout(processingTimer);
      // Schedule queue processing immediately after synchronous bubbling finishes
      processingTimer = setTimeout(processQueue, 50);
    };

    // --- The Actual Event Handlers ---

    // Child Handler 1 (C4)
    const childHandler1 = () => {
      executionQueue.push({
        id: "c1",
        message: "Triggered: Child Handler 1 (C4)",
        freq: 261.63,
        target: "child",
      });
    };

    // Child Handler 2 (E4) - Contains the Propagation Logic
    const childHandler2 = (e) => {
      executionQueue.push({
        id: "c2",
        message: "Triggered: Child Handler 2 (E4)",
        freq: 329.63,
        target: "child",
      });

      if (mode === "stopPropagation") {
        e.stopPropagation();
        executionQueue.push({
          id: "info",
          message: "🛑 e.stopPropagation() called. Bubbling halted.",
          freq: null,
          info: true,
        });
      } else if (mode === "stopImmediatePropagation") {
        e.stopImmediatePropagation();
        executionQueue.push({
          id: "info",
          message:
            "🛑 e.stopImmediatePropagation() called. All remaining listeners halted.",
          freq: null,
          info: true,
        });
      }
    };

    // Child Handler 3 (G4)
    const childHandler3 = () => {
      executionQueue.push({
        id: "c3",
        message: "Triggered: Child Handler 3 (G4)",
        freq: 392.0,
        target: "child",
      });
    };

    // Parent Handler 1 (C5)
    const parentHandler = () => {
      executionQueue.push({
        id: "p1",
        message: "Triggered: Parent Handler (C5)",
        freq: 523.25,
        target: "parent",
      });
    };

    // We MUST use native DOM addEventListener here instead of React's synthetic onClick
    // to accurately demonstrate native stopImmediatePropagation behaviors.
    wrapper.addEventListener("click", handleCapture, { capture: true });

    child.addEventListener("click", childHandler1);
    child.addEventListener("click", childHandler2);
    child.addEventListener("click", childHandler3);

    parent.addEventListener("click", parentHandler);

    return () => {
      wrapper.removeEventListener("click", handleCapture, { capture: true });
      child.removeEventListener("click", childHandler1);
      child.removeEventListener("click", childHandler2);
      child.removeEventListener("click", childHandler3);
      parent.removeEventListener("click", parentHandler);
    };
  }, [mode]);

  return (
    <div className="not-prose mx-[calc(50%-40vw)] bg-slate-50 p-6 font-sans text-slate-800 selection:bg-indigo-200">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="grid grid-cols-2 gap-8">
          {/* LEFT COLUMN: Controls & Interactive Canvas */}
          <div className="space-y-6">
            {/* Mode Controls */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <Code size={20} className="text-slate-500" />
                Child Handler 2 Configuration
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  { id: "none", label: "Normal Flow", desc: "No interruption" },
                  {
                    id: "stopPropagation",
                    label: "stopPropagation()",
                    desc: "Stops bubbling to parent",
                  },
                  {
                    id: "stopImmediatePropagation",
                    label: "stopImmediate...",
                    desc: "Stops all following handlers",
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setMode(opt.id)}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      mode === opt.id
                        ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200"
                        : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-sm font-semibold">{opt.label}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Canvas */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <MousePointer2 size={20} className="text-slate-500" />
                Interactive Canvas (Click Inner Box)
              </h2>

              <div
                ref={wrapperRef}
                className="relative flex justify-center overflow-hidden rounded-xl bg-slate-100 p-8 select-none"
              >
                {/* Parent Node */}
                <div
                  ref={parentRef}
                  className={`relative cursor-pointer rounded-2xl border-4 p-12 shadow-lg transition-all duration-300 md:p-16 ${activeHandler === "p1" ? "scale-[1.02] border-violet-500 bg-violet-200" : "border-violet-300 bg-violet-100 hover:bg-violet-200/50"}`}
                >
                  <div className="absolute top-4 left-4 flex items-center gap-2 font-bold text-violet-800">
                    <div
                      className={`h-3 w-3 rounded-full ${activeHandler === "p1" ? "animate-ping bg-violet-600" : "bg-violet-400"}`}
                    ></div>
                    Parent Node
                  </div>

                  {/* Child Node */}
                  <div
                    ref={childRef}
                    className={`relative mt-6 cursor-pointer rounded-xl border-4 p-10 shadow-md transition-all duration-300 md:p-14 ${["c1", "c2", "c3"].includes(activeHandler) ? "scale-105 border-emerald-500 bg-emerald-200 shadow-xl" : "border-emerald-400 bg-emerald-100 hover:bg-emerald-200/70"}`}
                  >
                    <div className="absolute top-3 left-3 flex items-center gap-2 font-bold text-emerald-800">
                      <div
                        className={`h-3 w-3 rounded-full ${["c1", "c2", "c3"].includes(activeHandler) ? "animate-ping bg-emerald-600" : "bg-emerald-400"}`}
                      ></div>
                      Child Node
                    </div>

                    <div className="pointer-events-none mt-4 flex flex-col items-center justify-center font-medium text-emerald-900 opacity-80">
                      <MousePointer2
                        className="mb-2 animate-bounce"
                        size={28}
                      />
                      Click Me
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Execution Logic & Logging */}
          <div className="flex flex-col space-y-6">
            {/* Visual Listeners */}
            <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <Volume2 size={20} className="text-slate-500" />
                Attached Listeners
              </h2>

              <div className="space-y-3">
                <HandlerBlock
                  active={activeHandler === "c1"}
                  id="c1"
                  color="bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200 text-emerald-900"
                  title="Child Listener 1"
                  note="Plays C4 (261.6Hz)"
                  code="child.addEventListener('click', handler1)"
                />

                <HandlerBlock
                  active={activeHandler === "c2"}
                  id="c2"
                  color="bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200 text-emerald-900"
                  title="Child Listener 2"
                  note="Plays E4 (329.6Hz)"
                  code={`child.addEventListener('click', (e) => {
  playTone(E4);${mode === "none" ? "" : `\n  e.${mode}();`}
})`}
                />

                <HandlerBlock
                  active={activeHandler === "c3"}
                  id="c3"
                  color="bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200 text-emerald-900"
                  title="Child Listener 3"
                  note="Plays G4 (392.0Hz)"
                  code="child.addEventListener('click', handler3)"
                />

                <div className="my-4 border-t border-dashed border-slate-200"></div>

                <HandlerBlock
                  active={activeHandler === "p1"}
                  id="p1"
                  color="bg-violet-50 border-violet-400 ring-2 ring-violet-200 text-violet-900"
                  title="Parent Listener"
                  note="Plays C5 (523.2Hz)"
                  code="parent.addEventListener('click', handler)"
                />
              </div>
            </div>

            {/* Terminal Log */}
            <div className="flex h-64 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-950 px-4 py-3 font-mono text-xs tracking-wider text-slate-400 uppercase">
                <Play size={14} className="text-indigo-400" /> Execution Log
              </div>
              <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
                {executionLog.length === 0 ? (
                  <div className="flex items-center gap-2 text-slate-600">
                    <ShieldAlert size={16} /> Waiting for click event...
                  </div>
                ) : (
                  executionLog.map((log, i) => (
                    <div
                      key={i}
                      className={`mb-2 flex items-start gap-3 ${log.info ? "text-amber-400" : log.target === "parent" ? "text-violet-400" : "text-emerald-400"}`}
                    >
                      <span className="shrink-0 text-slate-600">[{i + 1}]</span>
                      <span>{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component for the visual code blocks
function HandlerBlock({ active, title, note, code, color }) {
  return (
    <div
      className={`rounded-xl border-2 p-4 transition-all duration-300 ${active ? `${color} scale-[1.02] shadow-md` : "border-slate-100 bg-white opacity-80"}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="font-bold">{title}</div>
        <div className="flex items-center gap-2 rounded-full bg-white/50 px-2 py-1 text-xs font-semibold">
          {active && (
            <Volume2 className="animate-pulse text-indigo-600" size={14} />
          )}
          {note}
        </div>
      </div>
      <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-slate-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}
