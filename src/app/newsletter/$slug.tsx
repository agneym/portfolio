import { Suspense } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { MDXContent } from "@content-collections/mdx/react";
import { BlogArticleContainer } from "components/BlogHome/BlogArticleContainer";
import { IssueHeader } from "components/Newsletter/IssueHeader";
import { IssueNav } from "components/Newsletter/IssueNav";
import { getIssues } from "components/Newsletter/issues";
import { CustomMDXComponents } from "components/mdx";
import { allNewsletters } from "content-collections";

export const Route = createFileRoute("/newsletter/$slug")({
  loader: ({ params }: { params: { slug: string } }) => {
    const issue = allNewsletters.find((i) => i.slug === params.slug);
    if (!issue) throw notFound();
    return { issue };
  },
  head: ({ loaderData }) => {
    const issue = loaderData?.issue;
    const title = issue?.shortTitle ?? "JEM Newsletter";
    const description = issue?.description ?? issue?.excerpt ?? "";
    const ogImageUrl = `https://agney.dev/og?title=${encodeURIComponent(
      issue ? `JEM: ${title}` : title,
    )}`;

    return {
      meta: [
        { title: `${title} | JEM Newsletter | Agney` },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:publishedTime", content: issue?.date ?? "" },
        { property: "og:image", content: ogImageUrl },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
      ],
      links: issue
        ? [
            {
              rel: "canonical",
              href: `https://agney.dev/newsletter/${issue.slug}`,
            },
          ]
        : [],
    };
  },
  component: NewsletterIssuePage,
});

function NewsletterIssuePage() {
  const { issue } = Route.useLoaderData();
  const issues = getIssues();
  const index = issues.findIndex((i) => i.slug === issue.slug);
  const newer = issues[index - 1];
  const older = issues[index + 1];

  return (
    <BlogArticleContainer subscribeTag="newsletter-issue">
      <IssueHeader
        shortTitle={issue.shortTitle}
        date={issue.date}
        buttondownUrl={issue.buttondownUrl}
      />
      <Suspense fallback={null}>
        <MDXContent code={issue.mdx} components={CustomMDXComponents} />
      </Suspense>
      <IssueNav newer={newer} older={older} />
    </BlogArticleContainer>
  );
}
