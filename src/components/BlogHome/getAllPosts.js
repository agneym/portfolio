function importAll(r) {
  return r
    .keys()
    .filter((fileName) => fileName.startsWith("./"))
    .map((fileName) => ({
      link: fileName.substr(1).replace(/\.mdx$/, ""),
      meta: r(fileName).meta,
    }))
    .filter(({ meta }) => {
      return meta?.published !== false;
    });
}

export function getAllPosts() {
  return importAll(require.context("content", true, /\.mdx$/));
}
