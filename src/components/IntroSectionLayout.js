import React from "react";
import styled from "styled-components";
import { useTrail, animated, config } from "react-spring";

const Container = styled.section`
  padding: 15vh 0 0 8rem;

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
`;

function IntroSection({ children }) {
  const childrenArray = React.Children.toArray(children);
  const trail = useTrail(childrenArray.length, {
    y: 0,
    opacity: 1,
    from: { y: 50, opacity: 0 },
    config: config.gentle,
    delay: 800,
  });
  return (
    <Container>
      {trail.map(({ y, opacity }, index) => (
        <animated.div
          key={index}
          style={{
            opacity,
            transform: y.interpolate(y => `translate3d(0,${y}px,0)`),
          }}
        >
          {childrenArray[index]}
        </animated.div>
      ))}
    </Container>
  );
}

export default IntroSection;
