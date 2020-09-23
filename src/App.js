import React, { useEffect, useState, useContext } from "react";

import mapboxgl from "mapbox-gl";

import "./assets/style.scss";
import "@wfp/ui/assets/css/styles.min.css";

import { Icons } from "./components/icons.js";
import { Sidebar } from "./components/sidebar.js";
import { MonthBar } from "./components/monthBar.js";
import { BasemapMenu } from "./components/basemapMenu.js";
import { MAPBOX_TOKEN } from "./config.js";
import "mapbox-gl/dist/mapbox-gl.css";
import { BASEMAP_OPTIONS } from "./config.js";

export const StateContext = React.createContext();

mapboxgl.accessToken = MAPBOX_TOKEN;

const Legend = () => {
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

const Viewer = () => {
  const mapRef = React.useRef();
  const sidebarRef = React.useRef();
  const [map, setMap] = useState(null);
  const [legend, setLegend] = useState(null);

  const [searchState, setState] = useState({
    status: "IDLE",
    geom: null,
    month: null,
    chartData: { type: null, data: null, countryName: null },
    dashboard: null,
    layer: null,
  });

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: `mapbox://styles/mapbox/${BASEMAP_OPTIONS[0].value}`,
      center: [0, 0],
      zoom: 2,
      attributionControl: false,
    });

    setMap(map);
  }, []);

  return (
    <StateContext.Provider
      value={{
        searchState: searchState,
        setState: setState,
        map: map,
        legend: legend,
        setLegend: setLegend,
      }}
    >
      <div ref={mapRef} className="vh-100 relative z-1">
        <Icons sidebarRef={sidebarRef} />
        <Sidebar sidebarRef={sidebarRef} />
        <Legend legendData={searchState.legendData} />
        <MonthBar map={map} />
        <BasemapMenu map={map} />
      </div>
    </StateContext.Provider>
  );
};

const App = () => {
  return <Viewer />;
};

export default App;
