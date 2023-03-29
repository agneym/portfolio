import React from "react";
import styled, { keyframes } from "styled-components";
import { useTrail, animated, config } from "react-spring";
import { ArrowDownCircle } from "react-feather";

import media from "../utils/media";

const Container = styled.section`
  padding: 15vh 0 0 8rem;
  min-height: 100vh;
  position: relative;

  h1 {
    font-weight: 400;
    font-size: 8rem;
  }

  h2 {
    font-size: 6rem;
    margin-bottom: 8rem;
    font-weight: 400;
  }

  p {
    font-size: 4rem;
  }

  ${media.phone`
    padding: 0 2rem;
    display: flex;
    justify-content: center;
    flex-direction: column;

    h1 {
      font-size: 5rem;
    }
    h2 {
      font-size: 4rem;
      margin-bottom: 4rem;
    }
    p {
      font-size: 2rem;
    }
  `}
`;

const floating = keyframes`
  0% {
    transform: translate(0px);
  }
  50% {
    transform: translateY(8px);
  }
  100% {
    transform: translate(0px);
  }
`;

const ScrollButton = styled.button`
  position: absolute;
  top: 95%;
  left: 50%;
  color: #546e7a;
  background-color: transparent;
  appearance: none;
  border: 0;
  cursor: pointer;
  animation: ${floating} 2s 1s infinite;
`;

function IntroSection({ children }) {
  const childrenArray = React.Children.toArray(children);
  const trail = useTrail(childrenArray.length, {
    y: 0,
    opacity: 1,
    from: { y: 50, opacity: 0 },
    config: config.gentle,
  });
  return (
    <Container>
      {trail.map(({ y, opacity }, index) => (
        <animated.div
          key={index}
          style={{
            opacity,
            transform: y.interpolate((y) => `translate3d(0,${y}px,0)`),
          }}
        >
          {childrenArray[index]}
        </animated.div>
      ))}
      <ScrollButton aria-label="Scroll">
        <ArrowDownCircle />
      </ScrollButton>
    </Container>
  );
}

export default IntroSection;
