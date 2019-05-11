import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 0 4rem;
  align-self: center;
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
