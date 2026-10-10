import GithubIcon from "images/social-media/github.svg?react";
import TwitterIcon from "images/social-media/twitter.svg?react";
import type { ReactNode } from "react";

interface SocialMediaLinkProps {
  href: string;
  iconEl: ReactNode;
  ariaLabel: string;
}

const SocialMediaLink = ({ href, iconEl, ariaLabel }: SocialMediaLinkProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="keycap keycap-plain size-11 [--travel:3px]"
    >
      {iconEl}
    </a>
  );
};

export const Footer = () => {
  return (
    <footer className="flex items-center justify-center gap-x-4 text-center">
      <SocialMediaLink
        href="https://github.com/agneym"
        iconEl={<GithubIcon aria-hidden width="1.25rem" />}
        ariaLabel="My Github Profile"
      />
      <SocialMediaLink
        href="https://twitter.com/agneymenon"
        iconEl={<TwitterIcon aria-hidden width="1.25rem" />}
        ariaLabel="My Twitter Profile"
      />
    </footer>
  );
};
