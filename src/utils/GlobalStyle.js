import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: "Quicksand", sans-serif;
    margin: 0;
    width: 100%;
    overflow-x: hidden;
  }
  body * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;
