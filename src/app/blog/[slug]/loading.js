"use client";

import { BlogArticleContainer } from "components/BlogHome/BlogArticleContainer";
import { BlogPostHeader } from "components/BlogHome/BlogPostHeader";
import { LoadingRow } from "components/shared";
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
        className="min-h-[50vh] mt-12"
      >
        <div className="grid grid-cols-3 gap-x-3 gap-y-4 animate-pulse">
          <LoadingRow />
          <LoadingRow />
          <LoadingRow />
          <LoadingRow colCount={2} />
          <LoadingRow colCount={2} />
          <LoadingRow />
          <LoadingRow colCount={3} />
          <LoadingRow colCount={2} />
          <LoadingRow />
          <LoadingRow colCount={3} />
          <LoadingRow colCount={3} />
        </div>
      </motion.div>
    </BlogArticleContainer>
  );
}
