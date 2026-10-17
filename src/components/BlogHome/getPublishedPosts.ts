import { allPosts } from "content-collections";

/** Published posts, newest first. */
export function getPublishedPosts() {
  return allPosts
    .filter((post) => post.published !== false && post.published !== "false")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
