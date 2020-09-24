import React, { useContext } from "react";
import { StateContext } from "../App.js";
import { CHART_LABELS } from "../config.js";

export const MonthBar = ({ map }) => {
  const { searchState, setState } = useContext(StateContext);

  if (searchState.month === null) {
    return null;
  }

  const handleMonth = (idx) => {
    //map.getSource("popatrisk").setData(data.geom);

    setState((p) => {
      return { ...p, month: idx };
    });
  };

  return (
    <ul className="bg-near-white shadow-2 absolute z-2 top-1 right-2 ttc br2">
      {CHART_LABELS.map((i, idx) => (
        <li
          id={idx}
          className={`dib f6 pv2 ph3 hover-interactive-01 hover-white pointer ${
            idx === searchState.month ? "bg-interactive-01 white" : null
          }`}
          onClick={() => handleMonth(idx)}
        >
          {i}
        </li>
      ))}
    </ul>
  );
};
