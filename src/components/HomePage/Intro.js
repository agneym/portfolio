"use client";

import { AvatarImage } from "./AvatarImage";
import { motion, useReducedMotion } from "framer-motion";

const initial = {
  y: 10,
  opacity: 0,
};

const animate = {
  y: 0,
  opacity: 1,
};

const getAnimateProps = ({ delay, shouldReduceMotion }) => ({
  initial: shouldReduceMotion ? false : initial,
  animate,
  transition: {
    type: "spring",
    delay,
  },
});

export const Intro = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="flex items-center justify-center text-center flex-col gap-y-10">
      <motion.h1
        {...getAnimateProps({ shouldReduceMotion })}
        className="text-4xl tracking-tight"
      >
        Hey 👋 I'm
      </motion.h1>
      <div className="flex flex-col gap-y-6">
        <AvatarImage getAnimateProps={getAnimateProps} />
        <motion.h1
          {...getAnimateProps({ delay: 0.6, shouldReduceMotion })}
          className="text-6xl font font-extrabold"
        >
          Agney Menon
        </motion.h1>
        <motion.p
          {...getAnimateProps({ delay: 0.9, shouldReduceMotion })}
          className="text-xl tracking-normal text-slate-700 dark:text-slate-300 font-medium"
        >
          Web Developer. Storyteller.
        </motion.p>
      </div>
    </main>
  );
};
