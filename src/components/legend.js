import React, { useContext } from "react";
import { StateContext } from "../App.js";

export const Legend = () => {
  const { legend } = useContext(StateContext);
  if (legend === null) {
    return null;
  }

  const { arrayValues, title, description, range } = legend;

  return (
    <div className="absolute bottom-2 right-2 z-1 bg-light-gray shadow-2 pa2 bt b--interactive-01 bw3 w-30">
      <h3 className="f5 b">{title}</h3>
      <p className="f7 ma0 mv1 pa0 mb2">{description}</p>
      <div className="w-100">
        <div className="flex justify-between f7">
          <span>{range[0].label}</span>
          <span>{range[1].label}</span>
        </div>
        <div className="flex justify-center">
          {arrayValues.map((e) => {
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
    </div>
  );
};
