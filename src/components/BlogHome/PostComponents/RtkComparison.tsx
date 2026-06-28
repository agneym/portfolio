const RAW_OUTPUT = `./src/app/index.tsx
./src/app/__root.tsx
./src/app/webmarks/index.tsx
./src/app/blog/index.tsx
./src/app/blog/$slug.tsx
./src/app/blog.tsx
./src/app/client.tsx
./src/app/providers.tsx
./src/components/mdx.tsx
./src/components/HomePage/AvatarImage.tsx
./src/components/HomePage/Intro.tsx
./src/components/HomePage/Footer.tsx
./src/components/HomePage/HeadNav.tsx
./src/components/uikit/Navbar/Navbar.tsx
./src/components/uikit/Navbar/NavbarPopover.tsx
./src/components/uikit/Input/InputLabel.tsx
./src/components/uikit/Input/InputGroup.tsx
./src/components/uikit/Input/InputDescription.tsx
./src/components/uikit/Input/Input.tsx
./src/components/uikit/NavLink.tsx
./src/components/uikit/SkipNav/SkipNav.tsx
./src/components/uikit/PlaygroundWrapper.tsx
./src/components/shared/ThemeButton.tsx
./src/components/BlogHome/SubscribeNewsletter.tsx
./src/components/BlogHome/BlogPostHeader.tsx
./src/components/BlogHome/DateString.tsx
./src/components/BlogHome/PostComponents/CascadePipeline.tsx
./src/components/BlogHome/PostComponents/ImportanceQuiz.tsx
./src/components/BlogHome/PostComponents/EventDelegationCode.tsx
./src/components/BlogHome/PostComponents/NotifyOnChangePropsPlayground.tsx
./src/components/BlogHome/PostComponents/CascadeOriginsQuiz.tsx
./src/components/BlogHome/PostComponents/SpeedSelect.tsx
./src/components/BlogHome/PostComponents/RoughBarChart.tsx
./src/components/BlogHome/PostList.tsx
./src/components/BlogHome/PostListItem.tsx
./src/components/BlogHome/Header.tsx
./src/components/BlogHome/BlogArticleContainer.tsx
./src/router.tsx`;

const RTK_OUTPUT = `src/ router.tsx
src/app/ __root.tsx blog.tsx client.tsx index.tsx providers.tsx
src/app/blog/ $slug.tsx index.tsx
src/app/webmarks/ index.tsx
src/components/ mdx.tsx
src/components/BlogHome/ BlogArticleContainer.tsx BlogPostHeader.tsx DateString.tsx Header.tsx PostList.tsx PostListItem.tsx SubscribeNewsletter.tsx
src/components/BlogHome/PostComponents/ CascadeOriginsQuiz.tsx CascadePipeline.tsx EventDelegationCode.tsx ImportanceQuiz.tsx NotifyOnChangePropsPlayground.tsx RoughBarChart.tsx SpeedSelect.tsx
src/components/HomePage/ AvatarImage.tsx Footer.tsx HeadNav.tsx Intro.tsx
src/components/shared/ ThemeButton.tsx
src/components/uikit/ NavLink.tsx PlaygroundWrapper.tsx
src/components/uikit/Input/ Input.tsx InputDescription.tsx InputGroup.tsx InputLabel.tsx
src/components/uikit/Navbar/ Navbar.tsx NavbarPopover.tsx
src/components/uikit/SkipNav/ SkipNav.tsx`;

export function RtkComparison() {
  const rawLines = RAW_OUTPUT.trim().split("\n").length;
  const rtkLines = RTK_OUTPUT.trim().split("\n").length;
  const rawChars = RAW_OUTPUT.length;
  const rtkChars = RTK_OUTPUT.length;
  const reduction = Math.round((1 - rtkChars / rawChars) * 100);

  return (
    <figure className="not-prose my-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Raw output panel */}
        <div className="overflow-hidden rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
          <div className="flex items-center justify-between border-b border-red-200 px-3 py-2 dark:border-red-900">
            <span className="font-mono text-xs font-medium text-red-700 dark:text-red-400">
              $ find . -name &quot;*.tsx&quot;
            </span>
            <span className="font-mono text-xs text-red-500 tabular-nums">
              {rawLines} lines · {rawChars.toLocaleString()} chars
            </span>
          </div>
          <pre className="overflow-x-auto p-3 font-mono text-xs leading-5 text-red-900 dark:text-red-300">
            {RAW_OUTPUT}
          </pre>
        </div>

        {/* RTK output panel */}
        <div className="overflow-hidden rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30">
          <div className="flex items-center justify-between border-b border-emerald-200 px-3 py-2 dark:border-emerald-900">
            <span className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
              $ rtk find . -name &quot;*.tsx&quot;
            </span>
            <span className="font-mono text-xs text-emerald-600 tabular-nums">
              {rtkLines} lines · {rtkChars.toLocaleString()} chars · −
              {reduction}%
            </span>
          </div>
          <pre className="overflow-x-auto p-3 font-mono text-xs leading-5 text-emerald-900 dark:text-emerald-300">
            {RTK_OUTPUT}
          </pre>
        </div>
      </div>
      <figcaption className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
        Running <code>find</code> on this portfolio's source tree. RTK collapses
        38 flat file paths into a directory tree — same information, 44% fewer
        characters.
      </figcaption>
    </figure>
  );
}
