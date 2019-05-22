import React from "react";
import styled from "styled-components";

import media from "../../utils/media";

const Container = styled.div`
  padding: 0 4rem;
  align-self: center;

  ${media.phone`
    grid-column: 1/3;
    padding: 0 1rem;
  `}
`;

function DescriptionSection() {
  return (
    <Container>
      <p>I'm a Frontend developer.</p>
      <p>I like to write and help people write quality software.</p>
      <p>Things I love to talk about:</p>
      <ul>
        <li>JavaScript</li>
        <li>Ideas. Lots and lots of those.</li>
        <li>Stories. Movies, Television, Books.</li>
      </ul>
    </Container>
  );
}

export default DescriptionSection;
