declare module "content-collections" {
  export interface Post {
    title: string;
    date: string;
    tags?: string[];
    published?: boolean | "true" | "false";
    coverImage?: string;
    coverImageAttribution?: string;
    series?: string;
    content: string;
    _meta: {
      path: string;
      directory: string;
      extension: string;
      fileName: string;
      filePath: string;
    };
    slug: string;
    excerpt: string;
    mdx: string;
  }

  export interface Newsletter {
    title: string;
    date: string;
    description?: string;
    image?: string;
    buttondownUrl: string;
    content: string;
    _meta: Post["_meta"];
    slug: string;
    shortTitle: string;
    excerpt: string;
    mdx: string;
  }

  export const allPosts: Post[];
  export const allNewsletters: Newsletter[];
}
