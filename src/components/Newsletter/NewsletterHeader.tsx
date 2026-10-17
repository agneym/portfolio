interface NewsletterHeaderProps {
  issueCount: number;
}

export function NewsletterHeader({ issueCount }: NewsletterHeaderProps) {
  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="text-primary text-[clamp(3.25rem,9vw,6rem)] leading-[0.95] font-bold tracking-[-0.03em]">
        <span className="text-mod">JEM</span>
      </h1>
      <p className="text-secondary-strong text-xl text-pretty">
        <span className="bg-lemon text-text-on-lemon rounded-md px-1.5 font-bold">
          JavaScript Every Month
        </span>{" "}
        is a monthly digest of the best web development articles, tutorials and
        releases, picked by hand.
      </p>
      <p className="text-secondary tabular">
        {issueCount} issues and counting.
      </p>
    </div>
  );
}
