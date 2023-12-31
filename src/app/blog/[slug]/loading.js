"use client";

import { BlogArticleContainer } from "components/BlogHome/BlogArticleContainer";
import { BlogPostHeader } from "components/BlogHome/BlogPostHeader";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function BlogPostLoading() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");

  return (
    <BlogArticleContainer>
      <BlogPostHeader frontmatter={{ title }} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      ></motion.div>
    </BlogArticleContainer>
  );
}
