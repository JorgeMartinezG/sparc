import React, { useContext, useMemo } from "react";
import { Header } from "../components/header.js";
import { LandslideHazard, FloodHazard } from "./hazards.js";
import { StateContext } from "../App.js";

const Chart = ({ chartData }) => {
  const MemoChart = () => {
    const { type, data, country } = chartData;

    switch (type) {
      default:
        return <div></div>;
      case "landslide":
        return <LandslideHazard data={data} country={country} />;
      case "flood":
        return <FloodHazard data={data} country={country} />;
    }
  };

  return useMemo(MemoChart, [chartData]);
};

export const Sidebar = ({ sidebarRef }) => {
  const { searchState } = useContext(StateContext);
  const { chartData } = searchState;

  return (
    <div
      ref={sidebarRef}
      className="w-30 bg-near-white shadow-2 sidebar absolute z-2 mv3 flex flex-column"
    >
      <Header />
      <div className="w-90 center overflow-y-hidden h-100 pt3">
        <Chart chartData={chartData} />
      </div>
    </div>
  );
};
