import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "node:path";

export const getPostFrontmatter = async (slug) => {
  const filePath = path.join(process.cwd(), `src/content/${slug}.mdx`);
  const fileContents = await fs.readFile(filePath, "utf8");
  const { data } = matter(fileContents);
  return data;
};
