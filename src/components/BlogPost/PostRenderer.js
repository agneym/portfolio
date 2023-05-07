"use client";

import { run } from "@mdx-js/mdx";
import { Fragment, useEffect, useState } from "react";
import * as runtime from "react/jsx-runtime";

export function PostRenderer({ code }) {
  const [mdxModule, setMdxModule] = useState();

  useEffect(() => {
    (async () => {
      setMdxModule(await run(code, runtime));
    })();
  }, [code]);

  const Content = mdxModule ? mdxModule.default : Fragment;
  return <Content />;
}
