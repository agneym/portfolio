"use client";

import { PlaygroundWrapper } from "components/uikit";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";

export function BlogPost({ code }) {
  const Component = useMemo(() => {
    return getMDXComponent(code);
  }, [code]);

  return (
    <Component
      components={{
        Playground: PlaygroundWrapper,
        pre: (props) => (
          <div className="text-sm whitespace-pre-wrap">
            <pre {...props} />
          </div>
        ),
      }}
      hideHydrateWarning
    />
  );
}
