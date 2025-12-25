import { useEffect, useState, type ComponentType } from "react";

export default function BubblingVisualizerClient() {
  const [Component, setComponent] = useState<ComponentType | null>(null);

  useEffect(() => {
    import("../react/BubblingVisualizer").then((mod) => {
      setComponent(() => mod.default);
    });
  }, []);

  if (!Component) {
    return (
      <div className="not-prose rounded-lg border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
        Loading visualizer...
      </div>
    );
  }

  return <Component />;
}
