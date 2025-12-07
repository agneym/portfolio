import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";

export const postsDirectory = path.join(process.cwd(), "src/app/blog/(posts)");

export function getSortedPostsData() {
  const folders = fs.readdirSync(postsDirectory, {
    withFileTypes: true,
  });

  const allPostsData = folders
    .filter((dirent) => dirent.isDirectory())
    .map(({ name: folderName }) => {
      const slug = folderName;
      const fullPath = path.join(postsDirectory, folderName, "page.mdx");

      if (!fs.existsSync(fullPath)) return null;

      const fileContents = fs.readFileSync(fullPath, "utf8");

      const matterResult = matter(fileContents);

      return {
        slug,
        ...matterResult.data,
      };
    })
    .filter((post) => post && post.published !== false);

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}
