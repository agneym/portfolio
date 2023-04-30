import LogoSvg from "images/logo.svg";
import Link from "next/link";

export const HeadNav = () => {
  return (
    <nav className="flex gap-x-4 items-center justify-center md:justify-between pt-4 text-slate-600 dark:text-slate-400 px-8">
      <Link href="/" className="mr-auto">
        <LogoSvg
          width={40}
          className="text-slate-900 dark:text-slate-100"
          title="Home"
        />
      </Link>
      <div className="inline-flex gap-x-8">
        <Link
          href="/about"
          className="relative before:absolute before:block before:w-full before:h-0.5 before:-bottom-0.5 before:left-0 before:bg-current before:scale-0 before:transition-transform before:duration-300 before:ease-in-out hover:before:scale-100"
        >
          About
        </Link>
        <a href="https://github.com/agneym?tab=repositories" target="_blank">
          Projects
        </a>
        <a href="https://blog.agney.dev">Blog</a>
      </div>
    </nav>
  );
};
