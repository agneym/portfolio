import React from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :global {
    body {
      font-family: "Quicksand", sans-serif;
      margin: 0;
    }
    body * {
      box-sizing: border-box;
    }
  }
`;

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        {children}
        <GlobalStyle />
      </>
    )}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
