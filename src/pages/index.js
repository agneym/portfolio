import React from "react";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import IntroSection from "../components/IntroSection";

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
