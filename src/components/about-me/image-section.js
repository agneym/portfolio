import React from "react";
import { graphql, StaticQuery } from "gatsby";
import Img from "gatsby-image";
import { styled } from "linaria/react";
import { useSpring, animated } from "react-spring";

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
  height: 400px;
  width: 600px;
`;

const Container = styled.div`
  place-self: center;
  position: relative;
`;

function ImageSection() {
  const drawProps = useSpring({ x: 2000, from: { x: 0 } });
  const AnimatedBorder = animated(Border);
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
      <AnimatedBorder
        viewBox="0 0 600 400"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={4000}
        strokeDashoffset={drawProps.x}
      >
        <rect
          x="10"
          y="10"
          width="544"
          height="345"
          fill="transparent"
          stroke="blue"
        />
        <rect
          x="15"
          y="15"
          width="545"
          height="346"
          fill="transparent"
          stroke="red"
        />
      </AnimatedBorder>
    </Container>
  );
}

export default ImageSection;
