import React, { useContext } from "react";
import { Header } from "../components/header.js";
import { LandslideHazard } from "../hazards/landslide.js";
import { StateContext } from "../App.js";

export const Sidebar = ({ sidebarRef }) => {
  const { searchState } = useContext(StateContext);
  const { type, data } = searchState.chartData;

  const getChart = (type) => {
    switch (type) {
      default:
        return <div></div>;
      case "LANDSLIDE":
        return (
          <LandslideHazard
            data={data}
            countryName={searchState.country.label}
          />
        );
    }
  };

  return (
    <div
      ref={sidebarRef}
      className="w-30 bg-near-white shadow-2 sidebar absolute z-2 mv3 flex flex-column"
    >
      <Header />
      <div className="w-90 center overflow-y-hidden h-100 pt3">
        {getChart(type)}
      </div>
    </div>
  );
};
