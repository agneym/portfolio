import { notFound } from "next/navigation";
import { CustomMDX } from "components/mdx";
import { getBlogPosts } from "app/blog/utils";
import { BlogArticleContainer, BlogPostHeader } from "components/BlogHome";

export async function generateStaticParams() {
  let posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let post = getBlogPosts().find((post) => post.slug === slug);
  if (!post) {
    return;
  }

  let { title, date, tags } = post.metadata;

  return {
    title: `${title} | Blog`,
    description: title,
    keywords: tags,
    openGraph: {
      title,
      description: title,
      type: "article",
      publishedTime: date,
      url: `/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: title,
    },
  };
}

export default async function Blog({ params }) {
  const { slug } = await params;
  let post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <BlogArticleContainer>
      <BlogPostHeader
        frontmatter={{
          title: post.metadata.title,
          date: post.metadata.date,
        }}
      />
      <CustomMDX source={post.content} />
    </BlogArticleContainer>
  );
}
