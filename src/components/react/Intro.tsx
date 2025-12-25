import AvatarImage from "./AvatarImage";
import { motion, useReducedMotion } from "motion/react";
import { getAnimateProps } from "./getAnimateProps";

export default function Intro() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="flex flex-col items-center justify-center gap-y-10 text-center">
      <div id="reach-skip-nav" data-reach-skip-nav-content="" />
      <motion.h1
        {...getAnimateProps({ shouldReduceMotion })}
        className="text-4xl tracking-tight"
      >
        Hey 👋 I&apos;m
      </motion.h1>
      <div className="flex flex-col gap-y-6">
        <AvatarImage />
        <motion.h1
          {...getAnimateProps({ delay: 0.6, shouldReduceMotion })}
          className="font text-6xl font-extrabold"
        >
          Agney Menon
        </motion.h1>
        <motion.p
          {...getAnimateProps({ delay: 0.9, shouldReduceMotion })}
          className="text-xl font-medium tracking-normal text-slate-700 dark:text-slate-300"
        >
          Web Developer. Storyteller.
        </motion.p>
      </div>
    </main>
  );
}
