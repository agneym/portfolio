import LogoSvg from "images/logo.svg";

export function Header() {
  return (
    <div className="flex flex-col justify-center gap-y-5">
      <div className="flex gap-x-2 items-end justify-center">
        <LogoSvg
          width={40}
          className="text-slate-900 -z-10 dark:text-slate-100 -rotate-6 hover:rotate-0 transition-transform"
          title="Home"
          aria-hidden
        />
        <p className="font-bold text-3xl" aria-hidden>
          |
        </p>
        <h1 className="font-bold text-3xl">Blog</h1>
      </div>
      <p>
        <span>Welcome to Agney&apos;s </span>
        <span className="underline underline-offset-2	decoration-indigo-300 decoration-dashed">
          Digital Garden
        </span>
      </p>
    </div>
  );
}
