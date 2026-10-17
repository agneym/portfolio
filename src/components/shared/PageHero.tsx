import type { ReactNode } from "react";
import { SubscribeNewsletter } from "components/Newsletter/SubscribeNewsletter";

interface PageHeroProps {
  title: ReactNode;
  tagline: ReactNode;
  meta: ReactNode;
  /** Buttondown tag recording which page the subscriber signed up on. */
  subscribeTag: string;
}

export function PageHero({
  title,
  tagline,
  meta,
  subscribeTag,
}: PageHeroProps) {
  return (
    <header className="grid gap-x-12 gap-y-10 pt-14 pb-16 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,36rem)] lg:items-start">
      <div className="flex flex-col gap-y-4">
        <h1 className="text-primary text-[clamp(3.25rem,9vw,6rem)] leading-[0.95] font-bold tracking-[-0.03em] lg:text-[clamp(3rem,4.75vw,4.75rem)]">
          {title}
        </h1>
        <p className="text-secondary-strong text-xl text-pretty">{tagline}</p>
        <p className="text-secondary tabular">{meta}</p>
      </div>
      <SubscribeNewsletter tag={subscribeTag} />
    </header>
  );
}
