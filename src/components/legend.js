import React, { useContext } from "react";
import { StateContext } from "../App.js";

export const Legend = () => {
  const { legend } = useContext(StateContext);
  if (legend === null) {
    return null;
  }

  return (
    <div className="absolute bottom-2 right-2 z-1 bg-light-gray shadow-2 pa2 bt b--interactive-01 bw2">
      <h3 className="f5 b">Population at risk by admin2</h3>
      <div className="cf mt2">
        {legend.map((e) => {
          return (
            <div className="tc fl w3">
              <div
                style={{ backgroundColor: e.color }}
                className="w-100 h2"
              ></div>
              <div style={{ fontSize: "0.75rem" }} className="center tc b">
                {e.range}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
