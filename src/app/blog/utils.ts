import fs from "fs";
import path from "path";
import { type } from "arktype";
import matter from "gray-matter";

const FrontmatterSchema = type({
  title: "string",
  date: "string",
  "tags?": "string[]",
  "published?": "boolean | 'true' | 'false'",
});

export type Frontmatter = typeof FrontmatterSchema.infer & {
  publishedAt?: string;
};

function parseFrontmatter(fileContent: string) {
  const { data, content } = matter(fileContent);

  const result = FrontmatterSchema(data);
  if (result instanceof type.errors) {
    throw new Error(`Invalid frontmatter: ${result.summary}`);
  }

  const metadata: Frontmatter = { ...result };

  if (metadata.date) {
    metadata.publishedAt = metadata.date;
  }

  return { metadata, content };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  let rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file));
    let slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), "src/app/blog/posts")).filter(
    (post) =>
      post.metadata.published !== false && post.metadata.published !== "false",
  );
}
