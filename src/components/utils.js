import { API_URL, CHART_LABELS } from "../config.js";
import bbox from "@turf/bbox";

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

  map.fitBounds(bbox(data), { padding: 40 });
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

const processLandsLide = (geojson, summary_json, month) => {
  const admin2Values = summary_json.admin2;

  const colorsMap = {
    low: "#1d4877",
    medium: "#fbb021",
    high: "#f68838",
    very_high: "#ee3e32",
  };

  const processedFeatures = geojson.features.map((f) => {
    const values = admin2Values[f.properties.admin2_code];
    if (values !== undefined) {
      let prob_class = colorsMap["low"];

      // Get the probability class associated.
      Object.keys(values.prob_class).forEach((c) => {
        const sum = values.prob_class[c].by_month.reduce((a, b) => a + b, 0);
        if (sum !== 0) {
          prob_class = colorsMap[c];
        }
      });

      const properties = { ...f.properties, prob_class: prob_class };

      return { ...f, properties: properties };
    }
    return null;
  });

  const filtered = processedFeatures.filter((f) => f !== null);

  const geom = {
    type: "FeatureCollection",
    features: filtered,
  };

  // Create a new array of data for chart.
  const items = ["low", "medium", "high", "very_high"];
  const datasets = items.map((i) => {
    return {
      data: summary_json.prob_class[i].by_month,
      type: "bar",
      stack: "prob_class",
      label: i,
      backgroundColor: colorsMap[i],
    };
  });

  const chartData = {
    labels: CHART_LABELS,
    datasets: datasets,
  };

  return { geom: geom, chartData: chartData };
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
