export default function BlogPost({ children }) {
  return (
    <main>
      <article className="prose lg:prose-xl">{children}</article>
    </main>
  );
}
