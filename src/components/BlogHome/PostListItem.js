export function PostListItem() {
  return (
    <article className="flex flex-col gap-y-3">
      <header className="flex flex-col gap-y-0.5">
        <h3 className="text-xl">useMemo inside Context API - React</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          March 03, 2017
        </p>
      </header>
      <p className="text-gray-600 dark:text-gray-300">
        One of the most common places a useMemo is seen (in the wild) is for
        memoizing React context value. Let's look into what are the advantages
        of doing this and how we can prevent unnecessary renders using this
        pattern. Context provides a
      </p>
    </article>
  );
}
