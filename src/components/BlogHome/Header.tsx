import LogoSvg from "images/logo.svg?react";

export function Header() {
  return (
    <div className="flex flex-col justify-center gap-y-5">
      <div className="flex items-end justify-center gap-x-2">
        <LogoSvg
          width={40}
          className="text-primary -z-10 -rotate-6 transition-transform hover:rotate-0"
          title="Home"
          aria-hidden
        />
        <p className="text-3xl font-bold" aria-hidden>
          |
        </p>
        <h1 className="text-3xl font-bold">Blog</h1>
      </div>
      <p className="text-pretty">
        <span>Welcome to Agney&apos;s </span>
        <span className="decoration-accent-muted underline decoration-dashed underline-offset-2">
          Digital Garden
        </span>
      </p>
    </div>
  );
}
