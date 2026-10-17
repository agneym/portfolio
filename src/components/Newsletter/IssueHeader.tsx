import { DateString } from "components/BlogHome/DateString";

interface IssueHeaderProps {
  shortTitle: string;
  date: string;
  buttondownUrl: string;
}

export function IssueHeader({
  shortTitle,
  date,
  buttondownUrl,
}: IssueHeaderProps) {
  return (
    <header className="not-prose mx-auto flex w-full flex-col gap-y-5 pt-10 pb-6 sm:pt-16">
      <p className="text-mod text-base font-bold">JavaScript Every Month</p>
      <h1 className="text-primary text-[clamp(2.125rem,5.5vw,3.75rem)] leading-[1.08] font-bold tracking-[-0.025em] text-balance">
        {shortTitle}
      </h1>
      <div className="text-secondary flex flex-wrap items-baseline gap-x-4 gap-y-1 text-base">
        <DateString className="tabular">{date}</DateString>
        <a
          href={buttondownUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline decoration-2 underline-offset-4 hover:decoration-[var(--color-accent)]"
        >
          Originally sent via Buttondown
        </a>
      </div>
    </header>
  );
}
