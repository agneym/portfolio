import React from "react";
import styled from "styled-components";

const Container = styled.footer`
  margin-top: 2rem;
  text-align: center;
  padding: 3rem;
  color: rgba(0, 0, 0, 0.6);
`;

function Footer() {
  return (
    <Container>
      <p>Made with Gatsby and Hosted on Netlify.</p>
    </Container>
  );
}

export default Footer;
