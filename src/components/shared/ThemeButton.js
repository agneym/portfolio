"use client";

import MoonIcon from "images/moon.svg";
import SunIcon from "images/sun.svg";
import { useTheme } from "next-themes";

export const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  const isLightTheme = theme === "light";
  const Icon = isLightTheme ? MoonIcon : SunIcon;
  const label = isLightTheme ? "Dark Mode" : "Light Mode";

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center"
      onClick={() => setTheme(isLightTheme ? "dark" : "light")}
      aria-label={label}
      title={label}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};
