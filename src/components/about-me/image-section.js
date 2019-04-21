import React from "react";
import { graphql, StaticQuery } from "gatsby";
import Img from "gatsby-image";
import { styled } from "linaria/react";

const query = graphql`
  query {
    file(relativePath: { eq: "771B3565.jpg" }) {
      childImageSharp {
        fixed(width: 550, height: 350) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`;

const Container = styled.div`
  place-self: center;
`;

function ImageSection() {
  return (
    <Container>
      <StaticQuery
        query={query}
        render={data => <Img fixed={data.file.childImageSharp.fixed} />}
      />
    </Container>
  );
}

export default ImageSection;
