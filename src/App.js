import React, { useEffect, useState } from "react";

import mapboxgl from "mapbox-gl";

import "./assets/style.scss";
import "@wfp/ui/assets/css/styles.min.css";

import { fetchCountries, fetchHazards } from "./components/utils.js";
import { Icons } from "./components/icons.js";
import { Sidebar } from "./components/sidebar.js";
import { MAPBOX_TOKEN } from "./config.js";
import "mapbox-gl/dist/mapbox-gl.css";

export const StateContext = React.createContext();

mapboxgl.accessToken = MAPBOX_TOKEN;

const Legend = ({ legendData }) => {
  if (legendData === null) return null;

  return (
    <div className="absolute bottom-2 right-2 z-1 bg-light-gray shadow-2 pa2 bt b--interactive-01 bw2">
      <h3 className="f5 b">Population at risk</h3>
      <div className="cf mt2">
        {legendData.map((e) => {
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

const Viewer = () => {
  const mapRef = React.useRef();
  const sidebarRef = React.useRef();
  const [map, setMap] = useState(null);

  let config = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        type: "bar",
        stack: "prob_class",
        label: "low",
        backgroundColor: "#1d4877",
      },
      {
        data: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        type: "bar",
        stack: "prob_class",
        label: "medium",
        backgroundColor: "#fbb021",
      },
      {
        data: [
          3880,
          3871,
          3867,
          3858,
          3858,
          3858,
          3507,
          3507,
          3858,
          3858,
          3858,
          3511,
        ],
        type: "bar",
        stack: "prob_class",
        label: "high",
        backgroundColor: "#f68838",
      },
      {
        data: [
          2581,
          2344,
          2259,
          1831,
          1717,
          1710,
          1352,
          1342,
          1709,
          1844,
          1975,
          2039,
        ],
        type: "bar",
        stack: "prob_class",
        label: "very_high",
        backgroundColor: "#ee3e32",
      },
    ],
  };

  const [searchState, setState] = useState({
    country: null,
    hazard: null,
    loading: false,
    legendData: null,
    chartData: { type: null, data: null, countryName: null },
  });
  const [search, setSearch] = useState({ countries: null, hazards: null });

  useEffect(() => {
    fetchCountries(setSearch);
    fetchHazards(setSearch);
  }, []);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/light-v9",
      center: [0, 0],
      zoom: 2,
      attributionControl: false,
    });

    setMap(map);
  }, []);

  return (
    <StateContext.Provider
      value={{
        search: search,
        searchState: searchState,
        setState: setState,
        map: map,
      }}
    >
      <div ref={mapRef} className="vh-100 relative z-1">
        <Icons sidebarRef={sidebarRef} />
        <Sidebar sidebarRef={sidebarRef} />
        <Legend legendData={searchState.legendData} />
      </div>
    </StateContext.Provider>
  );
};

const App = () => {
  return <Viewer />;
};

export default App;
