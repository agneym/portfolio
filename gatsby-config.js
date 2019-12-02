module.exports = {
  siteMetadata: {
    title: `Agney Menon`,
    description: `Developer. Driven by Passion.`,
    author: `@agneymenon`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-react-svg`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Agney Menon`,
        short_name: `agney`,
        start_url: `/`,
        background_color: `#CA3C25`,
        theme_color: `#CA3C25`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`,
      },
    },
    "gatsby-plugin-offline",
  ],
};
