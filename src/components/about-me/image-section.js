import React from "react";
import { graphql, StaticQuery } from "gatsby";
import Img from "gatsby-image";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";

import media from "../../utils/media";

const query = graphql`
  query {
    file(relativePath: { eq: "771B3565.jpg" }) {
      childImageSharp {
        fixed(width: 550, height: 350) {
          ...GatsbyImageSharpFixed_tracedSVG
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

  ${media.phone`
    display: none;
  `}
`;

const Container = styled.div`
  place-self: center;
  position: relative;

  ${media.phone`
    grid-column: 1/3;
    width: 100%;

    &>.gatsby-image-wrapper {
      margin-left: calc(50% - 50vw);
      margin-right: calc(50% - 50vw);
    }
  `}
`;

const calc = (x, y) => [
  -(y - window.innerHeight / 2) / 40,
  (x - window.innerWidth / 2) / 40,
  1.02,
];
const trans = (x, y, s) =>
  `perspective(5000px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

function ImageSection() {
  const drawProps = useSpring({ x: 2000, from: { x: 0 } });
  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 150, tension: 350, friction: 100 },
  }));

  const AnimatedBorder = animated(Border);
  const AnimatedContainer = animated(Container);
  return (
    <AnimatedContainer
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
      onMouseLeave={() => set({ xys: [0, 0, 1] })}
      style={{ transform: props.xys.interpolate(trans) }}
    >
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
    </AnimatedContainer>
  );
}

export default ImageSection;
