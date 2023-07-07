import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";

export const postsDirectory = path.join(process.cwd(), "src/content");

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory, {
    withFileTypes: true,
  });
  const allPostsData = fileNames
    .filter((file) => file.isFile())
    .map(({ name: fileName }) => {
      const slug = fileName.replace(/\.mdx$/, "");

      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const matterResult = matter(fileContents, {
        excerpt: async (file) => {
          file.excerpt = file.content.slice(0, 250).replace(`\n`, ` `);
        },
      });

      return {
        slug,
        ...matterResult.data,
        excerpt: matterResult.excerpt,
      };
    })
    .filter((post) => post.published !== false);

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}
