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
      aria-label={ariaLabel}
      className="hover:text-secondary-strong text-secondary h-7 w-7 transition-transform hover:scale-105"
    >
      {iconEl}
    </a>
  );
};

export const Footer = () => {
  return (
    <footer className="flex items-center justify-center gap-x-8 text-center pointer-fine:gap-x-3">
      <SocialMediaLink
        href="https://github.com/agneym"
        iconEl={<GithubIcon width="1.75rem" />}
        ariaLabel="My Github Profile"
      />
      <SocialMediaLink
        href="https://twitter.com/agneymenon"
        iconEl={<TwitterIcon width="1.75rem" />}
        ariaLabel="My Twitter Profile"
      />
    </footer>
  );
};
