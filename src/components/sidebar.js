import React, { useContext, useMemo, useState, useEffect } from "react";
import { Header } from "../components/header.js";
import { handleLayers } from "../components/layers.js";
import { LandslideHazard, FloodHazard, CycloneHazard } from "./hazards.js";
import { StateContext } from "../App.js";
import { Bar } from "react-chartjs-2";
import { Tab, Tabs } from "@wfp/ui";
import Select from "react-select";

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

const SidebarTabs = ({ searchState, map }) => {
  const { chartData } = searchState;
  return (
    <Tabs className="mb2 navlist center">
      <Tab label="Chart">
        <Chart chartData={chartData} />
      </Tab>
      <Tab label="Options">
        <Options />
      </Tab>
    </Tabs>
  );
};

const Options = () => {
  const { searchState, map } = useContext(StateContext);
  const { dashboard } = searchState;

  const hazardLayers = dashboard.sidebar.ui.layers;
  const filteredlayers = dashboard.featurelayers.filter((l) =>
    hazardLayers.includes(l.id)
  );

  const defaultArray = filteredlayers.filter((l) => l.id === "popatrisk");

  const [layers, setLayers] = useState(defaultArray);

  useEffect(() => {
    handleLayers(layers, searchState, map);
  }, [layers, searchState, map]);

  const handleLayer = (opt) => {
    // Get layers that are new.

    // Get layers that were removed.
    // const ids = opt.map((l) => l.id);
    // layers.filter((l) => !ids.includes(l)).map((l) => map.removeLayer(l));

    setLayers(opt);
  };

  return (
    <div className="w-90 center h-100">
      <p className="f5 pv2 b">Layers</p>

      <Select
        classNamePrefix="react-select"
        isMulti={true}
        getOptionLabel={(option) => option.title}
        getOptionValue={(option) => option.id}
        options={filteredlayers}
        className="b"
        placeholder="Search layer"
        defaultValue={layers}
        onChange={(opt) => handleLayer(opt)}
      />
    </div>
  );
};

export const Sidebar = ({ sidebarRef }) => {
  const { searchState, map } = useContext(StateContext);

  return (
    <div
      ref={sidebarRef}
      className="w-30 bg-near-white shadow-2 sidebar absolute z-2 mv3 flex flex-column"
    >
      <Header />
      {searchState.status === "SUCCESS" ? (
        <SidebarTabs searchState={searchState} map={map} />
      ) : null}
    </div>
  );
};
