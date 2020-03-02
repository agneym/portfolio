import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const item = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: -100 },
};

const Container = styled(motion.section)`
  padding: 15vh 0 0 5rem;

  h1 {
    font-weight: 400;
    font-size: 8rem;
  }

  h2 {
    font-size: 6rem;
    margin-bottom: 8rem;
  }

  p {
    font-size: 4rem;
  }
`;

function IntroSection({ children }) {
  return (
    <Container initial="hidden" animate="visible" variants={item}>
      {children}
    </Container>
  );
}

export default IntroSection;
