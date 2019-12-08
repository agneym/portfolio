import React, { memo } from "react";
import styled from "styled-components";

import ExternalLink from "./external-link";
import Github from "../images/social-media/github.svg";
import Codepen from "../images/social-media/codepen.svg";
import LinkedIn from "../images/social-media/linked-in.svg";
import Twitter from "../images/social-media/twitter.svg";
import Stackoverflow from "../images/social-media/stackoverflow.svg";

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
    height: 2rem;
    margin: 0 1rem;

    @media only screen and (max-width: 600px) {
      height: 1.6rem;
    }
  }
`;

function IntroSection() {
  const links = [
    {
      to: "https://github.com/agneym",
      icon: Github,
    },
    {
      to: "https://stackoverflow.com/users/story/4374566",
      icon: Stackoverflow,
    },
    {
      to: "https://codepen.io/BoyWithSilverWings/",
      icon: Codepen,
    },
    {
      to: "https://twitter.com/agneymenon",
      icon: Twitter,
    },
    {
      to: "https://www.linkedin.com/in/agney-menon/",
      icon: LinkedIn,
    },
  ];
  return (
    <SectionContainer>
      <div>
        <Subtitle>Developer. Driven by Passion.</Subtitle>
        <Title>Agney Menon</Title>
      </div>
      <IconContainer>
        {links.map(link => {
          const Icon = link.icon;
          return (
            <ExternalLink to={link.to} key={link.to}>
              <Icon />
            </ExternalLink>
          );
        })}
      </IconContainer>
    </SectionContainer>
  );
}

export default memo(IntroSection);
