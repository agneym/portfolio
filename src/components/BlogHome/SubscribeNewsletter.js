import { Input } from "components/uikit";

export function SubscribeNewsletter() {
  return (
    <div className="flex gap-x-16 gap-y-16 flex-col-reverse px-4 md:flex-row text-gray-800 dark:text-gray-300">
      <div className="max-w-md md:basis-1/2 flex flex-col gap-y-3 text-balance">
        <p>
          <span>Stay ahead of the curve in Web Development with my </span>
          <span className="italic">Javascript Every Month</span>
          <span> Newsletter.</span>
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
        <form
          action="https://buttondown.email/api/emails/embed-subscribe/agney"
          method="post"
          target="popupwindow"
        >
          <div className="flex flex-col gap-y-4">
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
              <Input.Description>
                No spam, unsubscribe anytime.
              </Input.Description>
            </Input.Group>
            <input type="hidden" value="1" name="embed" />
            <input type="hidden" name="tag" value="blog" />
            <button
              type="submit"
              className="inline-flex justify-center items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              I want in!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
