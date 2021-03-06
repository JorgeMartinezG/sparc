import React, { useEffect, useState } from "react";

import mapboxgl from "mapbox-gl";

import "./assets/style.scss";
import "@wfp/ui/assets/css/styles.min.css";

import { Icons } from "./components/icons.js";
import { Sidebar } from "./components/sidebar.js";
import { MonthBar } from "./components/monthBar.js";
import { BasemapMenu } from "./components/basemapMenu.js";
import { addLayer } from "./components/utils.js";
import { MAPBOX_TOKEN } from "./config.js";
import "mapbox-gl/dist/mapbox-gl.css";
import { BASEMAP_OPTIONS } from "./config.js";
import { Legend } from "./components/legend.js";

export const StateContext = React.createContext();

mapboxgl.accessToken = MAPBOX_TOKEN;

const Viewer = () => {
  const mapRef = React.useRef();
  const sidebarRef = React.useRef();
  const [map, setMap] = useState(null);
  const [geom, setGeom] = useState(null);
  const [legend, setLegend] = useState(null);

  const [searchState, setState] = useState({
    status: "IDLE",
    month: null,
    chartData: { type: null, data: null, countryName: null },
    dashboard: null,
    layer: null,
  });

  Object.defineProperty(window, "devicePixelRatio", {
    get: function () {
      return 300 / 96;
    },
  });

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: `mapbox://styles/mapbox/${BASEMAP_OPTIONS[0].value}`,
      center: [0, 0],
      zoom: 2,
      attributionControl: false,
      preserveDrawingBuffer: true,
    });

    setMap(map);
  }, []);

  useEffect(() => {
    if (map === null) return;
    map.on("style.load", (event) => {
      if (geom === null) return;

      switch (geom.type) {
        case "FeatureCollection":
          addLayer(geom, map);
          break;
        case "raster":
          map.addLayer(geom);
          break;
        default:
          break;
      }
    });
  }, [map, geom]);

  return (
    <StateContext.Provider
      value={{
        searchState: searchState,
        setState: setState,
        map: map,
        legend: legend,
        setLegend: setLegend,
        setGeom: setGeom,
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
