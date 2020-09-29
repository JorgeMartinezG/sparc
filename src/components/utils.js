import { API_URL, LAYERS } from "../config.js";
import bbox from "@turf/bbox";
import mapboxgl from "mapbox-gl";

export const fetchCountries = async (setSearch) => {
  const resp = await fetch(`${API_URL}data//countries.json`);
  const jsonObj = await resp.json();

  const selectCountries = jsonObj.countries.map((o) => {
    return { label: o.dos.short, value: o.iso.alpha3 };
  });

  setSearch((s) => {
    return { ...s, countries: { list: selectCountries, selected: null } };
  });
};

export const fetchHazards = async (setSearch) => {
  const resp = await fetch(`${API_URL}data//hazards.json`);
  const jsonObj = await resp.json();

  const selectHazards = jsonObj.hazards.map((o) => {
    return { label: o.title, value: o.id };
  });

  setSearch((s) => {
    return { ...s, hazards: { list: selectHazards, selected: null } };
  });
};

const PopupDescription = (props) => {
  let val = "";

  if (props.value !== "null") {
    val = props.value;
  }

  return `
    <div>
      <p>
        <span><strong>admin1: </strong></span>
        ${props.admin1_name}
      </p>
      <p>
        <span><strong>admin2: </strong></span>
        ${props.admin2_name}
      </p>
      <p>
        <span><strong>value: </strong></span>
        ${val}
      </p>
    </div>
  `;
};

export const addLayer = (data, map) => {
  const options = {
    "fill-color": ["get", "color"],
    "fill-opacity": 0.8,
  };

  if (map.getLayer(LAYERS.WMS)) {
    map.removeLayer(LAYERS.WMS);
    map.removeSource(LAYERS.WMS);
  }

  if (map.getLayer(LAYERS.GEOJSON)) {
    map.getSource(LAYERS.GEOJSON).setData(data);
  }

  map.fitBounds(bbox(data), { padding: 100 });
  map.addLayer({
    id: LAYERS.GEOJSON,
    type: "fill",
    source: {
      type: "geojson",
      data: data,
    },
    paint: options,
  });

  map.on("click", LAYERS.GEOJSON, (e) => {
    const props = e.features[0].properties;

    const description = PopupDescription(props);
    let popup = new mapboxgl.Popup();
    popup.setLngLat(e.lngLat).setHTML(description).addTo(map);
  });
};

export const getResponse = async (country, hazard) => {
  const resp = await fetch(
    `${API_URL}data/country/${country}/dataset/context/${country}_NHR_ContextLayers.json`
  );
  const geojson = await resp.json();

  // Get data per admin2 code, per month, per category.
  const resp_summary = await fetch(
    `${API_URL}data/country/${country}/hazard/${hazard}/dataset/summary/${country}_NHR_PopAtRisk_${hazard}_Summary.json`
  );
  const summary = await resp_summary.json();

  const resp_dashboard = await fetch(
    `${API_URL}dashboard/country/${country}/hazard/${hazard}.json`
  );
  const dashboard = await resp_dashboard.json();

  const context_summary_json = await fetch(
    `${API_URL}data/country/${country}/dataset/context_summary/${country}_NHR_ContextLayers_Summary.json`
  );

  const context_summary = await context_summary_json.json();

  return {
    summary: summary,
    geojson: geojson,
    dashboard: dashboard,
    context_summary: context_summary,
  };
};
