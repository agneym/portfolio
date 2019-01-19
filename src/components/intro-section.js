import React from "react";
import styled from "styled-components";

import Github from "../images/social-media/github.svg";
import Codepen from "../images/social-media/codepen.svg";
import LinkedIn from "../images/social-media/linked-in.svg";
import Twitter from "../images/social-media/twitter.svg";

const SectionContainer = styled.section`
  display: grid;
  height: 100vh;
  padding: 2rem;
  grid-template-rows: 1fr 8rem;
  text-align: center;
  align-items: center;
`;

const Title = styled.h1`
  font-family: "Aleo", serif;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 2.4rem;
  letter-spacing: 0.2rem;
  margin: 0;
`;

const Subtitle = styled.sub`
  margin-bottom: 1rem;
  display: block;
  font-weight: 500;
  font-size: 0.9rem;
`;

const IconContainer = styled.div`
  .social-media {
    height: 1.8rem;
    margin: 0 1rem;
  }
`;

function IntroSection() {
  return (
    <SectionContainer>
      <div>
        <Subtitle>Developer. Driven by Passion.</Subtitle>
        <Title>Boy with Silver Wings</Title>
      </div>
      <IconContainer>
        <Github />
        <Codepen />
        <Twitter />
        <LinkedIn />
      </IconContainer>
    </SectionContainer>
  );
}

export default IntroSection;
