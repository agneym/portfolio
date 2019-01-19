import React from "react";
import styled from "styled-components";

const SectionContainer = styled.section`
  display: flex;
  height: 100vh;
  padding: 2rem;
  align-items: space-around;
`;

const Title = styled.h1`
  font-family: "Aleo", serif;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 2.4rem;
  letter-spacing: 0.2rem;
  margin: 0;
`;

function IntroSection() {
  return (
    <SectionContainer>
      <div />
      <div>
        <sub>Developer. Driven by Passion.</sub>
        <Title>Boy with Silver Wings</Title>
      </div>
      <div>Icons</div>
    </SectionContainer>
  );
}

export default IntroSection;
