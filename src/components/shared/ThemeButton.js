"use client";

import MoonIcon from "images/moon.svg";
import SunIcon from "images/sun.svg";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";

const AnimatedIcon = ({ icon: Icon }) => {
  return (
    <motion.span
      initial={{
        rotate: 30,
      }}
      animate={{
        rotate: 0,
      }}
      exit={{
        rotate: -30,
        opacity: 0,
      }}
      layoutId="one-thing"
      className="absolute"
    >
      <Icon className="h-5 w-5" />
    </motion.span>
  );
};

export const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  const isLightTheme = theme === "light";
  const Icon = isLightTheme ? MoonIcon : SunIcon;
  const label = isLightTheme ? "Dark Mode" : "Light Mode";

  return (
    <button
      type="button"
      className="inline-flex h-6 w-6 items-center justify-center transition-transform duration-150 hover:scale-105"
      onClick={() => setTheme(isLightTheme ? "dark" : "light")}
      aria-label={label}
      title={label}
    >
      <AnimatePresence>
        <AnimatedIcon key={theme} icon={Icon} />
      </AnimatePresence>
    </button>
  );
};
