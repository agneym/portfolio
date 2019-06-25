import React, { useEffect } from "react";

function Fbdevc() {
  useEffect(() => {
    setTimeout(() => {
      if (window) {
        window.location.href = "https://fdc-kochi-reactjs.netlify.com/";
      }
    }, 1000);
  });
  return <p>Loading ...</p>;
}

export default Fbdevc;
