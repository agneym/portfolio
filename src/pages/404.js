import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";

const Container = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <Container>
      <h1
        css={`
          color: red;
        `}
      >
        404
      </h1>
      <h2>NOT FOUND</h2>
      <p>This page does not exist.</p>
      <Link to="/">Home Page</Link>
    </Container>
  </Layout>
);

export default NotFoundPage;
