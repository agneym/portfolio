import React from "react";
import { graphql, StaticQuery } from "gatsby";
import Img from "gatsby-image";
import styled from "linaria/react";

const query = graphql`
  query {
    file(relativePath: { eq: "771B3565.jpg" }) {
      childImageSharp {
        fixed(width: 500, height: 400) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`;

function ImageSection() {
  return (
    <div>
      <StaticQuery
        query={query}
        render={data => <Img fixed={data.file.childImageSharp.fixed} />}
      />
    </div>
  );
}

export default ImageSection;
