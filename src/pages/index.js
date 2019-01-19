import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import IntroSection from "../components/intro-section";

const IndexPage = () => (
  <Layout>
    <SEO
      title="Home"
      keywords={[`portfolio`, `agney`, `boy with silver wings`]}
    />
    <IntroSection />
  </Layout>
);

export default IndexPage;
