import GithubIcon from "images/social-media/github.svg";

const SocialMediaLink = ({ href, iconEl, ariaLabel }) => {
  return (
    <a
      href={href}
      target="_blank"
      aria-label={ariaLabel}
      className="w-7 h-7 text-slate-400 hover:text-slate-300 transition-transform hover:scale-105"
    >
      {iconEl}
    </a>
  );
};

export const Footer = () => {
  return (
    <footer className="text-center flex gap-x-2 items-center justify-center">
      <SocialMediaLink
        href="https://github.com/agneym"
        iconEl={<GithubIcon />}
        ariaLabel="My Github Profile"
      />
    </footer>
  );
};
