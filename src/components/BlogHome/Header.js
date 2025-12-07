import LogoSvg from "images/logo.svg";

export function Header() {
  return (
    <div className="flex flex-col justify-center gap-y-5">
      <div className="flex items-end justify-center gap-x-2">
        <LogoSvg
          width={40}
          className="-z-10 -rotate-6 text-slate-900 transition-transform hover:rotate-0 dark:text-slate-100"
          title="Home"
          aria-hidden
        />
        <p className="text-3xl font-bold" aria-hidden>
          |
        </p>
        <h1 className="text-3xl font-bold">Blog</h1>
      </div>
      <p>
        <span>Welcome to Agney&apos;s </span>
        <span className="underline decoration-indigo-300 decoration-dashed underline-offset-2">
          Digital Garden
        </span>
      </p>
    </div>
  );
}
