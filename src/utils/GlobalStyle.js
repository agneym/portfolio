import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    font-size: 10px;
  }
  html {
    line-height: 1.15;
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
  }
  body {
    font-family: 'Roboto Slab', sans-serif;
    margin: 0;
    width: 100%;
    overflow-x: hidden;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    font-size: 1.6rem;
  }
  body * {
    box-sizing: border-box;
  }
  body.dark-mode {
    img:not([src*=".svg"]) {
      filter: grayscale(50%);
    }
  }
  code {
    font-family: Menlo, Monaco, "Courier New", Courier, monospace;
    word-break: break-word;
  }
  pre code {
    word-break: normal;
  }
  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
  }
  [hidden] {
    display: none;
  }
`;

export default GlobalStyle;
