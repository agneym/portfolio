import React from "react";
import styled from "styled-components";

const Container = styled.section`
  margin: 30vh 0 0 5rem;
`;

function IntroSection() {
  return (
    <Container>
      <h1
        css={`
          font-size: 8rem;
          font-weight: 400;
        `}
      >
        <span>Hello </span>
        <span role="img" aria-label="Wave">
          👋🏻
        </span>
      </h1>
      <p
        css={`
          font-weight: 600;
          font-size: 4rem;
          margin-bottom: 10rem;
        `}
      >
        My name is Agney.
      </p>
      <p
        css={`
          font-size: 3.5rem;
        `}
      >
        I'm a Developer by Profession & Hobby.
      </p>
    </Container>
  );
}

export default IntroSection;
