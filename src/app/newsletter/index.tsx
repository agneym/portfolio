import { createFileRoute } from "@tanstack/react-router";
import { SkipNavContent } from "components/uikit/SkipNav";
import { IssueList } from "components/Newsletter/IssueList";
import { NewsletterHeader } from "components/Newsletter/NewsletterHeader";
import { SubscribeNewsletter } from "components/Newsletter/SubscribeNewsletter";
import { getIssues } from "components/Newsletter/issues";

const TITLE = "JEM Newsletter | Agney";
const DESCRIPTION =
  "JavaScript Every Month: a monthly digest of curated web development articles, tutorials and releases.";
const OG_IMAGE = `https://agney.dev/og?title=${encodeURIComponent("JavaScript Every Month")}`;

export const Route = createFileRoute("/newsletter/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
    ],
  }),
  component: NewsletterHome,
});

function NewsletterHome() {
  return (
    <div className="min-h-full">
      <SkipNavContent />
      <header className="mx-auto grid max-w-6xl gap-x-12 gap-y-10 px-4 pt-14 pb-16 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_minmax(0,36rem)] lg:items-end">
        <NewsletterHeader issueCount={getIssues().length} />
        <SubscribeNewsletter tag="newsletter-page" hideArchives />
      </header>
      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-8">
        <IssueList />
      </div>
    </div>
  );
}
