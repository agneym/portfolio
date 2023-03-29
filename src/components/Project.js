import React from "react";
import styled from "styled-components";

const Container = styled.li``;

const Anchor = styled.a`
  text-decoration: none;
  color: inherit;
`;

const Tags = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;
`;

const Tag = styled.li`
  padding: 0.3rem 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0.5);
  margin: 0.5rem;
  height: min-content;

  &:first-child {
    margin-left: 0;
  }
`;

function Project({ data }) {
  return (
    <Container>
      <Anchor href={data.link} target="_blank" rel="noopener noreferrer">
        <h3>{data.title}</h3>
        <p>{data.description}</p>
        <Tags>
          {data.tags.map((tag) => (
            <Tag>{tag}</Tag>
          ))}
        </Tags>
      </Anchor>
    </Container>
  );
}

export default Project;
