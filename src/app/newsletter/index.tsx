import { createFileRoute } from "@tanstack/react-router";
import { IssueList } from "components/Newsletter/IssueList";
import { getIssues } from "components/Newsletter/issues";
import { Lemon } from "components/shared/Lemon";
import { PageHero } from "components/shared/PageHero";
import { PageShell } from "components/shared/PageShell";
import { SectionBar } from "components/shared/SectionBar";

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
    <PageShell>
      <PageHero
        title={<span className="text-mod">JEM</span>}
        tagline={
          <>
            <Lemon>JavaScript Every Month</Lemon> is a monthly digest of the
            best web development articles, tutorials and releases, picked by
            hand.
          </>
        }
        meta={`${getIssues().length} issues and counting.`}
        subscribeTag="newsletter-page"
      />
      <SectionBar heading="All issues" />
      <IssueList />
    </PageShell>
  );
}
