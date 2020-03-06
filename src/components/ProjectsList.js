import React from "react";
import styled from "styled-components";

import Project from "./Project";

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, minmax(200px, 1fr));
  max-width: 150ch;
  grid-gap: 2rem 6rem;
  margin: 0 auto;
  padding: 0;
  list-style: none;

  & > li::before {
    content: "\\200B";
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
    description: `Setup Modern JavaScript Applications with a single command. Adds in a bunch of plugins and environments to make extending as easy as possible.`,
    link: `https://github.com/agneym/create-electrojet`,
    tags: [`nodejs`, `cli`],
  },
  {
    title: `react-use-pip`,
    description: `A custom React hook to use Picture in Picture mode in supported browsers.`,
    link: `https://www.npmjs.com/package/use-pip`,
    tags: [`react`, `javascript`],
  },
  {
    title: `react-use-web-share`,
    description: `A custom react hook for triggering the native web share dialog in supported browsers.`,
    link: `https://www.npmjs.com/package/react-use-web-share`,
    tags: [`react`, `javascript`],
  },
  {
    title: `JSON Crew`,
    description: `An extensible JSON Viewer, Editor, Formatter, Validator based on Monaco Editor.`,
    link: `https://jsoncrew.agney.dev/`,
    tags: [`react`, `javascript`, `monaco`],
  },
  {
    title: `Calendar Link Generator`,
    description: `Generate links for Gmail, Outlook, Yahoo or plain old ICS right from your browser.`,
    link: `https://calendar.agney.dev/`,
    tags: [`svelte`, `javascript`],
  },
  {
    title: `Open Graph Image Generator with Github Actions`,
    description: `Generates open graph images for your blog with Github Actions.`,
    link: `https://github.com/marketplace/actions/generate-og-image`,
    tags: [`nodejs`, `github-actions`, `puppeteer`],
  },
  {
    title: `Create Profile Card`,
    description: `Creates a NPM Library Profile card for you by answering some questions`,
    link: `https://github.com/agneym/create-profile-card`,
    tags: [`nodejs`, `cli`],
  },
  {
    title: `Compare Repos`,
    description: `Evaluate two repositories across Number of stars, watchers, forks and open issues.`,
    link: `https://agneym.github.io/compare-repos/`,
    tags: [`javascript`, `visualisation`],
  },
];

function ProjectsList() {
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

export default ProjectsList;
