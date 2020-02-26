import React from "react";
import styled from "styled-components";

const Container = styled.section`
  margin: 30vh 0 0 5rem;
  height: 100vh;

  h1 {
    font-weight: 400;
    font-size: 8rem;
  }

  h2 {
    font-size: 6rem;
    margin-bottom: 8rem;
  }

  p {
    font-size: 4rem;
  }
`;

function IntroSection({ children }) {
  const childrenArray = React.Children.toArray(children);
  return <Container>{children}</Container>;
}

export default IntroSection;
