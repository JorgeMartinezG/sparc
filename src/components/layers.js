import { HAZARD_PARAMS } from "../config.js";
import { addLayer } from "./utils.js";

export const handleLayers = (layers, searchState, map) => {
  if (layers === null) {
    return;
  }

  layers.forEach((l) => handleLayer(l, searchState, map));
};

const handleLayer = (layer, searchState, map) => {
  let featureCollection = null;
  switch (layer.id) {
    case "popatrisk":
      featureCollection = AddLayerPopAtRisk(layer, searchState);
      break;
    default:
      console.log("Layer Id not found");
  }

  if (featureCollection === null) {
    return null;
  }

  addLayer(layer.id, featureCollection, map);
};

const AddLayerPopAtRisk = (layer, searchState) => {
  const { summary, geojson, hazard } = searchState;
  const { field } = HAZARD_PARAMS[hazard.value];

  const style = layer.carto.styles.filter((s) => s.id === "default")[0];
  const symbolizer = style.symbolizers.filter((s) => s.id === "default")[0];

  const breakpointStr = symbolizer.dynamic.options.breakpoints
    .split("_")
    .slice(1)
    .join("_");
  const bpColors = symbolizer.dynamic.options.colors.ramp;

  const breakpoints = [...new Set(summary.all.breakpoints[breakpointStr])];

  const month = 0;

  const processedFeatures = geojson.features.map((f) => {
    const values = summary.admin2[f.properties.admin2_code];
    if (values === undefined) {
      const properties = {
        ...f.properties,
        color: bpColors[0],
        value: 0,
      };
      return { ...f, properties: properties };
    }

    let month_idx = month;
    if (month === null) {
      month_idx = 0;
    }

    // Get the probability class associated.
    const probClassValue = Object.keys(values[field]).map((c) => {
      return values[field][c].by_month[month_idx];
    });

    /*
    const computedValue = parseInt(
      probClassValue.reduce((a, b) => a + b, 0) / probClassValue.length
    );
    */
    const computedValue = Math.min(
      Math.max(...probClassValue),
      breakpoints[breakpoints.length - 1]
    );

    // Assign color according to breakpoint.
    const idx = breakpoints.findIndex((e) => e >= computedValue);

    const properties = {
      ...f.properties,
      color: bpColors[idx],
      value: computedValue,
    };

    return { ...f, properties: properties };
  });

  const filtered = processedFeatures.filter((f) => f !== null);

  return {
    type: "FeatureCollection",
    features: filtered,
  };
};