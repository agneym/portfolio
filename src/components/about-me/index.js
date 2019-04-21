import React from "react";
import { styled } from "linaria/react";

import DescriptionSection from "./description-section";
import ImageSection from "./image-section";

const Section = styled.section`
  display: grid;
  margin: 1rem 2rem;
  grid-template-rows: 4rem auto;
  grid-template-columns: 1fr 1fr;
`;

const Title = styled.h2`
  font-weight: normal;
  text-align: center;
  grid-column: 1 / 3;
`;

function AboutMe() {
  return (
    <Section>
      <Title>Hey! My name is Agney.</Title>
      <ImageSection />
      <DescriptionSection />
    </Section>
  );
}

export default AboutMe;
