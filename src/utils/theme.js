const darkColors = {
  background: `#121212`,
  textColor: `rgba(255, 255, 255, 0.85)`,
};

const lightColors = {
  background: `#FFFFFF`,
  textColor: `rgba(0, 0, 0, 0.8)`,
};

const theme = {};

/**
 * Get the current theme considering mode.
 * @param {string} mode Mode of theme
 */
function getTheme(mode) {
  return {
    ...theme,
    colors: mode === "light" ? lightColors : darkColors,
  };
}

export default getTheme;
