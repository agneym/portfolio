import { Input } from "components/uikit";

export function SubscribeNewsletter() {
  return (
    <div className="flex gap-x-16 gap-y-16 flex-col-reverse px-4 md:flex-row text-gray-800 dark:text-gray-300">
      <div className="max-w-md md:basis-1/2 flex flex-col gap-y-3 [text-wrap:balance]">
        <p>
          <span>Stay ahead of the curve in Web Development with my </span>
          <span className="font-semibold">monthly</span>
          <span> newsletter.</span>
        </p>
        <p>
          I will deliver a curated selection of articles, tutorials, and
          resources straight to your inbox once a month.
        </p>
        <p>
          <span>Read the </span>
          <a
            href="https://buttondown.email/agney/archive/"
            target="_blank"
            className="underline decoration-dotted underline-offset-2 hover:decoration-solid"
          >
            Archives
          </a>
        </p>
      </div>
      <div className="flex flex-col gap-y-4 md:basis-1/2">
        <h2 className="text-xl dark:text-gray-200 text-gray-900">
          <span>Subscribe to </span>
          <span className="font-semibold">JEM</span>
          <span> Newsletter</span>
        </h2>
        <form>
          <Input.Group hasDescription>
            <Input.Label>Email</Input.Label>
            <Input.InputBase
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="address@example.ext"
              required
            />
            <Input.Description>No spam, unsubscribe anytime.</Input.Description>
          </Input.Group>
          <button type="submit"></button>
        </form>
      </div>
    </div>
  );
}
