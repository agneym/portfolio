import React from "react";
import styled from "styled-components";

const Grid = styled.ul`
  display: grid;
  padding: 0;
  margin: 0;
  list-style: none;

  & > li::before {
    content: "\200B";
  }
`;

const Heading = styled.h2`
  font-size: 4rem;
  font-weight: 400;
  text-align: center;
`;

const projectsConfig = [
  {
    title: `Electrojet`,
    description: `Setup Modern JavaScript Applications with a single command.`,
    link: `https://github.com/agneym/create-electrojet`,
  },
];

function Project({ data }) {
  return (
    <li>
      <a href={data.link} target="_blank" rel="noopener noreferrer">
        <h3>{data.title}</h3>
        <p>{data.description}</p>
      </a>
    </li>
  );
}

function Projects() {
  return (
    <section>
      <Heading>PROJECTS</Heading>
      <Grid>
        {projectsConfig.map(projectConfig => (
          <Project data={projectConfig} key={projectConfig.title} />
        ))}
      </Grid>
    </section>
  );
}

export default Projects;
