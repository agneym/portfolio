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

const Border = styled.svg`
  position: absolute;
  left: 0;
  top: 0;
`;

const Container = styled.div`
  place-self: center;
  position: relative;
`;

function ImageSection() {
  return (
    <Container>
      <StaticQuery
        query={query}
        render={data => (
          <Img
            fixed={data.file.childImageSharp.fixed}
            alt="Me at Silicon Valley talking an entrepreneur I met"
            style={{ zIndex: 1 }}
          />
        )}
      />
      <Border viewBox="0 0 600 400" height="400" width="600">
        <rect
          x="10"
          y="10"
          width="550"
          height="350"
          fill="transparent"
          stroke="blue"
        />
        <rect
          x="15"
          y="15"
          width="555"
          height="355"
          fill="transparent"
          stroke="red"
        />
      </Border>
    </Container>
  );
}

export default ImageSection;
