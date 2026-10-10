export function Header() {
  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="text-primary text-[clamp(3.25rem,9vw,6rem)] leading-[0.95] font-bold tracking-[-0.03em]">
        Blog
      </h1>
      <p className="text-secondary-strong text-xl text-pretty">
        Welcome to Agney&apos;s{" "}
        <span className="bg-lemon text-text-on-lemon rounded-md px-1.5 font-bold">
          Digital Garden
        </span>
      </p>
    </div>
  );
}
