import { API_URL } from "../config.js";
import bbox from "@turf/bbox";
import { processLandsLide } from "../hazards/landslide.js";
import mapboxgl from "mapbox-gl";

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

const addLayer = (layerName, data, map) => {
  const options = {
    "fill-color": ["get", "color"],
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

  map.on("click", layerName, (e) => {
    const props = e.features[0].properties;

    const description = PopupDescription(props);
    let popup = new mapboxgl.Popup();
    popup.setLngLat(e.lngLat).setHTML(description).addTo(map);
  });
};

const processData = (hazard, geojson, summary_json, country) => {
  switch (hazard) {
    case "landslide":
      return processLandsLide(geojson, summary_json, country);
    default:
      return null;
  }
};

export const getGeom = async (map, country, hazard) => {
  // Get country geojson.
  const { label, value } = country;

  const resp = await fetch(
    `${API_URL}country/${value}/dataset/context/${value}_NHR_ContextLayers.json`
  );
  const geojson = await resp.json();

  // Get data per admin2 code, per month, per category.
  const resp_summary = await fetch(
    `${API_URL}country/${value}/hazard/${hazard}/dataset/summary/${value}_NHR_PopAtRisk_${hazard}_Summary.json`
  );
  const summary_json = await resp_summary.json();

  const { geom, chartData } = processData(hazard, geojson, summary_json, label);

  addLayer("country", geom, map);

  return chartData;
};
