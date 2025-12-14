"use-client";

import avatarPic from "images/avatar-400x400.jpg";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { getAnimateProps } from "./getAnimateProps";

const transitionState = {
  delay: 1,
  type: "spring" as const,
  duration: 3,
  repeat: Infinity,
} as const;

export const AvatarImage = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      {...getAnimateProps({ delay: 0.4, shouldReduceMotion })}
      className="relative mx-auto inline overflow-hidden rounded-full"
    >
      <Image
        src={avatarPic}
        alt=""
        className="mx-auto rounded-full"
        width={200}
        priority
      />
      <motion.svg
        width={200}
        height={200}
        viewBox="-50 -50 100 100"
        className="absolute inset-0 mx-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.circle
          cx="0"
          cy="0"
          r="50"
          fill="none"
          strokeWidth="2"
          strokeDasharray="0 1"
          initial={
            shouldReduceMotion
              ? {
                  pathLength: 1,
                }
              : {
                  pathLength: 0,
                  stroke: "hsla(0deg, 86%, 59%, 1)",
                }
          }
          animate={{
            pathLength: 1,
            stroke: "hsla(180deg, 86%, 59%, 1)",
          }}
          transition={transitionState}
        />
      </motion.svg>
    </motion.div>
  );
};
