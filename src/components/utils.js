import { API_URL } from "../config.js";
import bbox from "@turf/bbox";
import { processLandsLide } from "../hazards/landslide.js";

export const fetchCountries = async (setSearch) => {
  const resp = await fetch(`${API_URL}/countries.json`);
  const jsonObj = await resp.json();

  const selectCountries = jsonObj.countries.map((o) => {
    return { label: o.dos.short, value: o.iso.alpha3 };
  });

  setSearch((s) => {
    return { ...s, countries: selectCountries };
  });
};

export const fetchHazards = async (setSearch) => {
  const resp = await fetch(`${API_URL}/hazards.json`);
  const jsonObj = await resp.json();

  const selectHazards = jsonObj.hazards.map((o) => {
    return { label: o.title, value: o.id };
  });

  setSearch((s) => {
    return { ...s, hazards: selectHazards };
  });
};

const addLayer = (layerName, data, map) => {
  const options = {
    "fill-color": ["get", "prob_class"],
    "fill-opacity": 0.8,
  };

  if (map.getLayer(layerName)) {
    map.removeLayer(layerName);
  }
  if (map.getSource(layerName)) {
    map.removeSource(layerName);
  }

  map.fitBounds(bbox(data), { padding: 100 });
  map.addLayer({
    id: layerName,
    type: "fill",
    source: {
      type: "geojson",
      data: data,
    },
    paint: options,
  });
};

const processData = (hazard, geojson, summary_json) => {
  switch (hazard) {
    case "landslide":
      return processLandsLide(geojson, summary_json, 0);
    default:
      return null;
  }
};

export const getGeom = async (map, country, hazard) => {
  // Get country geojson.
  const resp = await fetch(
    `${API_URL}country/${country}/dataset/context/${country}_NHR_ContextLayers.json`
  );
  const geojson = await resp.json();

  // Get data per admin2 code, per month, per category.
  const resp_summary = await fetch(
    `${API_URL}country/${country}/hazard/${hazard}/dataset/summary/${country}_NHR_PopAtRisk_${hazard}_Summary.json`
  );
  const summary_json = await resp_summary.json();

  const { geom, chartData } = processData(hazard, geojson, summary_json);

  addLayer("country", geom, map);

  return chartData;
};
