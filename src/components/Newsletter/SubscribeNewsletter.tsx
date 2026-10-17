import { useState, type ComponentProps } from "react";
import { Input } from "components/uikit/Input";
import { Mail } from "lucide-react";

const SUBSCRIBE_URL =
  "https://buttondown.email/api/emails/embed-subscribe/agney";

type Status = "idle" | "submitting" | "success" | "error";

interface SubscribeNewsletterProps {
  /** Buttondown tag recording where the subscriber signed up. */
  tag: string;
}

export function SubscribeNewsletter({ tag }: SubscribeNewsletterProps) {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();
    setStatus("submitting");
    try {
      // Buttondown sends no CORS headers; an opaque response that resolves
      // means the request went through.
      await fetch(SUBSCRIBE_URL, {
        method: "POST",
        mode: "no-cors",
        body: new FormData(event.currentTarget),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

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
      </div>
      {status === "success" ? (
        <output className="flex flex-col justify-center gap-y-2 md:basis-1/2">
          <p className="text-primary text-lg font-bold">
            Check your inbox to confirm
          </p>
          <p className="text-secondary">
            I sent you a confirmation email. Click the link in it and you are on
            the list.
          </p>
        </output>
      ) : (
        <form
          action={SUBSCRIBE_URL}
          method="post"
          onSubmit={onSubmit}
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
          <input type="hidden" name="tag" value={tag} />
          {status === "error" ? (
            <p role="alert" className="text-accent text-sm font-bold">
              Something went wrong. Please try again.
            </p>
          ) : null}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="keycap keycap-mod self-start px-5 py-3 text-base font-bold"
          >
            {status === "submitting" ? "Subscribing..." : "I want in!"}
          </button>
        </form>
      )}
    </div>
  );
}
