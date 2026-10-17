import { IssueListItem } from "./IssueListItem";
import { getIssues } from "./issues";

export function IssueList() {
  const issues = getIssues();

  // Group by year: the year is a wide key that rides along as you scroll.
  const years = new Map<number, typeof issues>();
  for (const issue of issues) {
    const year = new Date(issue.date).getUTCFullYear();
    years.set(year, [...(years.get(year) ?? []), issue]);
  }

  return (
    <>
      <h2 className="text-secondary-strong text-2xl font-semibold">
        All issues
      </h2>
      <div className="mt-8 flex flex-col gap-y-12">
        {[...years].map(([year, yearIssues]) => (
          <section
            key={year}
            aria-labelledby={`year-${year}`}
            className="grid gap-x-10 md:grid-cols-[8rem_1fr]"
          >
            <div className="md:sticky md:top-20 md:self-start">
              <h3
                id={`year-${year}`}
                className="keycap keycap-mod tabular px-4 py-2 text-lg font-semibold"
              >
                {year}
              </h3>
            </div>
            <div className="divide-muted flex flex-col divide-y">
              {yearIssues.map((issue) => (
                <IssueListItem
                  key={issue.slug}
                  slug={issue.slug}
                  shortTitle={issue.shortTitle}
                  date={issue.date}
                  excerpt={issue.excerpt}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
