"use client";

import { PlaygroundWrapper } from "components/uikit/PlaygroundWrapper";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";

const PreComponent = (props) => (
  <div className="text-sm whitespace-pre-wrap">
    <pre {...props} />
  </div>
);

export function BlogPost({ code }) {
  const Component = useMemo(() => {
    return getMDXComponent(code);
  }, [code]);

  return (
    <Component
      components={{
        Playground: PlaygroundWrapper,
        pre: PreComponent,
      }}
      hideHydrateWarning
    />
  );
}
