import React, { useContext, useMemo, useEffect } from "react";
import { Header } from "../components/header.js";
import { handleLayer } from "../components/layers.js";
import { LandslideHazard, FloodHazard, CycloneHazard } from "./hazards.js";
import { StateContext } from "../App.js";
import { Bar } from "react-chartjs-2";
import { LayerInfo } from "./layerInfo.js";
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
  const DEFAULT_LAYER = "popatrisk";
  const { searchState, map, setLegend, setState, setGeom } = useContext(
    StateContext
  );
  const { dashboard, layer } = searchState;

  const hazardLayers = dashboard.sidebar.ui.layers;
  const filteredlayers = dashboard.featurelayers.filter(
    (l) => hazardLayers.includes(l.id) && l.type === "geojson"
  );

  const defaultArray = filteredlayers.filter((l) => l.id === DEFAULT_LAYER)[0];

  useEffect(() => {
    setState((s) => {
      return { ...s, layer: defaultArray };
    });
  }, [defaultArray, setState]);

  const handleSelect = (opt) => {
    let month = null;
    if (opt.id === DEFAULT_LAYER) {
      month = 0;
    }

    setState((s) => {
      return { ...s, layer: opt, month: month };
    });
  };

  useEffect(() => {
    if (searchState.layer === null) {
      return;
    }

    const { geom, legend } = handleLayer(searchState, map);
    setLegend(legend);
    setGeom(geom);
  }, [searchState, map, setLegend, setGeom]);

  return (
    <div className="w-90 center h-100">
      <p className="f5 pv2 b">Layers</p>

      <Select
        classNamePrefix="react-select"
        isClearable={false}
        getOptionLabel={(option) => option.title}
        getOptionValue={(option) => option.id}
        options={filteredlayers}
        className="b w-80 fl"
        placeholder="Search layer"
        value={layer}
        onChange={(opt) => handleSelect(opt)}
      />
      <LayerInfo layer={layer} />
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
