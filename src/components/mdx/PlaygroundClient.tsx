import { useEffect, useState } from "react";

interface PlaygroundClientProps {
  initialSnippet?: {
    markup?: string;
    css?: string;
    javascript?: string;
  };
  mode?: "light" | "dark";
  [key: string]: unknown;
}

type PlaygroundComponent = React.ComponentType<PlaygroundClientProps>;

export default function PlaygroundClient(props: PlaygroundClientProps) {
  const [Component, setComponent] = useState<PlaygroundComponent | null>(null);

  useEffect(() => {
    import("../react/PlaygroundWrapper").then((mod) => {
      setComponent(() => mod.default as unknown as PlaygroundComponent);
    });
  }, []);

  if (!Component) {
    return (
      <div className="not-prose rounded-lg border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
        Loading playground...
      </div>
    );
  }

  return <Component {...props} />;
}
