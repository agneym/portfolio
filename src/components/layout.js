import React from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "styled-components";

import getTheme from "../utils/theme";

const Layout = ({ children }) => {
  const theme = getTheme("light");
  return (
    <ThemeProvider theme={theme}>
      {children}
      <GlobalStyle />
    </ThemeProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
