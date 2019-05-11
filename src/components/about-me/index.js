import React from "react";
import styled from "styled-components";

import DescriptionSection from "./description-section";
import ImageSection from "./image-section";

const Section = styled.section`
  display: grid;
  margin: 1rem 2rem;
  grid-template-rows: 4rem auto;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 2rem;
`;

const Title = styled.h2`
  font-weight: normal;
  text-align: center;
  grid-column: 1 / 3;
`;

function AboutMe() {
  return (
    <Section>
      <Title>Hey! I'm Agney.</Title>
      <ImageSection />
      <DescriptionSection />
    </Section>
  );
}

export default AboutMe;
