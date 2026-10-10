import { Input } from "components/uikit/Input";
import { Mail } from "lucide-react";

export function SubscribeNewsletter() {
  return (
    <div className="bg-key text-primary flex flex-col gap-6 rounded-[var(--radius-plate)] p-6 shadow-[inset_0_1px_0_var(--key-highlight),0_6px_0_var(--color-skirt),0_20px_32px_-16px_var(--key-cast)] sm:p-8 md:flex-row md:gap-10">
      <div className="flex flex-col gap-y-3 text-pretty md:basis-1/2">
        <h2 className="flex items-center gap-x-2.5 text-xl font-semibold">
          <Mail aria-hidden className="text-mod size-6 shrink-0" />
          <span>
            Subscribe to <span className="text-mod">JEM</span> Newsletter
          </span>
        </h2>
        <p className="text-secondary-strong">
          Stay ahead of the curve in Web Development with{" "}
          <span className="italic">Javascript Every Month</span> Newsletter.
        </p>
        <p className="text-secondary">
          I will deliver a curated selection of articles, tutorials, and
          resources straight to your inbox once a month.
        </p>
        <p className="text-secondary">
          Read the{" "}
          <a
            href="https://buttondown.email/agney/archive/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary decoration-mod font-bold underline decoration-2 underline-offset-4 hover:decoration-[var(--color-accent)]"
          >
            Archives
          </a>
        </p>
      </div>
      <form
        action="https://buttondown.email/api/emails/embed-subscribe/agney"
        method="post"
        target="popupwindow"
        className="flex flex-col justify-end gap-y-4 md:basis-1/2"
      >
        <Input.Group hasDescription>
          <Input.Label>Email</Input.Label>
          <Input.InputBase
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="address@example.ext"
            required
            name="email"
          />
          <Input.Description>No spam, unsubscribe anytime.</Input.Description>
        </Input.Group>
        <input type="hidden" value="1" name="embed" />
        <input type="hidden" name="tag" value="blog" />
        <button
          type="submit"
          className="keycap keycap-mod self-start px-5 py-3 text-base font-bold"
        >
          I want in!
        </button>
      </form>
    </div>
  );
}
