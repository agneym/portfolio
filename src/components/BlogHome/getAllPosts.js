function importAll(r) {
  return r
    .keys()
    .filter((fileName) => fileName.startsWith("./"))
    .map((fileName) => ({
      link: fileName.substr(1).replace(/\/page\.mdx$/, ""),
      meta: r(fileName).meta,
    }))
    .filter(({ meta }) => {
      return meta?.published !== false;
    });
}

export function getAllPosts() {
  return importAll(require.context("app/blog/(posts)", true, /\.mdx$/));
}
