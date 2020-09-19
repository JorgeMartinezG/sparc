import { HAZARD_PARAMS } from "../config.js";
import { addLayer } from "./utils.js";

export const handleLayers = (layers, searchState, map) => {
  if (layers === null) {
    return;
  }

  return layers
    .map((l) => handleLayer(l, searchState, map))
    .filter((l) => l !== null);
};

const createLegend = (breakpoints, bpColors) => {
  // Generate data for legend.

  return breakpoints.map((b, i) => {
    let val = b.toString();
    if (i > 0) {
      val = `${breakpoints[i - 1].toString()} - ${b.toString()}`;
    }

    return { range: val, color: bpColors[i] };
  });
};

const handleLayer = (layer, searchState, map) => {
  let layerData = null;
  switch (layer.id) {
    case "popatrisk":
      layerData = AddLayerPopAtRisk(layer, searchState);
      break;
    default:
      console.log("Layer Id not found");
  }

  if (layerData === null) {
    return null;
  }

  addLayer(layer.id, layerData.geom, map);

  return layerData.legend;
};

const AddLayerPopAtRisk = (layer, searchState) => {
  const { summary, geojson, hazard, month } = searchState;
  const { field } = HAZARD_PARAMS[hazard.value];

  const style = layer.carto.styles.filter((s) => s.id === "default")[0];
  const symbolizer = style.symbolizers.filter((s) => s.id === "default")[0];

  const breakpointStr = symbolizer.dynamic.options.breakpoints
    .split("_")
    .slice(1)
    .join("_");
  const bpColors = symbolizer.dynamic.options.colors.ramp;

  const breakpoints = [...new Set(summary.all.breakpoints[breakpointStr])];

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

  const geom = {
    type: "FeatureCollection",
    features: filtered,
  };

  const legend = createLegend(breakpoints, bpColors);

  return { geom: geom, legend: legend };
};
