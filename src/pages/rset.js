import React, { useEffect } from "react";

function Fbdevc() {
  useEffect(() => {
    setTimeout(() => {
      if (window) {
        window.location.href = "https://rset-reactjs.netlify.com/";
      }
    }, 1000);
  });
  return <p>Loading ...</p>;
}

export default Fbdevc;
