import { NavLink, Input, Separator } from "components/uikit";

export function SubscribeNewsletter() {
  return (
    <div className="flex gap-x-8 flex-col md:flex-row text-slate-300">
      <div className="max-w-md md:basis-1/2 flex flex-col gap-y-3 align-[balance]">
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
      <Separator orientation="vertical" />
      <div className="flex flex-col gap-y-6 md:basis-1/2">
        <h2 className="text-xl text-slate-200">Subscribe to JEM Newsletter</h2>
        <form>
          <Input.Group>
            <Input.Label>Email</Input.Label>
            <Input.InputBase
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="address@example.ext"
              required
            />
          </Input.Group>
        </form>
      </div>
    </div>
  );
}
