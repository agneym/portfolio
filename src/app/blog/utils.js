import fs from "fs";
import path from "path";

function parseFrontmatter(fileContent) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match?.[1];
  let content = fileContent.replace(frontmatterRegex, "").trim();

  if (!frontMatterBlock) {
    return { metadata: {}, content };
  }

  let frontMatterLines = frontMatterBlock.trim().split("\n");
  let metadata = {};
  let currentKey = null;

  frontMatterLines.forEach((line) => {
    // Handle array items (lines starting with "  - ")
    if (line.match(/^\s+-\s+/)) {
      let value = line.replace(/^\s+-\s+/, "").trim();
      if (currentKey && Array.isArray(metadata[currentKey])) {
        metadata[currentKey].push(value);
      }
      return;
    }

    // Handle key: value pairs
    let colonIndex = line.indexOf(":");
    if (colonIndex !== -1) {
      let key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Check if this starts an array (empty value followed by array items)
      if (value === "") {
        metadata[key] = [];
        currentKey = key;
      } else {
        // Remove quotes from value
        value = value.replace(/^['"](.*)['"]$/, "$1");
        metadata[key] = value;
        currentKey = key;
      }
    }
  });

  // Convert date string to proper format if exists
  if (metadata.date) {
    metadata.publishedAt = metadata.date;
  }

  return { metadata, content };
}

function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir) {
  let mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file));
    let slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), "src/app/blog/posts")).filter(
    (post) =>
      post.metadata.published !== false && post.metadata.published !== "false",
  );
}
