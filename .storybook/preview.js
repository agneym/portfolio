import "../src/app/global.css";
import { withThemeByClassName } from "@storybook/addon-styling";

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export const decorators = [
  withThemeByClassName({
    defaultTheme: "light",
    themes: {
      light: "light",
      dark: "dark",
    },
  }),
];

export default preview;
