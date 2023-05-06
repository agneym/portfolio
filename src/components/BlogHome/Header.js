import LogoSvg from "images/logo.svg";

export function Header() {
  return (
    <div className="py-32">
      <div className="flex items-center flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-y-5">
        <div className="flex gap-x-2 items-end">
          <LogoSvg
            width={40}
            className="text-slate-900 dark:text-slate-100"
            title="Home"
            aria-hidden
          />
          <p className="font-bold text-3xl" aria-hidden>
            |
          </p>
          <h1 className="font-bold text-3xl">Blog</h1>
        </div>
        <p>
          <span>Welcome to Agney's </span>
          <span className="underline underline-offset-2	decoration-dotted">
            Digital Garden
          </span>
        </p>
      </div>
    </div>
  );
}
