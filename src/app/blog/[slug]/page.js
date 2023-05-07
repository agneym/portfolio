import { compile } from "@mdx-js/mdx";
import { PostRenderer } from "components/BlogPost";
import { readFile } from "node:fs/promises";

export default async function BlogPost({ params }) {
  const { slug } = params;
  const content = await readFile(`src/posts/${slug}.mdx`, "utf-8");
  const code = String(
    await compile(content, {
      outputFormat: "function-body",
      development: false,
    })
  );

  return <PostRenderer code={code} />;
}
