import React, { useContext, useMemo } from "react";
import { Header } from "../components/header.js";
import { LandslideHazard, FloodHazard, CycloneHazard } from "./hazards.js";
import { StateContext } from "../App.js";
import { Bar } from "react-chartjs-2";
import { Tab, Tabs } from "@wfp/ui";

const Opts = (country) => {
  return {
    title: {
      position: "top",
      text: "Population at Risk for admin0 " + country,
      display: true,
      fontSize: "16",
    },
    scales: {
      xAxes: [
        {
          ticks: {
            fontSize: 14,
          },
        },
      ],
    },
  };
};

const Chart = ({ chartData }) => {
  const MemoChart = () => {
    const { type, data, country } = chartData;
    const opts = Opts(country);

    let chartInfo = null;
    switch (type) {
      default:
        chartInfo = <div></div>;
        break;
      case "landslide":
        chartInfo = <LandslideHazard />;
        break;
      case "flood":
        chartInfo = <FloodHazard />;
        break;
      case "cyclone":
        chartInfo = <CycloneHazard />;
        break;
      case "drought":
        chartInfo = <CycloneHazard />;
        break;
    }

    if (country === undefined) {
      return null;
    }

    return (
      <div className="w-90 center overflow-y-scroll h-100 pt3">
        <Bar data={data} options={opts} />
        {chartInfo}
      </div>
    );
  };

  return useMemo(MemoChart, [chartData]);
};

const SidebarTabs = ({ chartData }) => {
  return (
    <Tabs className="mb2 navlist center">
      <Tab label="Chart">
        <Chart chartData={chartData} />
      </Tab>
      <Tab label="Layers">
        <div className="some-content">Content for second tab goes here.</div>
      </Tab>
      <Tab label="Filters">
        <div className="some-content">Content for third tab goes here.</div>
      </Tab>
    </Tabs>
  );
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
      {searchState.status === "SUCCESS" ? (
        <SidebarTabs chartData={chartData} />
      ) : null}
    </div>
  );
};
