export const HeadNav = () => {
  return (
    <nav className="flex items-center justify-end text-slate-400 px-8">
      <div className="inline-flex gap-x-8">
        <a href="/about">About</a>
        <a href="https://github.com/agneym?tab=repositories" target="_blank">
          Projects
        </a>
        <a href="https://blog.agney.dev">Blog</a>
      </div>
    </nav>
  );
};
