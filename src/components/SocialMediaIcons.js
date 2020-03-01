import React from "react";
import { GitHub, Twitter } from "react-feather";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  margin: 6rem 0;
`;

const ExternalLink = styled.a`
  display: inline-block;
  margin: 0 1rem;
  text-decoration: none;
  color: inherit;
  transition: transform 200ms ease-in;

  &:hover {
    transform: scale(0.9);
  }
`;

function SocialMediaIcons() {
  const iconSize = 40;
  return (
    <Container>
      <ExternalLink href="https://github.com/agneym" target="_blank">
        <GitHub size={iconSize} />
      </ExternalLink>
      <ExternalLink href="https://twitter.com/agneymenon" target="_blank">
        <Twitter size={iconSize} />
      </ExternalLink>
    </Container>
  );
}

export default SocialMediaIcons;
