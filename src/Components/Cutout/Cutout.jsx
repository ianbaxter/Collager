import React from "react";
import "./Cutout.css";

const Cutout = ({ imgUrls }) => {
  let collage = [];
  for (let i = 0; i < imgUrls.length; i++) {
    let cutout = (
      <div className="artist-container">
        {/* <p>{favArtistsNames[i]}</p> */}
        <img src={imgUrls[i]} />
      </div>
    );
    collage.push(cutout);
  }

  return collage;
};
export default Cutout;
