import { allNewsletters } from "content-collections";

/** All issues, newest first. */
export function getIssues() {
  return [...allNewsletters].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
