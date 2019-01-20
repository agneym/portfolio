import React from "react";

function ExternalLink({ to, children }) {
  return (
    <a href={to} target="_blank" rel="nofollow noopener">
      {children}
    </a>
  );
}

export default ExternalLink;
