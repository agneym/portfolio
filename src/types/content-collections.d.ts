declare module "content-collections" {
  export interface Post {
    title: string;
    date: string;
    tags?: string[];
    published?: boolean | "true" | "false";
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

  export const allPosts: Post[];
}
