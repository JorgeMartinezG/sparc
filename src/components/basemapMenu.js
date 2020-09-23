import React, { useState } from "react";
import { BASEMAP_OPTIONS } from "../config.js";

export const BasemapMenu = ({ map }) => {
  // Remove elements that require mapbox token;
  const [basemap, setBasemap] = useState(BASEMAP_OPTIONS[0].label);

  const handleClick = (style) => {
    let styleValue = style.value;

    if (typeof style.value === "string") {
      styleValue = "mapbox://styles/mapbox/" + style.value;
    }
    map.setStyle(styleValue);
    setBasemap(style.label);
  };

  return (
    <div className="bg-white blue-dark flex mt2 ml2 f7 br1 shadow-1 absolute bottom-2 left-2 z-1">
      {BASEMAP_OPTIONS.map((style) => {
        return (
          <div
            onClick={() => handleClick(style)}
            className={`ttc pv2 ph3 pointer link + ${
              basemap === style.label ? "bg-grey-light fw6" : ""
            }`}
          >
            {style.label}
          </div>
        );
      })}
    </div>
  );
};
