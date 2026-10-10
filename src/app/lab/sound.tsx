import { createFileRoute } from "@tanstack/react-router";
import { SoundLab } from "components/Lab/SoundLab";

/**
 * A private playground for tuning the home keyboard's sounds with DialKit.
 * Not linked anywhere and kept out of search; DialKit only loads here.
 */
export const Route = createFileRoute("/lab/sound")({
  head: () => ({
    meta: [
      { title: "Sound lab | Agney" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SoundLab,
});
